import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 30_000 * 2,
    hookTimeout: 30_000,
    teardownTimeout: 30_000,
    environment: 'node',
    globals: true,
  },
})
