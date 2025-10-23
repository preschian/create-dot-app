import type { Prefix } from '~/utils/sdk'
import { toEvmAddress } from 'dedot/contracts'
import { useEffect, useState } from 'react'
import { getClient, polkadotSigner } from '~/utils/sdk'
import { useConnect } from './useConnect'

export function useMapAccount(chainKey: Prefix, address: string) {
  const { connectedWallet } = useConnect()
  const [isMapped, setIsMapped] = useState<boolean>(false)

  useEffect(() => {
    let ignore = false

    async function checkMapping() {
      try {
        const api = await getClient(chainKey)
        const mappedAccount = await api.query.revive.originalAccount(toEvmAddress(address))

        if (!ignore && mappedAccount) {
          setIsMapped(true)
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
    const signer = await polkadotSigner(connectedWallet)
    if (!signer) {
      throw new Error('Signer not available')
    }

    const api = await getClient(chainKey)
    await api.tx.revive
      .mapAccount()
      .signAndSend(address, { signer }, ({ status }) => {
        if (status.type === 'Finalized') {
          setIsMapped(true)
        }
      })
      .untilFinalized()
  }

  return {
    isMapped,
    mapAccount,
  }
}
