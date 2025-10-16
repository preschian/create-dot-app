# Vue Dedot Template

A modern **Vue 3 + TypeScript + Vite** template for building Polkadot decentralized applications (dApps) using the Dedot SDK.

## 🚀 Features

- **Vue 3** with `<script setup>` composition API
- **TypeScript** for type safety
- **Dedot SDK** integration for Polkadot blockchain interaction
- **Smart Contract Support** - Query and interact with ink! smart contracts
- **TailwindCSS + DaisyUI** for beautiful UI components
- **Wallet Connection** support via Talisman Connect
- **Iconify** icons integration
- Pre-configured for **multiple Polkadot chains**

## 🔗 SDK Information

This template uses **Dedot** - a Polkadot SDK for JavaScript/TypeScript that provides type-safe APIs for interacting with Polkadot-based blockchains.

📚 **Dedot Documentation**: https://docs.dedot.dev/

### Configuration Files:
- **`src/utils/sdk.ts`** - Configures which chains to connect to and manages chain endpoints. You can modify supported networks and RPC providers here.
- **`src/utils/contract-config.ts`** - Smart contract configuration and metadata.
- **`src/utils/formatters.ts`** - Utility functions for formatting data.

## 🌐 Supported Chains

The template comes pre-configured for:
- **Passet Hub** - Polkadot Asset Hub Testnet

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
├── components/         # Vue components
│   ├── AccountCard.vue
│   ├── Balance.vue
│   ├── ContractData.vue     # Smart contract query display
│   └── SignTransaction.vue
├── composables/        # Vue composition functions
│   ├── useConnect.ts
│   ├── useContractQuery.ts  # Smart contract query logic
│   ├── useContractTransaction.ts
│   ├── useCurrentBlock.ts
│   └── useLocalStorage.ts
├── generated-types/    # Auto-generated types from chains and contracts
├── utils/              # Utility functions and SDK setup
├── style.css          # Global styles
└── App.vue            # Main application component
```

## 📜 Smart Contract Integration

This template includes support for querying ink! smart contracts using Dedot's contract API.

### Querying Contract Data

The template includes a `ContractData.vue` component that demonstrates how to query smart contract state. See the implementation in:

- **`src/composables/useContractQuery.ts`** - Contains the contract query logic
- **`src/components/ContractData.vue`** - Displays the contract data in the UI

Example usage:

```typescript
import type { FlipperContractApi } from '~/generated-types/contract/flipper'
import { Contract } from 'dedot/contracts'
import contractMetadata from '../../../contract/target/ink/contract.json'

const contract = new Contract<FlipperContractApi>(
  api,
  contractMetadata,
  CONTRACT_ADDRESS,
  { defaultCaller: address }
)

const result = await contract.query.get()
const value = result.data // boolean value from flipper contract
```

### Generating Contract Types

To generate TypeScript types from your ink! contract metadata:

```bash
npm run types:contract
```

This will generate type-safe APIs in `src/generated-types/contract/` based on your contract's JSON metadata.

📖 For more details on smart contract integration, see the [Dedot Smart Contracts documentation](https://docs.dedot.dev/smart-contracts/queries).

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

- [Vue 3 Documentation](https://vuejs.org/guide/typescript/overview.html#project-setup)
- [Dedot Documentation](https://docs.dedot.dev/)
- [Polkadot Developer Portal](https://wiki.polkadot.network/)
