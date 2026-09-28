import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import YAML from 'yaml';
import { deepMerge } from '../core/merge.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '../../config.yaml');
const BASE = (YAML.parse(readFileSync(configPath, 'utf8'))).theme ?? {};

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * Expand color shorthands (`h1: "red bold"`) into `{ color: "red bold" }`
 * wherever the base theme expects an object with a `color` key, so the
 * shorthand overrides only the color instead of wiping out markers and other settings.
 * @param {object} base - Base theme section
 * @param {object} custom - User theme section
 * @returns {object} - Normalized user theme section
 */
const expandColorShorthands = (base, custom) => {
  if (!isPlainObject(base) || !isPlainObject(custom)) return custom;

  const result = {};
  for (const [key, value] of Object.entries(custom)) {
    const baseValue = base[key];
    if ((typeof value === 'string' || typeof value === 'function') && isPlainObject(baseValue) && 'color' in baseValue) {
      result[key] = { color: value };
    } else if (isPlainObject(value)) {
      result[key] = expandColorShorthands(baseValue, value);
    } else {
      result[key] = value;
    }
  }
  return result;
};

export const getTheme = (customInput = {}) => {
  const custom = customInput?.theme ?? customInput ?? {};
  return deepMerge(BASE, expandColorShorthands(BASE, custom));
};
