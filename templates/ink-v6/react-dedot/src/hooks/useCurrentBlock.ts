import type { Prefix } from '../utils/sdk'
import { useEffect, useState } from 'react'
import { getClient } from '../utils/sdk'

export function useCurrentBlock(chain: Prefix) {
  const [name, setName] = useState('')
  const [currentBlock, setCurrentBlock] = useState(0)

  useEffect(() => {
    let ignore = false
    let unsubscribe: (() => void) | undefined

    async function initializeSubscription() {
      const api = await getClient(chain)
      const chainName = await api.chainSpec.chainName()

      unsubscribe = await api.query.system.number(async (blockHeight) => {
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
