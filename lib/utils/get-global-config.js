import { camelCase } from 'change-case';
import terminalSize from "terminal-size";

import { filterAst, getAttribute } from '../utilities.js';
import { getMetaTags } from './get-meta-tags.js';
import { getTheme } from './get-theme.js';
import { getCachedTheme } from './theme-cache.js';

export const getGlobalConfig = (document, customTheme) => {
  const theme = getCachedTheme(customTheme, getTheme);
  const maxLineWidth = customTheme?.lineWidth?.max ?? 120;
  const lineWidth = customTheme?.lineWidth?.value ?? Math.min(maxLineWidth, terminalSize().columns - 2);
  const asciiMode = customTheme?.asciiMode ?? false;

  const config = {
    pre: false,
    lineWidth,
    fontAttrs: true,
    theme,
    depth: 0,
    asciiMode,
  };

  const metaTags = getMetaTags(document).map((metatag) => filterAst(metatag));

  // eslint-disable-next-line unicorn/no-array-for-each
  metaTags.forEach((metaTag) => {
    let metaAttributeName = getAttribute(metaTag, 'name');

    if (metaAttributeName && metaAttributeName.startsWith('cli-render-')) {
      const metaAttributeValue = getAttribute(metaTag, 'content', 'false');

      metaAttributeName = camelCase(
        metaAttributeName.replace('cli-render-', ''),
      );

      config[metaAttributeName] = metaAttributeValue === 'true';
    }
  });

  return config;
};
