import type { FlipperContractApi } from '~/generated-types/contract/flipper'
import type { Prefix } from '~/utils/sdk'
import { Contract } from 'dedot/contracts'
import { ref } from 'vue'
import { getContractAddress, getContractMetadata } from '~/utils/contract-config'
import sdk from '~/utils/sdk'
import { polkadotSigner } from '~/utils/sdk-interface'
import { useConnect } from './useConnect'

export function useContractTransaction(chainKey: Prefix, address?: string) {
  const { selectedAccount } = useConnect()
  const isProcessing = ref(false)
  const result = ref<string>('')
  const txHash = ref<string>('')

  async function flipContractValue() {
    if (!selectedAccount.value || !address) {
      result.value = 'Error: Wallet not connected'
      return
    }

    try {
      isProcessing.value = true
      result.value = ''
      txHash.value = ''

      const signer = await polkadotSigner()
      if (!signer) {
        result.value = 'Error: Signer not available'
        isProcessing.value = false
        return
      }

      const { api: apiInstance } = sdk(chainKey)
      const api = await apiInstance

      const contractAddress = getContractAddress(chainKey)
      const contractMetadata = getContractMetadata(chainKey)

      const contract = new Contract<FlipperContractApi>(
        api as any,
        contractMetadata,
        contractAddress,
        { defaultCaller: address },
      )

      await contract.tx
        .flip()
        .signAndSend(address, { signer }, ({ status }) => {
          if (status.type === 'BestChainBlockIncluded' || status.type === 'Finalized') {
            txHash.value = status.value.blockHash.toString()
            result.value = `Transaction ${status.type === 'Finalized' ? 'finalized' : 'included'}!`
            isProcessing.value = false
          }
        })
    }
    catch (err) {
      console.error('Transaction error:', err)
      result.value = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
      isProcessing.value = false
    }
  }

  return {
    isProcessing,
    result,
    txHash,
    flipContractValue,
  }
}
