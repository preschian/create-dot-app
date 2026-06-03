# Create Dot App

A command-line interface (CLI) tool designed to streamline the development process for Polkadot-based decentralized applications (dApps).

## Features

### ⚡ Next.js + Web3Auth Template
- **Next.js** (App Router) with React 19 and Tailwind CSS
- **[Web3Auth](https://web3auth.io/)** social/embedded wallet login
- **[Wagmi](https://wagmi.sh/)** for EVM wallet and contract interactions
- **Solidity** smart contracts via an integrated Hardhat workspace (Polkadot Hub)

### 📦 Package Manager Support
Compatible with npm and bun

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

Enter your project name when prompted. The Next.js template is currently selected automatically.

### Non-Interactive Mode

Skip the prompts by providing options via CLI flags:

```bash
# Specify project name only
npx create-dot-app@latest my-dapp

# Specify project name and template
npx create-dot-app@latest my-dapp --template next

# Full non-interactive mode
npx create-dot-app@latest my-dapp -t next
```

### CLI Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--template <template>` | `-t` | Specify template (see available templates below) |
| `--name <name>` | | Specify project name (can also be first positional arg) |
| `--help` | `-h` | Show help message |
| `--version` | `-v` | Show version number |

#### Available Templates

- `next` - Next.js (Web3Auth + Wagmi)

## Quick Start

```bash
# Interactive mode
npx create-dot-app@latest

# Non-interactive with specific template
npx create-dot-app@latest my-dapp --template next

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
- **Package Manager Tests**: Tests template installations with npm and bun
- **Automated Releases**: Publishes to npm on version tags

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

---

**Get started building your Polkadot dApp today! 🚀**
