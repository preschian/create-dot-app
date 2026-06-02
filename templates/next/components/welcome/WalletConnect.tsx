"use client";

// Connect Wallet control. The button + connected-state dropdown are styled per
// the design; the actual connect/disconnect is driven by the real Web3Auth modal
// and the connected account's balance comes from wagmi.
import React, { useEffect, useRef, useState } from "react";
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from "@web3auth/modal/react";
import { useConnection, useBalance, useChains } from "wagmi";
import { formatUnits } from "viem";
import type { Tokens } from "./theme";
import { Ic } from "./icons";

interface Props {
  C: Tokens;
  acc: string;
  mono: string;
  body: string;
  disp: string;
  chainId: number;
}

const trunc = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export function WalletConnect({ C, acc, mono, body, disp, chainId }: Props) {
  const { connect, isConnected, loading: connecting } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { address, connector } = useConnection();
  // only query once the chain is registered with wagmi (see LiveDemo note)
  const chainReady = useChains().some((c) => c.id === chainId);
  const { data: balance } = useBalance({
    address,
    chainId: chainReady ? chainId : undefined,
    query: { enabled: !!address && chainReady },
  });

  const [menu, setMenu] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  // close the connected menu on Escape + outside click
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [menu]);

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

  // ── button ──────────────────────────────────────────────────────────
  const btn = connected ? (
    <button
      className="ed-btn"
      onClick={() => setMenu((m) => !m)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: mono,
        fontSize: 13,
        fontWeight: 500,
        padding: "10px 16px",
        cursor: "pointer",
        border: `1.5px solid ${acc}`,
        background: "transparent",
        color: C.ink,
      }}
    >
      <span style={{ width: 9, height: 9, borderRadius: "50%", display: "inline-block", background: acc }} />
      {label} · {trunc(address!)}
    </button>
  ) : (
    <button
      className="ed-btn"
      onClick={() => connect()}
      disabled={connecting}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: mono,
        fontSize: 13,
        fontWeight: 500,
        padding: "10px 16px",
        cursor: connecting ? "default" : "pointer",
        border: `1.5px solid ${C.ink}`,
        background: "transparent",
        color: C.ink,
        opacity: connecting ? 0.7 : 1,
      }}
    >
      <Ic.wallet style={{ fontSize: 15 }} /> {connecting ? "Connecting…" : "Connect Wallet"}
    </button>
  );

  // ── connected menu ──────────────────────────────────────────────────
  const menuEl = connected && menu && (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: 0,
        width: 288,
        zIndex: 30,
        background: C.card,
        border: `1px solid ${C.line}`,
        boxShadow: "0 18px 50px rgba(0,0,0,.18)",
        animation: "wcRise .14s ease-out",
      }}
    >
      <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: acc,
              color: "#fff",
              fontFamily: mono,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {label[0]?.toUpperCase()}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: disp, fontSize: 15, fontWeight: 600, color: C.ink }}>{label}</div>
            <div style={{ fontFamily: mono, fontSize: 11, color: C.faint }}>via {connector?.name ?? "Web3Auth"}</div>
          </div>
        </div>
        <div style={{ marginTop: 13, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: "0.1em", color: C.faint }}>BALANCE</span>
          <span style={{ fontFamily: mono, fontSize: 15, color: C.ink, fontVariantNumeric: "tabular-nums" }}>
            {balanceText} <span style={{ color: C.dim, fontSize: 12 }}>{balance?.symbol ?? ""}</span>
          </span>
        </div>
        <div style={{ marginTop: 4, fontFamily: mono, fontSize: 11, color: C.dim, wordBreak: "break-all" }}>
          {trunc(address!)}
        </div>
      </div>
      <button
        className="wc-menuitem"
        onClick={() => {
          setMenu(false);
          connect();
        }}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          padding: "12px 18px",
          border: "none",
          borderBottom: `1px solid ${C.line}`,
          background: "transparent",
          cursor: "pointer",
          fontFamily: body,
          fontSize: 13.5,
          color: C.ink,
        }}
      >
        Switch account
      </button>
      <button
        className="wc-menuitem"
        onClick={disconnectAll}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          padding: "12px 18px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontFamily: body,
          fontSize: 13.5,
          color: acc,
        }}
      >
        Disconnect
      </button>
    </div>
  );

  return (
    <span ref={wrapRef} style={{ position: "relative", display: "inline-flex" }}>
      {btn}
      {menuEl}
    </span>
  );
}
