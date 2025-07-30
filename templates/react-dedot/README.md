# React Dedot Template

A modern **React + TypeScript + Vite** template for building Polkadot decentralized applications (dApps) using the Dedot SDK.

## 🚀 Features

- **React** with TypeScript support
- **Vite** for fast development and building
- **Dedot SDK** integration for Polkadot blockchain interaction
- **TailwindCSS + DaisyUI** for beautiful UI components
- **Wallet Connection** support via Talisman Connect
- **XState Store** for state management
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
├── components/     # React components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions and SDK setup
├── style.css       # Global styles
└── App.tsx         # Main application component
```

Learn more about React development in the [React Documentation](https://react.dev/).
