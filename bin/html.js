#!/usr/bin/env node

import { createReadStream } from 'node:fs';
import concat from 'concat-stream';

import cliHtml from '../index.js';

const input = process.argv.length > 2
  ? createReadStream(process.argv[2])
  : process.stdin;

input.pipe(concat((html) => {
  process.stdout.write(cliHtml(html.toString()));
}));
