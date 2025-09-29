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

async function main() {
  console.log()
  intro(color.inverse(' create-dot-app '))

  // Parse command line arguments
  const args = process.argv.slice(2)
  let projectNameArg: string | undefined
  let templateArg: string | undefined

  // Parse arguments
  for (const arg of args) {
    if (arg.startsWith('--template=')) {
      templateArg = arg.split('=')[1]
    }
    else if (!arg.startsWith('--')) {
      projectNameArg = arg
    }
  }

  // Get project name from command line args or prompt
  let name: string

  if (projectNameArg) {
    name = projectNameArg
    log.info(`Using project name: ${projectNameArg}`)
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
  if (templateArg) {
    log.info(`Using template: ${templateArg}`)
  }
  const template = await pickTemplate(templateArg)

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
