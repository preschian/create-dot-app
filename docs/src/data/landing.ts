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
  { t: 'next', s: '→  cd my-dapp' },
  { t: 'next', s: '→  npm install' },
  { t: 'next', s: '→  npm run dev' },
];

// Quickstart — the four commands.
export const STEPS = [
  { n: '01', cmd: 'npm create dot-app@latest', note: 'Scaffold a fresh project. Pick chains and a template in the prompt.' },
  { n: '02', cmd: 'cd my-dapp && npm i', note: 'Install dependencies. Lockfile pinned, zero post-install scripts.' },
  { n: '03', cmd: 'npm run dev', note: 'Boots a forked local node, seeds accounts, opens the app on :5173.' },
  { n: '04', cmd: 'npm run deploy', note: 'Type-checked, env-aware deploy to any configured network.' },
];

// Feature grid — six headline features. Mirrors templates/next welcome FEATURES.
export const FEATURES = [
  { title: 'Embedded wallet', desc: 'Connect with Web3Auth (MetaMask embedded wallets), SSR-ready for the App Router.' },
  { title: 'wagmi on Hub', desc: 'Read contracts, send transactions, and fetch balances on Polkadot Hub EVM.' },
  { title: 'Hub networks', desc: 'Switch between Passet testnet, Polkadot Hub, and Kusama Hub from the UI.' },
  { title: 'EVM on Hub', desc: 'Write Solidity, deploy with Hardhat, and interact through wagmi on Polkadot Hub.' },
  { title: 'Hardhat workspace', desc: 'Sample Flipper & Remark contracts with compile, test, and deploy scripts.' },
  { title: 'Typed end-to-end', desc: 'TypeScript, viem types, and ABIs exported from the contracts package.' },
];

// The stack — layer by layer, UI down to the chain. Mirrors templates/next.
export const STACK = [
  { layer: 'Frontend', tag: 'next · tailwind', desc: 'Next.js App Router with Tailwind CSS 4, SSR-ready.', path: 'app/' },
  { layer: 'Wallet', tag: 'web3auth', desc: 'Embedded MetaMask wallets via Web3Auth.', path: 'lib/web3/' },
  { layer: 'Hooks', tag: 'wagmi · viem', desc: 'Typed contract reads, writes and balances on Hub EVM.', path: 'lib/contracts/' },
  { layer: 'Contracts', tag: 'solidity · hardhat', desc: 'Solidity Flipper & Remark, compiled and tested.', path: 'contracts/' },
  { layer: 'Deploy', tag: 'hardhat ignition', desc: 'Repeatable deploys to Polkadot Hub.', path: 'contracts/ignition' },
];

// Closing CTA resources. Mirrors templates/next welcome RESOURCES.
export const CTA_LINKS = [
  { label: 'Documentation', meta: 'Smart contracts on Polkadot Hub', href: 'https://docs.polkadot.com/develop/smart-contracts/' },
  { label: 'Polkadot Hub', meta: 'Overview, assets & connectivity', href: 'https://docs.polkadot.com/reference/polkadot-hub/' },
  { label: 'Get started', meta: 'Hardhat, faucets & explorers', href: 'https://docs.polkadot.com/smart-contracts/get-started/' },
  { label: 'Discord', meta: 'Polkadot developer community', href: 'https://discord.gg/polkadot' },
];

// Accent palette offered in the top-bar accent picker. Default is electric blue.
export const ACCENTS = ['#D9542B', '#2F6BFF', '#18A058', '#7A5AE0', '#E0A92F'];
export const DEFAULT_ACCENT = '#2F6BFF';
