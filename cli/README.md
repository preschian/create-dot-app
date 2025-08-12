# Create Dot App

A command-line interface (CLI) tool designed to streamline the development process for Polkadot-based decentralized applications (dApps).

## Features

### 🚀 Multiple Frontend Framework Support
- **React.js**
- **Vue.js**

### 🔗 Dual SDK Integration Support
- **[PAPI](https://papi.how/)**
- **[Dedot](https://docs.dedot.dev/)**

### 📋 Planned Templates

- **Frontend Frameworks:** Next.js, Nuxt.js, Svelte, SvelteKit, Solid, Remix
- **Backend Frameworks:** Hono, Elysia, Fastify, H3

*Want any specific UI or frontend framework such as Shadcn/UI, Chakra UI, or others? Let me know by opening an issue!*

## Usage

Create a new Polkadot dApp project:

```bash
npx create-dot-app@latest
```

Follow the interactive prompts to:
1. Choose your preferred frontend framework
2. Select your SDK integration (PAPI or Dedot)

## Quick Start

```bash
# Create a new project
npx create-dot-app@latest my-dapp

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

# Or use the convenience script
./run-tests.sh
```

For more details about testing, see [TESTING.md](./TESTING.md).

### CI/CD

The project uses GitHub Actions for continuous integration:
- **CLI E2E Tests**: Runs on Ubuntu, macOS, and Windows with Node.js 18, 20, and 22
- **Package Manager Tests**: Tests template installations with different package managers
- **Automated Releases**: Publishes to npm on version tags

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

---

**Get started building your Polkadot dApp today! 🚀**
