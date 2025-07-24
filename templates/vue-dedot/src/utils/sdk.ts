import type { PaseoApi, PaseoAssetHubApi, PolkadotApi, PolkadotAssetHubApi } from '@dedot/chaintypes'
import { DedotClient, WsProvider } from 'dedot'
import { ref } from 'vue'

const dotProvider = new WsProvider('wss://dot-rpc.stakeworld.io')
const dotAssetHubProvider = new WsProvider('wss://dot-rpc.stakeworld.io/assethub')
const pasProvider = new WsProvider('wss://pas-rpc.stakeworld.io')
const pasAssetHubProvider = new WsProvider('wss://pas-rpc.stakeworld.io/assethub')

const config = {
  dot: {
    client: DedotClient.new<PolkadotApi>(dotProvider),
  },
  dot_asset_hub: {
    client: DedotClient.new<PolkadotAssetHubApi>(dotAssetHubProvider),
  },
  pas: {
    client: DedotClient.new<PaseoApi>(pasProvider),
  },
  pas_asset_hub: {
    client: DedotClient.new<PaseoAssetHubApi>(pasAssetHubProvider),
  },
}

export type Prefix = keyof typeof config
export const chainKeys = Object.keys(config) as Prefix[]

type DotAPI = Promise<DedotClient<PolkadotApi>>
type DotAssetHubAPI = Promise<DedotClient<PolkadotAssetHubApi>>
type PasAPI = Promise<DedotClient<PaseoApi>>
type PasAssetHubAPI = Promise<DedotClient<PaseoAssetHubApi>>
type UnionAPI = DotAPI | DotAssetHubAPI | PasAPI | PasAssetHubAPI

const client = ref<Record<Prefix, Promise<DedotClient<any>> | undefined>>({
  dot: undefined,
  dot_asset_hub: undefined,
  pas: undefined,
  pas_asset_hub: undefined,
})

function sdk(chain: 'dot'): { api: DotAPI }
function sdk(chain: 'dot_asset_hub'): { api: DotAssetHubAPI }
function sdk(chain: 'pas'): { api: PasAPI }
function sdk(chain: 'pas_asset_hub'): { api: PasAssetHubAPI }
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
