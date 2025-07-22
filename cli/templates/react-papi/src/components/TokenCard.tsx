import { useToken } from '../hooks/useToken'
import Avatar from './Avatar'

interface TokenCardProps {
  metadata?: string
  collection: number
  token?: number
}

export default function TokenCard({ metadata, collection, token }: TokenCardProps) {
  const { metadata: tokenMetadata, price, owner, loading } = useToken({ metadata, collection, token })

  return (
    <div className="group">
      {/* Clean Card */}
      <div className="bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg">
        {/* NFT Image */}
        <div className="relative overflow-hidden">
          {/* Loading Skeleton */}
          {loading && (
            <div className="w-full h-64 bg-gray-100">
              <div className="w-full h-full animate-pulse bg-gray-200" />
            </div>
          )}

          {/* NFT Image */}
          {!loading && tokenMetadata?.image && (
            <img
              src={`https://wsrv.nl/?url=${tokenMetadata.image}&w=256&h=256`}
              alt={tokenMetadata.name}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          {/* Dark Overlay */}
          {!loading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
          )}

          {/* Title & Price Overlay (shown on hover) */}
          {!loading && (
            <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="space-y-2">
                <h3 className="text-white text-lg font-light tracking-wide leading-tight">
                  {tokenMetadata?.name}
                </h3>
                {price
                  ? (
                      <div>
                        <div className="text-xs text-white/80 uppercase tracking-wider">
                          Price
                        </div>
                        <div className="text-base font-medium text-white">
                                                {price} DOT
                        </div>
                      </div>
                    )
                  : null}
              </div>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Loading Skeleton for Card Content */}
          {loading && (
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
          )}

          {/* Owner & Action */}
          {!loading && (
            <div className="flex items-center justify-between">
              <Avatar address={owner} />
              <a
                href={`https://koda.art/ahp/gallery/${collection}-${token}`}
                target="_blank"
                className="btn btn-neutral btn-sm uppercase tracking-wider"
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
