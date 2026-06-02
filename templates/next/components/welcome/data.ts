// Static content for the create-dot-app welcome screen — Polkadot-native.

export const CLI = "create-dot-app";
export const PROJECT = "my-dapp";
export const HEADLINE = "Ship your dapp today.";

export interface Feature {
  title: string;
  desc: string;
}

export const FEATURES: Feature[] = [
  { title: "Polkadot wallet", desc: "Connect Polkadot.js, Talisman & SubWallet out of the box." },
  { title: "Pallet & ink! hooks", desc: "Type-safe query & extrinsic hooks, fully typed." },
  { title: "Network switching", desc: "Detect, prompt and switch relay/parachain RPCs gracefully." },
  { title: "Local testnet", desc: "Forked node + seed accounts via one command." },
  { title: "Deploy scripts", desc: "Repeatable, env-aware deployment pipeline." },
  { title: "Typed end-to-end", desc: "TypeScript, generated types, zero any." },
];

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
