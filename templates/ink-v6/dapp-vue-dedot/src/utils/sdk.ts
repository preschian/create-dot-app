import type { Wallet } from '@talismn/connect-wallets'
import type { InjectedSigner } from 'dedot/types'
import type { PassetHubApi } from '../generated-types/passet-hub'
import { getWalletBySource } from '@talismn/connect-wallets'
import { DedotClient, WsProvider } from 'dedot'
import { ref } from 'vue'
import { name } from '../../package.json'

export const CHAIN_CONFIG = {
  passethub: {
    providers: ['wss://testnet-passet-hub.polkadot.io'],
    apiType: {} as PassetHubApi,
  },
} as const

export type Prefix = keyof typeof CHAIN_CONFIG
export const chainKeys = Object.keys(CHAIN_CONFIG) as Prefix[]

export type ApiTypeFor<T extends Prefix> = (typeof CHAIN_CONFIG)[T]['apiType']
export type DedotApiFor<T extends Prefix> = Promise<DedotClient<ApiTypeFor<T>>>

export const DAPP_NAME = name

const clients = ref<Partial<Record<Prefix, Promise<DedotClient<ApiTypeFor<Prefix>>>>>>({})

export default function sdk<T extends Prefix>(chain: T): { api: DedotApiFor<T> } {
  if (!clients.value[chain]) {
    clients.value[chain] = DedotClient.new(new WsProvider([...CHAIN_CONFIG[chain].providers]))
  }

  return {
    api: clients.value[chain]! as DedotApiFor<T>,
  }
}

export async function getClient(chainPrefix: Prefix) {
  const { api: apiInstance } = sdk(chainPrefix)
  return await apiInstance
}

export async function polkadotSigner(wallet: Wallet | null): Promise<InjectedSigner | undefined> {
  if (!wallet)
    return undefined

  const selectedWallet = getWalletBySource(wallet.extensionName)
  await selectedWallet?.enable(DAPP_NAME)

  return selectedWallet?.signer
}
