import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import process from 'node:process'

// Template repository configuration
const REPO_OWNER = 'preschian'
const REPO_NAME = 'create-dot-app'
const REPO_BRANCH = 'main'
const SOLIDITY_BASE_TEMPLATE = 'solidity-hardhat-wagmi'

/**
 * Downloads a template from the repository using gitpick
 * @param options - Download configuration
 * @param options.template - Template name (e.g., 'vue-dedot')
 * @param options.targetName - Target directory name
 */
export async function downloadTemplate({ template = 'vue-dedot', targetName = '.' }): Promise<void> {
  // Handle Solidity templates with multiple subdirectories
  if (template === 'solidity-react' || template === 'solidity-vue') {
    await downloadSolidityTemplate({ template, targetName })
    return
  }

  const subdir = `templates/${template}`
  const repoSpecifier = `${REPO_OWNER}/${REPO_NAME}/tree/${REPO_BRANCH}/${subdir}`

  await downloadWithGitpick(repoSpecifier, targetName)
}

/**
 * Downloads Solidity template with multiple subdirectories using gitpick
 * @param options - Download configuration
 * @param options.template - Template name ('solidity-react' or 'solidity-vue')
 * @param options.targetName - Target directory name
 */
async function downloadSolidityTemplate({ template, targetName = '.' }): Promise<void> {
  // Determine which dapp to download based on template
  const dappDir = template === 'solidity-react' ? 'dapp-react' : 'dapp-vue'

  // Define subdirectories to download (excluding package.json, we'll create it dynamically)
  const subdirs = [
    `templates/${SOLIDITY_BASE_TEMPLATE}/${dappDir}`,
    `templates/${SOLIDITY_BASE_TEMPLATE}/hardhat`,
    `templates/${SOLIDITY_BASE_TEMPLATE}/.gitignore`,
    `templates/${SOLIDITY_BASE_TEMPLATE}/README.md`,
  ]

  // Download all subdirectories/files in parallel
  const downloadPromises = subdirs.map(async (subdir) => {
    const repoSpecifier = `${REPO_OWNER}/${REPO_NAME}/tree/${REPO_BRANCH}/${subdir}`
    const itemName = subdir.split('/').pop()!
    const targetPath = targetName === '.' ? itemName : `${targetName}/${itemName}`

    return downloadWithGitpick(repoSpecifier, targetPath)
  })

  await Promise.all(downloadPromises)

  // Create custom package.json with only the selected dapp workspace
  await createSolidityPackageJson({ dappDir, targetName })
}

/**
 * Creates a custom package.json for Solidity template with appropriate workspaces
 * @param options - Configuration
 * @param options.dappDir - The dapp directory name ('dapp-react' or 'dapp-vue')
 * @param options.targetName - Target directory name
 */
async function createSolidityPackageJson({ dappDir, targetName = '.' }): Promise<void> {
  const packageJson = {
    name: 'solidity-hardhat-wagmi',
    version: '1.0.0',
    private: true,
    description: 'A comprehensive full-stack Polkadot development template featuring Hardhat for Solidity smart contract development and modern frontend applications with Wagmi integration.',
    main: 'index.js',
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
    },
    keywords: [],
    author: '',
    license: 'MIT',
    workspaces: [
      'hardhat',
      dappDir,
    ],
  }

  const packageJsonPath = targetName === '.' ? 'package.json' : join(targetName, 'package.json')
  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
}

/**
 * Downloads using gitpick with the specified repository specifier and target
 */
async function downloadWithGitpick(repoSpecifier: string, targetName: string): Promise<void> {
  // Get gitpick binary from node_modules
  let gitpickBinPath: string
  try {
    const require = createRequire(import.meta.url)
    gitpickBinPath = require.resolve('gitpick/dist/index.js')
  }
  catch {
    throw new Error('Failed to resolve gitpick binary. Make sure gitpick is installed as a dependency.')
  }

  return new Promise<void>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        gitpickBinPath,
        repoSpecifier,
        targetName,
        '-o',
      ],
      {
        cwd: process.cwd(),
        stdio: process.env.CI ? 'pipe' : 'ignore',
      },
    )

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      }
      else {
        reject(new Error(`Failed to download template: gitpick exited with code ${code}. This may indicate a network issue or invalid template path.`))
      }
    })
  })
}
