'use client'

import type { Prefix } from '../utils/sdk'
import { useEffect, useState } from 'react'
import { subscribeToBlocks } from '../utils/sdk-interface'

export function useCurrentBlock(chain: Prefix) {
  const [name, setName] = useState('')
  const [currentBlock, setCurrentBlock] = useState(0)

  useEffect(() => {
    let ignore = false
    let unsubscribe: Awaited<ReturnType<typeof subscribeToBlocks>> | undefined

    const initializeSubscription = async () => {
      unsubscribe = await subscribeToBlocks(chain, ({ blockHeight, chainName }) => {
        if (!ignore) {
          setCurrentBlock(blockHeight)
          setName(chainName)
        }
      })
    }

    initializeSubscription()

    return () => {
      ignore = true
      unsubscribe?.()
    }
  }, [chain])

  const isConnected = currentBlock > 0

  return {
    name,
    currentBlock,
    isConnected,
  }
}
