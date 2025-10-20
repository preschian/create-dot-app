import type { Prefix } from './sdk'
import flipperMetadata from '../contracts/flipper.json'

export const CONTRACT_CONFIG = {
  passethub: {
    address: '0x85ff0423124296970accc83a235fdfbfa68f85af',
    metadata: flipperMetadata,
  },
} as const

const getContractConfig = (chainPrefix: Prefix) => CONTRACT_CONFIG[chainPrefix]

export const getContractAddress = (chainPrefix: Prefix) => getContractConfig(chainPrefix).address
export const getContractMetadata = (chainPrefix: Prefix) => getContractConfig(chainPrefix).metadata

