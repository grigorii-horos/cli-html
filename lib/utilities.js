import chalkString from 'chalk-string';
import { registerCache } from './utils/memory.js';

/**
 * Error logging utility with levels
 * Only logs when DEBUG environment variable is set
 */
const ErrorLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

/**
 * Log error with appropriate level
 * @param {string} level - Error level (debug, info, warn, error)
 * @param {string} context - Context where error occurred
 * @param {string} message - Error message
 * @param {Error|*} error - Error object or additional data
 */
const logError = (level, context, message, error = null) => {
  if (!process.env.DEBUG && level < ErrorLevel.WARN) {
    return; // Only log warnings and errors in production
  }

  const timestamp = new Date().toISOString();
  const prefix = `[cli-html ${timestamp}] [${level}] [${context}]`;

  if (error instanceof Error) {
    console.error(`${prefix} ${message}:`, error.message);
    if (process.env.DEBUG === 'verbose') {
      console.error(error.stack);
    }
  } else if (error) {
    console.error(`${prefix} ${message}:`, error);
  } else {
    console.error(`${prefix} ${message}`);
  }
};

/**
 * Helper functions for different log levels
 */
export const logger = {
  debug: (context, message, data) => logError('DEBUG', context, message, data),
  info: (context, message, data) => logError('INFO', context, message, data),
  warn: (context, message, data) => logError('WARN', context, message, data),
  error: (context, message, error) => logError('ERROR', context, message, error),
};

/**
 * Safe wrapper for functions that might throw
 * @param {Function} fn - Function to execute
 * @param {*} fallback - Fallback value on error
 * @param {string} context - Context for error logging
 * @returns {*} - Function result or fallback
 */
export const safeExecute = (fn, fallback, context = 'unknown') => {
  try {
    return fn();
  } catch (error) {
    logger.error(context, 'Function execution failed', error);
    return fallback;
  }
};

export const filterAst = (ast) => {
  const removeTheseKeys = new Set(['mode', 'namespaceURI', 'parentNode', 'tagName']);

  return Object.fromEntries(
    Object.entries(ast)
      .filter(([key]) => !removeTheseKeys.has(key))
      .map(([key, value]) => [key, Array.isArray(value) ? value.map(filterAst) : value]),
  );
};

export const filterAst2 = (ast) => {
  const removeTheseKeys = new Set([
    'mode',
    'namespaceURI',
    'parentNode',
    'tagName',
    'rawAttrs',
    'nodeType',
    'id',
    'classList',
  ]);

  return Object.fromEntries(
    Object.entries(ast)
      .filter(([key]) => !removeTheseKeys.has(key))
      .map(([key, value]) => [key, Array.isArray(value) ? value.map(filterAst2) : value]),
  );
};

/**
 * Cache for compiled regular expressions to avoid recreating them
 */
const regexCache = new Map();
registerCache(regexCache, 'utilities:regexCache');

/**
 * Get cached regex or create and cache new one
 * @param {string} pattern - Regex pattern
 * @param {string} flags - Regex flags
 * @returns {RegExp} - Compiled regex
 */
const getCachedRegex = (pattern, flags = '') => {
  const key = `${pattern}:${flags}`;
  if (!regexCache.has(key)) {
    regexCache.set(key, new RegExp(pattern, flags));
  }
  return regexCache.get(key);
};

/**
 * Apply indentation to text (optimized version)
 * @param {string} indent - Indentation string
 * @param {boolean} skipFirst - Skip indentation on first line
 * @returns {Function} - Function that applies indentation to text
 */
export const indentify = (indent, skipFirst) => {
  // Cache the replacement string for performance
  const replacement = `\n${indent}`;

  return (text) => {
    if (!text) return text;

    // Fast path for single-line text
    if (!text.includes('\n')) {
      return (skipFirst ? '' : indent) + text;
    }

    // Use replaceAll for multi-line text (faster than regex for this case)
    return (skipFirst ? '' : indent) + text.replaceAll('\n', replacement);
  };
};

/**
 * Cache for getAttribute results (WeakMap for automatic garbage collection)
 * Key: tag object, Value: Map of attributeName -> value
 * Note: WeakMap doesn't support size() or clear(), so no registration needed
 */
const attributeCache = new WeakMap();

/**
 * Get attribute value from tag with validation and caching
 * @param {object} tag - HTML tag object
 * @param {string} attributeName - Name of attribute to get
 * @param {*} defaultValue - Default value if attribute not found
 * @returns {*} - Attribute value or default
 */
