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

export const filterAst = (ast) => {
  const removeTheseKeys = new Set(['mode', 'namespaceURI', 'parentNode', 'tagName']);

  return Object.fromEntries(
    Object.entries(ast)
      .filter(([key]) => !removeTheseKeys.has(key))
      .map(([key, value]) => [key, Array.isArray(value) ? value.map(filterAst) : value]),
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
