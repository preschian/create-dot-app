"use client";

import { useWeb3Auth } from "@web3auth/modal/react";
import { useLayoutEffect } from "react";
import { polkadotChains } from "./chains";

/**
 * Web3Auth merges dashboard chains with code config. Force coreOptions to only
 * the three Polkadot Hub networks so Wagmi does not list Ethereum or others.
 */
export function RestrictPolkadotChains({ onRestricted }: { onRestricted: () => void }) {
  const { web3Auth, isInitialized } = useWeb3Auth();

  useLayoutEffect(() => {
    if (!isInitialized || !web3Auth) return;

    const allowed = new Set(polkadotChains.map((chain) => chain.chainId));
    const merged = web3Auth.coreOptions.chains ?? [];
    const hasExtraChains =
      merged.length !== polkadotChains.length ||
      merged.some((chain) => !allowed.has(chain.chainId));

    if (hasExtraChains) {
      // Web3Auth exposes mutable coreOptions; reassignment is required to drop dashboard chains.
      // eslint-disable-next-line react-hooks/immutability -- intentional SDK config mutation
      web3Auth.coreOptions.chains = [...polkadotChains];
      onRestricted();
    }
  }, [isInitialized, web3Auth, onRestricted]);

  return null;
}
