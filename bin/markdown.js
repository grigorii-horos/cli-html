#!/usr/bin/env node

import fs, { createReadStream } from 'node:fs';

import concat from 'concat-stream';
import envPaths from 'env-paths';
import { parse } from 'yaml';

import { renderMarkdown } from '../index.js';

const paths = envPaths('cli-markdown', {
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

const theme = loadTheme(configPath);

let input = process.stdin;

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
