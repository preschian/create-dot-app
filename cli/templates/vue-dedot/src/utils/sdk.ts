import type { PaseoAssetHubApi, PolkadotAssetHubApi, PolkadotPeopleApi } from '@dedot/chaintypes'
import { DedotClient, WsProvider } from 'dedot'
import { ref } from 'vue'

const assetHubProvider = new WsProvider('wss://polkadot-asset-hub-rpc.polkadot.io')
const paseoAssetHubProvider = new WsProvider('wss://pas-rpc.stakeworld.io/assethub')
const peopleProvider = new WsProvider('wss://polkadot-people-rpc.polkadot.io')

const config = {
  asset_hub: {
    client: DedotClient.new<PolkadotAssetHubApi>(assetHubProvider),
  },
  pas_asset_hub: {
    client: DedotClient.new<PaseoAssetHubApi>(paseoAssetHubProvider),
  },
  people: {
    client: DedotClient.new<PolkadotPeopleApi>(peopleProvider),
  },
}

export type Prefix = keyof typeof config
type AssetHubAPI = Promise<DedotClient<PolkadotAssetHubApi>>
type PasAssetHubAPI = Promise<DedotClient<PaseoAssetHubApi>>
type PeopleAPI = Promise<DedotClient<PolkadotPeopleApi>>
type UnionAPI = AssetHubAPI | PasAssetHubAPI | PeopleAPI

const client = ref<Record<Prefix, Promise<DedotClient<any>> | undefined>>({
  asset_hub: undefined,
  pas_asset_hub: undefined,
  people: undefined,
})

function sdk(chain: 'asset_hub'): { api: AssetHubAPI }
function sdk(chain: 'pas_asset_hub'): { api: PasAssetHubAPI }
function sdk(chain: 'people'): { api: PeopleAPI }
function sdk(chain: Prefix): { api: UnionAPI }
function sdk(chain: Prefix) {
  if (!client.value[chain]) {
    client.value[chain] = config[chain].client
  }

  return {
    api: client.value[chain],
  }
}

export default sdk
