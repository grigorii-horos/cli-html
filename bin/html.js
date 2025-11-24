#!/usr/bin/env node

import fs, { createReadStream } from 'node:fs';

import concat from 'concat-stream';
import envPaths from 'env-paths';
import { parse } from 'yaml';

import cliHtml from '../index.js';

const paths = envPaths('cli-html', {
  suffix: '',
});

const loadTheme = () => {
  const themePath = `${paths.config}/theme.yml`;
  if (!fs.existsSync(themePath)) {
    return {};
  }

  try {
    const fileContent = fs.readFileSync(themePath, 'utf8');
    return fileContent.trim() ? parse(fileContent) || {} : {};
  } catch (error) {
    console.error(`Failed to read theme config: ${error.message}`);
    return {};
  }
};

const theme = loadTheme();

let input = process.stdin;
const inputPath = process.argv[2];

if (inputPath) {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  input = createReadStream(inputPath);
  input.on('error', (error) => {
    console.error(`Failed to read input file: ${error.message}`);
    process.exit(1);
  });
}

input.pipe(concat((html) => {
  process.stdout.write(cliHtml(html.toString(), theme));
}));
