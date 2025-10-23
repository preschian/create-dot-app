import type { Prefix } from '~/utils/sdk'
import { onMounted, ref } from 'vue'
import sdk, { CHAIN_CONFIG, polkadotSigner } from '~/utils/sdk'
import { useConnect } from './useConnect'

export function useMapAccount(chainKey: Prefix, address: string) {
  const { connectedWallet } = useConnect()
  const isMapped = ref<boolean>(false)

  async function mapAccount() {
    if (!connectedWallet.value) {
      throw new Error('Wallet not connected')
    }

    const signer = await polkadotSigner(connectedWallet.value.extensionName, address)
    if (!signer) {
      throw new Error('Signer not available')
    }

    const { client } = sdk(chainKey)
    const typedApi = client.getTypedApi(CHAIN_CONFIG[chainKey].descriptor)

    await typedApi.tx.Revive
      .map_account()
      .signAndSubmit(signer)
      .then(() => {
        isMapped.value = true
      })
  }

  onMounted(async () => {
    try {
      const { api: inkSdk } = sdk(chainKey)
      const mapped = await inkSdk.addressIsMapped(address)
      isMapped.value = mapped
    }
    catch (err) {
      console.error('Error checking account mapping:', err)
    }
  })

  return {
    isMapped,
    mapAccount,
  }
}
