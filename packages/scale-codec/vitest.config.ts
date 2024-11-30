import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['.tshy', '.tshy-build', 'dist', 'node_modules'],
    passWithNoTests: true,
  },
})
