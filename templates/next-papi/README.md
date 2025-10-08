# Next.js PAPI Template

A modern **Next.js 15 + TypeScript + React 19** template for building Polkadot decentralized applications (dApps) using the PAPI SDK.

## 🚀 Features

- **Next.js 15** with App Router and Turbopack
- **React 19** for modern UI development
- **TypeScript** for type safety
- **PAPI SDK** integration for Polkadot blockchain interaction
- **TailwindCSS 4 + DaisyUI** for beautiful UI components
- **Wallet Connection** support via Talisman Connect
- **Iconify** icons integration
- Pre-configured for **multiple Polkadot chains**

## 🔗 SDK Information

This template uses **PAPI (Polkadot API)** - a modern, type-safe SDK for interacting with Polkadot-based blockchains.

📚 **PAPI Documentation**: https://papi.how/

### Configuration Files:
- **`app/utils/sdk.ts`** - Configures which chains to connect to and manages chain endpoints. You can modify supported networks and RPC providers here.
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
├── components/     # React components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions and SDK setup
├── globals.css     # Global styles
├── layout.tsx      # Root layout component
└── page.tsx        # Main page component
```

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

This creates type-safe descriptors in `@polkadot-api/descriptors` that you can import.

### Step 2: Configure Your Chain

Edit `app/utils/sdk.ts` to add your chain configuration:

```typescript
import { yourChain } from '@polkadot-api/descriptors'

const CONFIG = {
  // ... existing chains
  your_chain: {
    descriptor: yourChain,
    providers: ['wss://your-rpc-endpoint.io'],
  },
}
```

You can add multiple RPC endpoints for fallback support:

```typescript
const CONFIG = {
  dot: {
    descriptor: polkadot,
    providers: [
      'wss://rpc.polkadot.io',
      'wss://polkadot-rpc.dwellir.com'
    ],
  },
}
```

📖 For more details, see the [PAPI Codegen documentation](https://papi.how/codegen).

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [PAPI Documentation](https://papi.how/)
- [Polkadot Developer Portal](https://wiki.polkadot.network/)
