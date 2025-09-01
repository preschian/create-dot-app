import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import process from 'node:process'

export async function downloadTemplate({ template = 'vue-dedot', targetName = '.' }): Promise<void> {
  // Template repository configuration
  const owner = 'preschian'
  const repo = 'create-dot-app'
  const branch = 'main'
  const subdir = `templates/${template}`

  const repoSpecifier = `${owner}/${repo}/tree/${branch}/${subdir}`
  // Get gitpick binary from node_modules
  const require = createRequire(import.meta.url)
  const gitpickBinPath = require.resolve('gitpick/dist/index.js')

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
