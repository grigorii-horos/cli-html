#!/usr/bin/env node

import fs, { createReadStream } from 'node:fs';

import concat from 'concat-stream';
import envPaths from 'env-paths';
import { parse } from 'yaml';

import { renderMarkdown } from '../index.js';

const paths = envPaths('cli-markdown', {
  suffix: '',
});

const loadTheme = () => {
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

input.pipe(concat((markdown) => {
  process.stdout.write(renderMarkdown(markdown.toString(), theme));
}));
