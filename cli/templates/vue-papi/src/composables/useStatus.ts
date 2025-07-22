import type { Prefix } from '~/utils/sdk'
import { onMounted, ref } from 'vue'
import { subscribeToBlocks } from '~/utils/sdk-interface'

const isConnected = ref(false)
const connectedNetworks = ref<{
  name: string
  key: Prefix
  blockHeight: number
  status: 'connecting' | 'connected'
  subscanUrl: string
}[]>([
  { name: '', key: 'dot', blockHeight: 0, status: 'connecting', subscanUrl: 'https://assethub-polkadot.subscan.io' },
  { name: '', key: 'dot_asset_hub', blockHeight: 0, status: 'connecting', subscanUrl: 'https://assethub-polkadot.subscan.io' },
  { name: '', key: 'pas', blockHeight: 0, status: 'connecting', subscanUrl: 'https://assethub-paseo.subscan.io' },
  { name: '', key: 'pas_asset_hub', blockHeight: 0, status: 'connecting', subscanUrl: 'https://assethub-paseo.subscan.io' },
])

export function useStatus() {
  // Helper function to get Subscan URL for a network
  function getSubscanUrl(chain: Prefix) {
    const network = connectedNetworks.value.find(n => n.key === chain)
    return network?.subscanUrl || ''
  }

  // Unified function to get latest block for any network
  function getLatestBlock(networkKey: Prefix) {
    subscribeToBlocks(networkKey, ({ blockHeight, chainName }) => {
      // Update network block height
      const network = connectedNetworks.value.find(n => n.key === networkKey)
      if (network) {
        network.blockHeight = blockHeight
        network.status = 'connected'
        network.name = chainName
      }

      // Set connected status
      if (!isConnected.value) {
        isConnected.value = true
      }
    })
  }

  // Initialize connections on mount
  onMounted(() => {
    getLatestBlock('dot')
    getLatestBlock('dot_asset_hub')
    getLatestBlock('pas')
    getLatestBlock('pas_asset_hub')
  })

  return {
    isConnected,
    connectedNetworks,
    getLatestBlock,
    getSubscanUrl,
  }
}
