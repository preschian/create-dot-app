// Static content for the create-dot-app welcome screen — Polkadot-native (dedot).

export const CLI = 'create-dot-app'
export const HEADLINE = 'Ship your dapp today.'

export interface Feature {
  title: string
  desc: string
}

export const FEATURES: Feature[] = [
  {
    title: 'Type-safe API',
    desc: '@dedot/chaintypes gives fully typed storage queries, constants, and extrinsics with no codegen step.',
  },
  {
    title: 'Lightweight client',
    desc: 'dedot is a compact, tree-shakable Polkadot client that keeps the bundle small.',
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
    desc: 'A real-time block watcher streams best and finalized heads from client.block.',
  },
  {
    title: 'Sign & submit',
    desc: 'A sample system.remark extrinsic is signed in the wallet and watched to finalization.',
  },
]

export const HERO_BLURB
  = 'is a Polkadot-native starter with a type-safe dedot client, live chain subscriptions, and wallet connection, already wired together.'

export interface Resource {
  label: string
  meta: string
  href: string
}

export const RESOURCES: Resource[] = [
  {
    label: 'Dedot',
    meta: 'Type-safe client docs (docs.dedot.dev)',
    href: 'https://docs.dedot.dev/',
  },
  {
    label: 'Polkadot docs',
    meta: 'Build on Polkadot & parachains',
    href: 'https://docs.polkadot.com/',
  },
  {
    label: 'Chaintypes',
    meta: 'Generated types for every chain',
    href: 'https://github.com/dedotdev/chaintypes',
  },
  {
    label: 'Discord',
    meta: 'Polkadot developer community',
    href: 'https://discord.gg/polkadot',
  },
]
