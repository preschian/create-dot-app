import { kusamaHub, polkadotHub, polkadotHubTestnet } from '../chains/polkadot'

const id = (chain: { chainId: string }) => Number.parseInt(chain.chainId, 16)

/**
 * Flipper contract per Polkadot Hub EVM chain.
 * Set the testnet address after `cd contracts && npm run deploy`.
 * Mainnet and Kusama Hub stay unset until you deploy there.
 */
export const FLIPPER_ADDRESS_BY_CHAIN_ID: Record<number, `0x${string}` | undefined> = {
  [id(polkadotHubTestnet)]: undefined,
  [id(polkadotHub)]: undefined,
  [id(kusamaHub)]: undefined,
}

export function flipperAddressForChain(chainId: number): `0x${string}` | undefined {
  return FLIPPER_ADDRESS_BY_CHAIN_ID[chainId]
}
