import js from '@eslint/js';
import restrictedGlobals from 'confusing-browser-globals';
import asyncAwaitPlugin from 'eslint-plugin-async-await';
import importPlugin from 'eslint-plugin-import';
import jsonPlugin from 'eslint-plugin-json';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import nPlugin from 'eslint-plugin-n';
import noLoopsPlugin from 'eslint-plugin-no-loops';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import preferObjectSpreadPlugin from 'eslint-plugin-prefer-object-spread';
import promisePlugin from 'eslint-plugin-promise';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unicornPlugin from 'eslint-plugin-unicorn';

export default [
  js.configs.recommended,
  jsonPlugin.configs.recommended,
  unicornPlugin.configs["flat/recommended"],
  // importPlugin.configs.recommended,
  nPlugin.configs["flat/recommended"],
  // jsdocPlugin.configs.recommended,
  jsdocPlugin.configs["flat/recommended"],
  // promisePlugin.configs.recommended,
  {
    plugins: {
      asyncAwait: asyncAwaitPlugin,
      noLoops: noLoopsPlugin,
      perfectionist: perfectionistPlugin,
      preferObjectSpread: preferObjectSpreadPlugin,
      promise: promisePlugin,
      simpleImportSort: simpleImportSortPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
      },
    },
    rules: {
      // "prefer-object-spread/prefer-object-spread": "error",
      "no-restricted-globals": ["error", ...restrictedGlobals],
      "import/extensions": "off",
      "import/prefer-default-export": "off",
      "import/no-cycle": "off",
      "unicorn/no-null": "off",
      "no-underscore-dangle": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-array-callback-reference": "off",
      "max-len": "off",
      "import/no-unresolved": "off",
      // getAttr/attr naming is the project convention (see CLAUDE.md)
      "unicorn/prevent-abbreviations": ["error", {
        checkFilenames: false,
        replacements: {
          attr: false, attrs: false, str: false, val: false, len: false, src: false, pkg: false,
          args: false, params: false, fn: false, i: false,
        },
      }],
      // Style rules the codebase does not follow
      "unicorn/no-negated-condition": "off",
      "unicorn/prefer-ternary": "off",
      "unicorn/import-style": "off",
      // Matching ANSI escape sequences is what this project does
      "no-control-regex": "off",
      // "jsdoc/require-returns-description": "off",
      // "jsdoc/require-param-description": "off",
      // "simple-import-sort/imports": "error",
      // "simple-import-sort/exports": "error",
    },
  },
  {
    // CLI entry points report errors through exit codes
    files: ["bin/**/*.js", "lib/cli.js"],
    rules: {
      "n/no-process-exit": "off",
      "unicorn/no-process-exit": "off",
    },
  },
  {
    files: ["test/**/*.js"],
    rules: {
      // node:test is stable on every Node version in `engines`
      "n/no-unsupported-features/node-builtins": ["error", { ignores: ["test", "test.describe", "test.it"] }],
      "unicorn/consistent-function-scoping": "off",
    },
  },
];
