import type { FlipperContractApi } from '~/generated-types/contract/flipper'
import type { Prefix } from '~/utils/sdk'
import { Contract } from 'dedot/contracts'
import { ref } from 'vue'
import { getContractAddress, getContractMetadata } from '~/utils/contract-config'
import { getClient } from '~/utils/sdk-interface'

export function useContractQuery(chainKey: Prefix, address?: string) {
  const contractValue = ref<boolean | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function queryContractValue() {
    if (!address)
      return

    isLoading.value = true
    error.value = null

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
        contractValue.value = result.data
      }
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to query contract'
      console.error('Contract query error:', err)
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
