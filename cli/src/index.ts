#!/usr/bin/env node
import path from 'node:path'
import process from 'node:process'
import {
  cancel,
  intro,
  isCancel,
  log,
  outro,
  spinner,
  text,
} from '@clack/prompts'
import fs from 'fs-extra'
import color from 'picocolors'
import { downloadTemplate } from './downloader.js'
import { trackProjectCreated } from './posthog.js'
import { pickTemplate } from './template-selector.js'

interface CliArgs {
  projectName?: string
  template?: string
  yes?: boolean
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
    else if (arg === '--yes' || arg === '-y') {
      parsed.yes = true
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
  -y, --yes                  Skip all prompts and use defaults
  -t, --template <template>  Specify template (see available templates below)
  --name <name>              Specify project name
  -h, --help                 Show this help message
  -v, --version              Show version number

${color.bold('Available Templates:')}

${color.cyan('Pallet Templates:')}
  next-dedot, next-papi, nuxt-dedot, nuxt-papi
  react-dedot, react-papi, vue-dedot, vue-papi

${color.cyan('Solidity Templates:')}
  solidity-react, solidity-vue

${color.cyan('ink! Templates:')}
  ink-v6/react-dedot, ink-v6/react-papi
  ink-v6/vue-dedot, ink-v6/vue-papi

${color.bold('Examples:')}
  ${color.dim('# Interactive mode')}
  npx create-dot-app@latest

  ${color.dim('# Non-interactive with defaults')}
  npx create-dot-app@latest --yes

  ${color.dim('# Specify project name')}
  npx create-dot-app@latest my-dapp

  ${color.dim('# Specify project name and template')}
  npx create-dot-app@latest my-dapp --template react-papi

  ${color.dim('# Full non-interactive mode')}
  npx create-dot-app@latest my-dapp -t ink-v6/react-dedot -y

${color.bold('Learn more:')}
  ${color.underline('https://github.com/preschian/create-dot-app')}
`)
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

  const isNonInteractive = args.yes

  // Get project name from command line args or prompt
  let name: string

  if (args.projectName) {
    name = args.projectName
    if (!isNonInteractive) {
      log.info(`Using project name: ${args.projectName}`)
    }
  }
  else if (isNonInteractive) {
    name = 'my-polkadot-app'
    log.info(`Using default project name: ${name}`)
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

  // Get template from command line args or prompt
  let template: string

  if (args.template) {
    if (!isNonInteractive) {
      log.info(`Using template: ${args.template}`)
    }
    template = await pickTemplate(args.template)
  }
  else if (isNonInteractive) {
    const defaultTemplate = 'react-papi'
    log.info(`Using default template: ${defaultTemplate}`)
    template = defaultTemplate
  }
  else {
    template = await pickTemplate()
  }

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

    s.stop('Project created successfully!')

    // Track successful project creation with template
    await trackProjectCreated(template)

    log.info(`${color.green('✓')} Done! Next steps:
    ${color.cyan(`cd ${name}`)}
    ${color.cyan('npm install')} ${color.dim('(or yarn install / pnpm install / bun install / deno install)')}
    ${color.cyan('npm run dev')} ${color.dim('(or yarn dev / pnpm dev / bun dev / deno task dev)')}
    `)

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
