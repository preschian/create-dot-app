# Next.js Dedot Template

A modern **Next.js 16 + TypeScript + React 19** template for building Polkadot decentralized applications (dApps) using the Dedot SDK. The first-run home page is a live welcome screen — a real-time block watcher, a network switcher, Connect Wallet, and a sample `system.remark` extrinsic — all wired up so you can confirm the stack works the moment it boots.

## 🚀 Features

- **Next.js 16** with App Router and Turbopack
- **React 19** for modern UI development
- **TypeScript** for type safety
- **Dedot SDK** integration for Polkadot blockchain interaction
- **Type-safe chaintypes** via `@dedot/chaintypes` — no code generation step required
- **TailwindCSS 4** styling with light/dark theme tokens and an accent picker
- **Wallet Connection** support via Talisman Connect
- Pre-configured for **multiple Polkadot chains**

## 🔗 SDK Information

This template uses **Dedot** - a lightweight, tree-shakable, type-safe SDK for interacting with Polkadot-based blockchains.

📚 **Dedot Documentation**: https://docs.dedot.dev/

### Connectivity

Chains connect through a remote RPC node over WebSocket (`WsProvider`). Each chain pulls its types from `@dedot/chaintypes`, so storage queries, constants, and extrinsics are fully typed with no code generation step. Prefer an in-browser light client? dedot also ships a `SmoldotProvider` (from `dedot/smoldot`) you can drop in to verify the chain yourself instead of trusting a single endpoint.

### Configuration Files:
- **`app/utils/sdk.ts`** - Configures which chains to connect to. Each chain points to an RPC endpoint; edit this file to add or remove supported networks (or switch a chain over to the smoldot light client).
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
├── hooks/          # dedot data hooks: use-connect, use-current-block, use-transaction
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
| `welcome/panels/WalletConnect.tsx` | Connect Wallet button + connected menu (balance via the RPC connection) |
| `welcome/panels/ConnectModal.tsx` | Talisman wallet + account picker |
| `welcome/panels/NetworkSwitch.tsx` | Network selector across the configured chains |
| `welcome/panels/HeaderControls.tsx` | Accent picker + theme toggle |
| `welcome/ui/{PopoverPanel,icons}` | Shared UI primitives (dropdown panel, icon set) |
| `welcome/{theme,networks,data,shared,format,useDismissible}` | Theme tokens, chain metadata, copy, and helpers |

## 🔧 Adding Custom Networks

### Step 1: Configure Your Chain

Dedot reads chain types from `@dedot/chaintypes`, so there is no descriptor generation step. Edit `app/utils/sdk.ts` to add your chain, pointing it at an RPC endpoint and the matching chaintypes interface:

```typescript
import type { YourChainApi } from '@dedot/chaintypes'

const CONFIG = {
  // ... existing chains
  your_chain: {
    providers: ['wss://your-rpc-endpoint.io'],
    apiType: {} as YourChainApi,
  },
}
```

If `@dedot/chaintypes` does not yet bundle types for your chain, you can generate them with the dedot CLI (`npx dedot chaintypes -w wss://your-rpc-endpoint.io`) or fall back to the generic `SubstrateApi` type.

### Step 2: Add it to the UI

The network switch, block watcher, and balance read each chain's display metadata from [`app/components/welcome/networks.ts`](app/components/welcome/networks.ts). Add a matching entry (keyed by the `CONFIG` key from `sdk.ts`) so the new chain shows up in the switcher:

```typescript
export const NETWORKS: NetworkInfo[] = [
  // ... existing chains
  { key: 'your_chain', name: 'Your Chain', chain: 'Your Chain', token: 'YRC', tag: 'MAINNET', color: '#E6007A', transport: 'your RPC' },
]
```

📖 For more details, see the [Dedot documentation](https://docs.dedot.dev/).

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Dedot Documentation](https://docs.dedot.dev/)
- [Polkadot Developer Portal](https://wiki.polkadot.network/)
