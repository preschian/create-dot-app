# Contributing to Create Dot App

Thank you for your interest in contributing to Create Dot App! This project helps developers quickly bootstrap Polkadot-based decentralized applications with various frontend frameworks and SDK integrations.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Contributing Templates](#contributing-templates)
- [Submitting Changes](#submitting-changes)

- [Release Process](#release-process)
- [Code of Conduct](#code-of-conduct)

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- Node.js 18+ (for compatibility testing)
- Git

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/preschian/create-dot-app.git
cd create-dot-app

# Install dependencies
bun install

# Build the CLI
cd cli && bun run build

# Test the CLI locally
bun run test
```

## 🛠 Development Setup

### Repository Structure

This is a monorepo with the following structure:

```
create-dot-app/
├── cli/                    # Main CLI package
│   ├── src/               # CLI source code
│   ├── __tests__/         # E2E tests
│   └── package.json       # CLI package config
├── templates/             # Project templates
│   ├── react-papi/       # React + PAPI template
│   ├── react-dedot/      # React + Dedot template
│   ├── vue-papi/         # Vue + PAPI template
│   ├── vue-dedot/        # Vue + Dedot template
│   ├── nuxt-papi/        # Nuxt + PAPI template
│   └── nuxt-dedot/       # Nuxt + Dedot template
├── docs/                  # Documentation site
└── package.json          # Root package config
```

### Local Development

1. **CLI Development**:
   ```bash
   cd cli
   bun run dev  # Watch mode for development
   ```

2. **Testing Changes**:
   ```bash
   # Build and test
   bun run build
   bun run test
   
   # Test CLI manually
   node dist/index.js my-test-app
   ```

3. **Documentation Development**:
   ```bash
   cd docs
   bun run dev  # Start documentation server
   ```

## 📁 Project Structure

### CLI Source Code (`cli/src/`)

- `index.ts` - Main CLI entry point
- `template-selector.ts` - Interactive template selection logic
- `posthog.ts` - Anonymous telemetry (optional)

### Key Technologies

- **CLI Framework**: [@clack/prompts](https://github.com/natemoo-re/clack) for interactive prompts
- **File Operations**: [fs-extra](https://github.com/jprichardson/node-fs-extra)
- **Template Management**: [@begit/core](https://github.com/unjs/begit) for template cloning
- **Testing**: [Vitest](https://vitest.dev/) with [node-pty](https://github.com/microsoft/node-pty) for E2E tests
- **Build Tool**: [tsdown](https://github.com/sxzz/tsdown)

## 🔧 Making Changes

### Types of Contributions

1. **Bug Fixes** - Fix issues in existing functionality
2. **New Templates** - Add support for new frontend frameworks or SDKs
3. **CLI Improvements** - Enhance user experience or add features
4. **Documentation** - Improve guides, README, or inline documentation
5. **Testing** - Add or improve test coverage

### Development Workflow

1. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**:
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**:
   ```bash
   cd cli
   bun run build
   bun run test
   bun run lint
   ```

4. **Commit Your Changes**:
   ```bash
   git add .
   git commit -m "feat: add support for SvelteKit template"
   ```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

Examples:
```
feat: add Svelte template with PAPI integration
fix: resolve template selection navigation issue
docs: update contributing guidelines
test: add E2E test for error handling
```

## 🧪 Testing

### Test Types

1. **E2E Tests** (`cli/__tests__/cli.e2e.test.ts`):
   - Test complete user flows
   - Use `node-pty` to simulate real CLI interactions
   - Verify file creation and project structure

2. **Template Tests**:
   - Ensure all templates build successfully
   - Verify package.json configurations
   - Check for required dependencies

### Running Tests

```bash
# Run all tests
cd cli && bun run test

# Run tests in watch mode
bun run test:watch

# Run with coverage
bun run test --coverage

# Run specific test
bun run test --run cli.e2e.test.ts
```

### Writing Tests

When adding new features, include corresponding tests:

```typescript
it('should create project with new template', async () => {
  // Test implementation using node-pty
  // Verify expected files are created
  // Check package.json is updated correctly
})
```

## 🎨 Contributing Templates

### Template Requirements

Each template must include:

1. **Core Files**:
   - `package.json` with correct dependencies
   - `README.md` with setup instructions
   - `tsconfig.json` (for TypeScript projects)
   - Build configuration (`vite.config.ts`, `nuxt.config.ts`, etc.)

2. **Polkadot Integration**:
   - SDK setup (PAPI or Dedot)
   - Connection management
   - Basic wallet integration
   - Transaction handling examples

3. **Components** (recommended):
   - `Connect` - Wallet connection
   - `Balance` - Account balance display
   - `SignTransaction` - Transaction signing
   - `AccountCard` - Account information

### Adding a New Template

1. **Create Template Directory**:
   ```bash
   mkdir templates/framework-sdk
   # Example: templates/svelte-papi
   ```

2. **Implement Required Structure**:
   ```
   templates/your-template/
   ├── package.json
   ├── README.md
   ├── src/ (or app/ for Nuxt)
   ├── components/
   ├── utils/
   └── config files
   ```

3. **Update CLI Template List**:
   ```typescript
   // In cli/src/template-selector.ts
   const templates = [
     // ... existing templates
     {
       name: 'Framework + SDK',
       value: 'framework-sdk',
       description: 'Framework with SDK integration'
     }
   ]
   ```

4. **Add Template Tests**:
   ```typescript
   // Add test case in cli/__tests__/cli.e2e.test.ts
   it('creates project with new template', async () => {
     // Test template creation
   })
   ```

### Template Best Practices

- Use TypeScript for type safety
- Include error handling for SDK operations
- Provide clear component examples
- Follow framework-specific conventions
- Include proper ESLint configuration
- Use consistent styling approach
- Document SDK-specific setup steps

## 📝 Submitting Changes

### Pull Request Process

1. **Fork the Repository** (for external contributors)

2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make Your Changes** following the guidelines above

4. **Test Thoroughly**:
   ```bash
   bun run build
   bun run test
   bun run lint
   ```

5. **Update Documentation** if needed

6. **Submit Pull Request**:
   - Use a clear, descriptive title
   - Reference any related issues
   - Provide detailed description of changes
   - Include testing steps


## 📦 Release Process

### Version Management

We use [Changesets](https://github.com/changesets/changesets) for version management:

```bash
# Add a changeset
bun run changeset

# Version packages
bun run version-packages

# Release
bun run release
```

### Release Types

- **Patch** (1.0.1) - Bug fixes, small improvements
- **Minor** (1.1.0) - New features, new templates
- **Major** (2.0.0) - Breaking changes

## 🤝 Code of Conduct

### Our Standards

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Publishing private information without consent
- Any conduct that would be inappropriate in a professional setting

### Enforcement

Project maintainers are responsible for clarifying standards and will take appropriate corrective action in response to unacceptable behavior.

## ❓ Getting Help

### Community Support

- **GitHub Issues**: Report bugs or request features
- **GitHub Discussions**: Ask questions or share ideas
- **Documentation**: Check the [docs site](https://github.com/preschian/create-dot-app/tree/main/docs)

### Maintainer Contact

For sensitive issues or direct communication:
- **Email**: [Contact through GitHub profile](https://github.com/preschian)
- **GitHub**: [@preschian](https://github.com/preschian)

## 🙏 Recognition

Contributors will be recognized in:
- Project README
- Release notes for significant contributions
- GitHub contributor list

Thank you for contributing to Create Dot App! Your efforts help make Polkadot development more accessible to everyone. 🚀

---

*This contributing guide is a living document. Please suggest improvements through issues or pull requests.*
