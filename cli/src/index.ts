import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import {
  cancel,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts'
import fs from 'fs-extra'
import color from 'picocolors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  console.log()
  intro(color.inverse(' create-dot-app '))

  const name = await text({
    message: 'What is your project name?',
    defaultValue: 'my-polkadot-app',
    placeholder: 'my-polkadot-app',
  })

  if (isCancel(name)) {
    cancel('Operation cancelled')
    return process.exit(0)
  }

  const template = await select({
    message: 'Pick a template',
    options: [
      { value: 'react-papi', label: 'React + PAPI' },
      { value: 'vue-papi', label: 'Vue + PAPI' },
    ],
  })

  if (isCancel(template)) {
    cancel('Operation cancelled')
    return process.exit(0)
  }

  const s = spinner()
  s.start('Creating your project...')

  try {
    // Get the template path
    const templatePath = path.join(__dirname, '..', 'templates', template)
    const targetPath = path.resolve(process.cwd(), name)

    // Check if template exists
    if (!await fs.pathExists(templatePath)) {
      s.stop('Template not found')
      cancel(`Template "${template}" not found at ${templatePath}`)
      return process.exit(1)
    }

    // Check if target directory already exists
    if (await fs.pathExists(targetPath)) {
      s.stop('Directory already exists')
      cancel(`Directory "${name}" already exists`)
      return process.exit(1)
    }

    // Copy template to target directory
    await fs.copy(templatePath, targetPath)

    // Update package.json with the project name
    const packageJsonPath = path.join(targetPath, 'package.json')
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath)
      packageJson.name = name as string
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
    }

    s.stop('Project created successfully!')

    outro(`${color.green('✓')} Done! Next steps:
      ${color.cyan(`cd ${name}`)}
      ${color.cyan('npm install')} ${color.dim('(or yarn install / pnpm install / bun install)')}
      ${color.cyan('npm run dev')} ${color.dim('(or yarn dev / pnpm dev / bun dev)')}
    `)
  }
  catch (error) {
    s.stop('Failed to create project')
    cancel(`Failed to create project: ${error}`)
    return process.exit(1)
  }
}

main().catch(console.error)
