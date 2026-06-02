"use client";

// Top-bar network selector. Click to open a dropdown of the available chains;
// selecting one shows a brief "switching..." state, then commits. The selected
// chain is owned by Welcome and flows down here + into LiveDemo and the wallet.
import React, { useEffect, useRef, useState } from "react";
import { NETWORKS, type NetworkInfo, rpcHost } from "./networks";
import { Ic } from "./icons";

interface Props {
  acc: string;
  net: NetworkInfo;
  onSwitch: (chainId: number) => void;
}

export function NetworkSwitch({ acc, net, onSwitch }: Props) {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);

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

  return (
    <span ref={wrapRef} className="relative inline-flex min-w-0 overflow-visible max-sm:w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Switch network"
        className="inline-flex max-sm:w-full min-w-0 cursor-pointer items-center gap-2 border border-[var(--line)] bg-transparent px-3 py-2 font-mono text-[12.5px] font-medium text-[var(--ink)] transition-[border-color,background] duration-150 hover:border-[var(--acc)] sm:gap-2.25 sm:py-2.25"
      >
        <span className="relative inline-flex size-2.25 shrink-0">
          <span
            className="absolute inset-0 animate-dapp-ping rounded-full opacity-45"
            style={{ background: net.color }}
          />
          <span className="absolute inset-0 rounded-full" style={{ background: net.color }} />
        </span>
        <span className="min-w-0 truncate sm:whitespace-nowrap">
          <span className="sm:hidden">{net.chain}</span>
          <span className="hidden sm:inline">{net.name}</span>
        </span>
        <svg
          viewBox="0 0 24 24"
          width="13"
          height="13"
          fill="none"
          className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-40 w-[calc(100vw-2.5rem)] max-w-none animate-ns-rise border border-[var(--line)] bg-[var(--card)] shadow-[0_18px_50px_rgba(0,0,0,.18)] sm:left-auto sm:right-0 sm:w-[308px] sm:max-w-[308px]">
          <div className="border-b border-[var(--line)] px-[18px] pt-[13px] pb-[11px]">
            <div className="font-mono text-[10.5px] font-semibold tracking-[0.12em] text-[var(--faint)]">SWITCH NETWORK</div>
          </div>
          {NETWORKS.map((n, i) => {
            const active = n.chainId === net.chainId;
            const busy = switching === n.chainId;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => choose(n)}
                className={`flex w-full cursor-pointer items-center gap-3 px-[18px] py-[13px] text-left transition-[background] duration-150 hover:bg-[color-mix(in_srgb,var(--acc)_8%,transparent)] ${
                  active ? "bg-[color-mix(in_srgb,var(--acc)_6%,transparent)]" : "bg-transparent"
                } ${i < NETWORKS.length - 1 ? "border-b border-[var(--line)]" : ""}`}
              >
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: n.color }} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[14.5px] font-semibold text-[var(--ink)]">{n.name}</span>
                    <span
                      className="rounded-[3px] border px-[5px] py-px font-mono text-[9px] font-semibold tracking-[0.08em]"
                      style={{
                        color: n.color,
                        borderColor: `color-mix(in srgb, ${n.color} 45%, transparent)`,
                      }}
                    >
                      {n.tag}
                    </span>
                  </span>
                  <span className="mt-[3px] block truncate font-mono text-[11px] text-[var(--faint)]">{rpcHost(n.rpc)}</span>
                </span>
                <span className="inline-flex w-[18px] shrink-0 items-center justify-center">
                  {busy ? (
                    <span
                      className="inline-block size-3.5 animate-ns-spin rounded-full border-2 border-[var(--line)]"
                      style={{ borderTopColor: acc }}
                    />
                  ) : active ? (
                    <Ic.check className="text-base text-[var(--acc)]" />
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
