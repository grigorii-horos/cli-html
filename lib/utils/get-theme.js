import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import YAML from 'yaml';
import { deepMerge } from '../core/merge.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '../../config.yaml');
const BASE = (YAML.parse(readFileSync(configPath, 'utf8'))).theme ?? {};

export const getTheme = (customInput = {}) => {
  const custom = customInput?.theme ?? customInput ?? {};
  return deepMerge(BASE, custom);
};
