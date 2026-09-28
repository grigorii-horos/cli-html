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

/** Help text for the options shared by every command */
export const OPTIONS_HELP = `Options:
  --config <path>  Use this config file instead of the one in the config directory
  --width <n>      Line width in columns (default: terminal width, at most lineWidth.max)
  -h, --help       Show this help`;

const OPTIONS_WITH_VALUE = new Set(['--config', '--width']);

const parseWidth = (value, usage) => {
  const width = Number(value);
  if (!Number.isInteger(width) || width < 1) {
    fail(`Invalid value for --width: ${value} (expected a positive integer)\n\n${usage}`, 2);
  }
  return width;
};

/**
 * Parse CLI arguments: `[file] [--config <path>] [--width <n>] [--help]`. A `-` file means stdin.
 * @param {string[]} argv - Arguments without the node binary and script path
 * @param {string} usage - Usage text printed for --help and on errors
 * @returns {{inputPath: string | null, configPath: string | null, width: number | null}} - Parsed arguments
 */
export const parseArgs = (argv, usage) => {
  let inputPath = null;
  const values = {};

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    const [name, inlineValue] = argument.startsWith('--') ? argument.split(/=(.*)/s) : [argument];

    if (argument === '-h' || argument === '--help') {
      console.log(usage);
      process.exit(0);
    } else if (OPTIONS_WITH_VALUE.has(name)) {
      if (inlineValue === undefined && index + 1 >= argv.length) {
        fail(`Missing value for ${name}\n\n${usage}`, 2);
      }
      values[name] = inlineValue ?? argv[++index];
    } else if (IGNORED_OPTIONS.has(argument)) {
      console.error(`Warning: ${argument} is not supported and is ignored`);
    } else if (argument.startsWith('-') && argument !== '-') {
      fail(`Unknown option: ${argument}\n\n${usage}`, 2);
    } else if (inputPath) {
      fail(`Unexpected argument: ${argument}\n\n${usage}`, 2);
    } else {
      inputPath = argument;
    }
  }

  return {
    inputPath: inputPath === '-' ? null : inputPath,
    configPath: values['--config'] ?? null,
    width: values['--width'] === undefined ? null : parseWidth(values['--width'], usage),
  };
};

/**
 * Apply command line overrides on top of the loaded config.
 * @param {object} config - Config from loadConfig()
 * @param {{width: number | null}} options - Parsed arguments
 * @returns {object} - Config to pass to the renderer
 */
export const applyOptions = (config, { width }) => (width
  ? { ...config, lineWidth: { ...config.lineWidth, value: width } }
  : config);

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
