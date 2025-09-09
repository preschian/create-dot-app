import type { Prefix } from '~/plugins/sdk.client'

export function useCurrentBlock(chain: Prefix) {
  const name = ref('')
  const currentBlock = ref(0)
  const isConnected = computed(() => currentBlock.value > 0)

  let unsubscribe: Awaited<ReturnType<typeof subscribeToBlocks>> | undefined

  onMounted(async () => {
    unsubscribe = await subscribeToBlocks(chain, async ({ blockHeight, chainName }) => {
      currentBlock.value = blockHeight
      name.value = chainName
    })
  })

  onUnmounted(() => {
    unsubscribe?.()
  })

  return {
    name,
    currentBlock,
    isConnected,
  }
}
