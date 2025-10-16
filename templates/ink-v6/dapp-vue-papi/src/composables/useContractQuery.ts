import type { Prefix } from '~/utils/sdk'
import { ref, watch } from 'vue'
import { contracts } from '~/descriptors'
import { getContractAddress } from '~/utils/contract-config'
import sdk from '~/utils/sdk'

const STORAGE_KEY = 'contract_value'

export function useContractQuery(chainKey: Prefix, userAddress?: string) {
  const storedValue = localStorage.getItem(`${STORAGE_KEY}_${chainKey}`)
  const contractValue = ref<boolean | null>(storedValue !== null ? JSON.parse(storedValue) : null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  watch(contractValue, (newValue) => {
    if (newValue !== null) {
      localStorage.setItem(`${STORAGE_KEY}_${chainKey}`, JSON.stringify(newValue))
    }
  })

  async function queryContractValue() {
    if (!userAddress) {
      error.value = 'No address provided'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const { api: inkSdk } = sdk(chainKey)
      const contractAddr = getContractAddress(chainKey)

      const contract = inkSdk.getContract(contracts.flipper, contractAddr)

      // Check if contract exists and is compatible
      const isCompatible = await contract.isCompatible()
      if (!isCompatible) {
        error.value = 'Contract hash mismatch - contract may have been updated or address is incorrect'
        isLoading.value = false
        return
      }

      const result = await contract.query('get', {
        origin: userAddress,
      })

      if (result.success) {
        // Extract the actual value from response
        const responseValue = result.value.response
        if (typeof responseValue === 'boolean') {
          contractValue.value = responseValue
        }
        else {
          console.warn('Unexpected response type:', typeof responseValue, responseValue)
          contractValue.value = Boolean(responseValue)
        }
      }
      else {
        // Handle error response
        const errorValue = result.value
        let errorMsg = 'Query failed - contract may not exist at this address'

        if (errorValue && typeof errorValue === 'object') {
          if ('message' in errorValue && typeof errorValue.message === 'string') {
            errorMsg = errorValue.message
          }
        }

        error.value = errorMsg
      }
    }
    catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to query contract'
      error.value = errorMsg

      // Log full error for debugging
      console.error('Contract query error details:', {
        error: err,
        chainKey,
        userAddress,
      })
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    contractValue,
    isLoading,
    error,
    queryContractValue,
  }
}
