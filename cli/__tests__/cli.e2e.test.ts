import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import pty from 'node-pty'
import stripAnsi from 'strip-ansi'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const node = process.execPath
const cliPath = path.join(__dirname, '..', 'dist', 'index.js')

interface SpawnOptions {
  args?: string[]
  timeout?: number
  onData?: (data: string, cleanOutput: string, process: pty.IPty) => void
  expectExitCode?: number
}

// Utility functions
function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function spawnCLI(testDir: string, options: SpawnOptions): Promise<{ output: string, process: pty.IPty }> {
  const { args = [], timeout = 25000, onData, expectExitCode = 0 } = options

  const p = pty.spawn(node, [cliPath, ...args], {
    name: 'xterm-color',
    cols: 120,
    rows: 30,
    cwd: testDir,
    env: {
      ...process.env,
      FORCE_COLOR: '0', // Disable colors for consistent output
      CI: '1', // Indicate we're in CI environment
      DISABLE_TELEMETRY: 'true', // Disable analytics during tests
    },
  })

  let buf = ''
  let resolved = false

  return new Promise<{ output: string, process: pty.IPty }>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true
        p.kill()
        reject(new Error(`Test timed out after ${timeout}ms`))
      }
    }, timeout)

    p.onData((data) => {
      buf += data
      const cleanOutput = stripAnsi(data)
      onData?.(data, cleanOutput, p)
    })

    p.onExit((exitCode) => {
      clearTimeout(timeoutId)
      if (!resolved) {
        resolved = true
        if (exitCode.exitCode === expectExitCode) {
          resolve({ output: stripAnsi(buf), process: p })
        }
        else {
          reject(new Error(`Expected exit code ${expectExitCode}, got ${exitCode.exitCode}`))
        }
      }
    })
  })
}

async function handleTemplateSelection(p: pty.IPty, navigateDown = 0): Promise<void> {
  await wait(100)

  // Navigate down if needed
  for (let i = 0; i < navigateDown; i++) {
    p.write('\x1B[B') // Arrow down
    await wait(50)
  }

  // Select current option
  p.write('\r')
}

describe('cli E2E tests with node-pty', () => {
  let testDir: string
  let originalCwd: string

  beforeEach(async () => {
    // Create temporary test directory
    testDir = path.join(os.tmpdir(), `create-dot-app-test-${Date.now()}`)
    await fs.mkdir(testDir, { recursive: true })
    originalCwd = process.cwd()
    process.chdir(testDir)
  })

  afterEach(async () => {
    // Cleanup
    process.chdir(originalCwd)
    await fs.rm(testDir, { recursive: true, force: true })
  })

  it('creates project with command line argument', async () => {
    const projectName = 'test-project-arg'
    const projectPath = path.join(testDir, projectName)

    const { output } = await spawnCLI(testDir, {
      args: [projectName],
      onData: (_, cleanOutput, process) => {
        if (cleanOutput.includes('Pick a template')) {
          handleTemplateSelection(process, 0)
        }
      },
    })

    // Verify output contains expected messages
    expect(output).toContain('create-dot-app')
    expect(output).toContain(projectName)

    // Verify project directory was created
    const projectExists = await fs.access(projectPath).then(() => true).catch(() => false)
    expect(projectExists).toBe(true)

    // Verify package.json has correct name
    const packageJsonPath = path.join(projectPath, 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    expect(packageJson.name).toBe(projectName)

    // Verify essential files exist
    const essentialFiles = ['src/App.tsx', 'src/main.tsx', 'index.html', 'vite.config.ts']
    for (const file of essentialFiles) {
      const filePath = path.join(projectPath, file)
      const fileExists = await fs.access(filePath).then(() => true).catch(() => false)
      expect(fileExists, `File ${file} should exist`).toBe(true)
    }
  })

  it('creates project in interactive mode', async () => {
    const projectName = 'interactive-project'
    const projectPath = path.join(testDir, projectName)

    let askedForName = false
    let askedForTemplate = false

    const { output } = await spawnCLI(testDir, {
      args: [],
      onData: async (_, cleanOutput, process) => {
        // Respond to project name prompt
        if (cleanOutput.includes('What is your project name?') && !askedForName) {
          askedForName = true
          await wait(100)
          process.write(`${projectName}\r`)
        }

        // Respond to template selection
        if (cleanOutput.includes('Pick a template') && !askedForTemplate) {
          askedForTemplate = true
          await handleTemplateSelection(process, 0)
        }
      },
    })

    // Verify output
    expect(output).toContain('create-dot-app')
    expect(output).toContain(projectName)

    // Verify project was created
    const projectExists = await fs.access(projectPath).then(() => true).catch(() => false)
    expect(projectExists).toBe(true)

    // Verify package.json has correct name
    const packageJsonPath = path.join(projectPath, 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    expect(packageJson.name).toBe(projectName)
  })

  it('handles existing directory error correctly', async () => {
    const projectName = 'existing-project'
    const projectPath = path.join(testDir, projectName)

    // Create directory that already exists
    await fs.mkdir(projectPath, { recursive: true })

    const { output } = await spawnCLI(testDir, {
      args: [projectName],
      expectExitCode: 1,
      onData: (_, cleanOutput, process) => {
        // Handle template selection if it appears
        if (cleanOutput.includes('Pick a template')) {
          handleTemplateSelection(process, 0)
        }
      },
    })

    // Should contain error message about existing directory
    expect(output.toLowerCase()).toContain('already exists')
  })

  it('can navigate template selection with arrow keys', async () => {
    const projectName = 'template-nav-test'
    const projectPath = path.join(testDir, projectName)

    await spawnCLI(testDir, {
      args: [projectName],
      onData: (_, cleanOutput, process) => {
        // Handle template selection with navigation to Vue + Dedot (3rd option)
        if (cleanOutput.includes('Pick a template')) {
          handleTemplateSelection(process, 2) // Navigate down 2 times
        }
      },
    })

    // Verify project was created
    const projectExists = await fs.access(projectPath).then(() => true).catch(() => false)
    expect(projectExists).toBe(true)

    // Verify it's a Vue project (should have App.vue instead of App.tsx)
    const appVueExists = await fs.access(path.join(projectPath, 'src/App.vue')).then(() => true).catch(() => false)
    expect(appVueExists, 'Should create Vue project with App.vue').toBe(true)
  })
})
