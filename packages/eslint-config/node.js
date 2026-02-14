/**
 * ESLint Flat Config - Node.js configuration (ESM)
 * Extends base configuration with Node.js-specific rules
 */

import prettierConfig from 'eslint-config-prettier'
import nPlugin from 'eslint-plugin-n'
import baseConfig from './index.js'
import { defineConfig } from 'eslint/config'

export default defineConfig(
  ...baseConfig,
  {
    name: 'softchor/node',
    plugins: {
      n: nPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'writable',
        global: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
      },
    },
    rules: {
      // Biome: noGlobalDir
      'n/file-name-in-lowercase': 'off',
      'n/no-unsupported-features/es-builtins': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
      'n/process-exit-as-throw': 'error',

      // Node.js best practices
      'n/prefer-global/buffer': 'off',
      'n/prefer-global/process': 'off',
      'n/prefer-global/text-encoder': 'off',
      'n/prefer-global/url-search-params': 'off',
      'n/prefer-global/url': 'off',

      // Async best practices
      'n/handle-callback-err': 'warn',

      // Security rules
      'n/no-path-concat': 'error',
      'n/no-sync': ['warn', { allowAtRootLevel: true }],
    },
  },
  prettierConfig
)
