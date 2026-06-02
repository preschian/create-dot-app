"use client";

// Editorial first-run welcome screen for create-dot-app. Reproduces the design
// 1:1 (layout, type, accent picker, light/dark), with the live block watcher,
// network switch, Connect Wallet, and sample transaction wired to the template's
// real wagmi + Web3Auth hooks.
import React, { useState } from "react";
import { useSwitchChain } from "wagmi";
import { tokens, ACCENTS, DEFAULT_ACCENT, themeVars } from "./welcome/theme";
import { NETWORKS, networkByChainId } from "./welcome/networks";
import { FEATURES, RESOURCES, PROJECT, HEADLINE, HERO_BLURB } from "./welcome/data";
import { Ic } from "./welcome/icons";
import { NetworkSwitch } from "./welcome/NetworkSwitch";
import { WalletConnect } from "./welcome/WalletConnect";
import { LiveDemo } from "./welcome/LiveDemo";

function AccentPicker({ acc, onPick }: { acc: string; onPick: (c: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title="Accent color"
        aria-label="Choose accent color"
        className="inline-flex size-[39px] shrink-0 cursor-pointer items-center justify-center border border-[var(--line)] bg-transparent transition-[border-color] duration-150 hover:border-[var(--acc)] hover:text-[var(--acc)]"
      >
        <span className="inline-block size-4 rounded-full" style={{ background: acc }} />
      </button>
      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 z-30 flex animate-ed-rise gap-[9px] border border-[var(--line)] bg-[var(--card)] px-[13px] py-[11px] shadow-[0_18px_50px_rgba(0,0,0,.18)]">
          {ACCENTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                onPick(c);
                setOpen(false);
              }}
              title={c}
              className="size-6 shrink-0 cursor-pointer rounded-full border-0 p-0 transition-transform duration-150 hover:scale-110"
              style={{
                background: c,
                boxShadow: c === acc ? "0 0 0 2px var(--card), 0 0 0 3.5px var(--ink)" : "none",
              }}
            />
          ))}
        </div>
      )}
    </span>
  );
}

function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title="Toggle light / dark"
      aria-label="Toggle light or dark mode"
      className="inline-flex size-[39px] shrink-0 cursor-pointer items-center justify-center border border-[var(--line)] bg-transparent text-[var(--ink)] transition-[color,border-color] duration-150 hover:border-[var(--acc)] hover:text-[var(--acc)]"
    >
      <span className="relative inline-block size-4 overflow-hidden rounded-full border-[1.5px] border-current">
        <span
          className={`absolute top-0 bottom-0 w-1/2 bg-current transition-[left,right] duration-200 ${dark ? "right-0 left-auto" : "left-0 right-auto"}`}
        />
      </span>
    </button>
  );
}

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
  const acc = accent;

  return (
    <div
      className="min-h-screen w-full bg-[var(--paper)] font-sans text-[var(--ink)]"
      style={themeVars(C, acc)}
    >
      <div className="mx-auto min-h-screen max-w-[1280px] border-x border-[var(--line)]">
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--paper)_82%,transparent)] px-10 py-5 backdrop-blur-md max-[560px]:px-5 max-[560px]:py-3.5">
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-bold tracking-tight">
              create<span className="text-[var(--acc)]">·</span>app
            </span>
            <span className="font-mono text-[11.5px] text-[var(--faint)]">v1.0</span>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <NetworkSwitch acc={acc} net={net} onSwitch={onSwitch} />
            <AccentPicker acc={acc} onPick={setAccent} />
            <ThemeToggle dark={dark} onToggle={() => setDark((d) => !d)} />
            <WalletConnect acc={acc} chainId={net.chainId} />
          </div>
        </header>

        <section className="grid items-end gap-12 border-b border-[var(--line)] px-10 pt-16 pb-11 max-[920px]:grid-cols-1 max-[560px]:gap-6 max-[560px]:px-5 max-[560px]:py-9 lg:grid-cols-[1fr_320px]">
          <h1 className="m-0 max-w-[9ch] text-[84px] leading-[0.95] font-bold tracking-[-0.04em] max-[920px]:text-[13vw]">
            {HEADLINE}
          </h1>
          <p className="m-0 pb-2.5 text-[16.5px] leading-snug text-[var(--dim)]">
            <span className="font-medium text-[var(--ink)]">{PROJECT}</span> {HERO_BLURB}
          </p>
        </section>

        <LiveDemo acc={acc} net={net} onSwitch={onSwitch} />

        <div className="grid max-[920px]:grid-cols-1 lg:grid-cols-[1fr_340px]">
          <div className="grid grid-cols-2 border-r border-[var(--line)] max-[920px]:border-r-0 max-[560px]:grid-cols-1">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`p-6 px-7 transition-[background] duration-150 hover:bg-[color-mix(in_srgb,var(--acc)_5%,transparent)] ${
                  i % 2 === 0 ? "border-r border-[var(--line)] max-[560px]:border-r-0" : ""
                } ${i < 4 ? "border-b border-[var(--line)]" : ""}`}
              >
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-xs font-semibold text-[var(--acc)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-lg font-semibold tracking-tight">{f.title}</span>
                </div>
                <p className="mt-2 mb-0 text-[13.5px] leading-snug text-[var(--dim)]">{f.desc}</p>
              </div>
            ))}
          </div>

          <aside className="flex flex-col max-[920px]:border-t max-[920px]:border-[var(--line)]">
            <div className="border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--acc)_10%,transparent)] p-6 px-7">
              <div className="font-mono text-[11px] font-semibold tracking-widest text-[var(--acc)]">START HERE</div>
              <div className="mt-2 text-[17px] leading-snug font-semibold">
                Edit <span className="font-mono text-sm font-medium text-[var(--acc)]">components/App.tsx</span> and save. It
                reloads instantly.
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-0.5 p-5 px-7">
              <div className="mb-2 font-mono text-[11px] font-semibold tracking-widest text-[var(--faint)]">RESOURCES</div>
              {RESOURCES.map((r, i) => (
                <a
                  key={r.label}
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex items-center justify-between py-3 text-[var(--ink)] no-underline transition-colors duration-150 hover:text-[var(--acc)] ${
                    i < RESOURCES.length - 1 ? "border-b border-[var(--line)]" : ""
                  }`}
                >
                  <span>
                    <span className="block text-[15px] font-medium">{r.label}</span>
                    <span className="mt-px block font-mono text-[11px] text-[var(--faint)]">{r.meta}</span>
                  </span>
                  <Ic.arrow className="text-[17px] text-[var(--faint)] transition-transform duration-150 group-hover:translate-x-[3px]" />
                </a>
              ))}
            </div>
          </aside>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] px-10 py-[18px] max-[560px]:px-5">
          <span className="font-mono text-[11.5px] text-[var(--faint)]">
            generated by <span className="text-[var(--dim)]">npm create dot-app@latest</span>
          </span>
          <span className="font-mono text-[11.5px] text-[var(--faint)]">MIT · Polkadot-native</span>
        </footer>
      </div>
    </div>
  );
}
