import type { Prefix } from '~/utils/sdk'
import { useState } from 'react'
import { useMapAccount } from '~/hooks/useMapAccount'

interface MapAccountProps {
  chainKey: Prefix
  address: string
}

export default function MapAccount({ chainKey, address }: MapAccountProps) {
  const { isMapped, mapAccount } = useMapAccount(chainKey, address)
  const [isMapping, setIsMapping] = useState(false)
  const [error, setError] = useState<string>()

  async function handleMapAccount() {
    try {
      setIsMapping(true)
      setError(undefined)
      await mapAccount()
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to map account')
      console.error('Error mapping account:', err)
    }
    finally {
      setIsMapping(false)
    }
  }

  return (
    <div className="mb-6">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
        Account Mapping
      </div>

      {isMapped
        ? (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2">
              <span className="icon-[mdi--check-circle] text-base" />
              <span>Account mapped to EVM</span>
            </div>
          )
        : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-2">
                <span className="icon-[mdi--alert-circle-outline] text-base" />
                <span>Account not mapped yet</span>
              </div>

              <button
                type="button"
                disabled={isMapping}
                className="btn btn-sm btn-neutral w-full uppercase tracking-wider"
                onClick={handleMapAccount}
              >
                {isMapping
                  ? (
                      <>
                        <span className="icon-[mdi--loading] animate-spin" />
                        Mapping...
                      </>
                    )
                  : (
                      <>
                        <span className="icon-[mdi--map-marker-plus]" />
                        Map Account to EVM
                      </>
                    )}
              </button>

              {error
                ? (
                    <div role="alert" className="alert alert-error alert-sm">
                      <span className="icon-[mdi--alert-circle]" />
                      <span className="text-xs">{error}</span>
                    </div>
                  )
                : null}
            </div>
          )}
    </div>
  )
}
