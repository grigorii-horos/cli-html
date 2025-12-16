import chalkString from 'chalk-string';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getCustomAttributes, applyCustomColor } from '../utilities.js';

export const abbr = inlineTag((value, tag, context) => {
  const title = getAttribute(tag, 'title', null);
  const custom = getCustomAttributes(tag);

  let abbrValue = applyCustomColor(custom.color, context.theme.abbr.color, value, chalkString);

  if (title) {
    const titleTheme = context.theme.abbr.title ?? {};

    const openParen = custom.title.prefix.marker ?? titleTheme.prefix?.marker ?? '(';

    const closeParen = custom.title.suffix.marker ?? titleTheme.suffix?.marker ?? ')';

    const prefixColorFunction = custom.title.prefix.color
      ? (text) => chalkString(custom.title.prefix.color, { colors: true })(text)
      : titleTheme.prefix?.color ?? ((text) => text);
    const suffixColorFunction = custom.title.suffix.color
      ? (text) => chalkString(custom.title.suffix.color, { colors: true })(text)
      : titleTheme.suffix?.color ?? ((text) => text);

    const styledOpenParen = prefixColorFunction(openParen);
    const styledCloseParen = suffixColorFunction(closeParen);

    // Apply title-specific prefix/suffix if provided
    // Apply title-specific color or fallback to theme
    const styledTitle = applyCustomColor(custom.title.color, context.theme.abbr.title.color, title, chalkString);

    abbrValue = `${abbrValue} ${styledOpenParen}${styledTitle}${styledCloseParen}`;
  }

  return abbrValue;
});

export const dfn = inlineTag((value, tag, context) => {
  const title = getAttribute(tag, 'title', null);
  const custom = getCustomAttributes(tag);

  let dfnValue = applyCustomColor(custom.color, context.theme.dfn.color, value, chalkString);

  if (title) {
    const titleTheme = context.theme.dfn.title ?? {};

    const openParen = custom.title.prefix.marker ?? titleTheme.prefix?.marker ?? '(';

    const closeParen = custom.title.suffix.marker ?? titleTheme.suffix?.marker ?? ')';

    const prefixColorFunction = custom.title.prefix.color
      ? (text) => chalkString(custom.title.prefix.color, { colors: true })(text)
      : titleTheme.prefix?.color ?? ((text) => text);
    const suffixColorFunction = custom.title.suffix.color
      ? (text) => chalkString(custom.title.suffix.color, { colors: true })(text)
      : titleTheme.suffix?.color ?? ((text) => text);

    const styledOpenParen = prefixColorFunction(openParen);
    const styledCloseParen = suffixColorFunction(closeParen);

    // Apply title-specific prefix/suffix if provided
    // Apply title-specific color or fallback to theme
    const styledTitle = applyCustomColor(custom.title.color, titleTheme.color, title, chalkString);

    dfnValue = `${dfnValue} ${styledOpenParen}${styledTitle}${styledCloseParen}`;
  }

  return dfnValue;
});

export const acronym = abbr;
