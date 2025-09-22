import type { SelectOptions } from '@clack/prompts'
import process from 'node:process'
import { cancel, isCancel, select } from '@clack/prompts'

export const templateOptions: SelectOptions<string>['options'] = [
  { value: 'next-dedot', label: 'Next + Dedot' },
  { value: 'next-papi', label: 'Next + PAPI' },

  { value: 'nuxt-dedot', label: 'Nuxt + Dedot' },
  { value: 'nuxt-papi', label: 'Nuxt + PAPI' },

  { value: 'react-dedot', label: 'React + Dedot' },
  { value: 'react-papi', label: 'React + PAPI' },

  { value: 'vue-dedot', label: 'Vue + Dedot' },
  { value: 'vue-papi', label: 'Vue + PAPI' },

  { value: 'solidity-react', label: 'Solidity + React (Hardhat + Wagmi)' },
  { value: 'solidity-vue', label: 'Solidity + Vue (Hardhat + Wagmi)' },
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
  const template = await select({
    message: 'Pick a template',
    options: templateOptions,
  })

  if (isCancel(template)) {
    cancel('Operation cancelled')
    process.exit(0)
  }

  return template
}
