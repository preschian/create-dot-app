import type { Prefix } from '~/utils/sdk'
import { ref } from 'vue'
import { contracts } from '~/descriptors'
import { getContractAddress } from '~/utils/contract-config'
import sdk, { polkadotSigner } from '~/utils/sdk'
import { useConnect } from './useConnect'

export function useContractTransaction(chainKey: Prefix, address?: string) {
  const { selectedAccount, connectedWallet } = useConnect()
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

      const signer = await polkadotSigner(
        connectedWallet.value?.extensionName || '',
        selectedAccount.value.address,
      )

      if (!signer) {
        result.value = 'Error: Signer not available'
        isProcessing.value = false
        return
      }

      const { api: inkSdk } = sdk(chainKey)
      const contractAddr = getContractAddress(chainKey)

      const contract = inkSdk.getContract(contracts.flipper, contractAddr)

      // Check if contract is compatible before sending
      const isCompatible = await contract.isCompatible()
      if (!isCompatible) {
        result.value = 'Error: Contract hash mismatch'
        isProcessing.value = false
        return
      }

      const tx = contract.send('flip', {
        origin: selectedAccount.value.address,
      })

      const unsub = tx.signSubmitAndWatch(signer).subscribe({
        next: (event) => {
          if (event.type === 'txBestBlocksState' && event.found) {
            txHash.value = event.txHash
          }

          if (event.type === 'finalized') {
            result.value = 'Transaction finalized!'
            unsub.unsubscribe()
            isProcessing.value = false
          }
        },
        error: (err) => {
          unsub.unsubscribe()
          const errorMsg = err instanceof Error ? err.message : 'Unknown error'
          result.value = `Error: ${errorMsg}`
          isProcessing.value = false

          console.error('Transaction error details:', {
            error: err,
            chainKey,
            userAddress: address,
          })
        },
      })
    }
    catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      result.value = `Error: ${errorMsg}`

      console.error('Transaction error details:', {
        error: err,
        chainKey,
        userAddress: address,
      })

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
