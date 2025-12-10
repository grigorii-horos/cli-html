import chalkString from 'chalk-string';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getCustomAttributes, applyCustomColor, getAttribute } from '../utilities.js';

const noStyle = inlineTag();

export const q = inlineTag((value) => `"${value}"`);

const createStyledTag = (themeKey) => inlineTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  const styledValue = applyCustomColor(custom.color, context.theme[themeKey].color, value, chalkString);
  return styledValue;
});

// Tags with prefix/suffix support
const createStyledTagWithMarkers = (themeKey) => (tag, context) => {
  const custom = getCustomAttributes(tag);
  const theme = context.theme[themeKey] || {};

  // Get inner content first
  const innerResult = inlineTag()(tag, context);
  if (!innerResult) return null;

  const value = innerResult.value || '';
  const styledValue = applyCustomColor(custom.color, theme.color, value, chalkString);

  // Support for prefix/suffix from custom attributes or theme
  const prefix = custom.prefix !== null && custom.prefix !== undefined ? custom.prefix : (theme.prefix || '');
  const suffix = custom.suffix !== null && custom.suffix !== undefined ? custom.suffix : (theme.suffix || '');

  const prefixColor = custom.prefixColor || theme.prefixColor || '';
  const suffixColor = custom.suffixColor || theme.suffixColor || '';

  const styledPrefix = prefixColor && prefix ? chalkString(prefixColor, { colors: true })(prefix) : prefix;
  const styledSuffix = suffixColor && suffix ? chalkString(suffixColor, { colors: true })(suffix) : suffix;

  return {
    type: 'inline',
    nodeName: tag.nodeName,
    pre: styledPrefix || null,
    value: styledValue,
    post: styledSuffix || null,
  };
};

// Special kbd implementation with key support
export const kbd = inlineTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  const theme = context.theme.kbd || {};
  const key = theme.key || {};

  const styledValue = applyCustomColor(custom.color, theme.color, value, chalkString);

  // Check if key style is enabled
  const keyEnabled = key.enabled === true;
  if (!keyEnabled) {
    // Simple style without key processing
    const prefix = theme.prefix?.marker || '';
    const suffix = theme.suffix?.marker || '';
    const prefixColor = theme.prefix?.color || '';
    const suffixColor = theme.suffix?.color || '';

    const styledPrefix = prefixColor ? chalkString(prefixColor, { colors: true })(prefix) : prefix;
    const styledSuffix = suffixColor ? chalkString(suffixColor, { colors: true })(suffix) : suffix;

    return `${styledPrefix}${styledValue}${styledSuffix}`;
  }

  // Key style enabled - process keys
  const keyStyle = key.style || 'simple';
  const keySeparator = key.separator || '+';

  // Box style - wrap each key in brackets
  if (keyStyle === 'box') {
    const keys = value.split(keySeparator).map(k => k.trim());
    const openMarker = theme.prefix?.marker || '[ ';
    const closeMarker = theme.suffix?.marker || ' ]';
    const openColor = theme.prefix?.color;
    const closeColor = theme.suffix?.color;

    const styledKeys = keys.map(k => {
      const styledOpen = openColor ? chalkString(openColor, { colors: true })(openMarker) : openMarker;
      const styledClose = closeColor ? chalkString(closeColor, { colors: true })(closeMarker) : closeMarker;
      const styledKey = applyCustomColor(custom.color, theme.color, k, chalkString);
      return `${styledOpen}${styledKey}${styledClose}`;
    });

    return styledKeys.join(` ${keySeparator} `);
  }

  // Simple style with prefix/suffix
  const prefix = theme.prefix?.marker || '';
  const suffix = theme.suffix?.marker || '';
  const prefixColor = theme.prefix?.color || '';
  const suffixColor = theme.suffix?.color || '';

  const styledPrefix = prefixColor ? chalkString(prefixColor, { colors: true })(prefix) : prefix;
  const styledSuffix = suffixColor ? chalkString(suffixColor, { colors: true })(suffix) : suffix;

  return `${styledPrefix}${styledValue}${styledSuffix}`;
});

