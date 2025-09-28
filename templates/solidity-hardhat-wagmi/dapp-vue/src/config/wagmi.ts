import type { Chain } from '@wagmi/vue/chains'
import { createConfig, createStorage, http } from '@wagmi/vue'

export const passetHub = {
  id: 420420422,
  name: 'Paseo PassetHub',
  nativeCurrency: {
    name: 'Paseo Token',
    symbol: 'PAS',
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout-passet-hub.parity-testnet.parity.io/',
    },
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-passet-hub-eth-rpc.polkadot.io'],
    },
  },
  testnet: true,
} as const satisfies Chain

export const config = createConfig({
  chains: [passetHub],
  storage: createStorage({ storage: localStorage, key: 'vite-vue' }),
  transports: {
    [passetHub.id]: http(),
  },
})
