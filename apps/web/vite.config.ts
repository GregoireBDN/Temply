import path from 'node:path'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: [
      { find: /^@\//, replacement: path.resolve(import.meta.dirname, 'src') + '/' },
      { find: /^#\//, replacement: path.resolve(import.meta.dirname, 'src') + '/' },
    ],
  },
  // Bundle PostHog into the SSR build rather than externalising it, so the
  // provider resolves correctly during server rendering.
  ssr: {
    noExternal: ['@posthog/react', 'posthog-js'],
  },
  plugins: [
    devtools(),
    nitro(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
