import type { Prefix } from '~/utils/sdk'
import { useEffect, useState } from 'react'
import sdk from '~/utils/sdk'

export function useCurrentBlock(chain: Prefix) {
  const [name, setName] = useState('')
  const [currentBlock, setCurrentBlock] = useState(0)

  useEffect(() => {
    let ignore = false
    let unsubscribe: (() => void) | undefined

    async function initializeSubscription() {
      const { client } = sdk(chain)
      const chainName = await client.getChainSpecData().then(data => data.name)

      unsubscribe = client.blocks$.subscribe((block) => {
        if (!ignore) {
          setCurrentBlock(block.number)
          setName(chainName)
        }
      }).unsubscribe
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
