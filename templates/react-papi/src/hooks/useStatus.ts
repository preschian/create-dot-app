import type { Prefix } from '../utils/sdk'
import { useState } from 'react'
import { subscribeToBlocks } from '../utils/sdk-interface'

interface NetworkStatus {
  name: string
  key: Prefix
  blockHeight: number
  status: 'connecting' | 'connected'
  subscanUrl: string
}

const initialNetworks: NetworkStatus[] = [
  { name: '', key: 'asset_hub', blockHeight: 0, status: 'connecting', subscanUrl: 'https://assethub-polkadot.subscan.io' },
  { name: '', key: 'pas_asset_hub', blockHeight: 0, status: 'connecting', subscanUrl: 'https://assethub-paseo.subscan.io' },
  { name: '', key: 'people', blockHeight: 0, status: 'connecting', subscanUrl: 'https://people-polkadot.subscan.io' },
]

export function useStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [connectedNetworks, setConnectedNetworks] = useState<NetworkStatus[]>(initialNetworks)

  const getLatestBlock = (networkKey: Prefix) => {
    subscribeToBlocks(networkKey, ({ blockHeight, chainName }) => {
      setConnectedNetworks(prevNetworks =>
        prevNetworks.map(network =>
          network.key === networkKey
            ? { ...network, blockHeight, status: 'connected', name: chainName }
            : network,
        ),
      )

      if (!isConnected) {
        setIsConnected(true)
      }
    })
  }

  getLatestBlock('asset_hub')
  getLatestBlock('pas_asset_hub')
  getLatestBlock('people')

  const getSubscanUrl = (chain: Prefix) => {
    const network = connectedNetworks.find(n => n.key === chain)
    return network?.subscanUrl || ''
  }

  return {
    isConnected,
    connectedNetworks,
    getSubscanUrl,
  }
}
