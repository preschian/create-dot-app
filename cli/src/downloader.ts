import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
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
async function downloadSolidityTemplate({ template, targetName: _targetName = '.' }): Promise<void> {
  // Determine which dapp to download based on template
  const dappDir = template === 'solidity-react' ? 'dapp-react' : 'dapp-vue'

  // Define subdirectories to download
  const subdirs = [
    `templates/${SOLIDITY_BASE_TEMPLATE}/${dappDir}`,
    `templates/${SOLIDITY_BASE_TEMPLATE}/hardhat`,
    `templates/${SOLIDITY_BASE_TEMPLATE}/.gitignore`,
    `templates/${SOLIDITY_BASE_TEMPLATE}/README.md`,
  ]

  // Download each subdirectory/file
  for (const subdir of subdirs) {
    const repoSpecifier = `${REPO_OWNER}/${REPO_NAME}/tree/${REPO_BRANCH}/${subdir}`

    // For files, we need to handle them differently
    if (subdir.endsWith('.gitignore') || subdir.endsWith('README.md')) {
      const fileName = subdir.split('/').pop()!
      await downloadWithGitpick(repoSpecifier, fileName)
    }
    else {
      // For directories, extract the directory name and download to target
      const dirName = subdir.split('/').pop()!
      await downloadWithGitpick(repoSpecifier, dirName)
    }
  }
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
