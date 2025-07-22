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
}

export type Prefix = keyof typeof config
type DotAPI = TypedApi<typeof dot>
type DotAssetHubAPI = TypedApi<typeof dot_asset_hub>
type PasAPI = TypedApi<typeof pas>
type PasAssetHubAPI = TypedApi<typeof pas_asset_hub>
type UnionAPI = DotAPI | DotAssetHubAPI | PasAPI | PasAssetHubAPI

const client = ref<Record<Prefix, PolkadotClient | undefined>>({
  dot: undefined,
  dot_asset_hub: undefined,
  pas: undefined,
  pas_asset_hub: undefined,
})

function sdk(chain: 'dot'): { api: DotAPI, client: PolkadotClient }
function sdk(chain: 'dot_asset_hub'): { api: DotAssetHubAPI, client: PolkadotClient }
function sdk(chain: 'pas'): { api: PasAPI, client: PolkadotClient }
function sdk(chain: 'pas_asset_hub'): { api: PasAssetHubAPI, client: PolkadotClient }
function sdk(chain: Prefix): { api: UnionAPI, client: PolkadotClient }
function sdk(chain: Prefix) {
  if (!client.value[chain]) {
    client.value[chain] = createClient(
      withPolkadotSdkCompat(
        getWsProvider(config[chain].providers[0]),
      ),
    )
  }

  return {
    api: client.value[chain].getTypedApi(config[chain].descriptor),
    client: client.value[chain],
  }
}

export default sdk
