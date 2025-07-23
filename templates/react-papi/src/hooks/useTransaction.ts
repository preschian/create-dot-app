import type { Prefix } from '../utils/sdk'
import { useState } from 'react'
import { createRemarkTransaction } from '../utils/sdk-interface'
import { polkadotSigner, useConnect } from './useConnect'
import { useStatus } from './useStatus'

export function useTransaction() {
  const { selectedAccount } = useConnect()
  const { getSubscanUrl } = useStatus()

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

      createRemarkTransaction(chainPrefix, message, signer, {
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
