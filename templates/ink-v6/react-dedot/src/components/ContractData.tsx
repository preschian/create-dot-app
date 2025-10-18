import type { Prefix } from '~/utils/sdk'
import { useEffect } from 'react'
import { useContractQuery } from '~/hooks/useContractQuery'

interface ContractDataProps {
  chainKey: Prefix
  address?: string
}

export default function ContractData({ chainKey, address }: ContractDataProps) {
  const { contractValue, isLoading, error, queryContractValue } = useContractQuery(chainKey, address)

  useEffect(() => {
    if (address) {
      queryContractValue()
    }
  }, [address, queryContractValue])

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-gray-500 uppercase tracking-wider">
          Contract Value
        </div>
        {address
          ? (
              <button
                type="button"
                className="btn btn-xs btn-ghost"
                disabled={isLoading}
                onClick={queryContractValue}
              >
                {isLoading
                  ? (
                      <span className="icon-[mdi--loading] animate-spin" />
                    )
                  : (
                      <span className="icon-[mdi--refresh]" />
                    )}
              </button>
            )
          : null}
      </div>

      {isLoading && contractValue === null
        ? (
            <div className="flex items-center gap-3 h-12">
              <span className="icon-[mdi--loading] animate-spin text-3xl text-gray-400" />
              <span className="font-mono font-light text-gray-400 text-xl">Loading...</span>
            </div>
          )
        : error
          ? (
              <div className="text-sm text-red-600 py-2">
                {error}
              </div>
            )
          : contractValue !== null
            ? (
                <div>
                  <div className="flex items-center gap-3 h-12">
                    {contractValue
                      ? (
                          <span className="icon-[mdi--toggle-switch] text-green-600 text-3xl" />
                        )
                      : (
                          <span className="icon-[mdi--toggle-switch-off] text-gray-400 text-3xl" />
                        )}
                    <span className="font-mono font-light text-black text-xl">{contractValue ? 'TRUE' : 'FALSE'}</span>
                  </div>
                </div>
              )
            : (
                <div className="text-sm text-gray-400 py-2">
                  No data
                </div>
              )}
    </div>
  )
}