export const getAttribute = (tag, attributeName, defaultValue) => {
  // Validate inputs
  if (!tag || typeof tag !== 'object') {
    return defaultValue;
  }

  if (!attributeName || typeof attributeName !== 'string') {
    return defaultValue;
  }

  // Check cache first
  let tagCache = attributeCache.get(tag);
  if (tagCache) {
    const cachedValue = tagCache.get(attributeName);
    if (cachedValue !== undefined) {
      return cachedValue === null ? defaultValue : cachedValue;
    }
  }

  // Not in cache, compute value
  if (!tag.attrs || !Array.isArray(tag.attrs) || tag.attrs.length === 0) {
    // Cache the miss
    if (!tagCache) {
      tagCache = new Map();
      attributeCache.set(tag, tagCache);
    }
    tagCache.set(attributeName, null);
    return defaultValue;
  }

  const attribute = tag.attrs.find(
    (attr) => attr && typeof attr === 'object' && attr.name === attributeName,
  );

  // Cache the result
  if (!tagCache) {
    tagCache = new Map();
    attributeCache.set(tag, tagCache);
  }

  if (!attribute || attribute.value === undefined) {
    tagCache.set(attributeName, null);
    return defaultValue;
  }

  const value = attribute.value;
  tagCache.set(attributeName, value);
  return value;
};

export const getColorFromClass = (classAttribute = '') => {
  if (classAttribute?.startsWith('x-cli-color-')) {
    return classAttribute?.slice(12);
  }

  return null;
};

/**
 * Get custom attributes from data-cli-* attributes
 * Supports: data-cli-color, data-cli-marker, data-cli-border, data-cli-prefix, data-cli-suffix, data-cli-prefix-color, data-cli-suffix-color
 * For abbr/dfn: data-cli-title-color, data-cli-title-prefix-marker, data-cli-title-prefix-color, data-cli-title-suffix-marker, data-cli-title-suffix-color
 * For ol/ul: data-cli-marker-color, data-cli-decimal
 * For li: data-cli-li-color (new)
 * For code/pre: data-cli-numbers-enabled, data-cli-numbers-color, data-cli-highlight-lines, data-cli-highlight-color, data-cli-gutter-separator-marker, data-cli-gutter-separator-color, data-cli-lang-label-enabled, data-cli-lang-label-position, data-cli-lang-label-color, data-cli-lang-label-prefix-marker, data-cli-lang-label-prefix-color, data-cli-lang-label-suffix-marker, data-cli-lang-label-suffix-color
 * For figure/fieldset/details: data-cli-border-style, data-cli-border-dim, data-cli-title-color (fieldset)
 * For progress/meter: data-cli-filled-color, data-cli-filled-marker, data-cli-empty-color, data-cli-empty-marker
 * For img: data-cli-prefix-marker, data-cli-prefix-color, data-cli-open-marker, data-cli-open-color, data-cli-close-marker, data-cli-close-color, data-cli-text-color
 * For input (checkbox): data-cli-checked-marker, data-cli-checked-color, data-cli-unchecked-marker, data-cli-unchecked-color, data-cli-checkbox-open-marker, data-cli-checkbox-open-color, data-cli-checkbox-close-marker, data-cli-checkbox-close-color
 * For input (radio): data-cli-radio-checked-marker, data-cli-radio-checked-color, data-cli-radio-unchecked-marker, data-cli-radio-unchecked-color, data-cli-radio-open-marker, data-cli-radio-open-color, data-cli-radio-close-marker, data-cli-radio-close-color
 * For input (button): data-cli-button-open-marker, data-cli-button-open-color, data-cli-button-close-marker, data-cli-button-close-color, data-cli-button-text-color
 * For input (text/email/etc.): data-cli-text-input-color
 * For input (range): data-cli-range-filled, data-cli-range-empty, data-cli-range-thumb, data-cli-range-filled-color, data-cli-range-empty-color, data-cli-range-thumb-color
 * For input (color): data-cli-color-prefix, data-cli-show-hex
 * For input (file): data-cli-file-prefix, data-cli-file-placeholder, data-cli-file-prefix-color, data-cli-file-text-color
 * For textarea: data-cli-textarea-color
 * For a (links): data-cli-show-href, data-cli-href-color, data-cli-show-title, data-cli-title-color, data-cli-title-prefix, data-cli-title-suffix
 * For kbd/samp/sub/sup: data-cli-prefix, data-cli-prefix-color, data-cli-suffix, data-cli-suffix-color
 * For details/summary: data-cli-open-marker, data-cli-closed-marker
 * For table elements: data-cli-padding-left, data-cli-padding-right, data-cli-padding-top, data-cli-padding-bottom, data-cli-border, data-cli-border-style
 * For table sections: data-cli-tr-color, data-cli-thead-color, data-cli-tbody-color, data-cli-tfoot-color
 * For select: data-cli-color (select name), data-cli-prefix, data-cli-prefix-color, data-cli-suffix, data-cli-suffix-color, data-cli-select-label (override name text)
 * For option: data-cli-color (option text), data-cli-selected-marker, data-cli-selected-color, data-cli-unselected-marker, data-cli-unselected-color
 * For optgroup: data-cli-color (label text), data-cli-marker, data-cli-marker-color
 * @param {object} tag - The tag object
 * @returns {object} - Object with all custom cli attributes
 */
