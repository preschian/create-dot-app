import type { Prefix } from '~/plugins/sdk.client'

export function useCurrentBlock(chain: Prefix) {
  const name = ref('')
  const currentBlock = ref(0)
  const isConnected = computed(() => currentBlock.value > 0)

  let unsubscribe: unknown

  onMounted(() => {
    unsubscribe = subscribeToBlocks(chain, ({ blockHeight, chainName }) => {
      currentBlock.value = blockHeight
      name.value = chainName
    })
  })

  onUnmounted(() => {
    typeof unsubscribe === 'function' && unsubscribe()
  })

  return {
    name,
    currentBlock,
    isConnected,
  }
}
