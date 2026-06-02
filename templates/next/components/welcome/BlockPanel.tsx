"use client";

import { useBlock, useChains } from "wagmi";
import type { NetworkInfo } from "./networks";
import { LiveDot } from "./icons";
import { EYEBROW, LIVE_CELL } from "./live-demo-shared";

interface Props {
  net: NetworkInfo;
}

export function BlockPanel({ net }: Props) {
  const chainReady = useChains().some((c) => c.id === net.chainId);
  const { data: head } = useBlock({
    chainId: chainReady ? net.chainId : undefined,
    watch: chainReady,
    query: { enabled: chainReady },
  });

  const block = head?.number ?? null;
  const hash = head?.hash ?? null;
  const reconnecting = !chainReady || block === null;
  const finalized = block !== null ? block - 3n : null;

  return (
    <div
      className={`border-r border-[var(--line)] ${LIVE_CELL} welcome-md:border-r-0 welcome-md:border-b`}
    >
      <div className="flex items-center justify-between">
        <span className={EYEBROW}>NETWORK</span>
        <span
          className={`inline-flex items-center gap-2 font-mono text-[11.5px] ${reconnecting ? "text-[var(--faint)]" : "text-[var(--dim)]"}`}
        >
          <LiveDot color={reconnecting ? "var(--faint)" : net.color} />
          {reconnecting ? "connecting…" : "connected"}
        </span>
      </div>

      <div className="mt-[18px] flex items-baseline gap-2.5">
        <span className="font-mono text-[15px] font-semibold text-[var(--acc)]">#</span>
        <span className="inline-block font-mono text-[clamp(36px,5.2vw,52px)] leading-none font-semibold tracking-tight text-[var(--ink)] tabular-nums welcome-sm:text-[clamp(34px,11vw,52px)]">
          {block !== null
            ? Number(block)
                .toLocaleString("en-US")
                .split("")
                .map((ch, i) => (
                  <span key={i + "-" + ch} className="inline-block animate-block-bump">
                    {ch}
                  </span>
                ))
            : "—"}
        </span>
      </div>
      <div className="mt-2 font-mono text-xs text-[var(--faint)]">
        {hash ? `${hash.slice(0, 10)}…` : "0x…"} · ~3s block time
      </div>

      <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3.5">
        {[
          ["Finalized", finalized !== null ? "#" + Number(finalized).toLocaleString("en-US") : "—"],
          ["Chain", net.chain],
          ["Token", net.token],
        ].map(([k, v]) => (
          <div key={k}>
            <div className="font-mono text-[10.5px] tracking-widest text-[var(--faint)]">{k.toUpperCase()}</div>
            <div className="mt-1 font-mono text-sm text-[var(--ink)]">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
