// @ts-nocheck
const restrictedGlobals = require('confusing-browser-globals');

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: '2020',
    sourceType: 'module',
  },
  extends: [
    // Syntax and ~
    'eslint:recommended',
    'plugin:node/recommended',

    'standard-jsdoc',
    'plugin:json/recommended',

    // Funny
    'plugin:unicorn/recommended',

    // Global config
    'airbnb-base',
  ],
  plugins: [
    'json',
    'no-loops',
    'unicorn',
    'async-await',
    'prefer-object-spread',

    'simple-import-sort',
  ],
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    'prefer-object-spread/prefer-object-spread': 2,
    'no-restricted-globals': [2, ...restrictedGlobals],

    'mocha/handle-done-callback': 0,
    'mocha/no-global-tests': 0,
    'mocha/valid-test-description': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'import/no-cycle': 0,
    'unicorn/no-null': 0,
    'no-underscore-dangle': 0,
    'unicorn/no-array-reduce': 0,
    'unicorn/no-array-callback-reference': 0,
    'max-len': 0,
    'import/no-unresolved': 0,

    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
};
