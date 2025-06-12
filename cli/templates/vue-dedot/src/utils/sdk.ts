import type { PolkadotAssetHubApi, PolkadotPeopleApi } from '@dedot/chaintypes'
import { DedotClient, WsProvider } from 'dedot'
import { ref } from 'vue'

const assetHubProvider = new WsProvider('wss://polkadot-asset-hub-rpc.polkadot.io')
const peopleProvider = new WsProvider('wss://polkadot-people-rpc.polkadot.io')

const config = {
  asset_hub: {
    client: DedotClient.new<PolkadotAssetHubApi>(assetHubProvider),
  },
  people: {
    client: DedotClient.new<PolkadotPeopleApi>(peopleProvider),
  },
}

type Prefix = keyof typeof config

const client = ref<Record<Prefix, Promise<DedotClient<any>> | undefined>>({
  asset_hub: undefined,
  people: undefined,
})

function sdk(chain: 'asset_hub'): { api: Promise<DedotClient<PolkadotAssetHubApi>> }
function sdk(chain: 'people'): { api: Promise<DedotClient<PolkadotPeopleApi>> }
function sdk(chain: Prefix) {
  if (!client.value[chain]) {
    client.value[chain] = config[chain].client
  }

  return {
    api: client.value[chain],
  }
}

export default sdk
