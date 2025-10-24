import process from 'node:process'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: process.env.CI ? 120_000 : 60_000, // Longer timeout in CI
    hookTimeout: process.env.CI ? 60_000 : 30_000,
    teardownTimeout: process.env.CI ? 60_000 : 30_000,
    environment: 'node',
    globals: true,
  },
})
