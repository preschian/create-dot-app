import type { SelectOptions } from '@clack/prompts'
import process from 'node:process'
import { cancel } from '@clack/prompts'

const DEFAULT_TEMPLATE = 'next'

export const templateOptions: SelectOptions<string>['options'] = [
  { value: DEFAULT_TEMPLATE, label: 'Next.js (Web3Auth + Wagmi)' },
]

export async function pickTemplate(providedTemplate?: string): Promise<string> {
  const validTemplates = templateOptions.map(option => option.value)

  // Validate the provided template if one was passed
  if (providedTemplate && !validTemplates.includes(providedTemplate)) {
    cancel(`Invalid template "${providedTemplate}". Available templates: ${validTemplates.join(', ')}`)
    process.exit(1)
  }

  // Only the Next.js template is currently available, so use it directly
  return providedTemplate ?? DEFAULT_TEMPLATE
}
