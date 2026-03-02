import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import stripAnsi from 'strip-ansi'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const node = process.env.NODE ?? 'node'
const cliPath = path.join(__dirname, '..', 'dist', 'index.mjs')

/** Writer interface for sending input to the CLI (used by onData / handleSelection). */
interface CLIWriter {
  write(s: string): void
}

interface SpawnOptions {
  args?: string[]
  timeout?: number
  onData?: (data: string, cleanOutput: string, writer: CLIWriter) => void
  expectExitCode?: number
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function spawnCLI(testDir: string, options: SpawnOptions): Promise<{ output: string, process: ReturnType<typeof spawn> }> {
  const { args = [], timeout = 60000, onData, expectExitCode = 0 } = options

  const env = {
    ...process.env,
    FORCE_COLOR: '0',
    CI: '1',
    DISABLE_TELEMETRY: 'true',
  }

  const child = spawn(node, [cliPath, ...args], {
    cwd: testDir,
    env,
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  const writer: CLIWriter = {
    write(s: string) {
      child.stdin?.write(s)
    },
  }

  let buf = ''
  let resolved = false

  const append = (data: string) => {
    buf += data
    const cleanOutput = stripAnsi(buf)
    onData?.(data, cleanOutput, writer)
  }

  child.stdout?.on('data', (chunk: Buffer | string) => append(chunk.toString()))
  child.stderr?.on('data', (chunk: Buffer | string) => append(chunk.toString()))

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true
        child.kill('SIGKILL')
        reject(new Error(`Test timed out after ${timeout}ms`))
      }
    }, timeout)

    child.on('close', (code, signal) => {
      clearTimeout(timeoutId)
      if (!resolved) {
        resolved = true
        const exitCode = code ?? (signal ? 1 : 0)
        if (exitCode === expectExitCode) {
          resolve({ output: stripAnsi(buf), process: child })
        }
        else {
          reject(new Error(`Expected exit code ${expectExitCode}, got ${exitCode}`))
        }
      }
    })

    child.on('error', (err) => {
      if (!resolved) {
        resolved = true
        clearTimeout(timeoutId)
        reject(err)
      }
    })
  })
}

async function handleSelection(writer: CLIWriter, navigateDown = 0): Promise<void> {
  await wait(500)
  for (let i = 0; i < navigateDown; i++) {
    writer.write('\x1B[B')
    await wait(200)
  }
  writer.write('\r')
  await wait(300)
}

