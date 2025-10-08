# Next.js Dedot Template

A modern **Next.js 15 + TypeScript + React 19** template for building Polkadot decentralized applications (dApps) using the Dedot SDK.

## 🚀 Features

- **Next.js 15** with App Router and Turbopack
- **React 19** for modern UI development
- **TypeScript** for type safety
- **Dedot SDK** integration for Polkadot blockchain interaction
- **TailwindCSS 4 + DaisyUI** for beautiful UI components
- **Wallet Connection** support via Talisman Connect
- **Iconify** icons integration
- Pre-configured for **multiple Polkadot chains**

## 🔗 SDK Information

This template uses **Dedot** - a Polkadot SDK for JavaScript/TypeScript that provides type-safe APIs for interacting with Polkadot-based blockchains.

📚 **Dedot Documentation**: https://docs.dedot.dev/

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

To add more networks or change RPC providers, edit `app/utils/sdk.ts`:

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

You can add multiple RPC endpoints for fallback support:

```typescript
const CONFIG = {
  dot: {
    providers: [
      'wss://rpc.polkadot.io',
      'wss://polkadot-rpc.dwellir.com'
    ],
    apiType: {} as PolkadotApi,
  },
}
```

📖 For more details on connecting to networks, see the [Dedot documentation](https://docs.dedot.dev/getting-started/connect-to-network).

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Dedot Documentation](https://docs.dedot.dev/)
- [Polkadot Developer Portal](https://wiki.polkadot.network/)
