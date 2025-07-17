import { onMounted, ref } from 'vue'
import sdk from '../utils/sdk'

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
  const ownerAddress = ref<string>()
  const loading = ref(true)

  const { api, client } = sdk('asset_hub')

  onMounted(async () => {
    if (!params.metadata || !params.token) {
      return
    }

    const [getMetadata, queryOwner, queryPrice] = await Promise.all([
      fetch(params.metadata).then(res => res.json()),
      api.query.Nfts.Item.getValue(params.collection, params.token),
      api.query.Nfts.ItemPriceOf.getValue(params.collection, params.token),
    ])

    metadata.value = getMetadata
    price.value = queryPrice?.[0].toString()

    if (price.value) {
      const chainSpec = await client.getChainSpecData()
      const tokenDecimals = chainSpec.properties.tokenDecimals
      price.value = (Number(price.value) / 10 ** tokenDecimals).toFixed()
    }

    if (queryOwner?.owner) {
      ownerAddress.value = queryOwner.owner
    }

    loading.value = false
  })

  return {
    metadata,
    price,
    ownerAddress,
    loading,
  }
}
