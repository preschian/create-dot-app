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
  { label: "Documentation", meta: "Guides & API reference", href: "https://docs.polkadot.com/" },
  { label: "Components", meta: "Wallet & contract UI kit", href: "https://wagmi.sh/" },
  { label: "Examples", meta: "Mint, swap, governance", href: "https://github.com/Web3Auth/web3auth-examples" },
  { label: "Discord", meta: "Ask & share with the community", href: "https://web3auth.io/community" },
];
