import { CHAIN_NAMESPACES, type CustomChainConfig } from "@web3auth/modal";

const polkadotLogo = "https://cryptologos.cc/logos/polkadot-new-dot-logo.png";

/** Polkadot Hub TestNet — https://docs.polkadot.com/smart-contracts/connect/ */
export const polkadotHubTestnet: CustomChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x190f1b41",
  rpcTarget: "https://eth-rpc-testnet.polkadot.io/",
  fallbackRpcTargets: ["https://services.polkadothub-rpc.com/testnet/"],
  displayName: "Polkadot Hub TestNet",
  ticker: "PAS",
  tickerName: "Paseo",
  blockExplorerUrl: "https://blockscout-testnet.polkadot.io/",
  decimals: 18,
  logo: polkadotLogo,
};

/** Polkadot Hub MainNet — https://docs.polkadot.com/smart-contracts/connect/ */
export const polkadotHub: CustomChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x190f1b43",
  rpcTarget: "https://eth-rpc.polkadot.io/",
  fallbackRpcTargets: ["https://services.polkadothub-rpc.com/mainnet/"],
  displayName: "Polkadot Hub",
  ticker: "DOT",
  tickerName: "Polkadot",
  blockExplorerUrl: "https://blockscout.polkadot.io/",
  decimals: 18,
  logo: polkadotLogo,
};

/** Kusama Hub — https://docs.polkadot.com/smart-contracts/connect/ */
export const kusamaHub: CustomChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x190f1b42",
  rpcTarget: "https://eth-rpc-kusama.polkadot.io/",
  displayName: "Kusama Hub",
  ticker: "KSM",
  tickerName: "Kusama",
  blockExplorerUrl: "https://blockscout-kusama.polkadot.io/",
  decimals: 18,
  logo: "https://cryptologos.cc/logos/kusama-ksm-logo.png",
};

export const polkadotChains = [polkadotHubTestnet, polkadotHub, kusamaHub] as const;
