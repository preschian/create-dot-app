import { useEffect, useState } from 'react'
import { formatIpfsUrl } from '../utils/formatters'
import { getCollectionDetail } from '../utils/sdk-interface'

export function useTokenCollection(collectionId: number) {
  const [items, setItems] = useState<Awaited<ReturnType<typeof getCollectionDetail>>['collectionItems']>(() => [])
  const [owners, setOwners] = useState<Set<string>>(() => new Set())
  const [listed, setListed] = useState<number>(0)
  const [collection, setCollection] = useState(() => ({
    name: 'Loading...',
    description: 'Loading...',
  }))

  useEffect(() => {
    let ignore = false

    async function fetchCollectionDetail() {
      const { collectionItems, collectionOwners, collectionListed, metadataUrl } = await getCollectionDetail(collectionId)

      if (!ignore) {
        setItems(collectionItems)
        setOwners(collectionOwners)
        setListed(collectionListed)
      }

      if (metadataUrl && !ignore) {
        const formattedUrl = formatIpfsUrl(metadataUrl)
        const metadata = await fetch(formattedUrl)
        const metadataJson = await metadata.json()

        if (!ignore) {
          setCollection({
            name: metadataJson.name,
            description: metadataJson.description,
          })
        }
      }
    }

    fetchCollectionDetail()

    return () => {
      ignore = true
    }
  }, [collectionId])

  return {
    items,
    owners,
    listed,
    collection,
  }
}
