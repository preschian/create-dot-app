import { FixedSizeBinary } from 'polkadot-api'
import { computed, onMounted, ref } from 'vue'
import { formatAddress, getInitials } from '~/utils/formatters'
import sdk from '~/utils/sdk'

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
    return formatAddress(params.address)
  })

  return {
    displayName,
    displayAddress,
    getInitials,
  }
}
