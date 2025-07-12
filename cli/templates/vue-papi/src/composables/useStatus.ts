import type { Prefix } from '../utils/sdk'
import { onMounted, ref } from 'vue'
import sdk from '../utils/sdk'

export function useStatus() {
  const isConnected = ref(false)

  // Connected networks with their block heights - only the three available in SDK
  const connectedNetworks = ref<{
    name: string
    key: Prefix
    blockHeight: number
    status: 'connecting' | 'connected'
  }[]>([
    { name: '', key: 'asset_hub' as Prefix, blockHeight: 0, status: 'connecting' },
    { name: '', key: 'pas_asset_hub' as Prefix, blockHeight: 0, status: 'connecting' },
    { name: '', key: 'people' as Prefix, blockHeight: 0, status: 'connecting' },
  ])

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
  }
}