describe('cli E2E tests', () => {
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
        if (cleanOutput.includes('Choose your project type') && !categorySelectionHandled) {
          categorySelectionHandled = true
          handleSelection(process, 0) // Select first category (Pallet Templates)
        }
        if (cleanOutput.includes('Pick a template') && !templateSelectionHandled) {
          templateSelectionHandled = true
          handleSelection(process, 0) // Use first template (index 0)
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
        if (cleanOutput.includes('Choose your project type') && !askedForCategory) {
          askedForCategory = true
          await handleSelection(process, 0)
        }

        // Respond to template selection
        if (cleanOutput.includes('Pick a template') && !askedForTemplate) {
          askedForTemplate = true
          await handleSelection(process, 0)
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
        if (cleanOutput.includes('Choose your project type')) {
          handleSelection(process, 0)
        }
        // Handle template selection if it appears
        if (cleanOutput.includes('Pick a template')) {
          handleSelection(process, 0)
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
        if (cleanOutput.includes('Choose your project type') && !categorySelectionHandled) {
          categorySelectionHandled = true
          handleSelection(process, 0) // Select Pallet Templates
        }
        // Handle template selection with navigation to Vue + Dedot (7th option, index 6)
        if (cleanOutput.includes('Pick a template') && !templateSelectionHandled) {
          templateSelectionHandled = true
          handleSelection(process, 6) // Navigate down 6 times to get Vue + Dedot
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

  it('creates project with custom name and template (non-interactive)', async () => {
    const projectName = 'vue-dapp'
    const projectPath = path.join(testDir, projectName)

    const { output } = await spawnCLI(testDir, {
      args: [projectName, '-t', 'vue-dedot'],
      timeout: 60000,
    })

    // Verify output contains expected messages
    expect(output).toContain('create-dot-app')
    expect(output).toContain('Project created successfully!')

    // Verify project directory was created
    const projectExists = await fs.access(projectPath).then(() => true).catch(() => false)
    expect(projectExists).toBe(true)

    // Verify package.json has correct name
    const packageJsonPath = path.join(projectPath, 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    expect(packageJson.name).toBe(projectName)

    // Verify it's a Vue project (should have App.vue)
    const appVueExists = await fs.access(path.join(projectPath, 'src/App.vue')).then(() => true).catch(() => false)
    expect(appVueExists, 'Should create Vue project with App.vue').toBe(true)
  })

  it('displays help with --help flag', async () => {
    const { output } = await spawnCLI(testDir, {
      args: ['--help'],
      timeout: 10000,
    })

    // Verify help message contains expected content
    expect(output).toContain('create-dot-app')
    expect(output).toContain('Bootstrap Polkadot dApps quickly')
    expect(output).toContain('Usage:')
    expect(output).toContain('Options:')
    expect(output).toContain('-t, --template')
    expect(output).toContain('--name')
    expect(output).toContain('-h, --help')
    expect(output).toContain('-v, --version')
    expect(output).toContain('Available Templates:')
    expect(output).toContain('Examples:')
  })

  it('displays help with -h flag', async () => {
    const { output } = await spawnCLI(testDir, {
      args: ['-h'],
      timeout: 10000,
    })

    // Verify help message is displayed
    expect(output).toContain('create-dot-app')
    expect(output).toContain('Bootstrap Polkadot dApps quickly')
    expect(output).toContain('Usage:')
  })

  it('displays version with --version flag', async () => {
    const { output } = await spawnCLI(testDir, {
      args: ['--version'],
      timeout: 10000,
    })

    // Verify version is displayed (should be in format: create-dot-app vX.Y.Z)
    expect(output).toMatch(/create-dot-app v\d+\.\d+\.\d+/)
  })

  it('displays version with -v flag', async () => {
    const { output } = await spawnCLI(testDir, {
      args: ['-v'],
      timeout: 10000,
    })

    // Verify version is displayed
    expect(output).toMatch(/create-dot-app v\d+\.\d+\.\d+/)
  })

  it('creates project with --name flag', async () => {
    const projectName = 'named-project'
    const projectPath = path.join(testDir, projectName)

    await spawnCLI(testDir, {
      args: ['--name', projectName, '-t', 'react-dedot'],
      timeout: 60000,
    })

    // Verify project directory was created
    const projectExists = await fs.access(projectPath).then(() => true).catch(() => false)
    expect(projectExists).toBe(true)

    // Verify package.json has correct name
    const packageJsonPath = path.join(projectPath, 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    expect(packageJson.name).toBe(projectName)
  })

  it('creates project with --name= syntax', async () => {
    const projectName = 'named-project-2'
    const projectPath = path.join(testDir, projectName)

    await spawnCLI(testDir, {
      args: [`--name=${projectName}`, '--template=nuxt-papi'],
      timeout: 60000,
    })

    // Verify project directory was created
    const projectExists = await fs.access(projectPath).then(() => true).catch(() => false)
    expect(projectExists).toBe(true)

    // Verify package.json has correct name
    const packageJsonPath = path.join(projectPath, 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    expect(packageJson.name).toBe(projectName)

    // Verify it's a Nuxt project
    const nuxtConfigExists = await fs.access(path.join(projectPath, 'nuxt.config.ts')).then(() => true).catch(() => false)
    expect(nuxtConfigExists, 'Should create Nuxt project with nuxt.config.ts').toBe(true)
  })
})
