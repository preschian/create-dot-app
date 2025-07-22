import type { Prefix } from '~/utils/sdk'
import { computed, onMounted, ref } from 'vue'
import { subscribeToBlocks } from '~/utils/sdk-interface'

const subscan: Record<Prefix, string> = {
  dot: 'https://polkadot.subscan.io',
  dot_asset_hub: 'https://assethub-polkadot.subscan.io',
  pas: 'https://paseo.subscan.io',
  pas_asset_hub: 'https://assethub-paseo.subscan.io',
}

export function useCurrentBlock(chainKey: Prefix) {
  const name = ref('')
  const currentBlock = ref(0)
  const isConnected = computed(() => currentBlock.value > 0)

  function explorerAccount() {
    const url = new URL(subscan[chainKey])
    url.pathname = `/account/`

    return url.toString()
  }

  onMounted(async () => {
    subscribeToBlocks(chainKey, ({ blockHeight, chainName }) => {
      currentBlock.value = blockHeight
      name.value = chainName
    })
  })

  return {
    name,
    currentBlock,
    isConnected,
    explorerAccount: explorerAccount(),
  }
}
