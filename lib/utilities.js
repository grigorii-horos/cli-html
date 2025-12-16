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
 * @param function_
 * @param {*} fallback - Fallback value on error
 * @param {string} context - Context for error logging
 * @returns {*} - Function result or fallback
 */
export const safeExecute = (function_, fallback, context = 'unknown') => {
  try {
    return function_();
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
    (attribute_) => attribute_ && typeof attribute_ === 'object' && attribute_.name === attributeName,
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
 * For input (color): data-cli-color-prefix, data-cli-hex-enabled
 * For input (file): data-cli-file-prefix, data-cli-file-placeholder, data-cli-file-prefix-color, data-cli-file-text-color
 * For textarea: data-cli-textarea-color
 * For a (links): data-cli-href-enabled, data-cli-href-color, data-cli-title-enabled, data-cli-title-color, data-cli-title-prefix, data-cli-title-suffix
 * For kbd/samp/sub/sup: data-cli-prefix, data-cli-prefix-color, data-cli-suffix, data-cli-suffix-color
 * For details/summary: data-cli-open-marker, data-cli-closed-marker
 * For table elements: data-cli-padding-left, data-cli-padding-right, data-cli-padding-top, data-cli-padding-bottom, data-cli-border, data-cli-border-style
 * For table sections: data-cli-tr-color, data-cli-thead-color, data-cli-tbody-color, data-cli-tfoot-color
 * For table striping: data-cli-striping-enabled, data-cli-striping-count, data-cli-striping-row-1-color, data-cli-striping-row-2-color, data-cli-striping-row-3-color, data-cli-striping-row-4-color, data-cli-striping-row-5-color
 * For select: data-cli-color (select name), data-cli-prefix, data-cli-prefix-color, data-cli-suffix, data-cli-suffix-color, data-cli-select-label (override name text)
 * For option: data-cli-color (option text), data-cli-selected-marker, data-cli-selected-color, data-cli-unselected-marker, data-cli-unselected-color
 * For optgroup: data-cli-color (label text), data-cli-marker, data-cli-marker-color
 * @param {object} tag - The tag object
 * @returns {object} - Object with all custom cli attributes
 */
/**
 * Get the disabled color from custom attributes or default
 * @param {object} custom - Custom attributes object
 * @param theme
 * @returns {string} - Disabled color string
 */
export const getDisabledColor = (custom, theme) => {
  return custom.disabled?.color || theme?.disabled?.color || 'gray dim';
};

export const getCustomAttributes = (tag) => {
  // Helper to parse boolean attributes
  const parseBool = (value) => value === null ? null : (value === 'true' || value === '1');

  // Helper to parse boolean or 'auto' values
  const parseBoolOrAuto = (value) => {
    if (value === null) return null;
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
    if (value === 'auto') return 'auto';
    return null;
  };

  return {
    // Simple attributes
    color: getAttribute(tag, 'data-cli-color', null),
    marker: getAttribute(tag, 'data-cli-marker', null),
    decimal: getAttribute(tag, 'data-cli-decimal', null),
    border: getAttribute(tag, 'data-cli-border', null),
    borderStyle: getAttribute(tag, 'data-cli-border-style', null),
    width: getAttribute(tag, 'data-cli-width', null),

    // Disabled state
    disabled: {
      color: getAttribute(tag, 'data-cli-disabled-color', null),
    },

    // Border settings
    borderDim: parseBool(getAttribute(tag, 'data-cli-border-dim', null)),

    // Marker with color
    markerColor: getAttribute(tag, 'data-cli-marker-color', null),

    // Prefix/Suffix
    prefix: getAttribute(tag, 'data-cli-prefix', null),
    prefixColor: getAttribute(tag, 'data-cli-prefix-color', null),
    prefixMarker: getAttribute(tag, 'data-cli-prefix-marker', null),
    suffix: getAttribute(tag, 'data-cli-suffix', null),
    suffixColor: getAttribute(tag, 'data-cli-suffix-color', null),
    suffixMarker: getAttribute(tag, 'data-cli-suffix-marker', null),

    // Text color
    text: {
      color: getAttribute(tag, 'data-cli-text-color', null),
    },

    // Title
    title: {
      enabled: parseBool(getAttribute(tag, 'data-cli-title-enabled', null)),
      color: getAttribute(tag, 'data-cli-title-color', null),
      prefix: {
        marker: getAttribute(tag, 'data-cli-title-prefix-marker', null),
        color: getAttribute(tag, 'data-cli-title-prefix-color', null),
      },
      suffix: {
        marker: getAttribute(tag, 'data-cli-title-suffix-marker', null),
        color: getAttribute(tag, 'data-cli-title-suffix-color', null),
      },
    },

    // Numbers (for code blocks)
    numbers: {
      enabled: parseBool(getAttribute(tag, 'data-cli-numbers-enabled', null)),
      color: getAttribute(tag, 'data-cli-numbers-color', null),
    },

    // Filled/Empty markers (for progress, meter, range)
    filled: {
      marker: getAttribute(tag, 'data-cli-filled-marker', null),
      color: getAttribute(tag, 'data-cli-filled-color', null),
    },
    empty: {
      marker: getAttribute(tag, 'data-cli-empty-marker', null),
      color: getAttribute(tag, 'data-cli-empty-color', null),
    },
    // Checkbox
    checked: {
      marker: getAttribute(tag, 'data-cli-checked-marker', null),
      color: getAttribute(tag, 'data-cli-checked-color', null),
    },
    unchecked: {
      marker: getAttribute(tag, 'data-cli-unchecked-marker', null),
      color: getAttribute(tag, 'data-cli-unchecked-color', null),
    },
    required: {
      enabled: parseBool(getAttribute(tag, 'data-cli-required-enabled', null)),
      marker: getAttribute(tag, 'data-cli-required-marker', null),
      color: getAttribute(tag, 'data-cli-required-color', null),
      position: getAttribute(tag, 'data-cli-required-position', null),
    },
    checkbox: {
      prefix: {
        marker: getAttribute(tag, 'data-cli-checkbox-prefix-marker', null),
        color: getAttribute(tag, 'data-cli-checkbox-prefix-color', null),
      },
      suffix: {
        marker: getAttribute(tag, 'data-cli-checkbox-suffix-marker', null),
        color: getAttribute(tag, 'data-cli-checkbox-suffix-color', null),
      },
    },

    // Radio
    radio: {
      checked: {
        marker: getAttribute(tag, 'data-cli-radio-checked-marker', null),
        color: getAttribute(tag, 'data-cli-radio-checked-color', null),
      },
      unchecked: {
        marker: getAttribute(tag, 'data-cli-radio-unchecked-marker', null),
        color: getAttribute(tag, 'data-cli-radio-unchecked-color', null),
      },
      prefix: {
        marker: getAttribute(tag, 'data-cli-radio-prefix-marker', null),
        color: getAttribute(tag, 'data-cli-radio-prefix-color', null),
      },
      suffix: {
        marker: getAttribute(tag, 'data-cli-radio-suffix-marker', null),
        color: getAttribute(tag, 'data-cli-radio-suffix-color', null),
      },
    },

    // Button
    button: {
      prefix: {
        marker: getAttribute(tag, 'data-cli-button-prefix-marker', null),
        color: getAttribute(tag, 'data-cli-button-prefix-color', null),
      },
      suffix: {
        marker: getAttribute(tag, 'data-cli-button-suffix-marker', null),
        color: getAttribute(tag, 'data-cli-button-suffix-color', null),
      },
      text: {
        color: getAttribute(tag, 'data-cli-button-text-color', null),
      },
    },

    // Text input
    textInput: {
      color: getAttribute(tag, 'data-cli-text-input-color', null),
    },

    // Textarea
    textarea: {
      color: getAttribute(tag, 'data-cli-textarea-color', null),
    },

    // Links (a tag)
    href: {
      enabled: parseBoolOrAuto(getAttribute(tag, 'data-cli-href-enabled', null)),
      color: getAttribute(tag, 'data-cli-href-color', null),
    },
    external: {
      enabled: parseBool(getAttribute(tag, 'data-cli-external-enabled', null)),
      marker: getAttribute(tag, 'data-cli-external-marker', null),
      color: getAttribute(tag, 'data-cli-external-color', null),
      position: getAttribute(tag, 'data-cli-external-position', null),
      spacing: getAttribute(tag, 'data-cli-external-spacing', null),
    },

    // Code blocks
    highlight: {
      lines: getAttribute(tag, 'data-cli-highlight-lines', null),
      color: getAttribute(tag, 'data-cli-highlight-color', null),
    },
    diff: {
      enabled: parseBool(getAttribute(tag, 'data-cli-diff-enabled', null)),
    },
    gutter: {
      enabled: parseBool(getAttribute(tag, 'data-cli-gutter-enabled', null)),
      marker: getAttribute(tag, 'data-cli-gutter-marker', null),
      color: getAttribute(tag, 'data-cli-gutter-color', null),
    },
    label: {
      enabled: parseBool(getAttribute(tag, 'data-cli-label-enabled', null)),
      position: getAttribute(tag, 'data-cli-label-position', null),
      color: getAttribute(tag, 'data-cli-label-color', null),
      prefix: {
        marker: getAttribute(tag, 'data-cli-label-prefix-marker', null),
        color: getAttribute(tag, 'data-cli-label-prefix-color', null),
      },
      suffix: {
        marker: getAttribute(tag, 'data-cli-label-suffix-marker', null),
        color: getAttribute(tag, 'data-cli-label-suffix-color', null),
      },
    },
    overflow: {
      enabled: parseBool(getAttribute(tag, 'data-cli-overflow-enabled', null)),
      marker: getAttribute(tag, 'data-cli-overflow-marker', null),
      color: getAttribute(tag, 'data-cli-overflow-color', null),
    },

    // List items
    li: {
      color: getAttribute(tag, 'data-cli-li-color', null),
    },

    // Details/summary
    open: {
      marker: getAttribute(tag, 'data-cli-open-marker', null),
    },
    closed: {
      marker: getAttribute(tag, 'data-cli-closed-marker', null),
    },

    // Range input
    range: {
      filled: getAttribute(tag, 'data-cli-range-filled', null),
      empty: getAttribute(tag, 'data-cli-range-empty', null),
      thumb: getAttribute(tag, 'data-cli-range-thumb', null),
      filledColor: getAttribute(tag, 'data-cli-range-filled-color', null),
      emptyColor: getAttribute(tag, 'data-cli-range-empty-color', null),
      thumbColor: getAttribute(tag, 'data-cli-range-thumb-color', null),
    },
    // Color input
    colorInput: {
      indicator: getAttribute(tag, 'data-cli-color-indicator', null),
      prefix: {
        marker: getAttribute(tag, 'data-cli-color-prefix-marker', null),
        color: getAttribute(tag, 'data-cli-color-prefix-color', null),
      },
      suffix: {
        marker: getAttribute(tag, 'data-cli-color-suffix-marker', null),
        color: getAttribute(tag, 'data-cli-color-suffix-color', null),
      },
      value: {
        color: getAttribute(tag, 'data-cli-color-value-color', null),
      },
      hex: {
        enabled: parseBool(getAttribute(tag, 'data-cli-hex-enabled', null)),
      },
    },

    // Password input
    password: {
      char: getAttribute(tag, 'data-cli-password-char', null),
      count: getAttribute(tag, 'data-cli-password-count', null),
      color: getAttribute(tag, 'data-cli-password-color', null),
    },

    // Email input
    email: {
      prefix: {
        marker: getAttribute(tag, 'data-cli-email-prefix-marker', null),
        color: getAttribute(tag, 'data-cli-email-prefix-color', null),
      },
      color: getAttribute(tag, 'data-cli-email-color', null),
    },

    // Date input
    date: {
      prefix: {
        marker: getAttribute(tag, 'data-cli-date-prefix-marker', null),
        color: getAttribute(tag, 'data-cli-date-prefix-color', null),
      },
      color: getAttribute(tag, 'data-cli-date-color', null),
    },

    // File input
    file: {
      prefix: {
        marker: getAttribute(tag, 'data-cli-file-prefix-marker', null),
        color: getAttribute(tag, 'data-cli-file-prefix-color', null),
      },
      text: {
        color: getAttribute(tag, 'data-cli-file-text-color', null),
      },
      placeholder: getAttribute(tag, 'data-cli-file-placeholder', null),
    },

    // Table sections
    tr: {
      color: getAttribute(tag, 'data-cli-tr-color', null),
    },
    thead: {
      color: getAttribute(tag, 'data-cli-thead-color', null),
    },
    tbody: {
      color: getAttribute(tag, 'data-cli-tbody-color', null),
    },
    tfoot: {
      color: getAttribute(tag, 'data-cli-tfoot-color', null),
    },

    // Padding
    padding: {
      left: getAttribute(tag, 'data-cli-padding-left', null),
      right: getAttribute(tag, 'data-cli-padding-right', null),
      top: getAttribute(tag, 'data-cli-padding-top', null),
      bottom: getAttribute(tag, 'data-cli-padding-bottom', null),
    },

    // Select/option/optgroup
    selected: {
      marker: getAttribute(tag, 'data-cli-selected-marker', null),
      color: getAttribute(tag, 'data-cli-selected-color', null),
    },
    unselected: {
      marker: getAttribute(tag, 'data-cli-unselected-marker', null),
      color: getAttribute(tag, 'data-cli-unselected-color', null),
    },
    option: {
      color: getAttribute(tag, 'data-cli-option-color', null),
    },
    select: {
      label: getAttribute(tag, 'data-cli-select-label', null),
    },

    // Table striping (1-based row indexing)
    striping: {
      enabled: parseBool(getAttribute(tag, 'data-cli-striping-enabled', null)),
      count: getAttribute(tag, 'data-cli-striping-count', null),
      rows: {
        '1': { color: getAttribute(tag, 'data-cli-striping-row-1-color', null) },
        '2': { color: getAttribute(tag, 'data-cli-striping-row-2-color', null) },
        '3': { color: getAttribute(tag, 'data-cli-striping-row-3-color', null) },
        '4': { color: getAttribute(tag, 'data-cli-striping-row-4-color', null) },
        '5': { color: getAttribute(tag, 'data-cli-striping-row-5-color', null) },
      },
    },

    // Blink animation indicator
    animation: {
      enabled: parseBool(getAttribute(tag, 'data-cli-animation-enabled', null)),
      marker: getAttribute(tag, 'data-cli-animation-marker', null),
      color: getAttribute(tag, 'data-cli-animation-color', null),
      position: getAttribute(tag, 'data-cli-animation-position', null),
    },

    // Marquee direction indicator
    direction: {
      enabled: parseBool(getAttribute(tag, 'data-cli-direction-enabled', null)),
      marker: getAttribute(tag, 'data-cli-direction-marker', null),
      color: getAttribute(tag, 'data-cli-direction-color', null),
      position: getAttribute(tag, 'data-cli-direction-position', null),
    },

    // Data element value display
    value: {
      enabled: parseBool(getAttribute(tag, 'data-cli-value-enabled', null)),
      color: getAttribute(tag, 'data-cli-value-color', null),
      prefix: {
        marker: getAttribute(tag, 'data-cli-value-prefix-marker', null),
        color: getAttribute(tag, 'data-cli-value-prefix-color', null),
      },
      suffix: {
        marker: getAttribute(tag, 'data-cli-value-suffix-marker', null),
        color: getAttribute(tag, 'data-cli-value-suffix-color', null),
      },
    },

    // Meter element
    meter: {
      width: getAttribute(tag, 'data-cli-meter-width', null),
      labels: {
        enabled: parseBool(getAttribute(tag, 'data-cli-labels-enabled', null)),
        format: getAttribute(tag, 'data-cli-labels-format', null),
        color: getAttribute(tag, 'data-cli-labels-color', null),
        position: getAttribute(tag, 'data-cli-labels-position', null),
      },
    },
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
  const validColors = new Set([
    'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'grey',
    'blackBright', 'redBright', 'greenBright', 'yellowBright', 'blueBright',
    'magentaBright', 'cyanBright', 'whiteBright',
    'bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite',
    'bgBlackBright', 'bgRedBright', 'bgGreenBright', 'bgYellowBright', 'bgBlueBright',
    'bgMagentaBright', 'bgCyanBright', 'bgWhiteBright',
    'bold', 'dim', 'italic', 'underline', 'inverse', 'hidden', 'strikethrough',
  ]);

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
  return parts.every(part => validColors.has(part) || part === '');
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
 * @param chalkStringFunction
 * @returns {string} - Styled text
 */
export const applyCustomColor = (customColor, themeFunction, value, chalkStringFunction) => {
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
      return chalkStringFunction(customColor, { colors: true })(stringValue);
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
  const baseColor = parts.find(part => !modifiers.some(module_ => part.toLowerCase().startsWith(module_)));

  return baseColor || colorString;
};
