#!/usr/bin/env node

import fs from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import process from 'node:process';
import vm from 'node:vm';

import {
  applyOptions, loadConfig, OPTIONS_HELP, parseArgs, writeOutput,
} from '../lib/cli.js';
import { renderJSX } from '../index.js';

const usage = `Usage: jsx <file.jsx> [--config <path>] [--width <n>]

Render a JSX file (default export: element or component) to the terminal.

${OPTIONS_HELP}`;

const options = parseArgs(process.argv.slice(2), usage);
const { inputPath } = options;

if (!inputPath) {
  console.error(usage);
  process.exit(2);
}

const jsxFile = resolve(process.cwd(), inputPath);

if (!fs.existsSync(jsxFile)) {
  console.error(`Input file not found: ${jsxFile}`);
  process.exit(1);
}

const theme = applyOptions(loadConfig('cli-html', options.configPath), options);

// Babel, react and react-dom are optional peer dependencies of cli-html
let babel;
try {
  ({ default: babel } = await import('@babel/core'));
} catch {
  console.error('The jsx command needs the optional peer dependencies: npm install @babel/core @babel/preset-env @babel/preset-react react react-dom');
  process.exit(1);
}

// react / react-dom and babel presets resolve next to cli-html (as its peers)
// or from the user's project; the user's own neighbouring modules resolve relative to the
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

try {
  writeOutput(await renderJSX(jsx, theme));
} catch (error) {
  console.error(`Failed to render JSX: ${error.message}`);
  process.exit(1);
}
