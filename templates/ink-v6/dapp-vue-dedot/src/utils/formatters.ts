import type { Prefix } from '~/utils/sdk'

export function stripAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function explorerDetail(hash: string): string {
  const url = `https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ftestnet-passet-hub.polkadot.io#/explorer/query/${hash}`
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
