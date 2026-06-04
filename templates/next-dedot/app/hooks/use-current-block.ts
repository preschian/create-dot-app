'use client'

import type { Prefix } from '../utils/sdk'
import { useEffect, useState } from 'react'
import { subscribeToBlocks } from '../utils/sdk-interface'

export function useCurrentBlock(chain: Prefix) {
  const [name, setName] = useState('')
  const [token, setToken] = useState('')
  const [currentBlock, setCurrentBlock] = useState(0)
  const [blockHash, setBlockHash] = useState('')
  const [finalized, setFinalized] = useState(0)

  useEffect(() => {
    let ignore = false
    let unsubscribe: Awaited<ReturnType<typeof subscribeToBlocks>> | undefined

    const initializeSubscription = async () => {
      unsubscribe = await subscribeToBlocks(chain, (data) => {
        if (ignore)
          return

        setCurrentBlock(data.blockHeight)
        setBlockHash(data.blockHash)
        setFinalized(data.finalized)
        setName(data.chainName)
        setToken(data.tokenSymbol)
      })
    }

    initializeSubscription()

    return () => {
      ignore = true
      unsubscribe?.unsubscribe()
    }
  }, [chain])

  const isConnected = currentBlock > 0

  return {
    name,
    token,
    currentBlock,
    blockHash,
    finalized,
    isConnected,
  }
}
