import type { Prefix } from '../utils/sdk'
import { onMounted, ref } from 'vue'
import sdk from '../utils/sdk'

const isConnected = ref(false)
const connectedNetworks = ref<{
  name: string
  key: Prefix
  blockHeight: number
  status: 'connecting' | 'connected'
  subscanUrl: string
}[]>([
  { name: '', key: 'asset_hub', blockHeight: 0, status: 'connecting', subscanUrl: 'https://assethub-polkadot.subscan.io' },
  { name: '', key: 'pas_asset_hub', blockHeight: 0, status: 'connecting', subscanUrl: 'https://assethub-paseo.subscan.io' },
  { name: '', key: 'people', blockHeight: 0, status: 'connecting', subscanUrl: 'https://people-polkadot.subscan.io' },
])

export function useStatus() {
  // Helper function to get Subscan URL for a network
  function getSubscanUrl(chain: Prefix) {
    const network = connectedNetworks.value.find(n => n.key === chain)
    return network?.subscanUrl || ''
  }

  // Unified function to get latest block for any network
  function getLatestBlock(networkKey: Prefix) {
    const { client } = sdk(networkKey)

    client.blocks$.subscribe(async (block) => {
      // Update network block height
      const network = connectedNetworks.value.find(n => n.key === networkKey)
      if (network) {
        network.blockHeight = block.number
        network.status = 'connected'
        network.name = await client.getChainSpecData().then(data => data.name)
      }

      // Set connected status
      if (!isConnected.value) {
        isConnected.value = true
      }
    })
  }

  // Initialize connections on mount
  onMounted(() => {
    getLatestBlock('asset_hub')
    getLatestBlock('pas_asset_hub')
    getLatestBlock('people')
  })

  return {
    isConnected,
    connectedNetworks,
    getLatestBlock,
    getSubscanUrl,
  }
}
