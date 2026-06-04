'use client'

import type { Prefix } from '../utils/sdk'
import { useCallback, useState } from 'react'
import { createRemarkTransaction, polkadotSigner } from '../utils/sdk-interface'
import { useConnect } from './use-connect'

export type TxStage = 'idle' | 'broadcasting' | 'inBlock' | 'finalized'

export function useTransaction() {
  const { selectedAccount } = useConnect()

  const [stage, setStage] = useState<TxStage>('idle')
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setStage('idle')
    setTxHash('')
    setError(null)
  }, [])

  const signRemark = useCallback(async (chainPrefix: Prefix, message: string) => {
    if (!selectedAccount) {
      setError('No account selected')
      return
    }

    setError(null)
    setTxHash('')
    setStage('broadcasting')

    try {
      const signer = await polkadotSigner()

      if (!signer) {
        throw new Error('No signer found')
      }

      createRemarkTransaction(chainPrefix, message, selectedAccount.address, signer, {
        onTxHash: (hash) => {
          setTxHash(hash)
          setStage('inBlock')
        },
        onFinalized: () => {
          setStage('finalized')
        },
        onError: (err) => {
          setError(`Error: ${err}`)
          setStage('idle')
        },
      })
    }
    catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setStage('idle')
    }
  }, [selectedAccount])

  const pending = stage === 'broadcasting' || stage === 'inBlock'

  return {
    stage,
    txHash,
    error,
    pending,
    reset,
    signRemark,
  }
}
