import type { AppKitNetwork } from '@reown/appkit/networks'
import type { Chain } from '@wagmi/vue/chains'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

export const passetHub = {
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

export const projectId = import.meta.env.VITE_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694' // this is a public projectId only to use on localhost
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not set')
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [passetHub]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
})
