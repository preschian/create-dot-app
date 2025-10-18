import type { FlipperContractApi } from '~/generated/contract/flipper'
import type { Prefix } from '~/utils/sdk'
import { Contract } from 'dedot/contracts'
import { useState } from 'react'
import { getContractAddress, getContractMetadata } from '~/utils/contract-config'
import { getClient, polkadotSigner } from '~/utils/sdk'
import { useConnect } from './useConnect'

export function useContractTransaction(chainKey: Prefix, address?: string) {
  const { selectedAccount, connectedWallet } = useConnect()
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string>('')
  const [txHash, setTxHash] = useState<string>('')

  async function flipContractValue() {
    if (!selectedAccount || !address) {
      setResult('Error: Wallet not connected')
      return
    }

    try {
      setIsProcessing(true)
      setResult('')
      setTxHash('')

      const signer = await polkadotSigner(connectedWallet)
      if (!signer) {
        setResult('Error: Signer not available')
        setIsProcessing(false)
        return
      }

      const api = await getClient(chainKey)
      const contractAddress = getContractAddress(chainKey)
      const contractMetadata = getContractMetadata(chainKey)

      const contract = new Contract<FlipperContractApi>(
        api as any,
        contractMetadata,
        contractAddress,
        { defaultCaller: address },
      )

      await contract.tx
        .flip()
        .signAndSend(address, { signer }, ({ status }: any) => {
          if (status.type === 'BestChainBlockIncluded' || status.type === 'Finalized') {
            setTxHash(status.value.blockHash.toString())
            setResult(`Transaction ${status.type === 'Finalized' ? 'finalized' : 'submitted'}!`)
            setIsProcessing(false)
          }
        })
    }
    catch (err) {
      console.error('Transaction error:', err)
      setResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setIsProcessing(false)
    }
  }

  return {
    isProcessing,
    result,
    txHash,
    flipContractValue,
  }
}
