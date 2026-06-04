#!/usr/bin/env node
import path from 'node:path'
import process from 'node:process'
import {
  cancel,
  confirm,
  intro,
  isCancel,
  log,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts'
import fs from 'fs-extra'
import color from 'picocolors'
import { downloadTemplate } from './downloader.js'
import { detectPackageManager, installDependencies, packageManagers } from './package-manager.js'
import { pickTemplate, templateOptions } from './template-selector.js'

interface CliArgs {
  projectName?: string
  template?: string
  help?: boolean
  version?: boolean
}

function parseArgs(args: string[]): CliArgs {
  const parsed: CliArgs = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (arg === '--help' || arg === '-h') {
      parsed.help = true
    }
    else if (arg === '--version' || arg === '-v') {
      parsed.version = true
    }
    else if (arg.startsWith('--template=') || arg.startsWith('-t=')) {
      parsed.template = arg.split('=')[1]
    }
    else if (arg === '--template' || arg === '-t') {
      parsed.template = args[++i]
    }
    else if (arg.startsWith('--name=')) {
      parsed.projectName = arg.split('=')[1]
    }
    else if (arg === '--name') {
      parsed.projectName = args[++i]
    }
    else if (!arg.startsWith('--') && !arg.startsWith('-')) {
      parsed.projectName = arg
    }
  }

  return parsed
}

function showHelp() {
  console.log(`
${color.bold('create-dot-app')} - Bootstrap Polkadot dApps quickly

${color.bold('Usage:')}
  npx create-dot-app@latest [project-name] [options]

${color.bold('Options:')}
  -t, --template <template>  Specify template (see available templates below)
  --name <name>              Specify project name
  -h, --help                 Show this help message
  -v, --version              Show version number

${color.bold('Available Templates:')}
${templateOptions.map(option => `  ${color.cyan(String(option.value).padEnd(10))} ${option.label}${option.hint ? color.dim(` (${option.hint})`) : ''}`).join('\n')}

${color.bold('Examples:')}
  ${color.dim('# Interactive mode (pick Solidity or Substrate)')}
  npx create-dot-app@latest

  ${color.dim('# Specify project name')}
  npx create-dot-app@latest my-dapp

  ${color.dim('# Solidity dapp (Polkadot Hub EVM)')}
  npx create-dot-app@latest my-dapp --template next

  ${color.dim('# Substrate dapp, PAPI SDK (Polkadot native)')}
  npx create-dot-app@latest my-dapp --template next-papi

  ${color.dim('# Substrate dapp, Dedot SDK (Polkadot native)')}
  npx create-dot-app@latest my-dapp --template next-dedot

${color.bold('Learn more:')}
  ${color.underline('https://github.com/preschian/create-dot-app')}
`)
}

function isInteractive(): boolean {
  return Boolean(process.stdout.isTTY) && !process.env.CI
}

async function getVersion(): Promise<string> {
  try {
    const packageJsonPath = new URL('../package.json', import.meta.url)
    const packageJson = await fs.readJson(packageJsonPath.pathname)
    return packageJson.version
  }
  catch {
    return 'unknown'
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) {
    showHelp()
    return process.exit(0)
  }

  if (args.version) {
    const version = await getVersion()
    console.log(`create-dot-app v${version}`)
    return process.exit(0)
  }

  console.log()
  intro(color.inverse(' create-dot-app '))

  // Get project name from command line args or prompt
  let name: string

  if (args.projectName) {
    name = args.projectName
    log.info(`Using project name: ${args.projectName}`)
  }
  else {
    const nameInput = await text({
      message: 'What is your project name?',
      defaultValue: 'my-polkadot-app',
      placeholder: 'my-polkadot-app',
    })

    if (isCancel(nameInput)) {
      cancel('Operation cancelled')
      return process.exit(0)
    }

    name = nameInput
  }

  // Resolve the template: honor --template, otherwise prompt (Solidity vs Substrate)
  const template = await pickTemplate(args.template, isInteractive())
  log.info(`Using template: ${template}`)

  const s = spinner()
  s.start('Creating your project...')

  try {
    const targetPath = path.resolve(process.cwd(), name)

    // Check if target directory already exists
    if (await fs.pathExists(targetPath)) {
      s.stop('Directory already exists')
      cancel(`Directory "${name}" already exists`)
      return process.exit(1)
    }

    // Download template
    await downloadTemplate({ template, targetName: name })

    // Update package.json with the project name
    const packageJsonPath = path.join(targetPath, 'package.json')
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath)
      packageJson.name = name
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
    }

    // Copy .env.example to .env.local so the project works out of the box
    const envExamplePath = path.join(targetPath, '.env.example')
    if (await fs.pathExists(envExamplePath)) {
      await fs.copy(envExamplePath, path.join(targetPath, '.env.local'))
    }

    s.stop('Project created successfully!')

    // Let the developer pick a package manager and optionally install now.
    // Skip prompting in non-interactive contexts (CI, piped stdin).
    let pm = detectPackageManager()
    let installed = false

    if (isInteractive()) {
      const pmChoice = await select({
        message: 'Which package manager do you want to use?',
        options: packageManagers.map(value => ({ value, label: value })),
        initialValue: pm,
      })

      if (!isCancel(pmChoice)) {
        pm = pmChoice

        const shouldInstall = await confirm({
          message: `Install dependencies with ${color.cyan(pm)} now?`,
          initialValue: true,
        })

        if (!isCancel(shouldInstall) && shouldInstall) {
          try {
            log.step(`Installing dependencies with ${pm}...`)
            await installDependencies(pm, targetPath)
            installed = true
          }
          catch (installError) {
            log.warn(`Could not install dependencies: ${installError}\n    Run "${pm} install" manually once you're in the project.`)
          }
        }
      }
    }

    // Build the next-steps list, skipping install if we already ran it
    const steps = [color.cyan(`cd ${name}`)]
    if (!installed) {
      steps.push(color.cyan(`${pm} install`))
    }
    steps.push(color.cyan(`${pm} run dev`))

    log.info(`${color.green('✓')} Done! Next steps:\n    ${steps.join('\n    ')}\n    `)

    outro('Happy coding!')
  }
  catch (error) {
    s.stop('Failed to create project')
    cancel(`Failed to create project: ${error}`)
    return process.exit(1)
  }

  process.exit(0)
}

main().catch(console.error)
