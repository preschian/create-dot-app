import { FixedSizeBinary } from 'polkadot-api'
import { computed, onMounted, ref } from 'vue'
import sdk from '../utils/sdk'

export interface UseProfileParams {
  name?: string
  address?: string
}

export function useProfile(params: UseProfileParams) {
  const { api: peopleApi } = sdk('people')
  const resolvedName = ref<string>()

  onMounted(async () => {
    if (params.address && !params.name) {
      try {
        const queryIdentity = await peopleApi.query.Identity.IdentityOf.getValue(params.address)
        resolvedName.value = queryIdentity?.info.display.value instanceof FixedSizeBinary
          ? queryIdentity.info.display.value.asText()
          : undefined
      }
      catch {
        // No identity found, will use address
      }
    }
  })

  const displayName = computed(() => {
    return params.name || resolvedName.value
  })

  const displayAddress = computed(() => {
    if (!params.address)
      return undefined
    return `${params.address.slice(0, 4)}...${params.address.slice(-4)}`
  })

  function getInitials(name?: string): string {
    if (!name)
      return 'A'
    return name.charAt(0).toUpperCase()
  }

  return {
    displayName,
    displayAddress,
    getInitials,
  }
}
