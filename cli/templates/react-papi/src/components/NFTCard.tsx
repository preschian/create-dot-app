import { FixedSizeBinary } from 'polkadot-api'
import { useEffect, useState } from 'react'
import sdk from '../utils/sdk'

interface NFTCardProps {
  metadata?: string
  collection: number
  token?: number
}

interface NFTMetadata {
  name: string
  image: string
}

const { api, client } = sdk('asset_hub')
const { api: peopleApi } = sdk('people')

export default function NFTCard({ metadata, collection, token }: NFTCardProps) {
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata>()
  const [price, setPrice] = useState<string>()
  const [owner, setOwner] = useState<string>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNFTData() {
      if (!metadata || !token) {
        return
      }

      const [getMetadata, queryOwner, queryPrice] = await Promise.all([
        fetch(metadata).then(res => res.json()),
        api.query.Nfts.Item.getValue(collection, token),
        api.query.Nfts.ItemPriceOf.getValue(collection, token),
      ])

      setNftMetadata(getMetadata)

      let priceValue = queryPrice?.[0]?.toString()
      if (priceValue) {
        const chainSpec = await client.getChainSpecData()
        const tokenDecimals = chainSpec.properties.tokenDecimals
        priceValue = (Number(priceValue) / 10 ** tokenDecimals).toFixed()
        setPrice(priceValue)
      }

      if (queryOwner?.owner) {
        const queryIdentity = await peopleApi.query.Identity.IdentityOf.getValue(queryOwner.owner)
        const ownerDisplay = queryIdentity?.info.display.value instanceof FixedSizeBinary
          ? queryIdentity.info.display.value.asText()
          : `${queryOwner?.owner.slice(0, 4)}...${queryOwner?.owner.slice(-4)}`
        setOwner(ownerDisplay)
      }

      setLoading(false)
    }

    loadNFTData()
  }, [metadata, collection, token])

  return (
    <div className="group">
      {/* Clean Card */}
      <div className="bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg">
        {/* NFT Image */}
        <div className="relative overflow-hidden">
          {/* Loading Skeleton */}
          {loading
            ? (
                <div className="w-full h-64 bg-gray-100">
                  <div className="w-full h-full animate-pulse bg-gray-200" />
                </div>
              )
            : nftMetadata?.image
              ? (
                  /* NFT Image */
                  <img
                    src={`https://wsrv.nl/?url=${nftMetadata.image}&w=256&h=256`}
                    alt={nftMetadata.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )
              : null}

          {/* Dark Overlay */}
          {!loading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
          )}

          {/* Title & Price Overlay (shown on hover) */}
          {!loading && (
            <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="space-y-2">
                <h3 className="text-white text-lg font-light tracking-wide leading-tight">
                  {nftMetadata?.name}
                </h3>
                {price && (
                  <div>
                    <div className="text-xs text-white/80 uppercase tracking-wider">
                      Price
                    </div>
                    <div className="text-base font-medium text-white">
                      {price}
                      {' '}
                      DOT
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Loading Skeleton for Card Content */}
          {loading
            ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full" />
                    <div className="space-y-1">
                      <div className="h-3 w-12 bg-gray-200 animate-pulse" />
                      <div className="h-3 w-20 bg-gray-200 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-7 w-14 bg-gray-200 animate-pulse" />
                </div>
              )
            : (
                /* Owner & Action */
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium uppercase">
                        {owner?.charAt(owner.length - 1)}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">
                        Owner
                      </div>
                      <div className="text-xs text-black font-medium">
                        {owner}
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://koda.art/ahp/gallery/${collection}-${token}`}
                    target="_blank"
                    className="bg-black hover:bg-gray-800 text-white px-4 py-1.5 text-xs font-medium transition-colors duration-200 uppercase tracking-wider hover:cursor-pointer"
                  >
                    View
                  </a>
                </div>
              )}
        </div>
      </div>
    </div>
  )
}
