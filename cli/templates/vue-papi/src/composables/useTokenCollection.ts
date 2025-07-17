import { onMounted, reactive, ref } from 'vue'
import { formatIpfsUrl } from '~/utils/formatters'
import { getCollectionDetail } from '~/utils/sdk-interface'

export function useTokenCollection(collectionId: number) {
  const items = ref<Awaited<ReturnType<typeof getCollectionDetail>>['collectionItems']>([])
  const owners = ref<Set<string>>(new Set())
  const listed = ref<number>(0)
  const collection = reactive({
    name: 'Loading...',
    description: 'Loading...',
  })

  onMounted(async () => {
    const { collectionItems, collectionOwners, collectionListed, metadataUrl } = await getCollectionDetail(collectionId)

    items.value = collectionItems
    owners.value = collectionOwners
    listed.value = collectionListed

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
