import type { PaseoApi, PaseoAssetHubApi, PolkadotApi, PolkadotAssetHubApi } from '@dedot/chaintypes'
import { createAtom } from '@xstate/store'
import { DedotClient, WsProvider } from 'dedot'

// Each chain connects through a remote RPC node over WebSocket. `apiType` carries
// the per-chain types from @dedot/chaintypes so storage queries, constants, and
// extrinsics are fully typed without any code generation step.
//
// Prefer an in-browser light client instead? Swap `WsProvider` in `sdk()` below
// for dedot's `SmoldotProvider` (from 'dedot/smoldot') so the app verifies the
// chain itself rather than trusting a single endpoint.
const CONFIG = {
  dot: {
    providers: ['wss://dot-rpc.stakeworld.io'],
    apiType: {} as PolkadotApi,
  },
  dot_asset_hub: {
    providers: ['wss://dot-rpc.stakeworld.io/assethub'],
    apiType: {} as PolkadotAssetHubApi,
  },
  pas: {
    providers: ['wss://pas-rpc.stakeworld.io'],
    apiType: {} as PaseoApi,
  },
  pas_asset_hub: {
    providers: ['wss://pas-rpc.stakeworld.io/assethub'],
    apiType: {} as PaseoAssetHubApi,
  },
} as const

export type Prefix = keyof typeof CONFIG
export const chainKeys = Object.keys(CONFIG) as Prefix[]

export type ApiTypeFor<T extends Prefix> = (typeof CONFIG)[T]['apiType']
export type DedotApiFor<T extends Prefix> = Promise<DedotClient<ApiTypeFor<T>>>

// Cache one client promise per prefix so a chain is connected once and reused
// across the block watcher, balance reads, and the write path. Created lazily so
// it never runs during SSR — `sdk()` is only called from client-side effects and
// event handlers.
const clients = createAtom<Partial<Record<Prefix, Promise<DedotClient<ApiTypeFor<Prefix>>>>>>({})

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

// A dropped socket — or dedot's staling watchdog forcing a reconnect — clears
// the client's metadata registry until it reconnects and re-syncs. `api.query`
// and `api.tx` read that registry synchronously, so touching them mid-reconnect
// throws "call `.connect()` first". Hand back the client only once it's ready.
async function whenReady(api: DedotClient<ApiTypeFor<Prefix>>): Promise<DedotClient<ApiTypeFor<Prefix>>> {
  if (hasMetadata(api)) {
    return api
  }

  await new Promise<void>((resolve) => {
    api.once('ready', () => resolve())
  })

  return api
}

export default function sdk<T extends Prefix>(chain: T): { api: DedotApiFor<T> } {
  if (!clients.get()[chain]) {
    clients.set({ ...clients.get(), [chain]: DedotClient.new(new WsProvider([...CONFIG[chain].providers])) })
  }

  // Re-check readiness on every call rather than only at creation: the cached
  // client is long-lived and may be mid-reconnect by the time a consumer awaits.
  return {
    api: clients.get()[chain]!.then(whenReady) as DedotApiFor<T>,
  }
}
