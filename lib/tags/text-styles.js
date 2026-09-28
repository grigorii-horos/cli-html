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

const isTrue = (attribute, themeValue) => (attribute === null ? themeValue === true : attribute === 'true');

// Special kbd implementation with key support
export const kbd = inlineTag((value, tag, context) => {
  const theme = context.theme.kbd || {};

  const prefix = applyColor(getAttr(tag, 'prefix.color') ?? theme.prefix?.color, getAttr(tag, 'prefix.marker') ?? theme.prefix?.marker ?? '');
  const suffix = applyColor(getAttr(tag, 'suffix.color') ?? theme.suffix?.color, getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker ?? '');
  const styleKey = (text) => applyThemeColor(getAttr(tag, 'color'), theme.color, text);

  // Setting a key style on the element enables key-by-key styling for it
  const keyStyle = getAttr(tag, 'key.style') ?? theme.key?.style;
  const keyEnabled = isTrue(getAttr(tag, 'key.enabled'), theme.key?.enabled) || getAttr(tag, 'key.style') !== null;

  // Box style - wrap each key: [ Ctrl ] + [ S ]
  if (keyEnabled && keyStyle === 'box') {
    const separator = getAttr(tag, 'key.separator') ?? theme.key?.separator;
    return value
      .split(separator)
      .map((key) => `${prefix}${styleKey(key.trim())}${suffix}`)
      .join(` ${separator.trim()} `);
  }

  return `${prefix}${styleKey(value)}${suffix}`;
});

// del/ins with an optional git-style diff marker
const createDiffTag = (name) => inlineTag((value, tag, context) => {
  const theme = context.theme[name] || {};
  const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);

  // Setting a diff style on the element enables the diff marker for it
  const diffStyle = getAttr(tag, 'diff.style') ?? theme.diff?.style;
  const diffEnabled = isTrue(getAttr(tag, 'diff.enabled'), theme.diff?.enabled) || getAttr(tag, 'diff.style') !== null;

  if (!diffEnabled || diffStyle !== 'git') {
    return styledValue;
  }

  const marker = getAttr(tag, 'diff.marker') ?? theme.diff?.marker;
  const markerColor = getAttr(tag, 'diff.color') ?? theme.diff?.color;
  return `${applyColor(markerColor, marker)} ${styledValue}`;
});

export const del = createDiffTag('del');
export const ins = createDiffTag('ins');

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
