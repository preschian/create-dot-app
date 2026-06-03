import { spawn } from 'node:child_process'
import process from 'node:process'

// Only npm and bun are offered for now. The template declares its Hardhat
// setup via the package.json "workspaces" field, which pnpm and yarn don't
// honor the same way (pnpm needs a pnpm-workspace.yaml), so installs break.
// Re-add them here once the template supports their workspace configs.
export const packageManagers = ['npm', 'bun'] as const
export type PackageManager = typeof packageManagers[number]

/**
 * Detects the package manager used to invoke the CLI via npm_config_user_agent.
 * Falls back to 'npm' for anything we don't support (e.g. pnpm, yarn).
 */
export function detectPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent ?? ''
  const name = userAgent.split(' ')[0]?.split('/')[0]

  if ((packageManagers as readonly string[]).includes(name)) {
    return name as PackageManager
  }

  return 'npm'
}

/**
 * Runs `<pm> install` in the given directory, streaming output to the user.
 * Rejects when the install exits with a non-zero code.
 */
export function installDependencies(pm: PackageManager, cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(pm, ['install'], {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      }
      else {
        reject(new Error(`${pm} install exited with code ${code}`))
      }
    })
  })
}
