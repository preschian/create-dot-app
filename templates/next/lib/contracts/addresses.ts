import { kusamaHub, polkadotHub, polkadotHubTestnet } from '../chains/polkadot'

const id = (chain: { chainId: string }) => Number.parseInt(chain.chainId, 16)

/**
 * Flipper contract per Polkadot Hub EVM chain.
 * Set the testnet address after `cd contracts && npm run deploy`.
 * Mainnet and Kusama Hub stay unset until you deploy there.
 */
export const FLIPPER_ADDRESS_BY_CHAIN_ID: Record<number, `0x${string}` | undefined> = {
  [id(polkadotHubTestnet)]: "0x8276BEe09CB4B7B77540EbC71836155B50426c5f",
  [id(polkadotHub)]: undefined,
  [id(kusamaHub)]: undefined,
}

export function flipperAddressForChain(chainId: number): `0x${string}` | undefined {
  return FLIPPER_ADDRESS_BY_CHAIN_ID[chainId]
}