// Special del implementation with diff support
export const del = inlineTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  const theme = context.theme.del || {};
  const diff = theme.diff || {};

  const styledValue = applyCustomColor(custom.color, theme.color, value, chalkString);

  // Check if diff is enabled
  const diffEnabled = diff.enabled === true;
  if (!diffEnabled) {
    return styledValue;
  }

  // Diff style - show marker before text
  const diffStyle = diff.style || 'simple';
  const marker = diff.marker || '-';
  const markerColor = diff.color || 'red';

  if (diffStyle === 'git') {
    const styledMarker = chalkString(markerColor, { colors: true })(marker);
    return `${styledMarker} ${styledValue}`;
  }

  // Simple style - just styled value
  return styledValue;
});

// Special ins implementation with diff support
export const ins = inlineTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  const theme = context.theme.ins || {};
  const diff = theme.diff || {};

  const styledValue = applyCustomColor(custom.color, theme.color, value, chalkString);

  // Check if diff is enabled
  const diffEnabled = diff.enabled === true;
  if (!diffEnabled) {
    return styledValue;
  }

  // Diff style - show marker before text
  const diffStyle = diff.style || 'simple';
  const marker = diff.marker || '+';
  const markerColor = diff.color || 'green';

  if (diffStyle === 'git') {
    const styledMarker = chalkString(markerColor, { colors: true })(marker);
    return `${styledMarker} ${styledValue}`;
  }

  // Simple style - just styled value
  return styledValue;
});
export const italic = createStyledTag('italic');
export const strikethrough = createStyledTag('strike');
export const underline = createStyledTag('underline');
export const bold = createStyledTag('bold');
export const samp = createStyledTag('samp');
export const variableTag = createStyledTag('var'); // Keep export name for backward compatibility
export const mark = createStyledTag('mark');

export const b = bold;

export const s = strikethrough;
export const strike = strikethrough;

// eslint-disable-next-line unicorn/prevent-abbreviations
export const i = createStyledTag('i');
export const em = createStyledTag('em');
export const cite = createStyledTag('cite');
export const time = createStyledTag('time');

export const strong = bold;

export const u = underline;

const customInline = inlineTag((value, tag) => {
  const custom = getCustomAttributes(tag);
  return custom.color ? applyCustomColor(custom.color, null, value, chalkString) : value;
});

// Custom inline elements with prefix/suffix support
const customInlineWithMarkers = (themeKey) => (tag, context) => {
  const custom = getCustomAttributes(tag);
  const theme = context.theme[themeKey] || {};

  // Get inner content first
  const innerResult = inlineTag()(tag, context);
  if (!innerResult) return null;

  const value = innerResult.value || '';
  const styledValue = custom.color ? applyCustomColor(custom.color, theme.color, value, chalkString) : value;

  // Support for prefix/suffix from custom attributes or theme
  const prefix = custom.prefix !== null && custom.prefix !== undefined ? custom.prefix : (theme.prefix || '');
  const suffix = custom.suffix !== null && custom.suffix !== undefined ? custom.suffix : (theme.suffix || '');

  const prefixColor = custom.prefixColor || theme.prefixColor || '';
  const suffixColor = custom.suffixColor || theme.suffixColor || '';

  const styledPrefix = prefixColor && prefix ? chalkString(prefixColor, { colors: true })(prefix) : prefix;
  const styledSuffix = suffixColor && suffix ? chalkString(suffixColor, { colors: true })(suffix) : suffix;

  return {
    type: 'inline',
    nodeName: tag.nodeName,
    pre: styledPrefix || null,
    value: styledValue,
    post: styledSuffix || null,
  };
};

export const small = customInline;
export const big = customInline;
export const sub = customInline;
export const sup = customInline;
export const tt = customInline;
export const data = customInline;
export const wbr = customInline;
export const font = customInline;

// Bidirectional text
export const bdi = customInline; // Isolates text that might be formatted in a different direction
export const bdo = customInline; // Overrides text direction

// Obsolete tags (kept for compatibility)
export const nobr = customInline; // No line breaks
export const marquee = customInline; // Scrolling text (obsolete)
