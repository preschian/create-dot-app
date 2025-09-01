import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import process from 'node:process'

/**
 * Downloads a template from the repository using gitpick
 * @param options - Download configuration
 * @param options.template - Template name (e.g., 'vue-dedot')
 * @param options.targetName - Target directory name
 */
export async function downloadTemplate({ template = 'vue-dedot', targetName = '.' }): Promise<void> {
  // Template repository configuration
  const owner = 'preschian'
  const repo = 'create-dot-app'
  const branch = 'main'
  const subdir = `templates/${template}`

  const repoSpecifier = `${owner}/${repo}/tree/${branch}/${subdir}`

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
