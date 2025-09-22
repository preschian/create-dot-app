# Solidity Hardhat + Wagmi Template

A comprehensive full-stack Web3 development template featuring Hardhat for smart contract development and modern frontend applications with Wagmi integration.

## Features

- **Smart Contract Development**: Hardhat with TypeScript and Polkadot integration
- **Dual Frontend Options**: React and Vue.js applications with Web3 connectivity
- **Modern Web3 Stack**: Wagmi, Viem, and TanStack Query for optimal DX
- **UI Components**: DaisyUI + Tailwind CSS for beautiful, responsive interfaces
- **Type Safety**: Full TypeScript support across all components
- **Development Tools**: ESLint configuration and automated contract verification

## Project Structure

```
├── hardhat/              # Smart contract development environment
│   ├── contracts/        # Solidity smart contracts
│   ├── scripts/          # Deployment and interaction scripts
│   └── ignition/         # Hardhat Ignition deployment modules
├── dapp-react/           # React frontend application
│   └── src/
│       ├── components/   # React components
│       └── config/       # Contract configurations
└── dapp-vue/             # Vue.js frontend application
    └── src/
        ├── components/   # Vue components
        └── config/       # Contract configurations
```

## Smart Contract

The template includes a **MessageBoard** contract that demonstrates:
- Message posting with sender tracking
- Circular buffer storage (last 8 messages)
- Message retrieval by sender or index
- Event emission for frontend integration
- Input validation and gas optimization

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### 1. Smart Contract Development

```bash
cd hardhat
npm install

# Deploy to Polkadot Asset Hub testnet
npm run deploy

# Interact with deployed contract
npm run interact

# Verify contract
npm run verify
```

### 2. React Frontend

```bash
cd dapp-react
npm install
npm run dev
```

### 3. Vue Frontend

```bash
cd dapp-vue
npm install
npm run dev
```

## Environment Setup

Create a `.env` file in the `hardhat` directory:

```env
PRIVATE_KEY=your_private_key_here
```

## Network Configuration

The template is pre-configured for:
- **Local Development**: Hardhat network with PolkaVM
- **Testnet**: Polkadot Asset Hub testnet

## Frontend Features

Both React and Vue applications include:

- **Wallet Connection**: Connect/disconnect Web3 wallets
- **Account Balance**: Display native token balance
- **Message Posting**: Submit messages to the smart contract
- **Message Display**: View recent messages with sender information
- **Responsive Design**: Mobile-friendly interface with DaisyUI components

## Available Scripts

### Hardhat
- `npm run deploy` - Deploy contracts to testnet
- `npm run interact` - Run interaction scripts
- `npm run verify` - Verify deployed contracts
- `npm run accounts` - Show account information
- `npm run lint` - Run ESLint

### Frontend (React/Vue)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

### Smart Contracts
- **Hardhat**: Development environment and testing framework
- **Solidity**: Smart contract programming language
- **Polkadot**: Target blockchain platform
- **TypeScript**: Type-safe development

### Frontend
- **React 19** / **Vue 3**: Modern frontend frameworks
- **Wagmi**: React/Vue hooks for Ethereum
- **Viem**: TypeScript interface for Ethereum
- **TanStack Query**: Data fetching and caching
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Component library for Tailwind CSS

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
