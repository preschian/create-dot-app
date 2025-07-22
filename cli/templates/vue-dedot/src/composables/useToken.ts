import { onMounted, ref } from 'vue'
import { getTokenDetail } from '~/utils/sdk-interface'

export interface TokenMetadata {
  name: string
  image: string
}

export interface UseTokenParams {
  metadata?: string
  collection: number
  token?: number
}

export function useToken(params: UseTokenParams) {
  const metadata = ref<TokenMetadata>()
  const price = ref<string>()
  const owner = ref<string>()
  const loading = ref(true)

  onMounted(async () => {
    if (!params.metadata || !params.token) {
      return
    }

    const { tokenMetadata, tokenPrice, tokenOwner } = await getTokenDetail(params.collection, params.token, params.metadata)

    metadata.value = tokenMetadata
    price.value = tokenPrice || ''
    owner.value = tokenOwner || ''

    loading.value = false
  })

  return {
    metadata,
    price,
    owner,
    loading,
  }
}
