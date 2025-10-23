import type { SelectOptions } from '@clack/prompts'
import process from 'node:process'
import { cancel, isCancel, select } from '@clack/prompts'

type Category = 'pallet' | 'solidity' | 'ink'

const categoryOptions: SelectOptions<Category>['options'] = [
  { value: 'pallet', label: 'Pallet Templates' },
  { value: 'solidity', label: 'Solidity Templates' },
  { value: 'ink', label: 'ink! Templates' },
]

const palletTemplateOptions: SelectOptions<string>['options'] = [
  { value: 'next-dedot', label: 'Next + Dedot' },
  { value: 'next-papi', label: 'Next + PAPI' },

  { value: 'nuxt-dedot', label: 'Nuxt + Dedot' },
  { value: 'nuxt-papi', label: 'Nuxt + PAPI' },

  { value: 'react-dedot', label: 'React + Dedot' },
  { value: 'react-papi', label: 'React + PAPI' },

  { value: 'vue-dedot', label: 'Vue + Dedot' },
  { value: 'vue-papi', label: 'Vue + PAPI' },
]

const solidityTemplateOptions: SelectOptions<string>['options'] = [
  { value: 'solidity-react', label: 'Solidity + React (Hardhat + Wagmi)' },
  { value: 'solidity-vue', label: 'Solidity + Vue (Hardhat + Wagmi)' },
]

const inkTemplateOptions: SelectOptions<string>['options'] = [
  { value: 'ink-v6/react-dedot', label: 'ink! React + Dedot' },
  { value: 'ink-v6/react-papi', label: 'ink! React + PAPI' },
  { value: 'ink-v6/vue-dedot', label: 'ink! Vue + Dedot' },
  { value: 'ink-v6/vue-papi', label: 'ink! Vue + PAPI' },
]

export const templateOptions: SelectOptions<string>['options'] = [
  ...palletTemplateOptions,
  ...solidityTemplateOptions,
  ...inkTemplateOptions,
]

export async function pickTemplate(providedTemplate?: string): Promise<string> {
  // If a template is provided, validate it and return it
  if (providedTemplate) {
    const validTemplates = templateOptions.map(option => option.value)
    if (validTemplates.includes(providedTemplate)) {
      return providedTemplate
    }
    else {
      cancel(`Invalid template "${providedTemplate}". Available templates: ${validTemplates.join(', ')}`)
      process.exit(1)
    }
  }

  // Otherwise, show the interactive picker
  // First, pick a category
  const category = await select({
    message: 'Pick a template category',
    options: categoryOptions,
  })

  if (isCancel(category)) {
    cancel('Operation cancelled')
    process.exit(0)
  }

  // Then, pick a template based on the category
  let templateOptionsForCategory: SelectOptions<string>['options']
  
  switch (category) {
    case 'pallet':
      templateOptionsForCategory = palletTemplateOptions
      break
    case 'solidity':
      templateOptionsForCategory = solidityTemplateOptions
      break
    case 'ink':
      templateOptionsForCategory = inkTemplateOptions
      break
  }

  const template = await select({
    message: 'Pick a template',
    options: templateOptionsForCategory,
  })

  if (isCancel(template)) {
    cancel('Operation cancelled')
    process.exit(0)
  }

  return template
}
