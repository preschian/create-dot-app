import type { Prefix } from './sdk'

export const CONTRACT_ADDRESSES: Record<Prefix, string> = {
  passethub: '0x596c81822e911eb078ae3e0917f4a6493b968150',
}

export function getContractAddress(chainKey: Prefix): string {
  const address = CONTRACT_ADDRESSES[chainKey]
  if (!address) {
    throw new Error(`No contract address configured for chain: ${chainKey}`)
  }
  return address
}
