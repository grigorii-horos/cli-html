// @ts-nocheck
const  restrictedGlobals = require( 'confusing-browser-globals')

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  extends: [
    // Syntax and ~
    'eslint:recommended',
    'es/browser',
    'plugin:node/recommended',
    // 'plugin:react/recommended',
    'plugin:promise/recommended',
    'standard-jsdoc',
    'plugin:json/recommended',

    // Funny
    // 'plugin:you-dont-need-lodash-underscore/compatible',
    'plugin:unicorn/recommended',
    'plugin:security/recommended',
    // 'plugin:jquery/slim',

    // Global config
    'airbnb-base',
    // 'airbnb',
  ],
  plugins: [
    'json',
    // 'html',
    'no-loops',
    'unicorn',
    // 'dollar-sign',
    'async-await',
    'prefer-object-spread',
    'promise',
    'security',
    'simple-import-sort'
  ],
  env: {
    browser: true,
    es6: true
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  rules: {
    'unicorn/filename-case': 2,
    'unicorn/import-index': 0,
    'import/extensions': 0,
    'prefer-object-spread/prefer-object-spread': 2,
    'no-restricted-globals': ['error'].concat(restrictedGlobals),
    'sort-imports': 'off',
    'import/order': 'off',
    'simple-import-sort/sort': 'error'
  }
};
