import type { Prefix } from '../utils/sdk'
import { useState } from 'react'
import { createRemarkTransaction, polkadotSigner } from '../utils/sdk-interface'
import { useConnect } from './useConnect'

export function useTransaction() {
  const { selectedAccount } = useConnect()

  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState('')
  const [txHash, setTxHash] = useState('')

  const signRemarkTransaction = async (chainPrefix: Prefix, message: string) => {
    if (!selectedAccount) {
      setResult('Error: No account selected')
      return
    }

    setIsProcessing(true)
    setResult('')
    setTxHash('')

    try {
      const signer = await polkadotSigner()

      if (!signer) {
        throw new Error('No signer found')
      }

      createRemarkTransaction(chainPrefix, message, selectedAccount.address, signer, {
        onTxHash: (hash) => {
          setTxHash(hash)
        },
        onFinalized: () => {
          setResult('Transaction successful!')
          setIsProcessing(false)
        },
        onError: (error) => {
          setResult(`Error: ${error}`)
          setIsProcessing(false)
        },
      })
    }
    catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setIsProcessing(false)
    }
  }

  return {
    isProcessing,
    result,
    txHash,
    signRemarkTransaction,
  }
}
