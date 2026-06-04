# Next.js PAPI Template

A modern **Next.js 16 + TypeScript + React 19** template for building Polkadot decentralized applications (dApps) using the PAPI SDK. The first-run home page is a live welcome screen — a real-time block watcher, a network switcher, Connect Wallet, and a sample `system.remark` extrinsic — all wired up so you can confirm the stack works the moment it boots.

## 🚀 Features

- **Next.js 16** with App Router and Turbopack
- **React 19** for modern UI development
- **TypeScript** for type safety
- **PAPI SDK** integration for Polkadot blockchain interaction
- **Light client** connectivity via smoldot — verifies the chain in-browser instead of trusting a single RPC node
- **TailwindCSS 4** styling with light/dark theme tokens and an accent picker
- **Wallet Connection** support via Talisman Connect
- Pre-configured for **multiple Polkadot chains**

## 🔗 SDK Information

This template uses **PAPI (Polkadot API)** - a modern, type-safe SDK for interacting with Polkadot-based blockchains.

📚 **PAPI Documentation**: https://papi.how/

### Connectivity

Chains connect through an in-browser **smoldot light client** (`getSmProvider`) rather than a remote RPC node, so the app verifies blocks itself instead of trusting a single endpoint. smoldot runs in a Web Worker, and each chain's spec is loaded on demand via a dynamic import. The first connection to a chain warp-syncs and can take a few seconds; the asset hubs are parachains, so they also sync their relay chain (`dot` / `pas`) under the hood.

### Configuration Files:
- **`app/utils/sdk.ts`** - Configures which chains to connect to. Each chain runs through the smoldot light client; edit this file to add or remove supported networks (or switch a chain back to a remote RPC endpoint).
- **`app/utils/sdk-interface.ts`** - Provides high-level functions for onchain SDK calls.

## 🌐 Supported Chains

The template comes pre-configured for:
- **Polkadot** (DOT) - Main network
- **Polkadot Asset Hub** - Asset management
- **Paseo** (PAS) - Testnet
- **Paseo Asset Hub** - Testnet asset management

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## 📁 Project Structure

```
app/
├── components/
│   ├── app.tsx     # ← start here: the screen rendered by app/page.tsx
│   └── welcome/    # first-run welcome UI (panels, theme, icons) — replace with your own
├── hooks/          # papi data hooks: use-connect, use-current-block, use-transaction
├── utils/          # sdk.ts (chain setup), sdk-interface.ts (onchain calls), formatters.ts
├── globals.css     # Tailwind entry + welcome animations
├── layout.tsx      # Root layout (fonts)
└── page.tsx        # Renders <App />
```

## 🎨 Where to start

Edit [`app/components/app.tsx`](app/components/app.tsx) — it composes the welcome screen and is the natural place to start building your own UI. Styling uses **Tailwind CSS 4** utility classes with theme tokens exposed as CSS variables (`--paper`, `--ink`, `--acc`, …) on the welcome root. The pieces it pulls in live in [`app/components/welcome/`](app/components/welcome):

| File | Responsibility |
| --- | --- |
| `welcome/panels/LiveDemo.tsx` | Composes `BlockPanel` + `WritePanel` |
| `welcome/panels/BlockPanel.tsx` | Live block watcher (`useCurrentBlock`) |
| `welcome/panels/WritePanel.tsx` | Sample `system.remark` extrinsic + transaction stepper |
| `welcome/panels/WalletConnect.tsx` | Connect Wallet button + connected menu (balance via the light client) |
| `welcome/panels/ConnectModal.tsx` | Talisman wallet + account picker |
| `welcome/panels/NetworkSwitch.tsx` | Network selector across the configured chains |
| `welcome/panels/HeaderControls.tsx` | Accent picker + theme toggle |
| `welcome/ui/{PopoverPanel,icons}` | Shared UI primitives (dropdown panel, icon set) |
| `welcome/{theme,networks,data,shared,format,useDismissible}` | Theme tokens, chain metadata, copy, and helpers |

## 🔧 Adding Custom Networks

### Step 1: Generate Chain Descriptors

PAPI requires type descriptors for each chain. Generate them using the PAPI CLI:

```bash
# Add a new chain using a WebSocket endpoint
npx papi add your_chain -w wss://your-rpc-endpoint.io

# Or use a well-known chain name
npx papi add kusama -n ksmcc3

# Generate descriptors (automatically runs on postinstall)
npx papi
```

This generates type-safe descriptors into the local `app/descriptors` folder (the template sets `noDescriptorsPackage` in `.papi/polkadot-api.json`), which you import via `../descriptors` (see `app/utils/sdk.ts`).

### Step 2: Configure Your Chain

Edit `app/utils/sdk.ts` to add your chain configuration. Each chain points to a light-client chain spec, loaded lazily with a dynamic import:

```typescript
import { yourChain } from '../descriptors'

const config = {
  // ... existing chains
  your_chain: {
    descriptor: yourChain,
    chainSpec: () => import('polkadot-api/chains/your_chain'),
  },
}
```

For a **parachain**, add the relay it syncs against (a relay-chain key already defined in `config`):

```typescript
your_parachain: {
  descriptor: yourParachain,
  chainSpec: () => import('polkadot-api/chains/your_parachain'),
  relay: 'dot',
},
```

`polkadot-api/chains/*` bundles specs for the well-known relay and system chains. If PAPI does not bundle a spec for your chain, supply your own chain-spec string, or connect over RPC instead with `getWsProvider('wss://your-rpc-endpoint.io')` from `polkadot-api/ws-provider`.

### Step 3: Add it to the UI

The network switch, block watcher, and balance read each chain's display metadata from [`app/components/welcome/networks.ts`](app/components/welcome/networks.ts). Add a matching entry (keyed by the `config` key from `sdk.ts`) so the new chain shows up in the switcher:

```typescript
export const NETWORKS: NetworkInfo[] = [
  // ... existing chains
  { key: 'your_chain', name: 'Your Chain', chain: 'Your Chain', token: 'YRC', tag: 'MAINNET', color: '#E6007A', transport: 'smoldot light client' },
]
```

📖 For more details, see the [PAPI Codegen documentation](https://papi.how/codegen).

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [PAPI Documentation](https://papi.how/)
- [Polkadot Developer Portal](https://wiki.polkadot.network/)
