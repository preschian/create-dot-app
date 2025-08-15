import type { SelectOptions } from '@clack/prompts'
import process from 'node:process'
import { cancel, isCancel, select } from '@clack/prompts'

export const templateOptions: SelectOptions<string>['options'] = [
  { value: 'react-dedot', label: 'React + Dedot' },
  { value: 'react-papi', label: 'React + PAPI' },

  { value: 'vue-dedot', label: 'Vue + Dedot' },
  { value: 'vue-papi', label: 'Vue + PAPI' },
  { value: 'nuxt-dedot', label: 'Nuxt + Dedot' },
]

export async function pickTemplate(): Promise<string> {
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
