// Display metadata for the chains the starter ships with, keyed to the dedot
// `Prefix` values defined in app/utils/sdk.ts so the network switch, block
// watcher, and balance all line up with what the RPC connection exposes.
// Add an entry here when you add a chain to the `CONFIG` in app/utils/sdk.ts.
import type { Prefix } from '../../utils/sdk'

export interface NetworkInfo {
  key: Prefix
  name: string
  chain: string
  token: string
  tag: string
  color: string
  transport: string
}

export const NETWORKS: NetworkInfo[] = [
  {
    key: 'dot',
    name: 'Polkadot',
    chain: 'Polkadot',
    token: 'DOT',
    tag: 'MAINNET',
    color: '#E6007A',
    transport: 'stakeworld RPC',
  },
  {
    key: 'dot_asset_hub',
    name: 'Polkadot Asset Hub',
    chain: 'Asset Hub',
    token: 'DOT',
    tag: 'SYSTEM',
    color: '#7916F3',
    transport: 'stakeworld RPC',
  },
  {
    key: 'pas',
    name: 'Paseo',
    chain: 'Paseo',
    token: 'PAS',
    tag: 'TESTNET',
    color: '#56B4D3',
    transport: 'stakeworld RPC',
  },
  {
    key: 'pas_asset_hub',
    name: 'Paseo Asset Hub',
    chain: 'Asset Hub',
    token: 'PAS',
    tag: 'TESTNET',
    color: '#18A058',
    transport: 'stakeworld RPC',
  },
]

// Default to a testnet so the write path can be tried with faucet tokens.
export const DEFAULT_NETWORK = NETWORKS.find(n => n.key === 'pas') ?? NETWORKS[0]

export function networkByKey(key: Prefix): NetworkInfo {
  return NETWORKS.find(n => n.key === key) ?? NETWORKS[0]
}

export function isTestnet(net: NetworkInfo): boolean {
  return net.tag === 'TESTNET'
}
