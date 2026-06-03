"use client";

// Minimal stroke icons — functional UI affordances, kept to simple geometry —
// plus the animated "live" status dot used by the network indicator.
import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

function Copy(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" {...p}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function Check(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" {...p}>
      <path d="M4 12.5 9.5 18 20 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Ext(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" {...p}>
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Wallet(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" {...p}>
      <rect x="3" y="6" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.5" cy="14.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function Spark(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="1em" height="1em" {...p}>
      <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export const Ic = { Copy, Check, Arrow, Ext, Wallet, Spark };

const LIVE_DOT_SIZE = {
  sm: "size-2",
  md: "size-2.25",
} as const;

/** A small animated "live" dot for status rows. */
export function LiveDot({ color, size = "sm" }: { color: string; size?: keyof typeof LIVE_DOT_SIZE }) {
  return (
    <span className={`relative inline-flex shrink-0 ${LIVE_DOT_SIZE[size]}`}>
      <span
        className="absolute inset-0 animate-dapp-ping rounded-full opacity-45"
        style={{ background: color }}
      />
      <span className="absolute inset-0 rounded-full" style={{ background: color }} />
    </span>
  );
}
