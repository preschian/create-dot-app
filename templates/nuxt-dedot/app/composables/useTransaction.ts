import type { Prefix } from '~/utils/sdk'
import { ref } from 'vue'
import { createRemarkTransaction, polkadotSigner } from '~/utils/sdk-interface'

export function useTransaction() {
  const { selectedAccount } = useConnect()

  const isProcessing = ref(false)
  const result = ref('')
  const txHash = ref('')

  const signRemarkTransaction = async (chainPrefix: Prefix, message: string) => {
    if (!selectedAccount?.value) {
      result.value = 'Error: No account selected'
      return
    }

    isProcessing.value = true
    result.value = ''
    txHash.value = ''

    try {
      const signer = await polkadotSigner()

      if (!signer) {
        throw new Error('No signer found')
      }

      createRemarkTransaction(chainPrefix, message, selectedAccount.value.address, signer, {
        onTxHash: (hash) => {
          txHash.value = hash
        },
        onFinalized: () => {
          result.value = 'Transaction successful!'
          isProcessing.value = false
        },
        onError: (error) => {
          result.value = `Error: ${error}`
          isProcessing.value = false
        },
      })
    }
    catch (err) {
      result.value = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
      isProcessing.value = false
    }
  }

  return {
    isProcessing,
    result,
    txHash,
    signRemarkTransaction,
  }
}
