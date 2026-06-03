// Content for the create·app marketing landing page.
// Polkadot-native. Technical, to-the-point copy aimed at developers.

export const INSTALL = 'npm create dot-app@latest';

export const HERO_COPY = {
  eyebrow: 'OPEN SOURCE · MIT',
  headline: 'Ship the dapp, skip the setup.',
  sub: 'Wallet connection, type-safe contract hooks, chain/RPC switching and deploy scripts, wired together, typed end-to-end, and Polkadot-native. One command and you are building, not configuring.',
};

// The animated scaffold "terminal" — what `npm create dot-app` prints.
export type ScaffoldKind = 'cmd' | 'q' | 'ok' | 'dim' | 'next';
export const SCAFFOLD_LINES: { t: ScaffoldKind; s: string }[] = [
  { t: 'cmd', s: 'npm create dot-app@latest' },
  { t: 'q', s: '◇  Project name … my-dapp' },
  { t: 'q', s: '◇  Network … Polkadot, Kusama, Paseo' },
  { t: 'q', s: '◇  Template … Wallet + Contracts' },
  { t: 'ok', s: '◇  Scaffolding project' },
  { t: 'dim', s: '   created 38 files · pinned lockfile' },
  { t: 'ok', s: '◇  Done in 4.2s' },
  { t: 'next', s: '→  cd my-dapp && npm run dev' },
];

// Stats strip.
export const STATS = [
  { n: '128k', label: 'weekly installs', meta: 'npm' },
  { n: '9.4k', label: 'GitHub stars', meta: 'github' },
  { n: '50+', label: 'parachains supported', meta: 'relay + paras' },
  { n: '~90s', label: 'to first deploy', meta: 'cold start' },
];

// Quickstart — the four commands.
export const STEPS = [
  { n: '01', cmd: 'npm create dot-app@latest', note: 'Scaffold a fresh project. Pick chains and a template in the prompt.' },
  { n: '02', cmd: 'cd my-dapp && npm i', note: 'Install dependencies. Lockfile pinned, zero post-install scripts.' },
  { n: '03', cmd: 'npm run dev', note: 'Boots a forked local node, seeds accounts, opens the app on :5173.' },
  { n: '04', cmd: 'npm run deploy', note: 'Type-checked, env-aware deploy to any configured network.' },
];

// Feature grid — six headline features.
export const FEATURES = [
  { title: 'Polkadot wallet', desc: 'Connect Polkadot.js, Talisman & SubWallet out of the box.' },
  { title: 'Pallet & ink! hooks', desc: 'Type-safe query & extrinsic hooks, fully typed.' },
  { title: 'Network switching', desc: 'Detect, prompt and switch relay/parachain RPCs gracefully.' },
  { title: 'Local testnet', desc: 'Forked node + seed accounts via one command.' },
  { title: 'Deploy scripts', desc: 'Repeatable, env-aware deployment pipeline.' },
  { title: 'Typed end-to-end', desc: 'TypeScript, generated types, zero any.' },
];

// The stack — layer by layer, UI down to the chain.
export const STACK = [
  { layer: 'Frontend', tag: 'react · vite', desc: 'Typed components, instant HMR, sensible defaults.', path: 'src/' },
  { layer: 'Wallet', tag: 'pjs · talisman', desc: 'Connect, accounts, balances and graceful network switching.', path: '@app/wallet' },
  { layer: 'Hooks', tag: 'query · extrinsic', desc: 'Pallet & ink! reads and writes, fully typed.', path: '@app/hooks' },
  { layer: 'Contracts', tag: 'ink! · pallets', desc: 'Starter contracts with generated TypeScript types.', path: 'contracts/' },
  { layer: 'Deploy', tag: 'env-aware', desc: 'Repeatable, type-checked deploys to any network.', path: 'scripts/deploy.ts' },
];

// Closing CTA resources.
export const CTA_LINKS = [
  { label: 'Documentation', meta: 'Guides & full API reference' },
  { label: 'GitHub', meta: 'Source, issues & roadmap' },
  { label: 'Examples', meta: 'Mint · swap · governance' },
  { label: 'Discord', meta: '6k builders, active' },
];

// Accent palette offered in the top-bar accent picker. Default is electric blue.
export const ACCENTS = ['#D9542B', '#2F6BFF', '#18A058', '#7A5AE0', '#E0A92F'];
export const DEFAULT_ACCENT = '#2F6BFF';
