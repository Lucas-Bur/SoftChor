import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { config as dotenvConfig } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ESM
const __dirname = dirname(fileURLToPath(import.meta.url))
const monorepoRoot = resolve(__dirname, '../../')

// Load .env from monorepo root into process.env for server-side code
// This is required because Vite's envDir only affects import.meta.env, not process.env
// In development, .env.local takes precedence over .env
dotenvConfig({ path: resolve(monorepoRoot, '.env') })
dotenvConfig({ path: resolve(monorepoRoot, '.env.local'), override: true })

const config = defineConfig({
  // Load .env files from monorepo root for import.meta.env
  envDir: '../..',
  server: {
    fs: {
      // Allow serving files from monorepo root (required for workspace packages)
      allow: ['../..'],
    },
  },
  plugins: [
    devtools(),
    // nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  ssr: {
    noExternal: [
      '@tanstack/start-server-core',
      '@tanstack/start-storage-context',
      '@tanstack/router-core',
      '@tanstack/react-router',
      '@tanstack/react-router-ssr-query',
    ],
    external: ['node:async_hooks', 'node:stream', 'node:stream/web'],
  },

  optimizeDeps: {
    exclude: ['node:async_hooks', 'node:stream', 'node:stream/web'],
  },

  build: {
    rollupOptions: {
      external: ['node:async_hooks', 'node:stream', 'node:stream/web'],
    },
  },
})

export default config
