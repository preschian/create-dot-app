"use client";

// Editorial first-run welcome screen for create-dot-app. Reproduces the design
// 1:1 (layout, type, accent picker, light/dark), with the live block watcher,
// network switch, Connect Wallet, and sample transaction wired to the template's
// real wagmi + Web3Auth hooks.
import React, { useState } from "react";
import { useSwitchChain } from "wagmi";
import { tokens, ACCENTS, DEFAULT_ACCENT, FONT, type Tokens } from "./welcome/theme";
import { NETWORKS, networkByChainId } from "./welcome/networks";
import { FEATURES, RESOURCES, PROJECT, HEADLINE } from "./welcome/data";
import { Ic } from "./welcome/icons";
import { NetworkSwitch } from "./welcome/NetworkSwitch";
import { WalletConnect } from "./welcome/WalletConnect";
import { LiveDemo } from "./welcome/LiveDemo";

function AccentPicker({ C, acc, onPick }: { C: Tokens; acc: string; onPick: (c: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      <button
        className="ed-theme"
        onClick={() => setOpen((o) => !o)}
        title="Accent color"
        aria-label="Choose accent color"
        style={{
          width: 39,
          height: 39,
          flex: "0 0 auto",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${C.line}`,
          background: "transparent",
          cursor: "pointer",
          transition: "border-color .14s",
        }}
      >
        <span style={{ width: 16, height: 16, borderRadius: "50%", background: acc, display: "inline-block" }} />
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 30,
            display: "flex",
            gap: 9,
            padding: "11px 13px",
            background: C.card,
            border: `1px solid ${C.line}`,
            boxShadow: "0 18px 50px rgba(0,0,0,.18)",
            animation: "edRise .14s ease-out",
          }}
        >
          {ACCENTS.map((c) => (
            <button
              key={c}
              className="ed-sw"
              onClick={() => {
                onPick(c);
                setOpen(false);
              }}
              title={c}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: c,
                cursor: "pointer",
                padding: 0,
                border: "none",
                transition: "transform .12s",
                boxShadow: c === acc ? `0 0 0 2px ${C.card}, 0 0 0 3.5px ${C.ink}` : "none",
              }}
            />
          ))}
        </div>
      )}
    </span>
  );
}

function ThemeToggle({ C, dark, onToggle }: { C: Tokens; dark: boolean; onToggle: () => void }) {
  return (
    <button
      className="ed-theme"
      onClick={onToggle}
      title="Toggle light / dark"
      aria-label="Toggle light or dark mode"
      style={{
        width: 39,
        height: 39,
        flex: "0 0 auto",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${C.line}`,
        background: "transparent",
        color: C.ink,
        cursor: "pointer",
        transition: "color .14s,border-color .14s",
      }}
    >
      <span
        style={{
          position: "relative",
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "1.5px solid currentColor",
          overflow: "hidden",
          display: "inline-block",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "50%",
            background: "currentColor",
            left: dark ? "auto" : 0,
            right: dark ? 0 : "auto",
            transition: "left .2s, right .2s",
          }}
        />
      </span>
    </button>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [accent, setAccent] = useState(DEFAULT_ACCENT);

  // selected network — owned here, flows into the switcher + live demo + wallet.
  // Defaults to the testnet (the provider's defaultChainId); switching aligns the
  // connected wallet via wagmi and also drives the read paths when disconnected.
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
  const mono = FONT.mono;
  const disp = FONT.disp;
  const body = FONT.body;

  const rootVars: React.CSSProperties = {
    // CSS vars consumed by the hover/responsive rules in globals.css
    ["--acc" as string]: acc,
    ["--line" as string]: C.line,
    background: C.paper,
    color: C.ink,
    fontFamily: body,
    minHeight: "100vh",
    width: "100%",
  };

  return (
    <div className="ed-root" style={rootVars}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          borderLeft: `1px solid ${C.line}`,
          borderRight: `1px solid ${C.line}`,
          minHeight: "100vh",
        }}
      >
        {/* top bar */}
        <div
          className="ed-topbar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 40px",
            borderBottom: `1px solid ${C.line}`,
            flexWrap: "wrap",
            rowGap: 12,
            columnGap: 16,
            background: `color-mix(in srgb, ${C.paper} 82%, transparent)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontFamily: disp, fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>
              create<span style={{ color: acc }}>·</span>app
            </span>
            <span style={{ fontFamily: mono, fontSize: 11.5, color: C.faint }}>v1.0</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <NetworkSwitch C={C} acc={acc} mono={mono} disp={disp} net={net} onSwitch={onSwitch} />
            <AccentPicker C={C} acc={acc} onPick={setAccent} />
            <ThemeToggle C={C} dark={dark} onToggle={() => setDark((d) => !d)} />
            <WalletConnect C={C} acc={acc} mono={mono} body={body} disp={disp} chainId={net.chainId} />
          </div>
        </div>

        {/* hero */}
        <div
          className="ed-hero"
          style={{
            padding: "64px 40px 44px",
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 48,
            alignItems: "end",
            borderBottom: `1px solid ${C.line}`,
          }}
        >
          <div>
            <h1
              className="ed-h1"
              style={{
                fontFamily: disp,
                fontWeight: 700,
                fontSize: 84,
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                margin: 0,
                maxWidth: "9ch",
              }}
            >
              {HEADLINE}
            </h1>
          </div>
          <p style={{ fontFamily: body, fontSize: 16.5, lineHeight: 1.55, color: C.dim, margin: 0, paddingBottom: 10 }}>
            <span style={{ color: C.ink, fontWeight: 500 }}>{PROJECT}</span> is a Polkadot-native starter with wallet
            connection, type-safe pallet & contract hooks and deploy scripts, already wired together.
          </p>
        </div>

        {/* live demo — block watcher + sample extrinsic */}
        <LiveDemo C={C} acc={acc} mono={mono} body={body} disp={disp} net={net} onSwitch={onSwitch} />

        {/* features + side rail */}
        <div className="ed-lower" style={{ display: "grid", gridTemplateColumns: "1fr 340px" }}>
          {/* features grid */}
          <div className="ed-feats" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRight: `1px solid ${C.line}` }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="ed-feat"
                style={{
                  padding: "24px 28px",
                  borderRight: i % 2 === 0 ? `1px solid ${C.line}` : "none",
                  borderBottom: i < 4 ? `1px solid ${C.line}` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: mono, fontSize: 12, color: acc, fontWeight: 600 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily: disp, fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>{f.title}</span>
                </div>
                <p style={{ fontFamily: body, fontSize: 13.5, color: C.dim, margin: "8px 0 0", lineHeight: 1.45 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* side rail */}
          <div className="ed-rail" style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                padding: "24px 28px",
                borderBottom: `1px solid ${C.line}`,
                background: `color-mix(in srgb, ${acc} 10%, transparent)`,
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 11, color: acc, fontWeight: 600, letterSpacing: "0.1em" }}>START HERE</div>
              <div style={{ fontFamily: disp, fontSize: 17, fontWeight: 600, marginTop: 8, lineHeight: 1.35 }}>
                Edit <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 500, color: acc }}>src/App.tsx</span> and save. It
                reloads instantly.
              </div>
            </div>
            <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
              <div style={{ fontFamily: mono, fontSize: 11, color: C.faint, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 8 }}>
                RESOURCES
              </div>
              {RESOURCES.map((r, i) => (
                <a
                  key={r.label}
                  className="ed-res"
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    color: C.ink,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: i < RESOURCES.length - 1 ? `1px solid ${C.line}` : "none",
                    transition: "color .14s",
                  }}
                >
                  <span>
                    <span style={{ display: "block", fontFamily: disp, fontSize: 15, fontWeight: 500 }}>{r.label}</span>
                    <span style={{ display: "block", fontFamily: mono, fontSize: 11, color: C.faint, marginTop: 1 }}>{r.meta}</span>
                  </span>
                  <Ic.arrow className="ed-ar" style={{ fontSize: 17, color: C.faint, transition: "transform .14s" }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div
          className="ed-foot"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 40px",
            borderTop: `1px solid ${C.line}`,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span style={{ fontFamily: mono, fontSize: 11.5, color: C.faint }}>
            generated by <span style={{ color: C.dim }}>npm create dot-app@latest</span>
          </span>
          <span style={{ fontFamily: mono, fontSize: 11.5, color: C.faint }}>MIT · Polkadot-native</span>
        </div>
      </div>
    </div>
  );
}
