import { computed, onMounted, ref } from 'vue'
import { formatAddress, getInitials } from '~/utils/formatters'
import { getIdentity } from '~/utils/sdk-interface'

export interface UseProfileParams {
  name?: string
  address?: string
}

export function useProfile(params: UseProfileParams) {
  const resolvedName = ref<string>()

  onMounted(async () => {
    if (params.address && !params.name) {
      resolvedName.value = await getIdentity(params.address)
    }
  })

  const displayName = computed(() => {
    return params.name || resolvedName.value
  })

  const displayAddress = computed(() => {
    if (!params.address)
      return undefined
    return formatAddress(params.address)
  })

  return {
    displayName,
    displayAddress,
    getInitials,
  }
}
