import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';
import { getAttribute } from '../utilities.js';

export const q = inlineTag((value, tag, context) => {
  const theme = context.theme.q ?? {};

  const prefix = getAttr(tag, 'prefix.marker') ?? theme.prefix?.marker;
  const suffix = getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker;
  const styledPrefix = applyColor(getAttr(tag, 'prefix.color') ?? theme.prefix?.color, prefix);
  const styledSuffix = applyColor(getAttr(tag, 'suffix.color') ?? theme.suffix?.color, suffix);

  // cite attribute: when enabled, style text as external link using a.external config
  const citeEnabledRaw = getAttr(tag, 'cite.enabled');
  const showCite = citeEnabledRaw !== null
    ? citeEnabledRaw === 'true'
    : theme.cite?.enabled === true;

  const citeUrl = showCite ? getAttribute(tag, 'cite', null) : null;

  if (!citeUrl) {
    const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);
    return `${styledPrefix}${styledValue}${styledSuffix}`;
  }

  // Cite active: style quoted text as link, reuse a.external marker/position/spacing
  const aTheme = context.theme.a ?? {};
  const externalMarker = aTheme.external?.marker;
  const externalSpacing = aTheme.external?.spacing;
  const externalPosition = aTheme.external?.position;

  const citeColor = getAttr(tag, 'cite.color') ?? theme.cite?.color;
  const styledLinkText = applyColor(citeColor, value);
  const styledMarker = applyColor(citeColor, externalMarker);

  const linked = externalPosition === 'before'
    ? `${styledMarker}${externalSpacing}${styledLinkText}`
    : `${styledLinkText}${externalSpacing}${styledMarker}`;

  return `${styledPrefix}${linked}${styledSuffix}`;
});

const createStyledTag = (themeKey) => inlineTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme[themeKey]?.color, value),
);

// Tags with prefix/suffix support
const createStyledTagWithMarkers = (themeKey) => inlineTag((value, tag, context) => {
  const theme = context.theme[themeKey] || {};
  const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);
  const prefix = getAttr(tag, 'prefix.marker') ?? theme.prefix?.marker ?? '';
  const suffix = getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker ?? '';
  const styledPrefix = applyColor(getAttr(tag, 'prefix.color') ?? theme.prefix?.color, prefix);
  const styledSuffix = applyColor(getAttr(tag, 'suffix.color') ?? theme.suffix?.color, suffix);
  return `${styledPrefix}${styledValue}${styledSuffix}`;
});

// Special kbd implementation with key support
export const kbd = inlineTag((value, tag, context) => {
  const theme = context.theme.kbd || {};
  const key = theme.key || {};

  const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);

  // Check if key style is enabled
  const keyEnabled = key.enabled === true;
  if (!keyEnabled) {
    // Simple style without key processing
    const prefix = theme.prefix?.marker || '';
    const suffix = theme.suffix?.marker || '';
    const prefixColor = theme.prefix?.color || '';
    const suffixColor = theme.suffix?.color || '';

    const styledPrefix = applyColor(prefixColor, prefix);
    const styledSuffix = applyColor(suffixColor, suffix);

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
      const styledOpen = applyColor(openColor, openMarker);
      const styledClose = applyColor(closeColor, closeMarker);
      const styledKey = applyThemeColor(getAttr(tag, 'color'), theme.color, k);
      return `${styledOpen}${styledKey}${styledClose}`;
    });

    return styledKeys.join(` ${keySeparator} `);
  }

  // Simple style with prefix/suffix
  const prefix = theme.prefix?.marker || '';
  const suffix = theme.suffix?.marker || '';
  const prefixColor = theme.prefix?.color || '';
  const suffixColor = theme.suffix?.color || '';

  const styledPrefix = applyColor(prefixColor, prefix);
  const styledSuffix = applyColor(suffixColor, suffix);

  return `${styledPrefix}${styledValue}${styledSuffix}`;
});

// Special del implementation with diff support
export const del = inlineTag((value, tag, context) => {
  const theme = context.theme.del || {};
  const diff = theme.diff || {};

  const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);

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
    const styledMarker = applyColor(markerColor, marker);
    return `${styledMarker} ${styledValue}`;
  }

  // Simple style - just styled value
  return styledValue;
});

// Special ins implementation with diff support
export const ins = inlineTag((value, tag, context) => {
  const theme = context.theme.ins || {};
  const diff = theme.diff || {};

  const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);

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
    const styledMarker = applyColor(markerColor, marker);
    return `${styledMarker} ${styledValue}`;
  }

  // Simple style - just styled value
  return styledValue;
});
export const italic = createStyledTag('italic');
export const strikethrough = createStyledTag('strikethrough');
export const underline = createStyledTag('underline');
export const bold = createStyledTag('bold');
export const samp = createStyledTagWithMarkers('samp');
export const variableTag = createStyledTag('var'); // Keep export name for backward compatibility
export const mark = createStyledTag('mark');

export const b = bold;

export const s = strikethrough;
export const strike = strikethrough;

// eslint-disable-next-line unicorn/prevent-abbreviations
export const i = createStyledTag('i');
export const em = createStyledTag('em');
export const cite = createStyledTag('cite');
export const time = inlineTag((value, tag, context) => {
  const theme = context.theme.time || {};
  const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);

  const datetimeEnabledRaw = getAttr(tag, 'datetime.enabled');
  const showDatetime = datetimeEnabledRaw !== null
    ? datetimeEnabledRaw === 'true'
    : theme.datetime?.enabled === true;

  if (!showDatetime) return styledValue;

  const datetimeAttr = getAttribute(tag, 'datetime', null);
  if (!datetimeAttr) return styledValue;

  const dtTheme = theme.datetime ?? {};
  const prefix = getAttr(tag, 'datetime.prefix.marker') ?? dtTheme.prefix?.marker ?? '';
  const suffix = getAttr(tag, 'datetime.suffix.marker') ?? dtTheme.suffix?.marker ?? '';
  const styledDt = applyColor(getAttr(tag, 'datetime.color') ?? dtTheme.color, datetimeAttr);
  const styledPrefix = applyColor(getAttr(tag, 'datetime.prefix.color') ?? dtTheme.prefix?.color, prefix);
  const styledSuffix = applyColor(getAttr(tag, 'datetime.suffix.color') ?? dtTheme.suffix?.color, suffix);

  return `${styledValue}${styledPrefix}${styledDt}${styledSuffix}`;
});

export const strong = bold;

export const u = underline;

const customInline = inlineTag((value, tag) => {
  const color = getAttr(tag, 'color');
  return color ? applyColor(color, value) : value;
});

const customInlineWithMarkers = createStyledTagWithMarkers;

export const small = customInline;
export const big = customInline;
export const sub = customInlineWithMarkers('sub');
export const sup = customInlineWithMarkers('sup');
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
