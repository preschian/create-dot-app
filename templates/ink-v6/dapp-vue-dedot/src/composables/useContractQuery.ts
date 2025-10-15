import type { FlipperContractApi } from '~/generated-types/contract/flipper'
import type { Prefix } from '~/utils/sdk'
import { Contract } from 'dedot/contracts'
import { onUnmounted, ref } from 'vue'
import sdk from '~/utils/sdk'
import contractMetadata from '../../../contract/target/ink/contract.json'

const CONTRACT_ADDRESS = '0xf4c151d281edc887666d53307174207856be8371'

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
      const { api: apiInstance } = sdk(chainKey)
      const api = await apiInstance

      const contract = new Contract(api as any, contractMetadata, CONTRACT_ADDRESS, {
        defaultCaller: address,
      }) as Contract<FlipperContractApi>

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

  onUnmounted(() => {})

  return {
    contractValue,
    isLoading,
    error,
    queryContractValue,
  }
}