/**
 * Get the disabled color from custom attributes or default
 * @param {object} custom - Custom attributes object
 * @returns {string} - Disabled color string
 */
export const getDisabledColor = (custom) => {
  return custom.disabledColor || 'gray dim';
};

export const getCustomAttributes = (tag) => {
  const numbersEnabled = getAttribute(tag, 'data-cli-numbers-enabled', null);
  const borderDim = getAttribute(tag, 'data-cli-border-dim', null);

  return {
    color: getAttribute(tag, 'data-cli-color', null),
    disabledColor: getAttribute(tag, 'data-cli-disabled-color', null),
    marker: getAttribute(tag, 'data-cli-marker', null),
    markerColor: getAttribute(tag, 'data-cli-marker-color', null),
    decimal: getAttribute(tag, 'data-cli-decimal', null),
    border: getAttribute(tag, 'data-cli-border', null),
    borderStyle: getAttribute(tag, 'data-cli-border-style', null),
    borderDim: borderDim === null ? null : (borderDim === 'true' || borderDim === '1'),
    prefix: getAttribute(tag, 'data-cli-prefix', null),
    prefixColor: getAttribute(tag, 'data-cli-prefix-color', null),
    suffix: getAttribute(tag, 'data-cli-suffix', null),
    suffixColor: getAttribute(tag, 'data-cli-suffix-color', null),
    titleColor: getAttribute(tag, 'data-cli-title-color', null),
    titlePrefix: getAttribute(tag, 'data-cli-title-prefix', null),
    titleSuffix: getAttribute(tag, 'data-cli-title-suffix', null),
    titlePrefixMarker: getAttribute(tag, 'data-cli-title-prefix-marker', getAttribute(tag, 'data-cli-title-prefix', null)),
    titlePrefixColor: getAttribute(tag, 'data-cli-title-prefix-color', null),
    titleSuffixMarker: getAttribute(tag, 'data-cli-title-suffix-marker', getAttribute(tag, 'data-cli-title-suffix', null)),
    titleSuffixColor: getAttribute(tag, 'data-cli-title-suffix-color', null),
    numbersEnabled: numbersEnabled === null ? null : (numbersEnabled === 'true' || numbersEnabled === '1'),
    numbersColor: getAttribute(tag, 'data-cli-numbers-color', null),
    filledColor: getAttribute(tag, 'data-cli-filled-color', null),
    filledMarker: getAttribute(tag, 'data-cli-filled-marker', null),
    emptyColor: getAttribute(tag, 'data-cli-empty-color', null),
    emptyMarker: getAttribute(tag, 'data-cli-empty-marker', null),
    // For img tag
    prefixMarker: getAttribute(tag, 'data-cli-prefix-marker', null),
    prefixColor: getAttribute(tag, 'data-cli-prefix-color', null),
    openMarker: getAttribute(tag, 'data-cli-open-marker', null),
    openColor: getAttribute(tag, 'data-cli-open-color', null),
    closeMarker: getAttribute(tag, 'data-cli-close-marker', null),
    closeColor: getAttribute(tag, 'data-cli-close-color', null),
    textColor: getAttribute(tag, 'data-cli-text-color', null),
    // For input checkbox
    checkedMarker: getAttribute(tag, 'data-cli-checked-marker', null),
    checkedColor: getAttribute(tag, 'data-cli-checked-color', null),
    uncheckedMarker: getAttribute(tag, 'data-cli-unchecked-marker', null),
    uncheckedColor: getAttribute(tag, 'data-cli-unchecked-color', null),
    checkboxOpenMarker: getAttribute(tag, 'data-cli-checkbox-open-marker', null),
    checkboxOpenColor: getAttribute(tag, 'data-cli-checkbox-open-color', null),
    checkboxCloseMarker: getAttribute(tag, 'data-cli-checkbox-close-marker', null),
    checkboxCloseColor: getAttribute(tag, 'data-cli-checkbox-close-color', null),
    // For input radio
    radioCheckedMarker: getAttribute(tag, 'data-cli-radio-checked-marker', null),
    radioCheckedColor: getAttribute(tag, 'data-cli-radio-checked-color', null),
    radioUncheckedMarker: getAttribute(tag, 'data-cli-radio-unchecked-marker', null),
    radioUncheckedColor: getAttribute(tag, 'data-cli-radio-unchecked-color', null),
    radioOpenMarker: getAttribute(tag, 'data-cli-radio-open-marker', null),
    radioOpenColor: getAttribute(tag, 'data-cli-radio-open-color', null),
    radioCloseMarker: getAttribute(tag, 'data-cli-radio-close-marker', null),
    radioCloseColor: getAttribute(tag, 'data-cli-radio-close-color', null),
    // For input button
    buttonOpenMarker: getAttribute(tag, 'data-cli-button-open-marker', null),
    buttonOpenColor: getAttribute(tag, 'data-cli-button-open-color', null),
    buttonCloseMarker: getAttribute(tag, 'data-cli-button-close-marker', null),
    buttonCloseColor: getAttribute(tag, 'data-cli-button-close-color', null),
    buttonTextColor: getAttribute(tag, 'data-cli-button-text-color', null),
    // For text input
    textInputColor: getAttribute(tag, 'data-cli-text-input-color', null),
    // For textarea
    textareaColor: getAttribute(tag, 'data-cli-textarea-color', null),
    // For links (a tag) - new
    showHref: getAttribute(tag, 'data-cli-show-href', null),
    hrefColor: getAttribute(tag, 'data-cli-href-color', null),
    showTitle: getAttribute(tag, 'data-cli-show-title', null),
    externalIndicatorEnabled: getAttribute(tag, 'data-cli-external-indicator-enabled', null),
    externalIndicatorMarker: getAttribute(tag, 'data-cli-external-indicator-marker', null),
    externalIndicatorColor: getAttribute(tag, 'data-cli-external-indicator-color', null),
    externalIndicatorPosition: getAttribute(tag, 'data-cli-external-indicator-position', null),
    externalIndicatorSpacing: getAttribute(tag, 'data-cli-external-indicator-spacing', null),
    // For code blocks - new
    highlightLines: getAttribute(tag, 'data-cli-highlight-lines', null),
    highlightColor: getAttribute(tag, 'data-cli-highlight-color', null),
    gutterEnabled: getAttribute(tag, 'data-cli-gutter-enabled', null),
    gutterSeparatorMarker: getAttribute(tag, 'data-cli-gutter-separator-marker', null),
    gutterSeparatorColor: getAttribute(tag, 'data-cli-gutter-separator-color', null),
    langLabelEnabled: getAttribute(tag, 'data-cli-lang-label-enabled', null),
    langLabelPosition: getAttribute(tag, 'data-cli-lang-label-position', null),
    langLabelColor: getAttribute(tag, 'data-cli-lang-label-color', null),
    langLabelPrefixMarker: getAttribute(tag, 'data-cli-lang-label-prefix-marker', null),
    langLabelPrefixColor: getAttribute(tag, 'data-cli-lang-label-prefix-color', null),
    langLabelSuffixMarker: getAttribute(tag, 'data-cli-lang-label-suffix-marker', null),
    langLabelSuffixColor: getAttribute(tag, 'data-cli-lang-label-suffix-color', null),
    overflowIndicatorEnabled: getAttribute(tag, 'data-cli-overflow-indicator-enabled', null),
    overflowIndicatorMarker: getAttribute(tag, 'data-cli-overflow-indicator-marker', null),
    overflowIndicatorColor: getAttribute(tag, 'data-cli-overflow-indicator-color', null),
    // For li elements - new
    liColor: getAttribute(tag, 'data-cli-li-color', null),
    // For details/summary - new
    openMarkerDetails: getAttribute(tag, 'data-cli-open-marker', null),
    closedMarker: getAttribute(tag, 'data-cli-closed-marker', null),
    // For input range - new
    rangeFilled: getAttribute(tag, 'data-cli-range-filled', null),
    rangeEmpty: getAttribute(tag, 'data-cli-range-empty', null),
    rangeThumb: getAttribute(tag, 'data-cli-range-thumb', null),
    rangeFilledColor: getAttribute(tag, 'data-cli-range-filled-color', null),
    rangeEmptyColor: getAttribute(tag, 'data-cli-range-empty-color', null),
    rangeThumbColor: getAttribute(tag, 'data-cli-range-thumb-color', null),
    // For input color - new
    colorPrefix: getAttribute(tag, 'data-cli-color-prefix', null),
    showHex: getAttribute(tag, 'data-cli-show-hex', null),
    // For input file - new
    filePrefix: getAttribute(tag, 'data-cli-file-prefix', null),
    filePlaceholder: getAttribute(tag, 'data-cli-file-placeholder', null),
    filePrefixColor: getAttribute(tag, 'data-cli-file-prefix-color', null),
    fileTextColor: getAttribute(tag, 'data-cli-file-text-color', null),
    // For table sections - new
    trColor: getAttribute(tag, 'data-cli-tr-color', null),
    theadColor: getAttribute(tag, 'data-cli-thead-color', null),
    tbodyColor: getAttribute(tag, 'data-cli-tbody-color', null),
    tfootColor: getAttribute(tag, 'data-cli-tfoot-color', null),
    // For table padding - new
    paddingLeft: getAttribute(tag, 'data-cli-padding-left', null),
    paddingRight: getAttribute(tag, 'data-cli-padding-right', null),
    paddingTop: getAttribute(tag, 'data-cli-padding-top', null),
    paddingBottom: getAttribute(tag, 'data-cli-padding-bottom', null),
    // For select/option/optgroup
    selectedMarker: getAttribute(tag, 'data-cli-selected-marker', null),
    selectedColor: getAttribute(tag, 'data-cli-selected-color', null),
    unselectedMarker: getAttribute(tag, 'data-cli-unselected-marker', null),
    unselectedColor: getAttribute(tag, 'data-cli-unselected-color', null),
    optionColor: getAttribute(tag, 'data-cli-option-color', null),
    selectLabel: getAttribute(tag, 'data-cli-select-label', null),
    // For progress/meter - new
    width: getAttribute(tag, 'data-cli-width', null),
    filledMarker: getAttribute(tag, 'data-cli-filled-marker', null),
    emptyMarker: getAttribute(tag, 'data-cli-empty-marker', null),
    filledColor: getAttribute(tag, 'data-cli-filled-color', null),
    emptyColor: getAttribute(tag, 'data-cli-empty-color', null),
  };
};

