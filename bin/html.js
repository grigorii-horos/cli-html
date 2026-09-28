#!/usr/bin/env node

import {
  applyOptions, loadConfig, OPTIONS_HELP, parseArgs, readInput, writeOutput,
} from '../lib/cli.js';
import { renderHTML } from '../index.js';

const usage = `Usage: html [file.html] [--config <path>] [--width <n>]

Render HTML to the terminal. Reads stdin when no file (or "-") is given.

${OPTIONS_HELP}`;

const options = parseArgs(process.argv.slice(2), usage);
const config = applyOptions(loadConfig('cli-html', options.configPath), options);

writeOutput(renderHTML(await readInput(options.inputPath), config));
