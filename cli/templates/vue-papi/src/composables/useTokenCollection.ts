import { onMounted, reactive, ref } from 'vue'
import { formatIpfsUrl } from '../utils/formatters'
import sdk from '../utils/sdk'

export interface TokenCollectionItem {
  collection: number
  token: number
  metadata: string
}

export interface TokenCollectionInfo {
  name: string
  description: string
}

export function useTokenCollection(collectionId: number) {
  const { api } = sdk('asset_hub')

  const items = ref<TokenCollectionItem[]>([])
  const owners = ref<Set<string>>(new Set())
  const listed = ref<number>(0)
  const collection = reactive<TokenCollectionInfo>({
    name: 'Loading...',
    description: 'Loading...',
  })

  onMounted(async () => {
    const [queryMetadata, queryOwner, queryPrice, queryCollectionMetadata] = await Promise.all([
      api.query.Nfts.ItemMetadataOf.getEntries(collectionId),
      api.query.Nfts.Item.getEntries(collectionId),
      api.query.Nfts.ItemPriceOf.getEntries(collectionId),
      api.query.Nfts.CollectionMetadataOf.getValue(collectionId),
    ])

    items.value = queryMetadata
      .sort((a, b) => a.keyArgs[1] - b.keyArgs[1])
      .map(item => ({
        collection: item.keyArgs[0],
        token: item.keyArgs[1],
        metadata: item.value.data.asText(),
      }))

    owners.value = new Set(queryOwner.map(item => item.value.owner))
    listed.value = queryPrice.length

    const metadataUrl = queryCollectionMetadata?.data.asText()

    if (!metadataUrl) {
      return
    }

    const formattedUrl = formatIpfsUrl(metadataUrl)
    const metadata = await fetch(formattedUrl)
    const metadataJson = await metadata.json()
    collection.name = metadataJson.name
    collection.description = metadataJson.description
  })

  return {
    items,
    owners,
    listed,
    collection,
  }
}
