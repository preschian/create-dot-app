import type { PolkadotClient, PolkadotSigner } from 'polkadot-api'
import { createInkSdk } from '@polkadot-api/sdk-ink'
import { createAtom } from '@xstate/store'
import { createClient } from 'polkadot-api'
import { connectInjectedExtension } from 'polkadot-api/pjs-signer'
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat'
import { getWsProvider } from 'polkadot-api/ws-provider'
import { name } from '../../package.json'
import { passet } from '../descriptors'

export const CHAIN_CONFIG = {
  passethub: {
    descriptor: passet,
    providers: ['wss://testnet-passet-hub.polkadot.io'],
  },
} as const

export type Prefix = keyof typeof CHAIN_CONFIG
export const chainKeys = Object.keys(CHAIN_CONFIG) as Prefix[]

export const DAPP_NAME = name

const clientStore = createAtom<Partial<Record<Prefix, PolkadotClient>>>({})

export default function sdk<T extends Prefix>(chain: T) {
  const clients = clientStore.get()

  if (!clients[chain]) {
    clients[chain] = createClient(
      withPolkadotSdkCompat(
        getWsProvider(CHAIN_CONFIG[chain].providers[0]),
      ),
    )
  }

  return {
    api: createInkSdk(clients[chain]!),
    client: clients[chain]!,
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
