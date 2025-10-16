import type { Prefix } from './sdk'
import { config } from './sdk'

export function stripAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function explorerDetail(hash: string, chainKey: Prefix): string {
  const rpc = config[chainKey].providers[0]
  const url = `https://polkadot.js.org/apps/?rpc=${rpc}#/explorer/query/${hash}`
  return url
}

export function buyTokenUrl(): string {
  const faucetUrl = new URL('https://faucet.polkadot.io/')
  faucetUrl.searchParams.set('parachain', '1111')
  return faucetUrl.toString()
}
