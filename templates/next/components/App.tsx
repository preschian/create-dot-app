"use client";

// Editorial first-run welcome screen for create-dot-app. Reproduces the design
// 1:1 (layout, type, accent picker, light/dark), with the live block watcher,
// network switch, Connect Wallet, and sample transaction wired to the template's
// real wagmi + Web3Auth hooks.
import { useState } from "react";
import { useSwitchChain } from "wagmi";
import { tokens, DEFAULT_ACCENT, themeVars } from "@/components/welcome/theme";
import { NETWORKS, networkByChainId } from "@/components/welcome/networks";
import { FEATURES, RESOURCES, CLI, HEADLINE, HERO_BLURB } from "@/components/welcome/data";
import { Ic } from "@/components/welcome/ui/icons";
import { HeaderUtilities } from "@/components/welcome/panels/HeaderControls";
import { NetworkSwitch } from "@/components/welcome/panels/NetworkSwitch";
import { WalletConnect } from "@/components/welcome/panels/WalletConnect";
import { LiveDemo } from "@/components/welcome/panels/LiveDemo";

export default function App() {
  const [dark, setDark] = useState(false);
  const [accent, setAccent] = useState(DEFAULT_ACCENT);

  const [chainId, setChainId] = useState(NETWORKS[0].chainId);
  const { mutate: switchChain } = useSwitchChain();

  const net = networkByChainId(chainId);
  const onSwitch = (id: number) => {
    setChainId(id);
    try {
      switchChain({ chainId: id });
    } catch {
      /* wallet may not be connected yet — the selection still drives the read paths */
    }
  };

  const C = tokens(dark);

  return (
    <div
      className="min-h-screen w-full bg-(--paper) font-sans text-(--ink)"
      style={themeVars(C, accent)}
    >
      <div className="mx-auto min-h-screen max-w-[1280px] border-x border-(--line)">
        <header className="sticky top-0 z-10 overflow-visible border-b border-(--line) bg-(color-mix(in_srgb,var(--paper)_82%,transparent)) px-(--welcome-header-inset) py-3.5 backdrop-blur-md sm:px-10 sm:py-5">
          <div className="flex flex-col gap-3 overflow-visible sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-lg font-bold tracking-tight">
                  create<span className="text-(--acc)">·</span>app
                </span>
                <span className="font-mono text-[11.5px] text-(--faint)">v1.0</span>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:hidden">
                <HeaderUtilities
                  accent={accent}
                  onAccentPick={setAccent}
                  dark={dark}
                  onToggleDark={() => setDark((d) => !d)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 overflow-visible sm:flex-row sm:items-center sm:gap-3">
              <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 overflow-visible">
                <NetworkSwitch net={net} onSwitch={onSwitch} />
                <WalletConnect chainId={net.chainId} />
              </div>
              <div className="hidden shrink-0 items-center gap-2 sm:flex">
                <HeaderUtilities
                  accent={accent}
                  onAccentPick={setAccent}
                  dark={dark}
                  onToggleDark={() => setDark((d) => !d)}
                />
              </div>
            </div>
          </div>
        </header>

        <section className="grid items-end gap-12 border-b border-(--line) px-10 pt-16 pb-11 welcome-md:grid-cols-1 welcome-sm:gap-6 welcome-sm:px-5 welcome-sm:py-9 lg:grid-cols-[1fr_320px]">
          <h1 className="m-0 max-w-[9ch] text-[84px] leading-[0.95] font-bold tracking-[-0.04em] welcome-md:text-[13vw]">
            {HEADLINE}
          </h1>
          <p className="m-0 pb-2.5 text-[16.5px] leading-snug text-(--dim)">
            <span className="font-medium text-(--ink)">{CLI}</span> {HERO_BLURB}
          </p>
        </section>

        <LiveDemo net={net} onSwitch={onSwitch} />

        <div className="grid welcome-md:grid-cols-1 lg:grid-cols-[1fr_340px]">
          <div className="grid grid-cols-2 border-r border-(--line) welcome-md:border-r-0 welcome-sm:grid-cols-1">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`p-6 px-7 transition-[background] duration-150 hover:bg-(color-mix(in_srgb,var(--acc)_5%,transparent)) ${
                  i % 2 === 0 ? "border-r border-(--line) welcome-sm:border-r-0" : ""
                } ${i < FEATURES.length - 2 ? "border-b border-(--line)" : ""}`}
              >
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-xs font-semibold text-(--acc)">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg font-semibold tracking-tight">{f.title}</span>
                </div>
                <p className="mt-2 mb-0 text-[13.5px] leading-snug text-(--dim)">{f.desc}</p>
              </div>
            ))}
          </div>

          <aside className="flex flex-col welcome-md:border-t welcome-md:border-(--line)">
            <div className="border-b border-(--line) bg-(color-mix(in_srgb,var(--acc)_10%,transparent)) p-6 px-7">
              <div className="font-mono text-[11px] font-semibold tracking-widest text-(--acc)">START HERE</div>
              <div className="mt-2 text-[17px] leading-snug font-semibold">
                Edit <span className="font-mono text-sm font-medium text-(--acc)">components/App.tsx</span> and save. It
                reloads instantly.
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-0.5 p-5 px-7">
              <div className="mb-2 font-mono text-[11px] font-semibold tracking-widest text-(--faint)">RESOURCES</div>
              {RESOURCES.map((r, i) => (
                <a
                  key={r.label}
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex items-center justify-between py-3 text-(--ink) no-underline transition-colors duration-150 hover:text-(--acc) ${
                    i < RESOURCES.length - 1 ? "border-b border-(--line)" : ""
                  }`}
                >
                  <span>
                    <span className="block text-[15px] font-medium">{r.label}</span>
                    <span className="mt-px block font-mono text-[11px] text-(--faint)">{r.meta}</span>
                  </span>
                  <Ic.Arrow className="text-[17px] text-(--faint) transition-transform duration-150 group-hover:translate-x-[3px]" />
                </a>
              ))}
            </div>
          </aside>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-(--line) px-10 py-[18px] welcome-sm:px-5">
          <span className="font-mono text-[11.5px] text-(--faint)">
            generated by <span className="text-(--dim)">npm create dot-app@latest</span>
          </span>
          <span className="font-mono text-[11.5px] text-(--faint)">MIT · Polkadot-native</span>
        </footer>
      </div>
    </div>
  );
}
