import type { Prefix } from '../utils/sdk'
import { useCurrentBlock } from '../hooks/useCurrentBlock'
import { buyTokenUrl } from '../utils/formatters'
import Balance from './Balance'
import ContractData from './ContractData'
import MapAccount from './MapAccount'
import SignTransaction from './SignTransaction'

interface AccountCardProps {
  chainKey: Prefix
  address?: string
}

export default function AccountCard({ chainKey, address }: AccountCardProps) {
  const { name, currentBlock, isConnected } = useCurrentBlock(chainKey)

  return (
    <div className="group bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h3 className="text-xl font-light text-black tracking-wide">
          {name || '---'}
        </h3>

        {isConnected
          ? (
              <div className="text-xs px-3 py-1.5 bg-green-100 text-green-700 border border-green-200 uppercase tracking-wider flex items-center gap-1.5">
                <span className="icon-[mdi--check-circle] text-sm" />
                Live
              </div>
            )
          : null}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Left Column: Chain Info & Balance */}
        <div className="p-6 space-y-6">
          {/* Chain Info Section */}
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Current Block
            </div>
            <div key={currentBlock} className="font-light text-black font-mono text-2xl block-highlight">
              #
              {currentBlock ? currentBlock.toLocaleString() : '---'}
            </div>
          </div>

          {/* Balance Section */}
          <div className="border-t border-gray-100 pt-6">
            {address
              ? (
                  <div>
                    <Balance key={`${address}_${currentBlock}`} address={address} chainKey={chainKey} />
                  </div>
                )
              : (
                  <div className="flex flex-col items-center py-6">
                    <span className="icon-[mdi--wallet-plus] text-3xl text-gray-300 mb-3" />
                    <p className="text-sm text-gray-400">
                      Connect wallet for balance
                    </p>
                  </div>
                )}
          </div>
        </div>

        {/* Right Column: Contract Info & Actions */}
        <div className="p-6">
          {address
            ? (
                <div className="space-y-6">
                  {/* Map Account */}
                  <MapAccount key={address} chainKey={chainKey} address={address} />

                  {/* Contract Data */}
                  <div key={currentBlock}>
                    <ContractData key={address} address={address} chainKey={chainKey} />
                  </div>

                  {/* Actions Section */}
                  <div className="border-t border-gray-100 pt-6 space-y-3">
                    {/* Transaction Component with Get Tokens */}
                    {isConnected
                      ? (
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <SignTransaction chainKey={chainKey} address={address} />
                            </div>
                            <div className="tooltip" data-tip="Get Tokens">
                              <a href={buyTokenUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline btn-neutral btn-square">
                                <span className="icon-[mdi--wallet-plus] text-lg" />
                              </a>
                            </div>
                          </div>
                        )
                      : (
                          <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-400">
                            <span className="icon-[mdi--link-off]" />
                            Chain not connected
                          </div>
                        )}
                  </div>
                </div>
              )
            : (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <span className="icon-[mdi--file-document-outline] text-4xl text-gray-300 mb-3" />
                  <p className="text-sm text-gray-400">
                    Connect wallet to interact
                  </p>
                </div>
              )}
        </div>
      </div>
    </div>
  )
}
