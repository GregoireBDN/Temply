import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/**
 * Dedicated test config: the app's `vite.config.ts` wires up TanStack Start +
 * Nitro (SSR) plugins that are unnecessary — and heavy — for component tests.
 * Here we only need the React plugin, a jsdom environment, and the `#/` / `@/`
 * path aliases the source uses.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@\//, replacement: path.resolve(import.meta.dirname, 'src') + '/' },
      { find: /^#\//, replacement: path.resolve(import.meta.dirname, 'src') + '/' },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
