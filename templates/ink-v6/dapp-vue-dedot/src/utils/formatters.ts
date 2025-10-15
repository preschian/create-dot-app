import type { Prefix } from './sdk'
import { CHAIN_CONFIG } from './sdk'

export function stripAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function explorerDetail(hash: string, chainKey: Prefix): string {
  const rpc = CHAIN_CONFIG[chainKey].providers[0]
  const url = `https://polkadot.js.org/apps/?rpc=${rpc}#/explorer/query/${hash}`
  return url
}

export function buyTokenUrl(chainKey: Prefix) {
  if (chainKey === 'passethub') {
    const faucetUrl = new URL('https://faucet.polkadot.io/')
    faucetUrl.searchParams.set('parachain', '1111')
    return faucetUrl.toString()
  }

  return 'https://learn.onpop.io/contracts/guides/bridge-tokens-to-pop-network'
}
