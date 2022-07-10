#!/usr/bin/env node

import concat from 'concat-stream';
import { createReadStream } from 'node:fs';

import cliHtml from '../index.js';

const input = process.argv.length > 2
  ? createReadStream(process.argv[2])
  : process.stdin;

input.pipe(concat((html) => {
  process.stdout.write(cliHtml(html.toString()));
}));
