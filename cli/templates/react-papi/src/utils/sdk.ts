import { asset_hub, people } from '@polkadot-api/descriptors'
import { createClient, type PolkadotClient, type TypedApi } from 'polkadot-api'
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat'
import { getWsProvider } from 'polkadot-api/ws-provider/web'

const config = {
  asset_hub: {
    descriptor: asset_hub,
    providers: ['wss://polkadot-asset-hub-rpc.polkadot.io'],
  },
  people: {
    descriptor: people,
    providers: ['wss://polkadot-people-rpc.polkadot.io'],
  },
}

type Prefix = keyof typeof config
type AssetHubAPI = TypedApi<typeof asset_hub>
type PeopleAPI = TypedApi<typeof people>

const clientStore: Record<Prefix, PolkadotClient | undefined> = {
  asset_hub: undefined,
  people: undefined,
}

function sdk(chain: 'asset_hub'): { api: AssetHubAPI, client: PolkadotClient }
function sdk(chain: 'people'): { api: PeopleAPI, client: PolkadotClient }
function sdk(chain: Prefix) {
  if (!clientStore[chain]) {
    clientStore[chain] = createClient(
      withPolkadotSdkCompat(
        getWsProvider(config[chain].providers[0]),
      ),
    )
  }

  return {
    api: clientStore[chain].getTypedApi(config[chain].descriptor),
    client: clientStore[chain],
  }
}

export default sdk