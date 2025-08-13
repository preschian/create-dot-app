# Nuxt PAPI Template

A modern **Nuxt 4 + TypeScript + Vite** template for building Polkadot decentralized applications (dApps) using the PAPI SDK.

## 🚀 Features

- **Nuxt 4** with `<script setup>` composition API
- **TypeScript** for type safety
- **PAPI SDK** integration for Polkadot blockchain interaction
- **TailwindCSS + DaisyUI** for beautiful UI components
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

# Preview production build
npm run preview
```

## 📁 Project Structure

```
app/
├── components/     # Vue components
├── composables/    # Vue composition functions
├── utils/          # Utility functions and SDK setup
├── descriptors/    # Chain descriptors
├── style.css       # Global styles
└── App.vue         # Main application component
```

Learn more about Vue 3 development in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
