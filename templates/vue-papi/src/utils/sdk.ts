import type { PolkadotClient, TypedApi } from 'polkadot-api'
import { createClient } from 'polkadot-api'
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat'
import { getWsProvider } from 'polkadot-api/ws-provider/web'
import { ref } from 'vue'
import { dot, dot_asset_hub, pas, pas_asset_hub } from '~/descriptors'

const config = {
  dot: {
    descriptor: dot,
    providers: ['wss://dot-rpc.stakeworld.io'],
  },
  dot_asset_hub: {
    descriptor: dot_asset_hub,
    providers: ['wss://dot-rpc.stakeworld.io/assethub'],
  },
  pas: {
    descriptor: pas,
    providers: ['wss://pas-rpc.stakeworld.io'],
  },
  pas_asset_hub: {
    descriptor: pas_asset_hub,
    providers: ['wss://pas-rpc.stakeworld.io/assethub'],
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
    api: clients.value[chain]!.getTypedApi(config[chain].descriptor) as TypedApi<typeof config[T]['descriptor']>,
    client: clients.value[chain]!,
  }
}
