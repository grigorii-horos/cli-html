import { camelCase } from 'change-case';
import terminalSize from "terminal-size";

import { filterAst, getAttribute } from '../utilities.js';
import { getMetaTags } from './get-meta-tags.js';
import { getTheme } from './get-theme.js';
import { getCachedTheme } from './theme-cache.js';

/**
 * Settings that a document may override with `<meta name="cli-render-*" content="...">`.
 * Each parser returns the parsed value, or undefined to ignore invalid content.
 */
const META_SETTINGS = {
  lineWidth: (content) => {
    const value = Number.parseInt(content, 10);
    return Number.isInteger(value) && value > 0 ? value : undefined;
  },
  asciiMode: (content) => {
    if (content === 'true') return true;
    if (content === 'false') return false;
    return undefined;
  },
};

export const getGlobalConfig = (document, customTheme) => {
  const theme = getCachedTheme(customTheme, getTheme);
  const maxLineWidth = customTheme?.lineWidth?.max ?? 120;
  const lineWidth = customTheme?.lineWidth?.value ?? Math.min(maxLineWidth, terminalSize().columns - 2);
  const asciiMode = customTheme?.asciiMode ?? false;

  const config = {
    pre: false,
    lineWidth,
    theme,
    depth: 0,
    asciiMode,
  };

  const metaTags = getMetaTags(document).map((metatag) => filterAst(metatag));

  for (const metaTag of metaTags) {
    const metaAttributeName = getAttribute(metaTag, 'name');
    if (!metaAttributeName?.startsWith('cli-render-')) continue;

    const key = camelCase(metaAttributeName.slice('cli-render-'.length));
    if (!Object.hasOwn(META_SETTINGS, key)) continue;

    const value = META_SETTINGS[key](getAttribute(metaTag, 'content', '').trim());
    if (value !== undefined) {
      config[key] = value;
    }
  }

  return config;
};
