// OpenGraph card (1200x630) for create·app, rendered to dist/index.png at build
// time by astro-takumi. Built with React.createElement (no JSX) so the file needs
// no JSX tsconfig and slots straight into the .mjs Astro config.
//
// Inline flexbox styles only — this is the next/og-style layout model Takumi
// understands. Copy is kept em-dash free to match the brand voice.
import { createElement as h } from 'react';
import type { ReactNode } from 'react';

// Brand tokens, mirrored from the landing page (electric blue accent, near-black canvas).
const ACCENT = '#2F6BFF';
const BG = '#0B0D12';
const FG = '#E7E9EE';
const MUTED = '#9AA3B2';
const HAIRLINE = 'rgba(231, 233, 238, 0.16)';
const DISPLAY = 'Space Grotesk';
const MONO = 'JetBrains Mono';

export async function renderOgImage(): Promise<ReactNode> {
  return h(
    'div',
    {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        backgroundColor: BG,
        color: FG,
        fontFamily: DISPLAY,
        backgroundImage:
          'radial-gradient(1100px 520px at 84% -16%, rgba(47, 107, 255, 0.32), rgba(11, 13, 18, 0))',
      },
    },

    // Top row: wordmark + open-source badge.
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
      h(
        'div',
        { style: { display: 'flex', alignItems: 'center', fontSize: 42, fontWeight: 700, letterSpacing: -1 } },
        h('span', null, 'create'),
        // The brand dot, drawn as a circle so it never depends on a glyph being in the font subset.
        h('div', { style: { display: 'flex', width: 13, height: 13, borderRadius: 999, backgroundColor: ACCENT, margin: '0 9px' } }),
        h('span', null, 'app'),
      ),
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            fontFamily: MONO,
            fontSize: 16,
            color: ACCENT,
            backgroundColor: 'rgba(231, 233, 238, 0.05)',
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 999,
            padding: '12px 26px',
          },
        },
        'OPEN SOURCE · MIT',
      ),
    ),

    // Middle: headline + supporting line.
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h(
        'div',
        { style: { display: 'flex', fontSize: 80, fontWeight: 700, lineHeight: 1.03, letterSpacing: -2, maxWidth: 960 } },
        'Ship the dapp, skip the setup.',
      ),
      h(
        'div',
        { style: { display: 'flex', fontSize: 30, fontWeight: 400, color: MUTED, lineHeight: 1.4, marginTop: 28, maxWidth: 920 } },
        'Polkadot-native dapp starter. Wallet connection, typed contract hooks, network switching, and deploy scripts. Typed end to end.',
      ),
    ),

    // Bottom row: install command pill + domain.
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            fontFamily: MONO,
            fontSize: 27,
            color: FG,
            backgroundColor: 'rgba(231, 233, 238, 0.05)',
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 14,
            padding: '16px 26px',
          },
        },
        h('span', { style: { color: ACCENT, marginRight: 14 } }, '$'),
        'npm create dot-app@latest',
      ),
      h('div', { style: { display: 'flex', fontFamily: MONO, fontSize: 22, color: MUTED } }, 'createdot.app'),
    ),
  );
}
