#!/usr/bin/env node

import fs from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import process from 'node:process';
import vm from 'node:vm';

import babel from '@babel/core';
import envPaths from 'env-paths';
import { parse } from 'yaml';

import { renderJSX } from '../index.js';

const paths = envPaths('cli-html', {
  suffix: '',
});

const loadTheme = (customConfigPath) => {
  // If custom config path is provided, use it
  if (customConfigPath) {
    if (!fs.existsSync(customConfigPath)) {
      console.error(`Config file not found: ${customConfigPath}`);
      process.exit(1);
    }

    try {
      const fileContent = fs.readFileSync(customConfigPath, 'utf8');
      const parsed = fileContent.trim() ? parse(fileContent) || {} : {};
      return parsed.theme || parsed;
    } catch (error) {
      console.error(`Failed to read config: ${error.message}`);
      process.exit(1);
    }
  }

  // Otherwise, look for config in standard locations
  const candidateFiles = ['config.yaml', 'config.yml', 'theme.yml'].map(
    (file) => `${paths.config}/${file}`,
  );

  const themePath = candidateFiles.find((filePath) => fs.existsSync(filePath));

  if (!themePath) {
    return {};
  }

  try {
    const fileContent = fs.readFileSync(themePath, 'utf8');
    const parsed = fileContent.trim() ? parse(fileContent) || {} : {};
    return parsed.theme || parsed;
  } catch (error) {
    console.error(`Failed to read config: ${error.message}`);
    return {};
  }
};

// Parse command line arguments
let inputPath = null;
let configPath = null;

for (let index = 2; index < process.argv.length; index++) {
  if (process.argv[index] === '--config' && index + 1 < process.argv.length) {
    configPath = process.argv[index + 1];
    index++; // Skip next argument
  } else if (!inputPath && !process.argv[index].startsWith('--')) {
    inputPath = process.argv[index];
  }
}

if (!inputPath) {
  console.error('Usage: jsx <file.jsx> [--config <path>]');
  process.exit(1);
}

const jsxFile = resolve(process.cwd(), inputPath);

if (!fs.existsSync(jsxFile)) {
  console.error(`Input file not found: ${jsxFile}`);
  process.exit(1);
}

const theme = loadTheme(configPath);

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
    process.stdout.write(output);
  })
  .catch((error) => {
    console.error(`Failed to render JSX: ${error.message}`);
    process.exit(1);
  });
