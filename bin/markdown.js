#!/usr/bin/env node

import {
  applyOptions, loadConfig, OPTIONS_HELP, parseArgs, readInput, writeOutput,
} from '../lib/cli.js';
import { renderMarkdown } from '../index.js';

const usage = `Usage: markdown [file.md] [--config <path>] [--width <n>]

Render Markdown to the terminal. Reads stdin when no file (or "-") is given.

${OPTIONS_HELP}`;

const options = parseArgs(process.argv.slice(2), usage);
const config = applyOptions(loadConfig('cli-markdown', options.configPath), options);

writeOutput(renderMarkdown(await readInput(options.inputPath), config));
