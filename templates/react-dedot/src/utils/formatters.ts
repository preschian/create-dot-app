import type { Prefix } from '~/utils/sdk'
import { encodeAddress } from 'dedot/utils'

const subscan: Record<Prefix, string> = {
  dot: 'https://polkadot.subscan.io',
  dot_asset_hub: 'https://assethub-polkadot.subscan.io',
  pas: 'https://paseo.subscan.io',
  pas_asset_hub: 'https://assethub-paseo.subscan.io',
}

export function unifyAddress(address: string) {
  return encodeAddress(address, 0)
}

export function stripAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function formatPrice(price: string, decimals: number): string {
  return (Number(price) / 10 ** decimals).toFixed(4).toLocaleString()
}

export function explorerAccount(chain: Prefix, address?: string): string {
  const url = new URL(subscan[chain])
  url.pathname = `/account/${address || ''}`

  return url.toString()
}

export function explorerDetail(chain: Prefix, hash: string): string {
  const url = new URL(subscan[chain])
  url.pathname = `/block/${hash}`

  return url.toString()
}

export function buyTokenUrl(chainKey: Prefix, address?: string) {
  if (chainKey === 'dot' || chainKey === 'dot_asset_hub') {
    const url = new URL('https://checkout.banxa.com')
    url.searchParams.set('coinType', 'DOT')
    url.searchParams.set('blockchain', 'DOT')
    url.searchParams.set('walletAddress', address || '')
    url.searchParams.set('orderType', 'BUY')

    return url.toString()
  }

  const faucetUrl = new URL('https://faucet.polkadot.io/')

  if (chainKey === 'pas_asset_hub') {
    faucetUrl.searchParams.set('parachain', '1000')
  }

  return faucetUrl.toString()
}
