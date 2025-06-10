import { asset_hub } from '@polkadot-api/descriptors'
import { createClient, type PolkadotClient, type TypedApi } from 'polkadot-api'
import { withPolkadotSdkCompat } from 'polkadot-api/polkadot-sdk-compat'
import { getWsProvider } from 'polkadot-api/ws-provider/web'
import { ref } from 'vue'

const config = {
  asset_hub: {
    descriptor: asset_hub,
    providers: ['wss://polkadot-asset-hub-rpc.polkadot.io'],
  },
}

type Prefix = keyof typeof config
type AssetHubAPI = TypedApi<typeof asset_hub>

const client = ref<Record<Prefix, PolkadotClient | undefined>>({
  asset_hub: undefined,
})

function sdk(chain: 'asset_hub'): { api: AssetHubAPI, client: PolkadotClient }
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
