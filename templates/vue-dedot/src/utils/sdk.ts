import type { PaseoApi, PaseoAssetHubApi, PolkadotApi, PolkadotAssetHubApi } from '@dedot/chaintypes'
import { DedotClient, WsProvider } from 'dedot'
import { ref } from 'vue'

const CONFIG = {
  dot: {
    providers: ['wss://dot-rpc.stakeworld.io'],
    apiType: {} as PolkadotApi,
  },
  dot_asset_hub: {
    providers: ['wss://dot-rpc.stakeworld.io/assethub'],
    apiType: {} as PolkadotAssetHubApi,
  },
  pas: {
    providers: ['wss://pas-rpc.stakeworld.io'],
    apiType: {} as PaseoApi,
  },
  pas_asset_hub: {
    providers: ['wss://pas-rpc.stakeworld.io/assethub'],
    apiType: {} as PaseoAssetHubApi,
  },
} as const

export type Prefix = keyof typeof CONFIG
export const chainKeys = Object.keys(CONFIG) as Prefix[]

export type ApiTypeFor<T extends Prefix> = (typeof CONFIG)[T]['apiType']
export type DedotApiFor<T extends Prefix> = Promise<DedotClient<ApiTypeFor<T>>>

const clients = ref<Partial<Record<Prefix, Promise<DedotClient<ApiTypeFor<Prefix>>>>>>({})

export default function sdk<T extends Prefix>(chain: T): { api: DedotApiFor<T> } {
  if (!clients.value[chain]) {
    clients.value[chain] = DedotClient.new(new WsProvider([...CONFIG[chain].providers]))
  }

  return {
    api: clients.value[chain]! as DedotApiFor<T>,
  }
}
