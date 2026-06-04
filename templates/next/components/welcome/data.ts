// Static content for the create-dot-app welcome screen — Polkadot-native.

export const CLI = "create-dot-app";
export const HEADLINE = "Ship your dapp today.";

export interface Feature {
  title: string;
  desc: string;
}

export const FEATURES: Feature[] = [
  {
    title: "Embedded wallet",
    desc: "Connect with Web3Auth (MetaMask embedded wallets), SSR-ready for the App Router.",
  },
  {
    title: "wagmi on Hub",
    desc: "Read contracts, send transactions, and fetch balances on Polkadot Hub EVM.",
  },
  {
    title: "Hub networks",
    desc: "Switch between Passet testnet, Polkadot Hub, and Kusama Hub from the UI.",
  },
  {
    title: "EVM on Hub",
    desc: "Write Solidity, deploy with Hardhat, and interact through wagmi on Polkadot Hub.",
  },
  {
    title: "Hardhat workspace",
    desc: "Sample Flipper & Remark contracts with compile, test, and deploy scripts.",
  },
  {
    title: "Typed end-to-end",
    desc: "TypeScript, viem types, and ABIs exported from the contracts package.",
  },
];

export const HERO_BLURB =
  "is a Polkadot Hub starter with embedded wallets, wagmi contract hooks, and Hardhat deploy scripts, already wired together.";

export interface Resource {
  label: string;
  meta: string;
  href: string;
}

export const RESOURCES: Resource[] = [
  {
    label: "Documentation",
    meta: "Smart contracts on Polkadot Hub",
    href: "https://docs.polkadot.com/develop/smart-contracts/",
  },
  {
    label: "Polkadot Hub",
    meta: "Overview, assets & connectivity",
    href: "https://docs.polkadot.com/reference/polkadot-hub/",
  },
  {
    label: "Get started",
    meta: "Hardhat, faucets & explorers",
    href: "https://docs.polkadot.com/smart-contracts/get-started/",
  },
  {
    label: "Discord",
    meta: "Polkadot developer community",
    href: "https://discord.gg/polkadot",
  },
];
