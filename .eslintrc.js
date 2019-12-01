// @ts-nocheck
const restrictedGlobals = require('confusing-browser-globals');

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    // Syntax and ~
    'eslint:recommended',
    'es/browser',
    'plugin:node/recommended',
    // 'plugin:react/recommended',

    'plugin:ava/recommended',
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
    'no-restricted-globals': [2].concat(restrictedGlobals),

    'mocha/handle-done-callback': 0,
    'mocha/no-global-tests': 0,
    'mocha/valid-test-description': 0,
  },
};
