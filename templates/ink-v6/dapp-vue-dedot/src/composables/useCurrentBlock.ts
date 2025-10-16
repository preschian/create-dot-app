import type { Prefix } from '~/utils/sdk'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getClient } from '~/utils/sdk-interface'

export function useCurrentBlock(chain: Prefix) {
  const name = ref('')
  const currentBlock = ref(0)
  const isConnected = computed(() => currentBlock.value > 0)

  let unsubscribe: (() => void) | undefined

  onMounted(async () => {
    const api = await getClient(chain)
    const chainName = await api.chainSpec.chainName()

    unsubscribe = await api.query.system.number(async (blockHeight) => {
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
