# E2E Testing Guide

This document describes the end-to-end testing setup for the Create Dot App CLI tool using Vitest and `node-pty`.

## Overview

The E2E tests use Vitest as the test runner and `node-pty` to spawn actual CLI processes and interact with them programmatically, simulating real user interactions. This allows us to test the complete user flow from start to finish.

## Test Coverage

The E2E test suite covers:

1. **CLI with Project Name Argument**: Tests running the CLI with a project name provided as a command-line argument
2. **CLI Interactive Mode**: Tests the interactive mode where the user is prompted for project name and template selection
3. **Error Handling**: Tests proper error handling when trying to create a project in an existing directory
4. **Template Navigation**: Tests arrow key navigation in template selection

## Features Tested

- ✅ Project creation with command-line argument
- ✅ Interactive project name input
- ✅ Template selection via arrow keys/enter
- ✅ File structure verification
- ✅ Package.json name update
- ✅ Error handling for existing directories
- ✅ Process exit codes
- ✅ Output validation
- ✅ Template navigation with arrow keys

## Running the Tests

```bash
# Navigate to CLI directory
cd cli

# Install dependencies (including vitest, node-pty, strip-ansi)
bun install

# Build the CLI
bun run build

# Run all E2E tests
bun run test

# Run tests in watch mode (for development)
bun run test:watch

# Or use the convenience script
./run-tests.sh
```

## Expected Output

```bash
✓ cli/__tests__/cli.e2e.test.ts (4)
  ✓ CLI E2E Tests with node-pty (4)
    ✓ creates project with command line argument
    ✓ creates project in interactive mode  
    ✓ handles existing directory error correctly
    ✓ can navigate template selection with arrow keys

Test Files  1 passed (1)
Tests  4 passed (4)
Start at 14:51:34
Duration  8.42s (transform 23ms, setup 0ms, collect 45ms, tests 8.35s)
```

## What Each Test Does

1. **creates project with command line argument**
   - Runs `create-dot-app my-project`
   - Automatically selects first template option
   - Verifies project files are created correctly

2. **creates project in interactive mode**
   - Runs `create-dot-app` without arguments
   - Responds to "What is your project name?" prompt
   - Selects template from menu
   - Verifies project creation

3. **handles existing directory error correctly**
   - Creates a directory first
   - Tries to create project with same name
   - Expects CLI to exit with error code 1
   - Verifies error message contains "already exists"

4. **can navigate template selection with arrow keys**
   - Uses arrow down keys to navigate template menu
   - Selects Vue + Dedot template (3rd option)
   - Verifies correct template was used (App.vue instead of App.tsx)

## How It Works

The tests use Vitest and `node-pty` to:

1. **Spawn CLI Process**: Creates a pseudoterminal and spawns the CLI process
2. **Simulate User Input**: Sends keystrokes and commands to the CLI as if a user was typing
3. **Capture Output**: Monitors all output from the CLI process using `strip-ansi` to clean ANSI codes
4. **Verify Results**: Uses Vitest assertions to check that files are created correctly and contain expected content
5. **Clean Up**: Automatically removes test directories after each test

## Test Structure

```typescript
describe('CLI E2E Tests with node-pty', () => {
  beforeEach(async () => {
    // Setup temporary test directory
  })
  
  afterEach(async () => {
    // Clean up test artifacts
  })
  
  it('creates project with command line argument', async () => {
    // Test implementation
  })
})
```

## Key Benefits

- **Real User Simulation**: Tests actual user interactions, not just unit functions
- **Complete Flow Testing**: Verifies the entire process from CLI invocation to project creation
- **Terminal Compatibility**: Ensures the CLI works correctly in different terminal environments
- **Error Scenario Coverage**: Tests both success and failure cases

## Dependencies

- `vitest`: Modern testing framework with TypeScript support
- `node-pty`: For creating pseudoterminals and spawning processes
- `strip-ansi`: For cleaning ANSI escape codes from terminal output
- `fs-extra`: For file system operations and cleanup

## Notes

- Tests run in isolated temporary directories to avoid conflicts
- Each test has a 30-second timeout to prevent hanging
- The CLI is built before running tests to ensure latest changes are tested
- All test artifacts are automatically cleaned up after each test using Vitest's `beforeEach`/`afterEach` hooks
- Tests use `strip-ansi` to handle colored terminal output consistently
- Vitest provides better test organization, parallel execution, and detailed reporting
