import { camelCase } from 'change-case';
import terminalSize from 'term-size';

import { filterAst, getAttribute } from '../utils.js';
import { getMetaTags } from './get-meta-tags.js';
import { getTheme } from './get-theme.js';

export const getGlobalConfig = (document, customTheme) => {
  const theme = getTheme(customTheme);
  const config = {
    pre: false,
    lineWidth: Math.min(120, terminalSize().columns - 2),
    fontAttrs: true,
    theme,
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
