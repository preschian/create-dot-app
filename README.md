# Create Dot App

[![CLI E2E Tests](https://github.com/preschian/create-dot-app/actions/workflows/cli-tests.yml/badge.svg)](https://github.com/preschian/create-dot-app/actions/workflows/cli-tests.yml)
[![Package Managers](https://github.com/preschian/create-dot-app/actions/workflows/package-managers.yml/badge.svg)](https://github.com/preschian/create-dot-app/actions/workflows/package-managers.yml)

A command-line interface (CLI) tool designed to streamline the development process for Polkadot-based decentralized applications (dApps).

## Features

### 🚀 Multiple Frontend Framework Support
- **React.js**
- **Vue.js**
- **Next.js**
- **Nuxt.js**

### 🔗 Dual SDK Integration Support
- **[PAPI](https://papi.how/)**
- **[Dedot](https://docs.dedot.dev/)**

### 📋 Planned Templates

- **Frontend Frameworks:** Svelte, SvelteKit, Solid, Remix
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

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Development setup
- How to add new templates
- Testing requirements
- Pull request process

Feel free to submit issues and pull requests!

---

**Get started building your Polkadot dApp today! 🚀**
