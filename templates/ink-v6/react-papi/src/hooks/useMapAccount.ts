import type { Prefix } from '~/utils/sdk'
import { useEffect, useState } from 'react'
import sdk, { CHAIN_CONFIG, polkadotSigner } from '~/utils/sdk'
import { useConnect } from './useConnect'

export function useMapAccount(chainKey: Prefix, address: string) {
  const { connectedWallet } = useConnect()
  const [isMapped, setIsMapped] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false

    async function checkMapping() {
      try {
        const { api: inkSdk } = sdk(chainKey)
        const mapped = await inkSdk.addressIsMapped(address)

        if (!ignore) {
          setIsMapped(mapped)
        }
      }
      catch (err) {
        console.error('Error checking account mapping:', err)
      }
    }

    checkMapping()

    return () => {
      ignore = true
    }
  }, [chainKey, address])

  async function mapAccount() {
    if (!connectedWallet) {
      throw new Error('Wallet not connected')
    }

    const signer = await polkadotSigner(connectedWallet.extensionName, address)
    if (!signer) {
      throw new Error('Signer not available')
    }

    const { client } = sdk(chainKey)
    const typedApi = client.getTypedApi(CHAIN_CONFIG[chainKey].descriptor)

    await typedApi.tx.Revive
      .map_account()
      .signAndSubmit(signer)
      .then(() => {
        setIsMapped(true)
      })
  }

  return {
    isMapped,
    mapAccount,
  }
}
