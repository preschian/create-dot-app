import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { downloadTemplate as gigetDownload } from 'giget'

const REPO_OWNER = 'preschian'
const REPO_NAME = 'create-dot-app'
const REPO_BRANCH = 'main'
const SOLIDITY_BASE_TEMPLATE = 'solidity-hardhat-wagmi'
const RAW_GITHUB_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}`

export async function downloadTemplate({ template = 'vue-dedot', targetName = '.' }): Promise<void> {
  if (template === 'solidity-react' || template === 'solidity-vue') {
    await downloadSolidityTemplate({ template, targetName })
    return
  }

  const subdir = `templates/${template}`
  await downloadWithGiget(subdir, targetName)
}

async function downloadSolidityTemplate({ template, targetName = '.' }): Promise<void> {
  const dappDir = template === 'solidity-react' ? 'dapp-react' : 'dapp-vue'

  const directories = [
    `templates/${SOLIDITY_BASE_TEMPLATE}/${dappDir}`,
    `templates/${SOLIDITY_BASE_TEMPLATE}/hardhat`,
  ]

  const files = [
    `templates/${SOLIDITY_BASE_TEMPLATE}/.gitignore`,
    `templates/${SOLIDITY_BASE_TEMPLATE}/README.md`,
  ]

  const dirPromises = directories.map(async (subdir) => {
    const itemName = subdir.split('/').pop()!
    const targetPath = targetName === '.' ? itemName : `${targetName}/${itemName}`
    return downloadWithGiget(subdir, targetPath)
  })

  const filePromises = files.map(async (filePath) => {
    const fileName = filePath.split('/').pop()!
    const targetPath = targetName === '.' ? fileName : `${targetName}/${fileName}`
    return downloadRawFile(filePath, targetPath)
  })

  await Promise.all([...dirPromises, ...filePromises])

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
    workspaces: [
      'hardhat',
      dappDir,
    ],
    scripts: {
      'compile': 'npm run compile -w hardhat',
      'lint': 'npm run lint --workspaces --if-present',
      'lint:hardhat': 'npm run lint -w hardhat',
      [`lint:${dappDir}`]: `npm run lint -w ${dappDir}`,
      [`build:${dappDir}`]: `npm run build -w ${dappDir}`,
      [`dev:${dappDir}`]: `npm run dev -w ${dappDir}`,
    },
    overrides: {
      'lru-cache': '^11.1.0',
    },
    keywords: [],
    author: '',
    license: 'MIT',
  }

  const packageJsonPath = targetName === '.' ? 'package.json' : join(targetName, 'package.json')
  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
}

async function downloadWithGiget(subdir: string, targetName: string): Promise<void> {
  const source = `github:${REPO_OWNER}/${REPO_NAME}/${subdir}#${REPO_BRANCH}`

  await gigetDownload(source, { dir: targetName, force: true })
}

async function downloadRawFile(filePath: string, targetPath: string): Promise<void> {
  const url = `${RAW_GITHUB_URL}/${filePath}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to download file: ${filePath}`)
  }

  const content = await response.text()
  const dir = dirname(targetPath)
  if (dir !== '.') {
    await mkdir(dir, { recursive: true })
  }
  await writeFile(targetPath, content)
}
