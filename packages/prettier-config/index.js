/**
 * Prettier configuration
 * Matches Biome's formatting rules:
 * - indentStyle: "space" -> useTabs: false
 * - indentWidth: 2 -> tabWidth: 2
 * - quoteStyle: "single" -> singleQuote: true
 * - semicolons: "asNeeded" -> semi: false
 * - jsxQuoteStyle: "single" -> jsxSingleQuote: true
 */

/** @type {import('prettier').Config} */
const config = {
  useTabs: false,
  tabWidth: 2,
  singleQuote: true,
  semi: false,
  jsxSingleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  bracketSpacing: true,
  proseWrap: 'preserve',
}

export default config
