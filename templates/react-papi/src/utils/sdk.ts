import type { Atom } from '@xstate/store'
import type { PolkadotClient, TypedApi } from 'polkadot-api'
import { createAtom } from '@xstate/store'
import { createClient } from 'polkadot-api'
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat'
import { getWsProvider } from 'polkadot-api/ws-provider/web'
import { asset_hub, pas_asset_hub, people } from '~/descriptors'

const config = {
  asset_hub: {
    descriptor: asset_hub,
    providers: ['wss://polkadot-asset-hub-rpc.polkadot.io'],
  },
  pas_asset_hub: {
    descriptor: pas_asset_hub,
    providers: ['wss://pas-rpc.stakeworld.io/assethub'],
  },
  people: {
    descriptor: people,
    providers: ['wss://polkadot-people-rpc.polkadot.io'],
  },
}

export type Prefix = keyof typeof config
type AssetHubAPI = TypedApi<typeof asset_hub>
type PeopleAPI = TypedApi<typeof people>
type PasAssetHubAPI = TypedApi<typeof pas_asset_hub>
type UnionAPI = AssetHubAPI | PasAssetHubAPI | PeopleAPI

const clientStore: Atom<Record<Prefix, PolkadotClient | undefined>> = createAtom({
  asset_hub: undefined,
  pas_asset_hub: undefined,
  people: undefined,
})

function sdk(chain: 'asset_hub'): { api: AssetHubAPI, client: PolkadotClient }
function sdk(chain: 'pas_asset_hub'): { api: PasAssetHubAPI, client: PolkadotClient }
function sdk(chain: 'people'): { api: PeopleAPI, client: PolkadotClient }
function sdk(chain: Prefix): { api: UnionAPI, client: PolkadotClient }
function sdk(chain: Prefix) {
  const client = clientStore.get()

  if (!client[chain]) {
    client[chain] = createClient(
      withPolkadotSdkCompat(
        getWsProvider(config[chain].providers[0]),
      ),
    )
  }

  return {
    api: client[chain].getTypedApi(config[chain].descriptor),
    client: client[chain],
  }
}

export default sdk
