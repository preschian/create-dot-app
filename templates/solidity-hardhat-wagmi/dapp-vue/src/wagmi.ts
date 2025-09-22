import type { Chain } from '@wagmi/vue/chains'
import { createConfig, createStorage, http } from '@wagmi/vue'

const passetHub = {
  id: 420420422,
  name: 'Passet Hub',
  nativeCurrency: {
    name: 'PAS',
    symbol: 'PAS',
    decimals: 12,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-passet-hub-eth-rpc.polkadot.io'],
    },
  },
} as const satisfies Chain

export const config = createConfig({
  chains: [passetHub],
  storage: createStorage({ storage: localStorage, key: 'vite-vue' }),
  transports: {
    [passetHub.id]: http(),
  },
})
