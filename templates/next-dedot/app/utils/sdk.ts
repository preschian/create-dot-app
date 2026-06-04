import type { PaseoApi, PaseoAssetHubApi, PolkadotApi, PolkadotAssetHubApi } from '@dedot/chaintypes'
import { createAtom } from '@xstate/store'
import { DedotClient, SmoldotProvider } from 'dedot'
import { startWithWorker } from 'dedot/smoldot/with-worker'

// Each chain connects through an in-browser smoldot light client instead of a
// remote RPC node, so the app verifies the chain itself rather than trusting a
// single endpoint. `apiType` carries the per-chain types from @dedot/chaintypes
// so storage queries, constants, and extrinsics are fully typed without any code
// generation step. `chainSpec` is loaded with a dynamic import so the (large)
// spec JSON is only downloaded when that chain is actually used; parachains (the
// asset hubs) declare the relay they sync against via `potentialRelayChains`.
//
// Prefer a remote RPC instead? Swap the provider in `sdk()` below for
// `new WsProvider('wss://...')` (also from 'dedot') and drop the smoldot wiring.
const CONFIG = {
  dot: {
    apiType: {} as PolkadotApi,
    chainSpec: () => import('@dedot/chain-specs/polkadot'),
  },
  dot_asset_hub: {
    apiType: {} as PolkadotAssetHubApi,
    chainSpec: () => import('@dedot/chain-specs/polkadot_asset_hub'),
    relay: 'dot',
  },
  pas: {
    apiType: {} as PaseoApi,
    chainSpec: () => import('@dedot/chain-specs/paseo'),
  },
  pas_asset_hub: {
    apiType: {} as PaseoAssetHubApi,
    chainSpec: () => import('@dedot/chain-specs/paseo_asset_hub'),
    relay: 'pas',
  },
} as const

export type Prefix = keyof typeof CONFIG
export const chainKeys = Object.keys(CONFIG) as Prefix[]

export type ApiTypeFor<T extends Prefix> = (typeof CONFIG)[T]['apiType']
export type DedotApiFor<T extends Prefix> = Promise<DedotClient<ApiTypeFor<T>>>

type Smoldot = ReturnType<typeof startWithWorker>
type SmoldotChain = Awaited<ReturnType<Smoldot['addChain']>>

// One smoldot instance (running in a Web Worker, off the main thread) is shared
// by every chain. Created lazily so it never runs during SSR — `sdk()` is only
// ever called from client-side effects and event handlers.
let smoldot: Smoldot | undefined

function getSmoldot() {
  if (!smoldot) {
    smoldot = startWithWorker(
      new Worker(new URL('dedot/smoldot/worker', import.meta.url), { type: 'module' }),
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
      const entry = CONFIG[chain]
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

// `api.registry` throws until the client has connected and fetched metadata, so
// probing it tells us whether storage reads and extrinsics are safe to issue.
function hasMetadata(api: DedotClient<ApiTypeFor<Prefix>>): boolean {
  try {
    return Boolean(api.registry)
  }
  catch {
    return false
  }
}

// A dropped connection — or dedot's staling watchdog forcing a reconnect, which
// a freshly warp-syncing light client can trigger — clears the client's metadata
// registry until it re-syncs. `api.query` and `api.tx` read that registry
// synchronously, so touching them mid-reconnect throws "call `.connect()` first".
// Hand back the client only once it's ready.
async function whenReady(api: DedotClient<ApiTypeFor<Prefix>>): Promise<DedotClient<ApiTypeFor<Prefix>>> {
  if (hasMetadata(api)) {
    return api
  }

  await new Promise<void>((resolve) => {
    api.once('ready', () => resolve())
  })

  return api
}

// Cache one client promise per prefix so a chain is connected once and reused
// across the block watcher, balance reads, and the write path. Created lazily so
// it never runs during SSR — `sdk()` is only called from client-side effects and
// event handlers.
const clients = createAtom<Partial<Record<Prefix, Promise<DedotClient<ApiTypeFor<Prefix>>>>>>({})

export default function sdk<T extends Prefix>(chain: T): { api: DedotApiFor<T> } {
  if (!clients.get()[chain]) {
    clients.set({ ...clients.get(), [chain]: DedotClient.new(new SmoldotProvider(getChain(chain))) })
  }

  // Re-check readiness on every call rather than only at creation: the cached
  // client is long-lived and may be mid-reconnect by the time a consumer awaits.
  return {
    api: clients.get()[chain]!.then(whenReady) as DedotApiFor<T>,
  }
}
