# Create Dot App

A command-line interface (CLI) tool designed to streamline the development process for Polkadot-based decentralized applications (dApps).

## Features

Choose the Polkadot stack you want to build with:

### ⚡ Solidity — `next`
- **Next.js** (App Router) with React 19 and Tailwind CSS
- **[Web3Auth](https://web3auth.io/)** social/embedded wallet login
- **[Wagmi](https://wagmi.sh/)** for EVM wallet and contract interactions
- **Solidity** smart contracts on Polkadot Hub (EVM)

### 🟣 Substrate (PAPI) — `next-papi`
- **Next.js** (App Router) with React 19 and Tailwind CSS
- **[PAPI](https://papi.how/)** (polkadot-api) for native Polkadot interaction
- **[smoldot](https://github.com/smol-dot/smoldot)** light client transport
- Connect Wallet plus a sample `system.remark` extrinsic, wired out of the box

### 🟣 Substrate (Dedot) — `next-dedot`
- **Next.js** (App Router) with React 19 and Tailwind CSS
- **[Dedot](https://dedot.dev/)** SDK for native Polkadot interaction
- Live block watcher, network switcher, Connect Wallet, and a sample `system.remark` extrinsic out of the box
- Light client transport opt-in (swap `WsProvider` for Dedot's `SmoldotProvider`)

### 📦 Package Manager Support
Compatible with npm, yarn, pnpm, and bun

### 📋 Planned Templates

- **Frontend Frameworks:** Svelte, SvelteKit, Solid, Remix
- **Backend Frameworks:** Hono, Elysia, Fastify, H3

*Want any specific UI or frontend framework such as Shadcn/UI, Chakra UI, or others? Let me know by opening an issue!*

## Usage

### Interactive Mode

Create a new Polkadot dApp project with interactive prompts:

```bash
npx create-dot-app@latest
```

Enter your project name when prompted, then pick a stack: **Solidity** (`next`), **Substrate (PAPI)** (`next-papi`), or **Substrate (Dedot)** (`next-dedot`).

### Non-Interactive Mode

Skip the prompts by providing options via CLI flags:

```bash
# Specify project name only (defaults to the next template)
npx create-dot-app@latest my-dapp

# Solidity dapp (Polkadot Hub EVM)
npx create-dot-app@latest my-dapp --template next

# Substrate dapp, PAPI SDK (Polkadot native)
npx create-dot-app@latest my-dapp --template next-papi

# Substrate dapp, Dedot SDK (Polkadot native)
npx create-dot-app@latest my-dapp --template next-dedot
```

### CLI Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--template <template>` | `-t` | Specify template (see available templates below) |
| `--name <name>` | | Specify project name (can also be first positional arg) |
| `--help` | `-h` | Show help message |
| `--version` | `-v` | Show version number |

#### Available Templates

- `next` - Solidity (Next.js + Web3Auth + Wagmi, Polkadot Hub EVM)
- `next-papi` - Substrate (Next.js + PAPI light client, Polkadot native)
- `next-dedot` - Substrate (Next.js + Dedot light client, Polkadot native)

## Quick Start

```bash
# Interactive mode (pick Solidity or Substrate)
npx create-dot-app@latest

# Non-interactive with a specific template
npx create-dot-app@latest my-dapp --template next         # Solidity
npx create-dot-app@latest my-dapp --template next-papi    # Substrate (PAPI)
npx create-dot-app@latest my-dapp --template next-dedot   # Substrate (Dedot)

# Navigate to project directory
cd my-dapp

# Install dependencies
npm install

# Start development server
npm run dev
```

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/preschian/create-dot-app.git
cd create-dot-app/cli

# Install dependencies
bun install

# Build the CLI
bun run build

# Run locally
node dist/index.js
```

### Testing

This CLI includes comprehensive E2E tests using Vitest and node-pty:

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch
```

For more details about testing, see [TESTING.md](./TESTING.md).

### CI/CD

The project uses GitHub Actions for continuous integration:
- **CLI E2E Tests**: Automated tests for all templates and features
- **Package Manager Tests**: Tests template installations with npm, yarn, pnpm, and bun
- **Automated Releases**: Publishes to npm on version tags

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

---

**Get started building your Polkadot dApp today! 🚀**
