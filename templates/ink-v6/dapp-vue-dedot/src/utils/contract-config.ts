import type { Prefix } from './sdk'
import flipperMetadata from '../../../contract/target/ink/flipper.json'

export const CONTRACT_CONFIG = {
  passethub: {
    address: '0xf4c151d281edc887666d53307174207856be8371',
    metadata: flipperMetadata,
  },
} as const

export function getContractAddress(chainPrefix: Prefix) {
  return CONTRACT_CONFIG[chainPrefix].address
}

export function getContractMetadata(chainPrefix: Prefix) {
  return CONTRACT_CONFIG[chainPrefix].metadata
}
