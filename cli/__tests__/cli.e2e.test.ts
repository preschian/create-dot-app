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
  const { args = [], timeout = 60000, onData, expectExitCode = 0 } = options

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
      const cleanOutput = stripAnsi(buf)
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

async function handleCategorySelection(p: pty.IPty, navigateDown = 0): Promise<void> {
  await wait(200)

  // Navigate down if needed
  for (let i = 0; i < navigateDown; i++) {
    p.write('\x1B[B') // Arrow down
    await wait(100)
  }

  // Select current option
  p.write('\r')
  await wait(100)
}

async function handleTemplateSelection(p: pty.IPty, navigateDown = 0): Promise<void> {
  await wait(200) // Increased wait time

  // Navigate down if needed
  for (let i = 0; i < navigateDown; i++) {
    p.write('\x1B[B') // Arrow down
    await wait(100) // Increased wait between navigation
  }

  // Select current option
  p.write('\r')
  await wait(100) // Wait after selection
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

    let categorySelectionHandled = false
    let templateSelectionHandled = false

    const { output } = await spawnCLI(testDir, {
      args: [projectName],
      timeout: 60000, // Increase timeout
      onData: (data, cleanOutput, process) => {
        if (cleanOutput.includes('Pick a template category') && !categorySelectionHandled) {
          categorySelectionHandled = true
          handleCategorySelection(process, 0) // Select first category (Pallet Templates)
        }
        if (cleanOutput.includes('Pick a template') && !templateSelectionHandled) {
          templateSelectionHandled = true
          handleTemplateSelection(process, 0) // Use first template (index 0)
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

    // Verify essential files exist (Next.js App Router structure)
    const essentialFiles = ['app/page.tsx', 'app/layout.tsx', 'next.config.ts', 'package.json']
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
    let askedForCategory = false
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

        // Respond to category selection
        if (cleanOutput.includes('Pick a template category') && !askedForCategory) {
          askedForCategory = true
          await handleCategorySelection(process, 0)
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
        // Handle category selection if it appears
        if (cleanOutput.includes('Pick a template category')) {
          handleCategorySelection(process, 0)
        }
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

    let categorySelectionHandled = false
    let templateSelectionHandled = false

    await spawnCLI(testDir, {
      args: [projectName],
      onData: (_, cleanOutput, process) => {
        // Handle category selection (Pallet Templates)
        if (cleanOutput.includes('Pick a template category') && !categorySelectionHandled) {
          categorySelectionHandled = true
          handleCategorySelection(process, 0) // Select Pallet Templates
        }
        // Handle template selection with navigation to Vue + Dedot (7th option, index 6)
        if (cleanOutput.includes('Pick a template') && !templateSelectionHandled) {
          templateSelectionHandled = true
          handleTemplateSelection(process, 6) // Navigate down 6 times to get Vue + Dedot
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

  it('creates project with --template parameter', async () => {
    const projectName = 'template-param-test'
    const projectPath = path.join(testDir, projectName)

    const { output } = await spawnCLI(testDir, {
      args: [projectName, '--template=nuxt-dedot'],
      timeout: 60000,
    })

    // Verify output contains expected messages
    expect(output).toContain('create-dot-app')
    expect(output).toContain(`Using project name: ${projectName}`)
    expect(output).toContain('Using template: nuxt-dedot')
    expect(output).toContain('Project created successfully!')

    // Verify project directory was created
    const projectExists = await fs.access(projectPath).then(() => true).catch(() => false)
    expect(projectExists).toBe(true)

    // Verify package.json has correct name
    const packageJsonPath = path.join(projectPath, 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    expect(packageJson.name).toBe(projectName)

    // Verify it's a Nuxt project (should have nuxt.config.ts)
    const nuxtConfigExists = await fs.access(path.join(projectPath, 'nuxt.config.ts')).then(() => true).catch(() => false)
    expect(nuxtConfigExists, 'Should create Nuxt project with nuxt.config.ts').toBe(true)
  })

  it('handles invalid --template parameter correctly', async () => {
    const projectName = 'invalid-template-test'

    const { output } = await spawnCLI(testDir, {
      args: [projectName, '--template=invalid-template'],
      expectExitCode: 1,
      timeout: 30000,
    })

    // Should contain error message about invalid template
    expect(output).toContain('Invalid template "invalid-template"')
    expect(output).toContain('Available templates:')
    expect(output).toContain('next-dedot')
    expect(output).toContain('nuxt-dedot')
    expect(output).toContain('react-dedot')
    expect(output).toContain('vue-dedot')
    expect(output).toContain('ink-v6/react-dedot')
  })

  it('creates project with --template parameter only (prompts for name)', async () => {
    const projectName = 'template-only-test'
    const projectPath = path.join(testDir, projectName)

    let askedForName = false

    const { output } = await spawnCLI(testDir, {
      args: ['--template=react-dedot'],
      timeout: 60000,
      onData: async (_, cleanOutput, process) => {
        // Respond to project name prompt
        if (cleanOutput.includes('What is your project name?') && !askedForName) {
          askedForName = true
          await wait(100)
          process.write(`${projectName}\r`)
        }
      },
    })

    // Verify output contains expected messages
    expect(output).toContain('create-dot-app')
    expect(output).toContain('Using template: react-dedot')
    expect(output).toContain('Project created successfully!')

    // Verify project directory was created
    const projectExists = await fs.access(projectPath).then(() => true).catch(() => false)
    expect(projectExists).toBe(true)

    // Verify package.json has correct name
    const packageJsonPath = path.join(projectPath, 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    expect(packageJson.name).toBe(projectName)

    // Verify it's a React project (should have App.tsx)
    const appTsxExists = await fs.access(path.join(projectPath, 'src/App.tsx')).then(() => true).catch(() => false)
    expect(appTsxExists, 'Should create React project with App.tsx').toBe(true)
  })

  it('creates project with ink! template using --template parameter', async () => {
    const projectName = 'ink-template-test'
    const projectPath = path.join(testDir, projectName)

    const { output } = await spawnCLI(testDir, {
      args: [projectName, '--template=ink-v6/react-dedot'],
      timeout: 60000,
    })

    // Verify output contains expected messages
    expect(output).toContain('create-dot-app')
    expect(output).toContain(`Using project name: ${projectName}`)
    expect(output).toContain('Using template: ink-v6/react-dedot')
    expect(output).toContain('Project created successfully!')

    // Verify project directory was created
    const projectExists = await fs.access(projectPath).then(() => true).catch(() => false)
    expect(projectExists).toBe(true)

    // Verify package.json has correct name
    const packageJsonPath = path.join(projectPath, 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    expect(packageJson.name).toBe(projectName)

    // Verify it's an ink! React project (should have contract folder and App.tsx)
    const contractExists = await fs.access(path.join(projectPath, 'contract/Cargo.toml')).then(() => true).catch(() => false)
    const appTsxExists = await fs.access(path.join(projectPath, 'src/App.tsx')).then(() => true).catch(() => false)
    expect(contractExists, 'Should have ink! contract folder').toBe(true)
    expect(appTsxExists, 'Should create React project with App.tsx').toBe(true)
  })

  it('creates ink! project in interactive mode', async () => {
    const projectName = 'ink-interactive-test'
    const projectPath = path.join(testDir, projectName)

    let askedForName = false
    let askedForCategory = false
    let askedForTemplate = false

    const { output } = await spawnCLI(testDir, {
      args: [],
      timeout: 60000,
      onData: async (_, cleanOutput, process) => {
        // Respond to project name prompt
        if (cleanOutput.includes('What is your project name?') && !askedForName) {
          askedForName = true
          await wait(100)
          process.write(`${projectName}\r`)
        }

        // Respond to category selection (select ink! Templates - 3rd option, index 2)
        if (cleanOutput.includes('Pick a template category') && !askedForCategory) {
          askedForCategory = true
          await handleCategorySelection(process, 2)
        }

        // Respond to template selection (select first ink! template)
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

    // Verify it's an ink! project (should have contract folder)
    const contractExists = await fs.access(path.join(projectPath, 'contract/Cargo.toml')).then(() => true).catch(() => false)
    expect(contractExists, 'Should have ink! contract folder').toBe(true)
  })
})
