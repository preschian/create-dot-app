// Static content for the create-dot-app welcome screen — Polkadot-native (papi).

export const CLI = 'create-dot-app'
export const HEADLINE = 'Ship your dapp today.'

export interface Feature {
  title: string
  desc: string
}

export const FEATURES: Feature[] = [
  {
    title: 'Light client',
    desc: 'smoldot syncs the chain in-browser, so the app verifies blocks itself instead of trusting one RPC.',
  },
  {
    title: 'Type-safe API',
    desc: 'polkadot-api descriptors give fully typed storage queries, constants, and extrinsics.',
  },
  {
    title: 'Multi-chain',
    desc: 'Polkadot, Paseo, and their Asset Hubs, switchable from the UI in a single click.',
  },
  {
    title: 'Wallet connection',
    desc: 'Talisman Connect discovers every installed Polkadot extension and its accounts.',
  },
  {
    title: 'Live subscriptions',
    desc: 'A real-time block watcher streams best and finalized heads from client.blocks$.',
  },
  {
    title: 'Sign & submit',
    desc: 'A sample system.remark extrinsic is signed in the wallet and watched to finalization.',
  },
]

export const HERO_BLURB
  = 'is a Polkadot-native starter with an in-browser light client, type-safe polkadot-api hooks, and wallet connection, already wired together.'

export interface Resource {
  label: string
  meta: string
  href: string
}

export const RESOURCES: Resource[] = [
  {
    label: 'Polkadot-API',
    meta: 'Type-safe client docs (papi.how)',
    href: 'https://papi.how/',
  },
  {
    label: 'Polkadot docs',
    meta: 'Build on Polkadot & parachains',
    href: 'https://docs.polkadot.com/',
  },
  {
    label: 'Light clients',
    meta: 'smoldot, in-browser chain sync',
    href: 'https://github.com/smol-dot/smoldot',
  },
  {
    label: 'Discord',
    meta: 'Polkadot developer community',
    href: 'https://discord.gg/polkadot',
  },
]
