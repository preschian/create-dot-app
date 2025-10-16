import type { Prefix } from '~/utils/sdk'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { sdk } from '~/utils/sdk'

export function useCurrentBlock(chain: Prefix) {
  const name = ref('')
  const currentBlock = ref(0)
  const isConnected = computed(() => currentBlock.value > 0)

  let unsubscribe: (() => void) | undefined

  onMounted(async () => {
    const { client } = sdk(chain)
    const chainName = await client.getChainSpecData().then(data => data.name)

    unsubscribe = client.blocks$.subscribe((block) => {
      currentBlock.value = block.number
      name.value = chainName
    }).unsubscribe
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
