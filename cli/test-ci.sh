#!/bin/bash

# CLI E2E Tests - CI Simulation
echo "🧪 Simulating GitHub Actions CLI E2E Tests"
echo "=========================================="

# Set environment variables like CI would
export CI=true
export FORCE_COLOR=0

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ bun is not installed. Please install bun first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
if ! bun install; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Lint code
echo "🔍 Linting code..."
if ! bun run lint; then
    echo "❌ Linting failed"
    exit 1
fi

# Build CLI
echo "🔨 Building CLI..."
if ! bun run build; then
    echo "❌ Build failed"
    exit 1
fi

# Run E2E tests
echo "🧪 Running E2E tests..."
if ! bun run test; then
    echo "❌ Tests failed"
    exit 1
fi

echo "✅ All CI steps completed successfully!"
echo "🎉 Ready for GitHub Actions!"