/**
 * Validate and sanitize numeric value
 * @param {*} value - Value to validate
 * @param {number} min - Minimum allowed value (optional)
 * @param {number} max - Maximum allowed value (optional)
 * @param {number} defaultValue - Default value if invalid
 * @returns {number} - Validated number or default
 */
export const validateNumber = (value, min = -Infinity, max = Infinity, defaultValue = 0) => {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(value);

  if (!Number.isFinite(parsed)) {
    return defaultValue;
  }

  if (parsed < min) return min;
  if (parsed > max) return max;

  return parsed;
};

/**
 * Validate and sanitize integer value
 * @param {*} value - Value to validate
 * @param {number} min - Minimum allowed value (optional)
 * @param {number} max - Maximum allowed value (optional)
 * @param {number} defaultValue - Default value if invalid
 * @returns {number} - Validated integer or default
 */
export const validateInteger = (value, min = -Infinity, max = Infinity, defaultValue = 0) => {
  const parsed = typeof value === 'number' ? Math.floor(value) : Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return defaultValue;
  }

  if (parsed < min) return min;
  if (parsed > max) return max;

  return parsed;
};

/**
 * Validate boolean value from various formats
 * @param {*} value - Value to validate (true/false/'true'/'false'/1/0)
 * @param {boolean} defaultValue - Default value if invalid
 * @returns {boolean} - Validated boolean or default
 */
