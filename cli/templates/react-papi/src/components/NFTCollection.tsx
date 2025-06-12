import { useEffect, useState } from 'react'
import sdk from '../utils/sdk'
import NFTCard from './NFTCard'

const { api } = sdk('asset_hub')
const COLLECTION = 486

interface NFTItem {
  collection: number
  token: number
  metadata: string
}

interface CollectionInfo {
  name: string
  description: string
}

export default function NFTCollection() {
  const [items, setItems] = useState<NFTItem[]>([])
  const [owners, setOwners] = useState<Set<string>>(() => new Set())
  const [listed, setListed] = useState<number>(0)
  const [collection, setCollection] = useState<CollectionInfo>({
    name: 'Loading...',
    description: 'Loading...',
  })

  useEffect(() => {
    async function loadCollection() {
      const [queryMetadata, queryOwner, queryPrice, queryCollectionMetadata] = await Promise.all([
        api.query.Nfts.ItemMetadataOf.getEntries(COLLECTION),
        api.query.Nfts.Item.getEntries(COLLECTION),
        api.query.Nfts.ItemPriceOf.getEntries(COLLECTION),
        api.query.Nfts.CollectionMetadataOf.getValue(COLLECTION),
      ])

      const nftItems = queryMetadata
        .sort((a: any, b: any) => a.keyArgs[1] - b.keyArgs[1])
        .map((item: any) => ({
          collection: item.keyArgs[0],
          token: item.keyArgs[1],
          metadata: item.value.data.asText(),
        }))
      setItems(nftItems)

      setOwners(new Set(queryOwner.map((item: any) => item.value.owner)))
      setListed(queryPrice.length)

      const metadataUrl = queryCollectionMetadata?.data.asText().replace('ipfs://', 'https://ipfs.io/ipfs/')

      if (!metadataUrl) {
        return
      }

      const metadata = await fetch(metadataUrl)
      const metadataJson = await metadata.json()
      setCollection({
        name: metadataJson.name,
        description: metadataJson.description,
      })
    }

    loadCollection()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Split Header */}
        <div className="flex items-end justify-between mb-12 pb-8 border-b border-gray-200">
          <div>
            <h1 className="text-5xl font-light text-black tracking-tight mb-2">
              {collection.name}
            </h1>
            <p className="text-gray-600 font-light line-clamp-1">
              {collection.description}
            </p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <div className="text-2xl font-light">
                {items.length}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                Items
              </div>
            </div>
            <div>
              <div className="text-2xl font-light">
                {listed}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                Listed
              </div>
            </div>
            <div>
              <div className="text-2xl font-light">
                {owners.size}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                Owners
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist NFT Grid */}
        {items.length
          ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {items.map(metadata => (
                  <NFTCard
                    key={`${metadata.collection}-${metadata.token}`}
                    metadata={metadata.metadata}
                    collection={metadata.collection}
                    token={metadata.token}
                  />
                ))}
              </div>
            )
          : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {Array.from({ length: 32 }, (_, i) => (
                  <NFTCard
                    key={i}
                    collection={COLLECTION}
                  />
                ))}
              </div>
            )}
      </div>
    </div>
  )
}
