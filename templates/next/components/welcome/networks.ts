// Display metadata for the three networks the starter ships with, keyed to the
// real wagmi numeric chain IDs derived from lib/chains/polkadot.ts so the network
// switch, block watcher, and balance all line up with what wagmi/Web3Auth expose.
import { polkadotHub, polkadotHubTestnet, kusamaHub } from "../../lib/chains/polkadot";
import type { CustomChainConfig } from "@web3auth/modal";

export interface NetworkInfo {
  id: string;
  chainId: number;
  name: string;
  token: string;
  tag: string;
  color: string;
  rpc: string;
  chain: string;
  explorer: string;
}

const numericId = (chain: CustomChainConfig) => Number.parseInt(chain.chainId, 16);

export const NETWORKS: NetworkInfo[] = [
  {
    id: "pas-hub",
    chainId: numericId(polkadotHubTestnet),
    name: "Polkadot Hub Testnet",
    token: "PAS",
    tag: "TESTNET",
    color: "#56B4D3",
    rpc: polkadotHubTestnet.rpcTarget,
    chain: "Passet Hub",
    explorer: polkadotHubTestnet.blockExplorerUrl ?? "",
  },
  {
    id: "dot-hub",
    chainId: numericId(polkadotHub),
    name: "Polkadot Hub",
    token: "DOT",
    tag: "MAINNET",
    color: "#E6007A",
    rpc: polkadotHub.rpcTarget,
    chain: "Polkadot Asset Hub",
    explorer: polkadotHub.blockExplorerUrl ?? "",
  },
  {
    id: "ksm-hub",
    chainId: numericId(kusamaHub),
    name: "Kusama Hub",
    token: "KSM",
    tag: "CANARY",
    color: "#7D4DAE",
    rpc: kusamaHub.rpcTarget,
    chain: "Kusama Asset Hub",
    explorer: kusamaHub.blockExplorerUrl ?? "",
  },
];

export const TESTNET = NETWORKS[0];

export function networkByChainId(chainId: number | undefined): NetworkInfo {
  return NETWORKS.find((n) => n.chainId === chainId) ?? NETWORKS[0];
}

/** Strip the protocol for the compact endpoint label used across the UI. */
export function rpcHost(rpc: string): string {
  return rpc.replace(/^https?:\/\//, "").replace(/^wss?:\/\//, "").replace(/\/$/, "");
}

/** Block-explorer URL for a transaction hash, or undefined if the chain has no explorer. */
export function explorerTxUrl(net: NetworkInfo, hash: string): string | undefined {
  if (!net.explorer) return undefined;
  return `${net.explorer.replace(/\/$/, "")}/tx/${hash}`;
}
