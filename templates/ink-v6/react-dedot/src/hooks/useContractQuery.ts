import type { FlipperContractApi } from '~/generated/contract/flipper'
import type { Prefix } from '~/utils/sdk'
import { Contract } from 'dedot/contracts'
import { useCallback, useState } from 'react'
import { getContractAddress, getContractMetadata } from '~/utils/contract-config'
import { getClient } from '~/utils/sdk'

const STORAGE_KEY = 'contract_value'

export function useContractQuery(chainKey: Prefix, address?: string) {
  const storageKey = `${STORAGE_KEY}_${chainKey}`
  const [contractValue, setContractValue] = useState<boolean | null>(() => {
    const stored = localStorage.getItem(storageKey)
    return stored !== null ? JSON.parse(stored) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const queryContractValue = useCallback(async () => {
    if (!address)
      return

    setIsLoading(true)
    setError(null)

    try {
      const api = await getClient(chainKey)
      const contractAddress = getContractAddress(chainKey)
      const contractMetadata = getContractMetadata(chainKey)

      const contract = new Contract<FlipperContractApi>(
        api as any,
        contractMetadata,
        contractAddress,
        { defaultCaller: address },
      )

      const result = await contract.query.get()

      if (result.data !== undefined) {
        setContractValue(result.data)
        localStorage.setItem(storageKey, JSON.stringify(result.data))
      }
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to query contract'
      setError(errorMessage)
      console.error('Contract query error:', err)
    }
    finally {
      setIsLoading(false)
    }
  }, [chainKey, address, storageKey])

  return {
    contractValue,
    isLoading,
    error,
    queryContractValue,
  }
}
