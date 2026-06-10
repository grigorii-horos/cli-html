import chalkString from 'chalk-string';

const noColor =
  typeof process !== 'undefined' &&
  process.env.NO_COLOR !== undefined &&
  process.env.NO_COLOR !== '';

const forceColor =
  !noColor &&
  typeof process !== 'undefined' &&
  process.env.FORCE_COLOR &&
  process.env.FORCE_COLOR !== '0';

export const applyColor = (spec, text) => {
  const str = text == null ? '' : String(text);
  if (noColor || !spec || spec === 'null') return str;
  if (typeof spec === 'function') {
    try { return spec(str); } catch { return str; }
  }
  try {
    return chalkString(spec, forceColor ? { colors: true } : undefined)(str);
  } catch {
    return str;
  }
};

export const applyThemeColor = (customSpec, themeSpec, text) =>
  applyColor(customSpec ?? themeSpec, text);
