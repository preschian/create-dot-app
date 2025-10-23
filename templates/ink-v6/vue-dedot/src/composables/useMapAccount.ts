import type { Prefix } from '~/utils/sdk'
import { toEvmAddress } from 'dedot/contracts'
import { onMounted, ref } from 'vue'
import { getClient, polkadotSigner } from '~/utils/sdk'
import { useConnect } from './useConnect'

export function useMapAccount(chainKey: Prefix, address: string) {
  const { connectedWallet } = useConnect()
  const isMapped = ref<boolean>(false)

  async function mapAccount() {
    const signer = await polkadotSigner(connectedWallet.value)
    if (!signer) {
      throw new Error('Signer not available')
    }

    const api = await getClient(chainKey)
    await api.tx.revive
      .mapAccount()
      .signAndSend(address, { signer }, ({ status }) => {
        if (status.type === 'Finalized')
          isMapped.value = true
      })
      .untilFinalized()
  }

  onMounted(async () => {
    const api = await getClient(chainKey)
    const mappedAccount = await api.query.revive.originalAccount(toEvmAddress(address))

    if (mappedAccount)
      isMapped.value = true
  })

  return {
    isMapped,
    mapAccount,
  }
}
