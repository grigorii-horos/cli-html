import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';

export const abbr = inlineTag((value, tag, context) => {
  const title = getAttribute(tag, 'title', null);

  let abbrValue = applyThemeColor(getAttr(tag, 'color'), context.theme.abbr.color, value);

  if (title) {
    const titleTheme = context.theme.abbr.title ?? {};

    const openParen = getAttr(tag, 'title.prefix.marker') ?? titleTheme.prefix?.marker;

    const closeParen = getAttr(tag, 'title.suffix.marker') ?? titleTheme.suffix?.marker;

    const styledOpenParen = applyThemeColor(getAttr(tag, 'title.prefix.color'), titleTheme.prefix?.color, openParen);
    const styledCloseParen = applyThemeColor(getAttr(tag, 'title.suffix.color'), titleTheme.suffix?.color, closeParen);

    // Apply title-specific prefix/suffix if provided
    // Apply title-specific color or fallback to theme
    const styledTitle = applyThemeColor(getAttr(tag, 'title.color'), titleTheme.color, title);

    abbrValue = `${abbrValue} ${styledOpenParen}${styledTitle}${styledCloseParen}`;
  }

  return abbrValue;
});

export const dfn = inlineTag((value, tag, context) => {
  const title = getAttribute(tag, 'title', null);

  let dfnValue = applyThemeColor(getAttr(tag, 'color'), context.theme.dfn.color, value);

  if (title) {
    const titleTheme = context.theme.dfn.title ?? {};

    const openParen = getAttr(tag, 'title.prefix.marker') ?? titleTheme.prefix?.marker;

    const closeParen = getAttr(tag, 'title.suffix.marker') ?? titleTheme.suffix?.marker;

    const styledOpenParen = applyThemeColor(getAttr(tag, 'title.prefix.color'), titleTheme.prefix?.color, openParen);
    const styledCloseParen = applyThemeColor(getAttr(tag, 'title.suffix.color'), titleTheme.suffix?.color, closeParen);

    // Apply title-specific prefix/suffix if provided
    // Apply title-specific color or fallback to theme
    const styledTitle = applyThemeColor(getAttr(tag, 'title.color'), titleTheme.color, title);

    dfnValue = `${dfnValue} ${styledOpenParen}${styledTitle}${styledCloseParen}`;
  }

  return dfnValue;
});

export const acronym = abbr;
