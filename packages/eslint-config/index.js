/**
 * ESLint Flat Config - Base configuration (ESM)
 * Maps Biome recommended rules to ESLint equivalents
 */

import eslint from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

// Get the TypeScript recommended configs
const tsConfigs = tseslint.configs.recommended

export default [
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.ts',
      '**/routeTree.gen.ts',
      '**/pnpm-lock.yaml',
      '**/.output/**',
    ],
  },
  // Base ESLint recommended rules
  eslint.configs.recommended,
  // TypeScript recommended rules (spread)
  ...tsConfigs,
  // Custom rules configuration - includes both TypeScript and core ESLint rules
  // Note: In flat config, core ESLint rules are available without a plugin prefix
  // because eslint.configs.recommended already sets up the core plugin
  {
    name: 'softchor/base',
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // ===== TypeScript ESLint Rules =====
      // Biome: noUnusedVariables
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Biome: noExplicitAny (warn instead of error for flexibility)
      '@typescript-eslint/no-explicit-any': 'warn',

      // Biome: explicitFunctionReturnType (off for flexibility)
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Biome: explicitModuleBoundaryTypes (off for flexibility)
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Biome: noNonNullAssertion (warn instead of error)
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Biome: noEmptyInterfaces
      '@typescript-eslint/no-empty-interface': 'warn',

      // Biome: noRedeclare - turned off to allow declaration merging (const + type with same name)
      '@typescript-eslint/no-redeclare': 'off',

      // Biome: noShadow
      '@typescript-eslint/no-shadow': 'error',

      // Biome: useLiteralKeys
      '@typescript-eslint/dot-notation': 'error',

      // Biome: noExtraNonNullAssertion
      '@typescript-eslint/no-extra-non-null-assertion': 'error',

      // Biome: noMisleadingInstantiator
      '@typescript-eslint/no-misused-new': 'error',

      // Biome: noUnnecessaryTypeAssertion
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',

      // Biome: noUnnecessaryTypeConstraint
      '@typescript-eslint/no-unnecessary-type-constraint': 'warn',

      // Biome: noUnsafeDeclarationMerging
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',

      // Biome: noUnsafeMemberAccess
      '@typescript-eslint/no-unsafe-member-access': 'warn',

      // Biome: noUnsafeReturn
      '@typescript-eslint/no-unsafe-return': 'warn',

      // Biome: noUnsafeCall
      '@typescript-eslint/no-unsafe-call': 'warn',

      // Biome: noUnsafeAssignment
      '@typescript-eslint/no-unsafe-assignment': 'warn',

      // Biome: noUnusedPrivateClassMembers
      '@typescript-eslint/no-unused-private-class-members': 'error',

      // Biome: noUselessConstructor
      '@typescript-eslint/no-useless-constructor': 'error',

      // Biome: noUselessEmptyExport
      '@typescript-eslint/no-useless-empty-export': 'error',

      // Biome: useAsConstAssertion
      '@typescript-eslint/prefer-as-const': 'warn',

      // Biome: useEnumInitializers
      '@typescript-eslint/prefer-enum-initializers': 'warn',

      // Biome: useExportType
      '@typescript-eslint/consistent-type-exports': [
        'warn',
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],

      // Biome: useImportType
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', disallowTypeAnnotations: false },
      ],

      // Biome: useShorthandFunctionType
      '@typescript-eslint/prefer-function-type': 'warn',

      // Biome: useOptionalChain
      '@typescript-eslint/prefer-optional-chain': 'warn',

      // Biome: useNullishCoalescing
      '@typescript-eslint/prefer-nullish-coalescing': [
        'warn',
        { ignoreConditionalTests: true, ignoreMixedLogicalExpressions: true },
      ],

      // Additional TypeScript best practices
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // ===== Import Organization =====
      // Biome: organizeImports
      // Custom groups for better import organization:
      // 1. Side effect imports
      // 2. React/react-dom
      // 3. External packages
      // 4. Internal @repo/* packages
      // 5. Internal @/ alias imports
      // 6. Relative imports (parent → sibling → index)
      // 7. Type imports
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports
            ['^\\u0000'],
            // React and react-dom first
            ['^react$', '^react-dom$'],
            // External packages (anything that doesn't start with . or @)
            ['^(?!@|\\.)[^/]+'],
            // Internal @repo packages
            ['^@repo'],
            // Internal @/ alias imports
            ['^@/'],
            // Parent imports (../)
            ['^\\.\\.(?!/)'],
            // Sibling imports (./something)
            ['^\\./(?=.*/)'],
            // Index imports (./)
            ['^\\.'],
            // Type imports
            ['^.*\\u0000$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  // Prettier config (disables conflicting rules)
  prettierConfig,
]
