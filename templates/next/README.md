# create-dot-app — Next.js (Polkadot Hub)

A Next.js (App Router) starter for building dapps on **Polkadot Hub**. The first-run
home page is a live welcome screen — a real-time block watcher, a network switcher,
Connect Wallet, and a sample transaction — all wired up so you can confirm the stack
works the moment it boots.

Wallet connection is powered by **Web3Auth (MetaMask Embedded Wallets)** and on-chain
reads/writes by **[wagmi](https://wagmi.sh)**, pointed at the three Polkadot Hub EVM
networks: Passet Hub Testnet (PAS), Polkadot Hub (DOT), and Kusama Hub (KSM). The
provider is initialized in a `"use client"` component to stay compatible with the App
Router's server component architecture.

## Prerequisites

- Node.js 20+
- npm
- A Client ID from the [Web3Auth Dashboard](https://dashboard.web3auth.io)

## Setup

### 1. Install dependencies

Installs the Next.js app and the Hardhat workspace under `contracts/` (npm workspaces).

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your Client ID:

```
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=YOUR_CLIENT_ID
```

After deploying on testnet, set Flipper and Remark addresses in [`lib/contracts/addresses.ts`](lib/contracts/addresses.ts).

> `.env.example` ships a demo Sapphire Devnet Client ID for quick local testing.
> Use **Sapphire Devnet** (the default) for local development — Sapphire Mainnet does
> not allow localhost.

### 3. Run the application

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Where to start

Edit [`components/App.tsx`](components/App.tsx) — it composes the welcome screen and is
the natural place to start building your own UI. Styling uses **Tailwind CSS 4** utility
classes with theme tokens exposed as CSS variables (`--paper`, `--ink`, `--acc`, …) on the
welcome root. The pieces it pulls in live in [`components/welcome/`](components/welcome):

| File | Responsibility |
| --- | --- |
| `App.tsx` | Top bar, hero, features, side rail; owns theme + selected-network state |
| `welcome/LiveDemo.tsx` | Composes `BlockPanel` + `WritePanel` |
| `welcome/BlockPanel.tsx` | Live block watcher (`useBlock`) |
| `welcome/WritePanel.tsx` | Sample contract writes + transaction stepper |
| `welcome/WalletConnect.tsx` | Connect Wallet button + connected menu (Web3Auth + `useBalance`) |
| `welcome/NetworkSwitch.tsx` | Network selector (`useSwitchChain`) |
| `welcome/HeaderControls.tsx` | Accent picker + theme toggle |
| `welcome/{theme,networks,data,icons,format,useDismissible,PopoverPanel}` | Shared theme, data, UI primitives |
| `app/globals.css` | Tailwind CSS 4 entry + welcome animations |

Providers and chain config:

- [`components/provider.tsx`](components/provider.tsx) — Web3Auth + wagmi + React Query
- [`lib/chains/polkadot.ts`](lib/chains/polkadot.ts) — the three Polkadot Hub chain configs

## Smart contracts

The [`contracts/`](contracts/) directory is a [Hardhat](https://docs.polkadot.com/smart-contracts/dev-environments/hardhat/) workspace (`hardhat`) in the same npm monorepo as the app. See [`contracts/README.md`](contracts/README.md).

```bash
npm run compile:contracts
npm run test:contracts
npm run deploy:contracts   # requires PRIVATE_KEY — see contracts/README.md
```

## Scripts

```bash
npm run dev                # start the dev server
npm run build              # production build
npm run start              # serve the production build
npm run lint               # eslint (includes @typescript-eslint/no-deprecated for wagmi/viem APIs)
npm run compile:contracts  # compile Solidity and export ABIs to lib/contracts/
npm run test:contracts     # Hardhat tests
npm run deploy:contracts   # deploy Flipper + Remark to Polkadot Hub TestNet
```

`npm run lint` fails on wagmi symbols marked `@deprecated` in their types (for example `useAccount`, `switchChain`, `writeContract` on hook results). Use `useConnection`, `mutate` from `useSwitchChain` / `useWriteContract`, and similar replacements from the [wagmi migration guide](https://wagmi.sh/react/guides/migrate-from-v2-to-v3).

## Resources

- [Polkadot Smart Contracts docs](https://docs.polkadot.com/develop/smart-contracts/)
- [MetaMask Embedded Wallets / Web3Auth docs](https://docs.metamask.io/embedded-wallets/)
- [wagmi documentation](https://wagmi.sh)

## License

MIT
