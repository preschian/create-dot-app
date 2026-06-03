import { kusamaHub, polkadotHub, polkadotHubTestnet } from '@/lib/web3/chains'

const id = (chain: { chainId: string }) => Number.parseInt(chain.chainId, 16)

/**
 * Deployed demo contracts per Polkadot Hub EVM chain.
 * Set testnet addresses after `npm run deploy:contracts`.
 * Mainnet and Kusama Hub stay unset until you deploy there.
 */
const FLIPPER_ADDRESS_BY_CHAIN_ID: Record<number, `0x${string}` | undefined> = {
  [id(polkadotHubTestnet)]: '0xC71323A95Eb9a1DCc545b7E3cfb0906cA014eb67',
  [id(polkadotHub)]: undefined,
  [id(kusamaHub)]: undefined,
}

const REMARK_ADDRESS_BY_CHAIN_ID: Record<number, `0x${string}` | undefined> = {
  [id(polkadotHubTestnet)]: '0xF470c52bb35B13a90c0BFc05b164ECc07f405956',
  [id(polkadotHub)]: undefined,
  [id(kusamaHub)]: undefined,
}

export function flipperAddressForChain(chainId: number): `0x${string}` | undefined {
  return FLIPPER_ADDRESS_BY_CHAIN_ID[chainId]
}

export function remarkAddressForChain(chainId: number): `0x${string}` | undefined {
  return REMARK_ADDRESS_BY_CHAIN_ID[chainId]
}