export const validateBoolean = (value, defaultValue = false) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (lower === 'true' || lower === '1' || lower === 'yes') return true;
    if (lower === 'false' || lower === '0' || lower === 'no') return false;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  return defaultValue;
};

/**
 * Validate color string format (chalk-string compatible)
 * @param {string} color - Color string to validate
 * @returns {boolean} - True if valid color format
 */
export const isValidColor = (color) => {
  if (!color || typeof color !== 'string') {
    return false;
  }

  // Allow common color names and styles
  const validColors = [
    'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'grey',
    'blackBright', 'redBright', 'greenBright', 'yellowBright', 'blueBright',
    'magentaBright', 'cyanBright', 'whiteBright',
    'bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite',
    'bgBlackBright', 'bgRedBright', 'bgGreenBright', 'bgYellowBright', 'bgBlueBright',
    'bgMagentaBright', 'bgCyanBright', 'bgWhiteBright',
    'bold', 'dim', 'italic', 'underline', 'inverse', 'hidden', 'strikethrough',
  ];

  // Check if it's a hex color
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return true;
  }

  // Check if it's RGB format
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color)) {
    return true;
  }

  // Check if it's a space-separated list of valid colors/styles
  const parts = color.split(/\s+/);
  return parts.every(part => validColors.includes(part) || part === '');
};

