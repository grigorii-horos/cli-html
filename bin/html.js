#!/usr/bin/env node

import { loadConfig, parseArgs, readInput, writeOutput } from '../lib/cli.js';
import { renderHTML } from '../index.js';

const usage = `Usage: html [file.html] [--config <path>]

Render HTML to the terminal. Reads stdin when no file (or "-") is given.

Options:
  --config <path>  Use this config file instead of the one in the config directory
  -h, --help       Show this help`;

const { inputPath, configPath } = parseArgs(process.argv.slice(2), usage);
const config = loadConfig('cli-html', configPath);

writeOutput(renderHTML(await readInput(inputPath), config));
