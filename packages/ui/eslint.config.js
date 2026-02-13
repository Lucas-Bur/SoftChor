/**
 * UI package ESLint Flat Config (ESM)
 * Extends the shared React ESLint config from @repo/eslint-config
 */

import reactConfig from '@repo/eslint-config/react'

export default [
  ...reactConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]
