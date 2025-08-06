#!/usr/bin/env node
import path from 'node:path'
import process from 'node:process'
import { downloadRepo } from '@begit/core'
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
import { shutdownAnalytics, trackProjectCreated } from './posthog.js'
import { pickTemplate } from './template-selector.js'

async function main() {
  console.log()
  intro(color.inverse(' create-dot-app '))

  // Get project name from command line args or prompt
  const projectNameArg = process.argv[2]
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
      await shutdownAnalytics()
      return process.exit(0)
    }

    name = nameInput
  }

  const template = await pickTemplate()

  const s = spinner()
  s.start('Creating your project...')

  try {
    const targetPath = path.resolve(process.cwd(), name)

    // Check if target directory already exists
    if (await fs.pathExists(targetPath)) {
      s.stop('Directory already exists')
      cancel(`Directory "${name}" already exists`)
      await shutdownAnalytics()
      return process.exit(1)
    }

    // Download template using begit
    await downloadRepo({
      repo: {
        owner: 'preschian',
        name: 'create-dot-app',
        branch: 'main',
        subdir: `templates/${template}`,
      },
      dest: name,
    })

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
    ${color.cyan('npm install')} ${color.dim('(or yarn install / pnpm install / bun install)')}
    ${color.cyan('npm run dev')} ${color.dim('(or yarn dev / pnpm dev / bun dev)')}
    `)

    outro('Happy coding!')
  }
  catch (error) {
    s.stop('Failed to create project')
    cancel(`Failed to create project: ${error}`)
    await shutdownAnalytics()
    return process.exit(1)
  }

  // Ensure analytics are sent before process exits
  await shutdownAnalytics()
}

main().catch(console.error)
