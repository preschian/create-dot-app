# Nuxt Dedot Template

A modern **Nuxt 3 + TypeScript** template for building Polkadot decentralized applications (dApps) using the Dedot SDK.

## 🚀 Features

- **Nuxt 3** with Vue 3 and `<script setup>` composition API
- **TypeScript** for type safety
- **Server-side rendering (SSR)** and static site generation
- **Dedot SDK** integration for Polkadot blockchain interaction
- **TailwindCSS + DaisyUI** for beautiful UI components
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

# Preview production build
npm run preview
```

## 📁 Project Structure

```
app/
├── components/     # Vue components
├── composables/    # Vue composition functions
├── utils/          # Utility functions and SDK setup
├── assets/css/     # Global styles
└── app.vue         # Main application component
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

- [Nuxt Documentation](https://nuxt.com/docs/getting-started/introduction)
- [Dedot Documentation](https://docs.dedot.dev/)
- [Polkadot Developer Portal](https://wiki.polkadot.network/)
