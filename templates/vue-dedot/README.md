# Vue Dedot Template

A modern **Vue 3 + TypeScript + Vite** template for building Polkadot decentralized applications (dApps) using the Dedot SDK.

## 🚀 Features

- **Vue 3** with `<script setup>` composition API
- **TypeScript** for type safety
- **Dedot SDK** integration for Polkadot blockchain interaction
- **TailwindCSS + DaisyUI** for beautiful UI components
- **Wallet Connection** support via Talisman Connect
- **Iconify** icons integration
- Pre-configured for **multiple Polkadot chains**

## 🔗 SDK Information

This template uses **Dedot** - a Polkadot SDK for JavaScript/TypeScript that provides type-safe APIs for interacting with Polkadot-based blockchains.

📚 **Dedot Documentation**: https://docs.dedot.dev/

### Configuration Files:
- **`src/utils/sdk.ts`** - Configures which chains to connect to and manages chain endpoints. You can modify supported networks and RPC providers here.
- **`src/utils/sdk-interface.ts`** - Provides high-level functions for onchain SDK calls.

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
src/
├── components/     # Vue components
├── composables/    # Vue composition functions
├── utils/          # Utility functions and SDK setup
├── style.css       # Global styles
└── App.vue         # Main application component
```

Learn more about Vue 3 development in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
