import type { PolkadotClient, PolkadotSigner } from 'polkadot-api'
import { createInkSdk } from '@polkadot-api/sdk-ink'
import { createClient } from 'polkadot-api'
import { connectInjectedExtension } from 'polkadot-api/pjs-signer'
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat'
import { getWsProvider } from 'polkadot-api/ws-provider'
import { ref } from 'vue'
import { passet } from '~/descriptors'
import { name } from '../../package.json'

export const CHAIN_CONFIG = {
  passethub: {
    descriptor: passet,
    providers: ['wss://testnet-passet-hub.polkadot.io'],
  },
} as const

export type Prefix = keyof typeof CHAIN_CONFIG
export const chainKeys = Object.keys(CHAIN_CONFIG) as Prefix[]

export const DAPP_NAME = name

const clients = ref<Partial<Record<Prefix, PolkadotClient>>>({})

export default function sdk<T extends Prefix>(chain: T) {
  if (!clients.value[chain]) {
    clients.value[chain] = createClient(
      withPolkadotSdkCompat(
        getWsProvider(CHAIN_CONFIG[chain].providers[0]),
      ),
    )
  }

  return {
    api: createInkSdk(clients.value[chain]!),
    client: clients.value[chain]!,
  }
}

export async function polkadotSigner(extensionName: string, address: string): Promise<PolkadotSigner | undefined> {
  try {
    const selectedExtension = await connectInjectedExtension(extensionName)
    const account = selectedExtension.getAccounts().find(acc => acc.address === address)
    return account?.polkadotSigner
  }
  catch (err) {
    console.error('Failed to get signer:', err)
    return undefined
  }
}
