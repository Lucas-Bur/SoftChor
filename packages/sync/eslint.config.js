/**
 * Sync package ESLint Flat Config (ESM)
 * Extends the shared Node ESLint config from @repo/eslint-config
 */

import nodeConfig from '@repo/eslint-config/node'

export default [
  ...nodeConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]
