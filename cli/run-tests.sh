#!/bin/bash

# Create Dot App - Integration Test Runner
echo "🧪 Create Dot App Integration Tests"
echo "=================================="

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ bun is not installed. Please install bun first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Build the CLI
echo "🔨 Building CLI..."
bun run build

# Run the E2E tests with Vitest
echo "🧪 Running E2E tests with Vitest..."
bun run test

echo "✅ Tests completed!"
