"use client";

import { Web3AuthProvider, type Web3AuthContextConfig } from "@web3auth/modal/react";
import { IWeb3AuthState, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { polkadotChains, polkadotHubTestnet } from "../lib/chains/polkadot";
import { RestrictPolkadotChains } from "./restrict-polkadot-chains";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

const queryClient = new QueryClient();
 
const web3AuthContextConfig: Web3AuthContextConfig = {
    web3AuthOptions: {
      clientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      chains: [...polkadotChains],
      defaultChainId: polkadotHubTestnet.chainId,
      ssr: true,
      disableAnalytics: true,
    },
  };

export default function Provider({ children, web3authInitialState }: 
  { children: React.ReactNode, web3authInitialState: IWeb3AuthState | undefined }) {
  const [wagmiKey, setWagmiKey] = useState(0);
  const onChainsRestricted = useCallback(() => setWagmiKey((key) => key + 1), []);

  return (
    <Web3AuthProvider config={web3AuthContextConfig} initialState={web3authInitialState}>
      <QueryClientProvider client={queryClient}>
        <RestrictPolkadotChains onRestricted={onChainsRestricted} />
        <WagmiProvider key={wagmiKey}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </Web3AuthProvider>
  );
}
