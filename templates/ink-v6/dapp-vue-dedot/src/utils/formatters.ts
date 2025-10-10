import type { Prefix } from '~/utils/sdk'
import { encodeAddress } from 'dedot/utils'

const subscan: Record<Prefix, string> = {
  passethub: 'https://passet-hub-paseo.subscan.io',
  pop: 'https://paseo.subscan.io',
}

export function unifyAddress(address: string) {
  return encodeAddress(address, 0)
}

export function stripAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function explorerAccount(chain: Prefix, address?: string): string {
  const url = new URL(subscan[chain])
  url.pathname = `/account/${address || ''}`

  return url.toString()
}

export function explorerDetail(hash: string): string {
  const url = `https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ftestnet-passet-hub.polkadot.io#/explorer/query/${hash}`
  return url
}

export function buyTokenUrl(chainKey: Prefix) {
  const faucetUrl = new URL('https://faucet.polkadot.io/')

  if (chainKey === 'passethub') {
    faucetUrl.searchParams.set('parachain', '1111')
  }

  return faucetUrl.toString()
}
