import type { PolkadotClient, TypedApi } from 'polkadot-api'
import { createAtom } from '@xstate/store'
import { createClient } from 'polkadot-api'
import { getSmProvider } from 'polkadot-api/sm-provider'
import { startFromWorker } from 'polkadot-api/smoldot/from-worker'
import { dot, dot_asset_hub, pas, pas_asset_hub } from '../descriptors'

// Each chain connects through an in-browser smoldot light client instead of a
// remote RPC node, so the app verifies the chain itself rather than trusting a
// single endpoint. `chainSpec` is loaded with a dynamic import so the (large)
// spec JSON is only downloaded when that chain is actually used. Parachains (the
// asset hubs) declare the relay they sync against via `potentialRelayChains`.
//
// Prefer a remote RPC instead? Swap the provider in `sdk()` below for
// `getWsProvider('wss://...')` (from 'polkadot-api/ws-provider') and drop the
// `chainSpec`/smoldot wiring.
const config = {
  dot: {
    descriptor: dot,
    chainSpec: () => import('polkadot-api/chains/polkadot'),
  },
  dot_asset_hub: {
    descriptor: dot_asset_hub,
    chainSpec: () => import('polkadot-api/chains/polkadot_asset_hub'),
    relay: 'dot',
  },
  pas: {
    descriptor: pas,
    chainSpec: () => import('polkadot-api/chains/paseo'),
  },
  pas_asset_hub: {
    descriptor: pas_asset_hub,
    chainSpec: () => import('polkadot-api/chains/paseo_asset_hub'),
    relay: 'pas',
  },
} as const

export type Prefix = keyof typeof config

type Smoldot = ReturnType<typeof startFromWorker>
type SmoldotChain = Awaited<ReturnType<Smoldot['addChain']>>

// One smoldot instance (running in a Web Worker, off the main thread) is shared
// by every chain. Created lazily so it never runs during SSR — `sdk()` is only
// ever called from client-side effects and event handlers.
let smoldot: Smoldot | undefined

function getSmoldot() {
  if (!smoldot) {
    smoldot = startFromWorker(
      new Worker(new URL('polkadot-api/smoldot/worker', import.meta.url)),
    )
  }

  return smoldot
}

// Cache the smoldot chain per prefix so a relay chain (e.g. `dot`) is synced
// once and reused both as its own chain and as the relay for its asset hub.
const chainStore: Partial<Record<Prefix, Promise<SmoldotChain>>> = {}

function getChain(chain: Prefix): Promise<SmoldotChain> {
  if (!chainStore[chain]) {
    chainStore[chain] = (async () => {
      const entry = config[chain]
      const { chainSpec } = await entry.chainSpec()

      if ('relay' in entry) {
        return getSmoldot().addChain({
          chainSpec,
          potentialRelayChains: [await getChain(entry.relay)],
        })
      }

      return getSmoldot().addChain({ chainSpec })
    })()
  }

  return chainStore[chain]!
}

const clientStore = createAtom<Partial<Record<Prefix, PolkadotClient>>>({})

export default function sdk<T extends Prefix>(chain: T) {
  const clients = clientStore.get()

  if (!clients[chain]) {
    clients[chain] = createClient(getSmProvider(() => getChain(chain)))
  }

  return {
    api: clients[chain]!.getTypedApi(config[chain].descriptor) as TypedApi<typeof config[T]['descriptor']>,
    client: clients[chain]!,
  }
}
