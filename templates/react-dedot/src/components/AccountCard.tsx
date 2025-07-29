import type { Prefix } from '../utils/sdk'
import { useCurrentBlock } from '../hooks/useCurrentBlock'
import { buyTokenUrl, explorerAccount } from '../utils/formatters'
import Balance from './Balance'
import SignTransaction from './SignTransaction'

interface AccountCardProps {
  chainKey: Prefix
  address?: string
}

export default function AccountCard({ chainKey, address }: AccountCardProps) {
  const { name, currentBlock, isConnected } = useCurrentBlock(chainKey)

  return (
    <div className="group bg-white border border-gray-200 overflow-hidden hover:border-black transition-all duration-300 hover:shadow-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="font-light text-black tracking-wide">
            {name || '---'}
          </h3>
        </div>

        {isConnected && (
          <div className="text-xs px-2 py-1 bg-green-100 text-green-700 border border-green-200 uppercase tracking-wider flex items-center gap-1">
            <span className="icon-[mdi--check-circle] text-xs" />
            Live
          </div>
        )}
      </div>

      {/* Chain Info Section */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          Current Block
        </div>
        <div key={currentBlock} className="font-light text-black font-mono text-lg block-highlight">
          #
          {currentBlock ? currentBlock.toLocaleString() : '---'}
        </div>
      </div>

      {/* Account Section */}
      <div className="border-t border-gray-100 pt-4">
        {address
          ? (
              <Balance key={address} address={address} chainKey={chainKey} />
            )
          : (
              <div className="flex flex-col items-center py-3">
                <span className="icon-[mdi--wallet-plus] text-2xl text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">
                  Connect wallet for balance
                </p>
              </div>
            )}
      </div>

      {/* Actions Section */}
      {address && (
        <div className="mt-4">
          {/* Quick Actions Row */}
          <div className="pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <a href={buyTokenUrl(chainKey, address)} target="_blank" rel="noopener noreferrer" className="btn btn-xs btn-outline btn-neutral uppercase tracking-wider">
                Funds Token
              </a>
              <a href={explorerAccount(chainKey, address)} target="_blank" rel="noopener noreferrer" className="btn btn-xs btn-outline btn-neutral uppercase tracking-wider">
                <span className="icon-[mdi--open-in-new]" />
                Explorer
              </a>
            </div>

            {/* Transaction Component */}
            {isConnected
              ? (
                  <SignTransaction chainKey={chainKey} />
                )
              : (
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <span className="icon-[mdi--link-off]" />
                    Chain not connected
                  </div>
                )}
          </div>
        </div>
      )}
    </div>
  )
}
