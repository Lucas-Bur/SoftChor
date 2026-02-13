/**
 * ESLint Flat Config - React configuration (ESM)
 * Extends base configuration with React-specific rules
 *
 * Note: This project uses React Compiler, which handles memoization automatically.
 * Rules like jsx-no-bind are disabled since the compiler optimizes these patterns.
 */

import prettierConfig from 'eslint-config-prettier'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import baseConfig from './index.js'

export default tseslint.config(
  ...baseConfig,
  // React Hooks recommended config (includes compiler-powered linting)
  reactHooksPlugin.configs.flat.recommended,
  {
    name: 'softchor/react',
    plugins: {
      react: reactPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Biome: useJsxKeyInIterable
      'react/jsx-key': 'error',

      // Biome: useFragmentSyntax
      'react/jsx-no-useless-fragment': 'warn',

      // Biome: noChildrenProp
      'react/no-children-prop': 'error',

      // Biome: noUnescapedEntities
      'react/no-unescaped-entities': 'error',

      // Biome: noUnusedClasses
      'react/no-unused-class-component-methods': 'warn',

      // Biome: noVoidElementsWithChildren
      'react/void-dom-elements-no-children': 'error',

      // Biome: useSelfClosingElements
      'react/self-closing-comp': 'error',

      // Biome: useJsxShorthandFragment
      'react/jsx-fragments': ['error', 'syntax'],

      // Biome: useJsxShorthandForProp
      'react/jsx-boolean-value': ['error', 'never'],

      // Biome: noRedundantAlt
      'jsx-a11y/alt-text': 'error',

      // Biome: noRedundantAria
      'jsx-a11y/no-redundant-roles': 'error',

      // Biome: noPositiveTabindex
      'jsx-a11y/no-noninteractive-tabindex': 'error',

      // Biome: noInteractiveElementToNoninteractiveRole
      'jsx-a11y/no-static-element-interactions': 'warn',

      // Biome: noNoninteractiveElementToInteractiveRole
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',

      // Biome: noDistractingElements
      'jsx-a11y/no-distracting-elements': 'error',

      // Biome: noAccessKey
      'jsx-a11y/no-access-key': 'error',

      // Biome: noAutofocus
      'jsx-a11y/no-autofocus': 'warn',

      // Biome: noAriaUnsupportedElements
      'jsx-a11y/aria-unsupported-elements': 'error',

      // Biome: noAriaHiddenOnFocusable
      'jsx-a11y/no-aria-hidden-on-focusable': 'error',

      // Biome: useButtonType
      'react/button-has-type': 'error',

      // Biome: useAnchorContent
      'jsx-a11y/anchor-has-content': 'error',

      // Biome: useAnchorIsValid
      'jsx-a11y/anchor-is-valid': 'error',

      // Biome: useValidLang
      'jsx-a11y/lang': 'error',

      // Biome: useIframeTitle
      'jsx-a11y/iframe-has-title': 'error',

      // Biome: useMediaCaption
      'jsx-a11y/media-has-caption': 'warn',

      // Biome: useImgAlt
      'jsx-a11y/img-redundant-alt': 'error',

      // Biome: useHtmlLang
      'jsx-a11y/html-has-lang': 'error',

      // React-specific overrides for modern React
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Using TypeScript instead
      'react/display-name': 'off', // Not always necessary
      'react/jsx-props-no-spreading': 'off', // Allow spreading for flexibility

      // DISABLED: React Compiler handles memoization automatically
      // The compiler optimizes inline functions and arrow functions in JSX props
      'react/jsx-no-bind': 'off',

      // React Hooks rules are configured via reactHooksPlugin.configs.flat.recommended
      // Override exhaustive-deps to warn instead of error for flexibility
      'react-hooks/exhaustive-deps': 'warn',

      // Accessibility rules
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
    },
  },
  prettierConfig
)
