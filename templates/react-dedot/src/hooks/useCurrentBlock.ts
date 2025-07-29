import type { Prefix } from '../utils/sdk'
import { useEffect, useState } from 'react'
import { subscribeToBlocks } from '../utils/sdk-interface'

export function useCurrentBlock(chain: Prefix) {
  const [name, setName] = useState('')
  const [currentBlock, setCurrentBlock] = useState(0)

  useEffect(() => {
    let ignore = false

    const initializeSubscription = async () => {
      const unsubscribe = subscribeToBlocks(chain, ({ blockHeight, chainName }) => {
        if (!ignore) {
          setCurrentBlock(blockHeight)
          setName(chainName)
        }
      })

      return unsubscribe
    }

    initializeSubscription()

    return () => {
      ignore = true
    }
  }, [chain])

  const isConnected = currentBlock > 0

  return {
    name,
    currentBlock,
    isConnected,
  }
}
