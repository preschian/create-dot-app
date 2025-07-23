#!/usr/bin/env node
import path from 'node:path'
import process from 'node:process'
import {
  cancel,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
  log,
} from '@clack/prompts'
import fs from 'fs-extra'
import color from 'picocolors'
import { downloadRepo } from '@begit/core'

async function main() {
  console.log()
  intro(color.inverse(' create-dot-app '))

  // Get project name from command line args or prompt
  const projectNameArg = process.argv[2]
  let name: string

  if (projectNameArg) {
    name = projectNameArg
    log.info(`Using project name: ${projectNameArg}`)
  } else {
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

  const template = await select({
    message: 'Pick a template',
    options: [
      { value: 'react-papi', label: 'React + PAPI' },
      { value: 'vue-papi', label: 'Vue + PAPI' },
      { value: 'vue-dedot', label: 'Vue + Dedot' },
    ],
  })

  if (isCancel(template)) {
    cancel('Operation cancelled')
    return process.exit(0)
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

    // Download template using begit
    await downloadRepo({
      repo: {
       owner: "preschian",
       name: "create-dot-app",
       branch: 'main',
       subdir: `templates/${template}`,
      },
      dest: name,
    });

    // Update package.json with the project name
    const packageJsonPath = path.join(targetPath, 'package.json')
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath)
      packageJson.name = name
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
    }

    s.stop('Project created successfully!')

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
    return process.exit(1)
  }
}

main().catch(console.error)
