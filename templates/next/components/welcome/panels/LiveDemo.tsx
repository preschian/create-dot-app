"use client";

import type { NetworkInfo } from "@/components/welcome/networks";
import { BlockPanel } from "./BlockPanel";
import { WritePanel } from "./WritePanel";

interface Props {
  net: NetworkInfo;
  onSwitch: (chainId: number) => void;
}

export function LiveDemo({ net, onSwitch }: Props) {
  return (
    <div className="grid grid-cols-2 border-b border-(--line) welcome-md:grid-cols-1">
      <BlockPanel net={net} />
      <WritePanel net={net} onSwitch={onSwitch} />
    </div>
  );
}
