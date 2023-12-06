#!/usr/bin/env node

import fs, { createReadStream } from 'node:fs';

import concat from 'concat-stream';
import envPaths from 'env-paths';
import { parse } from 'yaml';

import cliHtml from '../index.js';

const paths = envPaths('cli-html', {
  suffix: '',
});
let fileContent = '';
try {
  fileContent = fs.readFileSync(`${paths.config}/theme.yml`, 'utf8');
} catch {}

const theme = parse(fileContent) || {};
const input = process.argv.length > 2
  ? createReadStream(process.argv[2])
  : process.stdin;

input.pipe(concat((html) => {
  process.stdout.write(cliHtml(html.toString(), theme));
}));
