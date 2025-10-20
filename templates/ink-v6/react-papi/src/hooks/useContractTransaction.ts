import type { Prefix } from '~/utils/sdk'
import { useCallback, useState } from 'react'
import { contracts } from '~/descriptors'
import { getContractAddress } from '~/utils/contract-config'
import sdk, { polkadotSigner } from '~/utils/sdk'
import { useConnect } from './useConnect'

export function useContractTransaction(chainKey: Prefix, address?: string) {
  const { selectedAccount, connectedWallet } = useConnect()
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string>('')
  const [txHash, setTxHash] = useState<string>('')

  const flipContractValue = useCallback(async () => {
    if (!selectedAccount || !address) {
      setResult('Error: Wallet not connected')
      return
    }

    try {
      setIsProcessing(true)
      setResult('')
      setTxHash('')

      const signer = await polkadotSigner(
        connectedWallet?.extensionName || '',
        selectedAccount.address,
      )

      if (!signer) {
        setResult('Error: Signer not available')
        setIsProcessing(false)
        return
      }

      const { api: inkSdk } = sdk(chainKey)
      const contractAddr = getContractAddress(chainKey)

      const contract = inkSdk.getContract(contracts.flipper, contractAddr)

      const isCompatible = await contract.isCompatible()
      if (!isCompatible) {
        setResult('Error: Contract hash mismatch')
        setIsProcessing(false)
        return
      }

      const tx = contract.send('flip', {
        origin: selectedAccount.address,
      })

      const unsub = tx.signSubmitAndWatch(signer).subscribe({
        next: (event) => {
          if (event.type === 'txBestBlocksState' && event.found) {
            setTxHash(event.block.hash)
          }

          if (event.type === 'finalized') {
            setResult('Transaction finalized!')
            unsub.unsubscribe()
            setIsProcessing(false)
          }
        },
        error: (err) => {
          unsub.unsubscribe()
          const errorMsg = err instanceof Error ? err.message : 'Unknown error'
          setResult(`Error: ${errorMsg}`)
          setIsProcessing(false)

          console.error('Transaction error details:', {
            error: err,
            chainKey,
            userAddress: address,
          })
        },
      })
    }
    catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setResult(`Error: ${errorMsg}`)

      console.error('Transaction error details:', {
        error: err,
        chainKey,
        userAddress: address,
      })

      setIsProcessing(false)
    }
  }, [selectedAccount, address, connectedWallet, chainKey])

  return {
    isProcessing,
    result,
    txHash,
    flipContractValue,
  }
}
