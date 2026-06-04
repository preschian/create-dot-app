import type { SelectOptions } from '@clack/prompts'
import process from 'node:process'
import { cancel, isCancel, select } from '@clack/prompts'

const DEFAULT_TEMPLATE = 'next'

export const templateOptions: SelectOptions<string>['options'] = [
  {
    value: 'next',
    label: 'Solidity',
    hint: 'Next.js + Web3Auth + Wagmi, Polkadot Hub EVM',
  },
  {
    value: 'next-papi',
    label: 'Substrate',
    hint: 'Next.js + PAPI light client, Polkadot native',
  },
]

export async function pickTemplate(providedTemplate?: string, interactive = true): Promise<string> {
  const validTemplates = templateOptions.map(option => option.value)

  // Validate the provided template if one was passed
  if (providedTemplate) {
    if (!validTemplates.includes(providedTemplate)) {
      cancel(`Invalid template "${providedTemplate}". Available templates: ${validTemplates.join(', ')}`)
      process.exit(1)
    }

    return providedTemplate
  }

  // Non-interactive contexts (CI, piped stdin) can't prompt, so use the default
  if (!interactive) {
    return DEFAULT_TEMPLATE
  }

  // Let the developer choose which Polkadot stack to scaffold
  const choice = await select({
    message: 'Which Polkadot stack do you want to build with?',
    options: templateOptions,
    initialValue: DEFAULT_TEMPLATE,
  })

  if (isCancel(choice)) {
    cancel('Operation cancelled')
    process.exit(0)
  }

  return choice
}
