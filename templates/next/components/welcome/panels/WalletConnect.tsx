"use client";

// Connect Wallet control. The button + connected-state dropdown are styled per
// the design; the actual connect/disconnect is driven by the real Web3Auth modal
// and the connected account's balance comes from wagmi.
import { useRef, useState } from "react";
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/react";
import { useConnection, useBalance, useChains } from "wagmi";
import { formatUnits } from "viem";
import { formatAddress } from "@/components/welcome/format";
import { Ic } from "@/components/welcome/ui/icons";
import { useDismissible } from "@/components/welcome/useDismissible";
import { PopoverPanel } from "@/components/welcome/ui/PopoverPanel";

interface Props {
  chainId: number;
}

export function WalletConnect({ chainId }: Props) {
  const { connect, isConnected, loading: connecting } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { address, connector } = useConnection();
  const chainReady = useChains().some((c) => c.id === chainId);
  const { data: balance } = useBalance({
    address,
    chainId: chainReady ? chainId : undefined,
    query: { enabled: !!address && chainReady },
  });

  const [menu, setMenu] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);
  useDismissible(menu, () => setMenu(false), wrapRef);

  const connected = isConnected && !!address;
  const label = userInfo?.name || userInfo?.email || "Account";
  const balanceText =
    balance?.value !== undefined
      ? `${Number(formatUnits(balance.value, balance.decimals)).toLocaleString("en-US", {
          maximumFractionDigits: 4,
        })}`
      : "—";

  const disconnectAll = () => {
    setMenu(false);
    disconnect();
  };

  const btn = connected ? (
    <button
      type="button"
      onClick={() => setMenu((m) => !m)}
      className="inline-flex max-w-full min-w-0 cursor-pointer items-center gap-2 border-[1.5px] border-(--acc) bg-transparent px-3 py-2 font-mono text-xs font-medium text-(--ink) transition-[transform,background,color] duration-150 hover:-translate-y-px sm:max-w-none sm:px-4 sm:py-2.5 sm:text-[13px]"
    >
      <span className="inline-block size-2 shrink-0 rounded-full bg-(--acc) sm:size-2.25" />
      <span className="truncate">
        <span className="hidden sm:inline">{label} · </span>
        {formatAddress(address!)}
      </span>
    </button>
  ) : (
    <button
      type="button"
      onClick={() => connect()}
      disabled={connecting}
      className="inline-flex shrink-0 cursor-pointer items-center gap-2 border-[1.5px] border-(--ink) bg-transparent px-3 py-2 font-mono text-xs font-medium whitespace-nowrap text-(--ink) transition-[transform,background,color] duration-150 hover:-translate-y-px disabled:cursor-default disabled:opacity-70 sm:px-4 sm:py-2.5 sm:text-[13px]"
    >
      <Ic.Wallet className="text-[15px]" />
      <span className="sm:hidden">{connecting ? "…" : "Connect"}</span>
      <span className="hidden sm:inline">{connecting ? "Connecting…" : "Connect Wallet"}</span>
    </button>
  );

  const menuEl = connected && menu && (
    <PopoverPanel className="right-0 z-30 w-72 welcome-sm:right-0">
      <div className="border-b border-(--line) px-[18px] py-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-[30px] shrink-0 items-center justify-center rounded-full bg-(--acc) font-mono text-[13px] font-semibold text-white">
            {label[0]?.toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-(--ink)">{label}</div>
            <div className="font-mono text-[11px] text-(--faint)">via {connector?.name ?? "Web3Auth"}</div>
          </div>
        </div>
        <div className="mt-3.25 flex items-baseline justify-between">
          <span className="font-mono text-[10.5px] tracking-widest text-(--faint)">BALANCE</span>
          <span className="font-mono text-[15px] tabular-nums text-(--ink)">
            {balanceText} <span className="text-xs text-(--dim)">{balance?.symbol ?? ""}</span>
          </span>
        </div>
        <div className="mt-1 break-all font-mono text-[11px] text-(--dim)">{formatAddress(address!)}</div>
      </div>
      <button
        type="button"
        onClick={disconnectAll}
        className="block w-full cursor-pointer border-0 bg-transparent px-[18px] py-3 text-left text-[13.5px] text-(--acc) transition-[background] duration-150 hover:bg-(color-mix(in_srgb,var(--acc)_8%,transparent))"
      >
        Disconnect
      </button>
    </PopoverPanel>
  );

  return (
    <span ref={wrapRef} className="relative inline-flex">
      {btn}
      {menuEl}
    </span>
  );
}
