"use client";

import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";

type WagmiRemountContextValue = {
  wagmiKey: number;
  remountWagmi: () => void;
};

const WagmiRemountContext = createContext<WagmiRemountContextValue | null>(null);

export function WagmiRemountProvider({ children }: { children: ReactNode }) {
  const [wagmiKey, setWagmiKey] = useState(0);
  const remountWagmi = useCallback(() => setWagmiKey((key) => key + 1), []);
  const value = useMemo(() => ({ wagmiKey, remountWagmi }), [wagmiKey, remountWagmi]);

  return <WagmiRemountContext.Provider value={value}>{children}</WagmiRemountContext.Provider>;
}

export function useWagmiRemount() {
  const value = use(WagmiRemountContext);
  if (!value) {
    throw new Error("useWagmiRemount must be used within WagmiRemountProvider");
  }
  return value;
}
