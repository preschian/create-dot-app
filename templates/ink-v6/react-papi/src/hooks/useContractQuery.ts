import type { Prefix } from '~/utils/sdk'
import { useCallback, useState } from 'react'
import { contracts } from '~/descriptors'
import { getContractAddress } from '~/utils/contract-config'
import sdk from '~/utils/sdk'

const STORAGE_KEY = 'contract_value'

export function useContractQuery(chainKey: Prefix, userAddress?: string) {
  const storageKey = `${STORAGE_KEY}_${chainKey}`
  const [contractValue, setContractValue] = useState<boolean | null>(() => {
    const stored = localStorage.getItem(storageKey)
    return stored !== null ? JSON.parse(stored) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const queryContractValue = useCallback(async () => {
    if (!userAddress) {
      setError('No address provided')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { api: inkSdk } = sdk(chainKey)
      const contractAddr = getContractAddress(chainKey)

      const contract = inkSdk.getContract(contracts.flipper, contractAddr)

      const isCompatible = await contract.isCompatible()
      if (!isCompatible) {
        setError('Contract hash mismatch - contract may have been updated or address is incorrect')
        setIsLoading(false)
        return
      }

      const result = await contract.query('get', {
        origin: userAddress,
      })

      if (result.success) {
        const responseValue = result.value.response
        if (typeof responseValue === 'boolean') {
          setContractValue(responseValue)
          localStorage.setItem(storageKey, JSON.stringify(responseValue))
        }
        else {
          console.warn('Unexpected response type:', typeof responseValue, responseValue)
          const boolValue = Boolean(responseValue)
          setContractValue(boolValue)
          localStorage.setItem(storageKey, JSON.stringify(boolValue))
        }
      }
      else {
        const errorValue = result.value
        let errorMsg = 'Query failed - contract may not exist at this address'

        if (errorValue && typeof errorValue === 'object') {
          if ('message' in errorValue && typeof errorValue.message === 'string') {
            errorMsg = errorValue.message
          }
        }

        setError(errorMsg)
      }
    }
    catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to query contract'
      setError(errorMsg)

      console.error('Contract query error details:', {
        error: err,
        chainKey,
        userAddress,
      })
    }
    finally {
      setIsLoading(false)
    }
  }, [chainKey, userAddress, storageKey])

  return {
    contractValue,
    isLoading,
    error,
    queryContractValue,
  }
}
