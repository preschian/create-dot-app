import type { PolkadotClient } from 'polkadot-api'
import { createInkSdk } from '@polkadot-api/sdk-ink'
import { createClient } from 'polkadot-api'
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat'
import { getWsProvider } from 'polkadot-api/ws-provider'
import { ref } from 'vue'
import { passet } from '~/descriptors'

const config = {
  passet: {
    descriptor: passet,
    providers: ['wss://testnet-passet-hub.polkadot.io'],
  },
} as const

export type Prefix = keyof typeof config
export const chainKeys = Object.keys(config) as Prefix[]

const clients = ref<Partial<Record<Prefix, PolkadotClient>>>({})

export default function sdk<T extends Prefix>(chain: T) {
  if (!clients.value[chain]) {
    clients.value[chain] = createClient(
      withPolkadotSdkCompat(
        getWsProvider(config[chain].providers[0]),
      ),
    )
  }

  return {
    api: createInkSdk(clients.value[chain]!),
    client: clients.value[chain]!,
  }
}
