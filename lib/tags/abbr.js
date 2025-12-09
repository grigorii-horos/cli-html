import chalkString from 'chalk-string';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getCustomAttributes, applyCustomColor } from '../utilities.js';

export const abbr = inlineTag((value, tag, context) => {
  const title = getAttribute(tag, 'title', null);
  const custom = getCustomAttributes(tag);

  let abbrValue = applyCustomColor(custom.color, context.theme.abbr.color, value, chalkString);

  if (title) {
    const titleTheme = context.theme.abbr.title ?? {};

    const openParen = custom.titlePrefixMarker ?? titleTheme.prefix?.marker ?? '(';

    const closeParen = custom.titleSuffixMarker ?? titleTheme.suffix?.marker ?? ')';

    const prefixColorFn = custom.titlePrefixColor
      ? (text) => chalkString(custom.titlePrefixColor, { colors: true })(text)
      : titleTheme.prefix?.color ?? ((text) => text);
    const suffixColorFn = custom.titleSuffixColor
      ? (text) => chalkString(custom.titleSuffixColor, { colors: true })(text)
      : titleTheme.suffix?.color ?? ((text) => text);

    const styledOpenParen = prefixColorFn(openParen);
    const styledCloseParen = suffixColorFn(closeParen);

    // Apply title-specific prefix/suffix if provided
    // Apply title-specific color or fallback to theme
    const styledTitle = applyCustomColor(custom.titleColor, context.theme.abbr.title.color, title, chalkString);

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

    const openParen = custom.titlePrefixMarker ?? titleTheme.prefix?.marker ?? '(';

    const closeParen = custom.titleSuffixMarker ?? titleTheme.suffix?.marker ?? ')';

    const prefixColorFn = custom.titlePrefixColor
      ? (text) => chalkString(custom.titlePrefixColor, { colors: true })(text)
      : titleTheme.prefix?.color ?? ((text) => text);
    const suffixColorFn = custom.titleSuffixColor
      ? (text) => chalkString(custom.titleSuffixColor, { colors: true })(text)
      : titleTheme.suffix?.color ?? ((text) => text);

    const styledOpenParen = prefixColorFn(openParen);
    const styledCloseParen = suffixColorFn(closeParen);

    // Apply title-specific prefix/suffix if provided
    // Apply title-specific color or fallback to theme
    const styledTitle = applyCustomColor(custom.titleColor, titleTheme.color, title, chalkString);

    dfnValue = `${dfnValue} ${styledOpenParen}${styledTitle}${styledCloseParen}`;
  }

  return dfnValue;
});

export const acronym = abbr;
