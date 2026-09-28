#!/usr/bin/env node

import fs from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import process from 'node:process';
import vm from 'node:vm';

import babel from '@babel/core';

import { loadConfig, parseArgs, writeOutput } from '../lib/cli.js';
import { renderJSX } from '../index.js';

const usage = `Usage: jsx <file.jsx> [--config <path>]

Render a JSX file (default export: element or component) to the terminal.

Options:
  --config <path>  Use this config file instead of the one in the config directory
  -h, --help       Show this help`;

const { inputPath, configPath } = parseArgs(process.argv.slice(2), usage);

if (!inputPath) {
  console.error(usage);
  process.exit(2);
}

const jsxFile = resolve(process.cwd(), inputPath);

if (!fs.existsSync(jsxFile)) {
  console.error(`Input file not found: ${jsxFile}`);
  process.exit(1);
}

const theme = loadConfig('cli-html', configPath);

// react / react-dom and babel presets resolve from cli-html's own
// dependencies; the user's own neighbouring modules resolve relative to the
// source file.
const pkgRequire = createRequire(import.meta.url);
const fileRequire = createRequire(jsxFile);

// Resolve preset paths absolutely so babel finds them regardless of the
// current working directory (e.g. when invoked through a wrapper package).
const { code } = babel.transformFileSync(jsxFile, {
  babelrc: false,
  configFile: false,
  presets: [
    [pkgRequire.resolve('@babel/preset-env'), { targets: { node: 'current' } }],
    pkgRequire.resolve('@babel/preset-react'),
  ],
});

const smartRequire = (id) => {
  try {
    return fileRequire(id);
  } catch {
    return pkgRequire(id);
  }
};

const moduleObject = { exports: {} };

const run = vm.compileFunction(
  code,
  ['module', 'exports', 'require'],
  { filename: jsxFile },
);

run(moduleObject, moduleObject.exports, smartRequire);

const jsx = moduleObject.exports.default ?? moduleObject.exports;

renderJSX(jsx, theme)
  .then((output) => {
    writeOutput(output);
  })
  .catch((error) => {
    console.error(`Failed to render JSX: ${error.message}`);
    process.exit(1);
  });
