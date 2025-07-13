import type { Prefix } from '../utils/sdk'
import { Binary } from 'polkadot-api'
import { ref } from 'vue'
import sdk from '../utils/sdk'
import { polkadotSigner, useConnect } from './useConnect'
import { useStatus } from './useStatus'

export function useTransaction() {
  const { selectedAccount } = useConnect()
  const { getSubscanUrl } = useStatus()

  const isProcessing = ref(false)
  const result = ref('')
  const txHash = ref('')

  const signRemarkTransaction = async (chainPrefix: Prefix, message: string) => {
    if (!selectedAccount.value) {
      result.value = 'Error: No account selected'
      return
    }

    isProcessing.value = true
    result.value = ''
    txHash.value = ''

    try {
      const { api } = sdk(chainPrefix)
      const signer = await polkadotSigner()

      if (!signer) {
        throw new Error('No signer found')
      }

      const remark = Binary.fromText(message)
      const tx = api.tx.System.remark({ remark })

      tx.signSubmitAndWatch(signer).subscribe({
        next: (event) => {
          if (event.type === 'txBestBlocksState') {
            txHash.value = event.txHash
          }

          if (event.type === 'finalized') {
            result.value = 'Transaction successful!'
            isProcessing.value = false
          }
        },
        error: (err) => {
          result.value = `Error: ${err.message || 'Unknown error'}`
          isProcessing.value = false
        },
      })
    }
    catch (err) {
      result.value = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
      isProcessing.value = false
    }
  }

  const getSubscanLink = (chainPrefix: Prefix, hash: string) => {
    return `${getSubscanUrl(chainPrefix)}/extrinsic/${hash}`
  }

  return {
    isProcessing,
    result,
    txHash,
    signRemarkTransaction,
    getSubscanLink,
  }
}
