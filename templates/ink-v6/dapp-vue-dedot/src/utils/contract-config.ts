import type { Prefix } from './sdk'
import flipperMetadata from '../../contract/target/ink/flipper.json'

export const CONTRACT_CONFIG = {
  passethub: {
    address: '0xbb6d76a4ea5cf48bb7e6f9c2331b12c32e3fd340',
    metadata: flipperMetadata,
  },
} as const

const getContractConfig = (chainPrefix: Prefix) => CONTRACT_CONFIG[chainPrefix]

export const getContractAddress = (chainPrefix: Prefix) => getContractConfig(chainPrefix).address
export const getContractMetadata = (chainPrefix: Prefix) => getContractConfig(chainPrefix).metadata
