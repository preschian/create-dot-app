import type { Prefix } from './sdk'
import flipperMetadata from '../../../contract/target/ink/flipper.json'

export const CONTRACT_CONFIG = {
  passethub: {
    address: '0xf4c151d281edc887666d53307174207856be8371',
    metadata: flipperMetadata,
  },
} as const

const getContractConfig = (chainPrefix: Prefix) => CONTRACT_CONFIG[chainPrefix]

export const getContractAddress = (chainPrefix: Prefix) => getContractConfig(chainPrefix).address
export const getContractMetadata = (chainPrefix: Prefix) => getContractConfig(chainPrefix).metadata
