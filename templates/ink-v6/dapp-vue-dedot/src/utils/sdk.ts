import type { PassetHubApi } from '../generated-types/passet-hub'
import { DedotClient, WsProvider } from 'dedot'
import { ref } from 'vue'

const CONFIG = {
  passethub: {
    providers: ['wss://testnet-passet-hub.polkadot.io'],
    apiType: {} as PassetHubApi,
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
