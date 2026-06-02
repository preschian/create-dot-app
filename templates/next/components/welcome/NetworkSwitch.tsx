"use client";

// Top-bar network selector. Click to open a dropdown of the available chains;
// selecting one shows a brief "switching..." state, then commits. The selected
// chain is owned by Welcome and flows down here + into LiveDemo and the wallet.
import React, { useEffect, useRef, useState } from "react";
import type { Tokens } from "./theme";
import { NETWORKS, type NetworkInfo, rpcHost } from "./networks";
import { Ic } from "./icons";

interface Props {
  C: Tokens;
  acc: string;
  mono: string;
  disp: string;
  net: NetworkInfo;
  onSwitch: (chainId: number) => void;
}

export function NetworkSwitch({ C, acc, mono, disp, net, onSwitch }: Props) {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState<number | null>(null); // chainId being switched to
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);

  // close on Escape + outside click
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open]);
  useEffect(() => () => clearTimeout(timer.current ?? undefined), []);

  const choose = (n: NetworkInfo) => {
    if (n.chainId === net.chainId) {
      setOpen(false);
      return;
    }
    setSwitching(n.chainId);
    timer.current = setTimeout(() => {
      onSwitch(n.chainId);
      setSwitching(null);
      setOpen(false);
    }, 650);
  };

  const Chevron = (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      style={{ transition: "transform .16s", transform: open ? "rotate(180deg)" : "none", flex: "0 0 auto" }}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <span ref={wrapRef} style={{ position: "relative", display: "inline-flex" }}>
      <button
        className="ns-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Switch network"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 9,
          fontFamily: mono,
          fontSize: 12.5,
          fontWeight: 500,
          color: C.ink,
          cursor: "pointer",
          padding: "9px 12px",
          border: `1px solid ${C.line}`,
          background: "transparent",
        }}
      >
        <span style={{ position: "relative", display: "inline-flex", width: 9, height: 9, flex: "0 0 auto" }}>
          <span
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: net.color,
              opacity: 0.45,
              animation: "dappPing 1.8s cubic-bezier(0,0,.2,1) infinite",
            }}
          />
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: net.color }} />
        </span>
        <span style={{ whiteSpace: "nowrap" }}>{net.name}</span>
        {Chevron}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 308,
            zIndex: 40,
            background: C.card,
            border: `1px solid ${C.line}`,
            boxShadow: "0 18px 50px rgba(0,0,0,.18)",
            animation: "nsRise .14s ease-out",
          }}
        >
          <div style={{ padding: "13px 18px 11px", borderBottom: `1px solid ${C.line}` }}>
            <div style={{ fontFamily: mono, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.12em", color: C.faint }}>
              SWITCH NETWORK
            </div>
          </div>
          {NETWORKS.map((n, i) => {
            const active = n.chainId === net.chainId;
            const busy = switching === n.chainId;
            return (
              <button
                key={n.id}
                className="ns-item"
                onClick={() => choose(n)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                  padding: "13px 18px",
                  border: "none",
                  background: active ? `color-mix(in srgb, ${acc} 6%, transparent)` : "transparent",
                  borderBottom: i < NETWORKS.length - 1 ? `1px solid ${C.line}` : "none",
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: n.color, flex: "0 0 auto" }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: disp, fontSize: 14.5, fontWeight: 600, color: C.ink }}>{n.name}</span>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        color: n.color,
                        border: `1px solid color-mix(in srgb, ${n.color} 45%, transparent)`,
                        padding: "1px 5px",
                        borderRadius: 3,
                      }}
                    >
                      {n.tag}
                    </span>
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontFamily: mono,
                      fontSize: 11,
                      color: C.faint,
                      marginTop: 3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {rpcHost(n.rpc)}
                  </span>
                </span>
                <span
                  style={{
                    flex: "0 0 auto",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 18,
                  }}
                >
                  {busy ? (
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: `2px solid ${C.line}`,
                        borderTopColor: acc,
                        display: "inline-block",
                        animation: "nsSpin .7s linear infinite",
                      }}
                    />
                  ) : active ? (
                    <Ic.check style={{ fontSize: 16, color: acc }} />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
}
