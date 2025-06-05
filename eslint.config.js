import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import restrictedGlobals from 'confusing-browser-globals';
import jsonPlugin from 'eslint-plugin-json';
import unicornPlugin from 'eslint-plugin-unicorn';

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  js.configs.recommended,
  jsonPlugin.configs.recommended,
  unicornPlugin.configs["flat/recommended"],
  ...compat.extends(
    "standard-jsdoc"
    // 'airbnb-base'
  ),
  ...compat.plugins(
    "no-loops",
    "async-await",
    "prefer-object-spread",
    "simple-import-sort"
  ),
  ...compat.env({
    browser: true,
    es6: true,
  }),
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
      },
    },
    rules: {
      "prefer-object-spread/prefer-object-spread": 2,
      "no-restricted-globals": [2, ...restrictedGlobals],
      "mocha/handle-done-callback": 0,
      "mocha/no-global-tests": 0,
      "mocha/valid-test-description": 0,
      "import/extensions": 0,
      "import/prefer-default-export": 0,
      "import/no-cycle": 0,
      "unicorn/no-null": 0,
      "no-underscore-dangle": 0,
      "unicorn/no-array-reduce": 0,
      "unicorn/no-array-callback-reference": 0,
      "max-len": 0,
      "import/no-unresolved": 0,
      "jsdoc/require-returns-description": 0,
      "jsdoc/require-param-description": 0,
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      // "import/first": "error",
      // "import/newline-after-import": "error",
      // "import/no-duplicates": "error",
    },
  },
];
