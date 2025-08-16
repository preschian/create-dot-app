export function useCurrentBlock(chain: Prefix) {
  // make sure to run this composable only on client side
  if (import.meta.server) {
    return {}
  }

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
