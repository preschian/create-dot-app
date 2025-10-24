# React Dedot Template

A modern **React + TypeScript + Vite** template for building Polkadot decentralized applications (dApps) using the Dedot SDK.

## 🚀 Features

- **React** with TypeScript support
- **Vite** for fast development and building
- **Dedot SDK** integration for Polkadot blockchain interaction
- **Smart Contract Support** - Query and interact with ink! smart contracts
- **TailwindCSS + DaisyUI** for beautiful UI components
- **Wallet Connection** support via Talisman Connect
- **XState Store** for predictable state management
- **Iconify** icons integration
- Pre-configured for **multiple Polkadot chains**

## 🔗 SDK & Libraries

This template uses:

- **Dedot** - A Polkadot SDK for JavaScript/TypeScript that provides type-safe APIs for interacting with Polkadot-based blockchains.
  - 📚 **Documentation**: https://docs.dedot.dev/

- **XState Store** - Lightweight state management library for managing wallet connections and app state.
  - 📚 **Documentation**: https://stately.ai/docs/xstate-store

### Configuration Files:
- **`src/utils/sdk.ts`** - Configures which chains to connect to and manages chain endpoints. You can modify supported networks and RPC providers here.
- **`src/utils/contract-config.ts`** - Smart contract configuration and metadata.
- **`src/utils/formatters.ts`** - Utility functions for formatting data.
- **`src/hooks/useConnect.ts`** - Wallet connection state management using XState Store.

## 🌐 Supported Chains

The template comes pre-configured for:
- **Passet Hub** - Polkadot Asset Hub Testnet

## 🛠️ Getting Started

### Prerequisites

This template uses **ink! v6** smart contracts. You'll need Pop CLI with ink! v6 support to build and deploy contracts.

Install Pop CLI:

```bash
cargo install --git https://github.com/r0gue-io/pop-cli.git --branch v6.0.0-alpha.4 --locked
```

📖 For more details, see the [Getting Started with ink! v6 guide](https://learn.onpop.io/contracts/welcome/migrating-to-inkv6).

### Installation

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

## 📜 Smart Contract Development

This template includes a sample flipper contract in the `contract/` directory to help you get started.

### Building the Contract

```bash
# Build the smart contract
npm run build:contract
```

This will compile your ink! smart contract and generate the contract metadata at `contract/target/ink/flipper.json`.

### Deploying the Contract

```bash
# Deploy contract to Passet Hub testnet
npm run deploy:contract
```

This will deploy your contract using `pop` CLI with wallet integration.

### Generating Types

```bash
# Generate TypeScript types from contract metadata
npm run generate:contract

# Generate chain types from RPC endpoint
npm run generate:chain
```

The `generate:contract` command creates type-safe APIs in `src/generated/contract/` based on your contract's JSON metadata.

## 📁 Project Structure

```
contract/              # Sample ink! smart contract
├── Cargo.toml
├── lib.rs
└── target/ink/        # Built contract artifacts
    ├── flipper.json   # Contract metadata
    └── flipper.contract
src/
├── components/        # React components
│   ├── AccountCard.tsx
│   ├── Balance.tsx
│   ├── ContractData.tsx     # Smart contract query display
│   └── SignTransaction.tsx
├── hooks/             # Custom React hooks
│   ├── useConnect.ts         # Wallet connection with XState Store
│   ├── useContractQuery.ts  # Smart contract query logic
│   ├── useContractTransaction.ts
│   ├── useCurrentBlock.ts
│   └── useBalance.ts
├── generated/         # Auto-generated types from chains and contracts
├── utils/             # Utility functions and SDK setup
├── style.css          # Global styles
└── App.tsx            # Main application component
```

## 🔗 Smart Contract Integration

This template includes support for querying and interacting with ink! smart contracts using Dedot's contract API.

### Querying Contract Data

The template includes a `ContractData.tsx` component that demonstrates how to query smart contract state. See the implementation in:

- **`src/hooks/useContractQuery.ts`** - Contains the contract query logic
- **`src/components/ContractData.tsx`** - Displays the contract data in the UI

Example usage:

```typescript
import type { FlipperContractApi } from '~/generated/contract/flipper'
import { Contract } from 'dedot/contracts'
import contractMetadata from '../../../contract/target/ink/flipper.json'

const contract = new Contract<FlipperContractApi>(
  api,
  contractMetadata,
  CONTRACT_ADDRESS,
  { defaultCaller: address }
)

const result = await contract.query.get()
const value = result.data // boolean value from flipper contract
```

### Executing Contract Transactions

The template also includes a `SignTransaction.tsx` component for executing contract transactions:

- **`src/hooks/useContractTransaction.ts`** - Contains the contract transaction logic
- **`src/components/SignTransaction.tsx`** - UI for sending transactions

📖 For more details on smart contract integration, see the [Dedot Smart Contracts documentation](https://docs.dedot.dev/smart-contracts/queries).

## 🗄️ State Management

This template uses **XState Store** for managing wallet connection state across components. The store is defined in `src/hooks/useConnect.ts` and provides a centralized, predictable way to handle wallet connections.

### How it works:

```typescript
import { createStore } from '@xstate/store'
import { useSelector } from '@xstate/store/react'

// Create a global store
const walletStore = createStore({
  context: {
    selectedAccount: null,
    connectedWallet: null,
    listAccounts: [],
    isConnecting: null,
  },
  on: {
    setSelectedAccount: (context, event) => ({
      ...context,
      selectedAccount: event.account,
    }),
    // ... other transitions
  },
})

// Use in components
// eslint-disable-next-line react-hooks/rules-of-hooks
const selectedAccount = useSelector(walletStore, state => state.context.selectedAccount)
```

The `useConnect` hook wraps the store and provides convenient methods like `connect()`, `disconnect()`, and `selectAccount()` that can be used across any component in your app.

📖 Learn more about XState Store in the [official documentation](https://stately.ai/docs/xstate-store).

## 🔧 Adding Custom Networks

To add more networks or change RPC providers, edit `src/utils/sdk.ts`:

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

- [React Documentation](https://react.dev/)
- [Dedot Documentation](https://docs.dedot.dev/)
- [Polkadot Developer Portal](https://wiki.polkadot.network/)
