import type { Chain } from 'wagmi/chains'
import { createConfig, createStorage, http } from 'wagmi'

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
  storage: createStorage({ storage: localStorage, key: 'vite-react' }),
  transports: {
    [passetHub.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
