import { useTokenCollection } from '../hooks/useTokenCollection'
import TokenCard from './TokenCard'

const COLLECTION_ID = 486

export default function TokenCollection() {
  const { items, owners, listed, collection } = useTokenCollection(COLLECTION_ID)

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

        {/* Minimalist Token Grid */}
        {items.length
          ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {items.map(metadata => (
                  <TokenCard
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
                  <TokenCard
                    key={i}
                    collection={COLLECTION_ID}
                  />
                ))}
              </div>
            )}
      </div>
    </div>
  )
}