/**
 * Check if NO_COLOR environment variable is set
 * @returns {boolean} - True if colors should be disabled
 */
export const isNoColor = () => {
  return typeof process !== 'undefined' &&
    process.env.NO_COLOR !== undefined &&
    process.env.NO_COLOR !== '';
};

/**
 * Wrapper for chalkString that respects NO_COLOR with error handling
 * @param {string} colorString - Color string (chalk-string format)
 * @param {object} options - Options object
 * @returns {Function} - Styling function
 */
export const safeChalkString = (colorString, options = {}) => {
  if (isNoColor()) {
    return (text) => text;
  }

  // Validate color string
  if (!colorString || typeof colorString !== 'string') {
    if (colorString !== '' && colorString !== null && colorString !== undefined) {
      logger.warn('safeChalkString', `Invalid color string type: ${typeof colorString}`, colorString);
    }
    return (text) => text;
  }

  try {
    return chalkString(colorString, options);
  } catch (error) {
    logger.warn('safeChalkString', `Failed to parse color string: "${colorString}"`, error);
    return (text) => text;
  }
};

/**
 * Apply custom color if available, otherwise use theme
 * @param {string|null} customColor - Custom color string (chalk-string format)
 * @param {Function} themeFunction - Theme function to use as fallback
 * @param {string} value - Text to style
 * @param {Function} chalkStringFn - chalkString function (pass from caller)
 * @returns {string} - Styled text
 */
export const applyCustomColor = (customColor, themeFunction, value, chalkStringFn) => {
  // Validate value first
  if (value === null || value === undefined) {
    logger.debug('applyCustomColor', 'Received null/undefined value, returning empty string');
    return '';
  }

  // Convert to string if not already
  const stringValue = typeof value === 'string' ? value : String(value);

  // Check NO_COLOR first
  if (isNoColor()) {
    return stringValue;
  }

  // Try custom color first
  if (customColor && typeof customColor === 'string') {
    try {
      return chalkStringFn(customColor, { colors: true })(stringValue);
    } catch (error) {
      logger.warn('applyCustomColor', `Failed to apply custom color "${customColor}"`, error);
      // Fall through to theme function
    }
  }

  // Try theme function
  if (themeFunction && typeof themeFunction === 'function') {
    try {
      return themeFunction(stringValue);
    } catch (error) {
      logger.warn('applyCustomColor', 'Failed to apply theme function', error);
      return stringValue;
    }
  }

  // No color or theme function available
  return stringValue;
};

/**
 * Extract base color name from a color string that may contain modifiers
 * boxen only accepts base color names without modifiers like 'bold', 'dim', etc.
 * @param {string} colorString - Color string like "green bold" or "blue"
 * @returns {string} - Base color name like "green" or "blue"
 */
export const extractBaseColor = (colorString) => {
  if (!colorString) return colorString;

  const modifiers = ['bold', 'dim', 'italic', 'underline', 'inverse', 'hidden', 'strikethrough', 'bg'];
  const parts = colorString.trim().split(/\s+/);

  // Filter out modifiers and bg colors, return first valid color
  const baseColor = parts.find(part => !modifiers.some(mod => part.toLowerCase().startsWith(mod)));

  return baseColor || colorString;
};
