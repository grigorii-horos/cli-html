import fs from 'node:fs';
import process from 'node:process';

import envPaths from 'env-paths';
import { parse } from 'yaml';

const CONFIG_FILES = ['config.yaml', 'config.yml', 'theme.yml'];

// Documented in the past but never implemented; accepted so existing scripts keep working
const IGNORED_OPTIONS = new Set(['--streaming', '--verbose']);

const fail = (message, exitCode = 1) => {
  console.error(message);
  process.exit(exitCode);
};

const readConfigFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return fileContent.trim() ? parse(fileContent) || {} : {};
};

/**
 * Load the CLI config. The whole file is returned (not just its `theme:` key)
 * so top-level settings like `lineWidth` and `asciiMode` are kept.
 * @param {string} appName - Config directory name (e.g. 'cli-html')
 * @param {string | null} customConfigPath - Path passed via --config
 * @returns {object} - Parsed config
 */
export const loadConfig = (appName, customConfigPath) => {
  if (customConfigPath) {
    if (!fs.existsSync(customConfigPath)) {
      fail(`Config file not found: ${customConfigPath}`);
    }

    try {
      return readConfigFile(customConfigPath);
    } catch (error) {
      return fail(`Failed to read config: ${error.message}`);
    }
  }

  const configDirectory = envPaths(appName, { suffix: '' }).config;
  const configPath = CONFIG_FILES
    .map((file) => `${configDirectory}/${file}`)
    .find((filePath) => fs.existsSync(filePath));

  if (!configPath) {
    return {};
  }

  try {
    return readConfigFile(configPath);
  } catch (error) {
    console.error(`Failed to read config ${configPath}: ${error.message}`);
    return {};
  }
};

/**
 * Parse CLI arguments: `[file] [--config <path>] [--help]`. A `-` file means stdin.
 * @param {string[]} argv - Arguments without the node binary and script path
 * @param {string} usage - Usage text printed for --help and on errors
 * @returns {{inputPath: string | null, configPath: string | null}} - Parsed arguments
 */
export const parseArgs = (argv, usage) => {
  let inputPath = null;
  let configPath = null;

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];

    if (argument === '-h' || argument === '--help') {
      console.log(usage);
      process.exit(0);
    } else if (argument === '--config') {
      if (index + 1 >= argv.length) {
        fail(`Missing value for --config\n\n${usage}`, 2);
      }
      configPath = argv[++index];
    } else if (IGNORED_OPTIONS.has(argument)) {
      console.error(`Warning: ${argument} is not supported and is ignored`);
    } else if (argument.startsWith('--config=')) {
      configPath = argument.slice('--config='.length);
    } else if (argument.startsWith('-') && argument !== '-') {
      fail(`Unknown option: ${argument}\n\n${usage}`, 2);
    } else if (inputPath) {
      fail(`Unexpected argument: ${argument}\n\n${usage}`, 2);
    } else {
      inputPath = argument;
    }
  }

  return { inputPath: inputPath === '-' ? null : inputPath, configPath };
};

/**
 * Read the whole input file, or stdin when no path is given.
 * @param {string | null} inputPath - Input file path
 * @returns {Promise<string>} - Input contents
 */
export const readInput = async (inputPath) => {
  if (inputPath) {
    try {
      return await fs.promises.readFile(inputPath, 'utf8');
    } catch (error) {
      return fail(error.code === 'ENOENT'
        ? `Input file not found: ${inputPath}`
        : `Failed to read input file: ${error.message}`);
    }
  }

  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
};

/**
 * Write output to stdout, exiting quietly when the reader goes away
 * (e.g. `html page.html | head`).
 * @param {string} output - Rendered output
 */
export const writeOutput = (output) => {
  process.stdout.on('error', (error) => {
    if (error.code === 'EPIPE') {
      process.exit(0);
    }
    throw error;
  });
  process.stdout.write(output);
};
