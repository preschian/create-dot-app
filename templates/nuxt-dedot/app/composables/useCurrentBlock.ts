import type { Prefix } from '~/plugins/sdk.client'

export function useCurrentBlock(chain: Prefix) {
  const name = ref('')
  const currentBlock = ref(0)
  const isConnected = computed(() => currentBlock.value > 0)

  onMounted(async () => {
    subscribeToBlocks(chain, ({ blockHeight, chainName }) => {
      currentBlock.value = blockHeight
      name.value = chainName
    })
  })

  return {
    name,
    currentBlock,
    isConnected,
  }
}
