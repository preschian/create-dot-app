# Create Dot App

A command-line interface (CLI) tool designed to streamline the development process for Polkadot-based decentralized applications (dApps).

## Features

### 🚀 Multiple Frontend Framework Support
- **React.js** - Single Page Application with Vite
- **Vue.js** - Single Page Application with Vite
- **Next.js** - React framework with SSR/SSG
- **Nuxt** - Vue framework with SSR/SSG

### 🔗 Dual SDK Integration Support
- **[PAPI](https://papi.how/)** - Polkadot API
- **[Dedot](https://docs.dedot.dev/)** - Developer-friendly Polkadot SDK

### 🔨 Smart Contract Support
- **Substrate Pallets** - Build with runtime modules
- **Solidity** - EVM-compatible smart contracts (Hardhat + Wagmi)
- **ink! v6** - WebAssembly-based smart contracts with RISC-V

### 📦 Package Manager Support
Compatible with npm, yarn, pnpm, bun, and deno

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

Follow the interactive prompts to:
1. Enter your project name
2. Choose your project type (Pallet, Solidity, or ink!)
3. Select your preferred template

### Non-Interactive Mode

Skip the prompts by providing options via CLI flags:

```bash
# Specify project name only
npx create-dot-app@latest my-dapp

# Specify project name and template
npx create-dot-app@latest my-dapp --template react-papi

# Full non-interactive mode
npx create-dot-app@latest my-dapp -t ink-v6/react-dedot
```

### CLI Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--template <template>` | `-t` | Specify template (see available templates below) |
| `--name <name>` | | Specify project name (can also be first positional arg) |
| `--help` | `-h` | Show help message |
| `--version` | `-v` | Show version number |

#### Available Templates

**Pallet Templates:**
- `next-dedot` - Next.js + Dedot
- `next-papi` - Next.js + PAPI
- `nuxt-dedot` - Nuxt + Dedot
- `nuxt-papi` - Nuxt + PAPI
- `react-dedot` - React + Dedot
- `react-papi` - React + PAPI
- `vue-dedot` - Vue + Dedot
- `vue-papi` - Vue + PAPI

**Solidity Templates:**
- `solidity-react` - Solidity + React (Hardhat + Wagmi)
- `solidity-vue` - Solidity + Vue (Hardhat + Wagmi)

**ink! Templates:**
- `ink-v6/react-dedot` - ink! React + Dedot
- `ink-v6/react-papi` - ink! React + PAPI
- `ink-v6/vue-dedot` - ink! Vue + Dedot
- `ink-v6/vue-papi` - ink! Vue + PAPI

## Quick Start

```bash
# Interactive mode
npx create-dot-app@latest

# Non-interactive with specific template
npx create-dot-app@latest my-dapp --template ink-v6/react-papi

# Navigate to project directory
cd my-dapp

# Install dependencies
npm install

# Start development server
npm run dev
```

## Privacy & Telemetry

This CLI collects anonymous usage data to help improve the tool. The data includes:
- Selected template type
- CLI version

**To disable telemetry**, set the environment variable:

```bash
export DISABLE_TELEMETRY=true
```

Or run with telemetry disabled:

```bash
DISABLE_TELEMETRY=true npx create-dot-app@latest
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
