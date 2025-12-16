/**
 * String Utility Functions
 *
 * Common string manipulation utilities to reduce code duplication.
 * @module string-utils
 */

import { registerCache } from './memory.js';

/**
 * Trim trailing newline from string
 * @param {string} str - Input string
 * @param string_
 * @returns {string} - String without trailing newline
 * @example
 * trimTrailingNewline('hello\n') // => 'hello'
 * trimTrailingNewline('hello')   // => 'hello'
 */
export const trimTrailingNewline = (string_) => {
  if (!string_) return string_;
  return string_?.at(-1) === '\n' ? string_.slice(0, -1) : string_;
};

/**
 * Trim leading newline from string
 * @param {string} str - Input string
 * @param string_
 * @returns {string} - String without leading newline
 * @example
 * trimLeadingNewline('\nhello') // => 'hello'
 * trimLeadingNewline('hello')   // => 'hello'
 */
export const trimLeadingNewline = (string_) => {
  if (!string_) return string_;
  return string_?.at(0) === '\n' ? string_.slice(1) : string_;
};

/**
 * Trim both leading and trailing newlines
 * @param {string} str - Input string
 * @param string_
 * @returns {string} - String without leading/trailing newlines
 * @example
 * trimNewlines('\nhello\n') // => 'hello'
 * trimNewlines('hello')     // => 'hello'
 */
export const trimNewlines = (string_) => {
  if (!string_) return string_;
  return trimLeadingNewline(trimTrailingNewline(string_));
};

/**
 * Truncate string to max length with optional suffix
 * @param {string} str - Input string
 * @param string_
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add when truncated (default: '...')
 * @returns {string} - Truncated string
 * @example
 * truncate('hello world', 8)           // => 'hello...'
 * truncate('hello world', 8, '…')      // => 'hello w…'
 * truncate('hello', 10)                // => 'hello'
 */
export const truncate = (string_, maxLength, suffix = '...') => {
  if (!string_ || string_.length <= maxLength) return string_;
  return string_.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Repeat string n times
 * @param {string} str - String to repeat
 * @param string_
 * @param {number} n - Number of times to repeat
 * @returns {string} - Repeated string
 * @example
 * repeat('ab', 3)  // => 'ababab'
 * repeat('-', 5)   // => '-----'
 */
export const repeat = (string_, n) => {
  if (!string_ || n <= 0) return '';
  return new Array(n).fill(string_).join('');
};

/**
 * Pad string to specified width
 * @param {string} str - String to pad
 * @param string_
 * @param {number} width - Target width
 * @param {string} char - Character to pad with (default: ' ')
 * @param {string} align - Alignment: 'left', 'right', 'center' (default: 'left')
 * @returns {string} - Padded string
 * @example
 * pad('hello', 10)                    // => 'hello     '
 * pad('hello', 10, ' ', 'right')      // => '     hello'
 * pad('hello', 10, ' ', 'center')     // => '  hello   '
 */
export const pad = (string_, width, char = ' ', align = 'left') => {
  if (!string_) return repeat(char, width);

  const padding = width - string_.length;
  if (padding <= 0) return string_;

  switch (align) {
    case 'right': {
      return repeat(char, padding) + string_;
    }
    case 'center': {
      const leftPad = Math.floor(padding / 2);
      const rightPad = padding - leftPad;
      return repeat(char, leftPad) + string_ + repeat(char, rightPad);
    }
    default: { // 'left'
      return string_ + repeat(char, padding);
    }
  }
};

/**
 * Split string into chunks of specified size
 * @param {string} str - Input string
 * @param string_
 * @param {number} size - Chunk size
 * @returns {string[]} - Array of chunks
 * @example
 * chunk('abcdefgh', 3)  // => ['abc', 'def', 'gh']
 * chunk('hello', 10)    // => ['hello']
 */
export const chunk = (string_, size) => {
  if (!string_ || size <= 0) return [];

  const chunks = [];
  for (let index = 0; index < string_.length; index += size) {
    chunks.push(string_.slice(index, index + size));
  }
  return chunks;
};

/**
 * Escape HTML entities
 * @param {string} str - Input string
 * @param string_
 * @returns {string} - Escaped string
 * @example
 * escapeHtml('<div>') // => '&lt;div&gt;'
 */
export const escapeHtml = (string_) => {
  if (!string_) return string_;

  const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return string_.replaceAll(/[&<>"']/g, char => entities[char]);
};

/**
 * Unescape HTML entities
 * @param {string} str - Input string with HTML entities
 * @param string_
 * @returns {string} - Unescaped string
 * @example
 * unescapeHtml('&lt;div&gt;') // => '<div>'
 */
export const unescapeHtml = (string_) => {
  if (!string_) return string_;

  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };

  return string_.replaceAll(/&(?:amp|lt|gt|quot|#39);/g, entity => entities[entity]);
};

/**
 * Check if string contains only whitespace
 * @param {string} str - Input string
 * @param string_
 * @returns {boolean} - True if only whitespace or empty
 * @example
 * isWhitespace('   ')  // => true
 * isWhitespace('')     // => true
 * isWhitespace('a')    // => false
 */
export const isWhitespace = (string_) => {
  return !string_ || /^\s*$/.test(string_);
};

/**
 * Remove all whitespace from string
 * @param {string} str - Input string
 * @param string_
 * @returns {string} - String without whitespace
 * @example
 * removeWhitespace('hello world')  // => 'helloworld'
 * removeWhitespace('  a  b  ')     // => 'ab'
 */
export const removeWhitespace = (string_) => {
  if (!string_) return string_;
  return string_.replaceAll(/\s+/g, '');
};

/**
 * Normalize whitespace (collapse multiple spaces to single space)
 * @param {string} str - Input string
 * @param string_
 * @returns {string} - String with normalized whitespace
 * @example
 * normalizeWhitespace('hello    world')  // => 'hello world'
 * normalizeWhitespace('  a  b  ')        // => ' a b '
 */
export const normalizeWhitespace = (string_) => {
  if (!string_) return string_;
  return string_.replaceAll(/\s+/g, ' ');
};

/**
 * Convert string to title case
 * @param {string} str - Input string
 * @param string_
 * @returns {string} - Title cased string
 * @example
 * toTitleCase('hello world')  // => 'Hello World'
 * toTitleCase('CLI-HTML')     // => 'Cli-Html'
 */
export const toTitleCase = (string_) => {
  if (!string_) return string_;
  return string_.replaceAll(/\w\S*/g, word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
};

/**
 * Capitalize first letter of string (rest unchanged)
 * @param {string} str - Input string
 * @param string_
 * @returns {string} - Capitalized string
 * @example
 * capitalize('hello world')  // => 'Hello world'
 * capitalize('CLI-HTML')     // => 'CLI-HTML'
 */
export const capitalize = (string_) => {
  if (!string_) return string_;
  return string_.charAt(0).toUpperCase() + string_.slice(1);
};

/**
 * Cached ANSI regex for performance
 */
const ANSI_REGEX = /\u001B\[[0-9;]*m/g;

/**
 * Strip all ANSI escape codes from string (optimized with cached regex)
 * @param {string} str - Input string with ANSI codes
 * @param string_
 * @returns {string} - String without ANSI codes
 * @example
 * stripAnsi('\x1b[31mred\x1b[0m')  // => 'red'
 * stripAnsi('normal text')         // => 'normal text'
 */
export const stripAnsi = (string_) => {
  if (!string_ || typeof string_ !== 'string') return string_ || '';

  // Fast path: check if string contains any ANSI codes
  if (!string_.includes('\u001B')) return string_;

  // Reset regex state and replace
  ANSI_REGEX.lastIndex = 0;
  return string_.replace(ANSI_REGEX, '');
};

/**
 * Check if string is empty (null, undefined, or empty string)
 * @param {string} str - Input string
 * @param string_
 * @returns {boolean} - True if empty
 * @example
 * isEmpty('')         // => true
 * isEmpty(null)       // => true
 * isEmpty(undefined)  // => true
 * isEmpty('hello')    // => false
 * isEmpty('  ')       // => false (use isWhitespace for this)
 */
export const isEmpty = (string_) => {
  return string_ === null || string_ === undefined || string_ === '';
};

/**
 * Reverse a string
 * @param {string} str - Input string
 * @param string_
 * @returns {string} - Reversed string
 * @example
 * reverse('hello')  // => 'olleh'
 * reverse('abc')    // => 'cba'
 */
export const reverse = (string_) => {
  if (!string_) return string_;
  return string_.split('').reverse().join('');
};

/**
 * Count occurrences of substring in string
 * @param {string} str - Input string
 * @param string_
 * @param {string} substr - Substring to count
 * @param {boolean} caseSensitive - Case sensitive search (default: true)
 * @returns {number} - Number of occurrences
 * @example
 * count('hello world', 'o')        // => 2
 * count('Hello World', 'o', false) // => 2
 * count('Hello World', 'o', true)  // => 1
 */
export const count = (string_, substr, caseSensitive = true) => {
  if (!string_ || !substr) return 0;

  const searchString = caseSensitive ? string_ : string_.toLowerCase();
  const searchSubstr = caseSensitive ? substr : substr.toLowerCase();

  let count = 0;
  let position = 0;

  while (true) {
    const index = searchString.indexOf(searchSubstr, position);
    if (index === -1) break;
    count++;
    position = index + 1;
  }

  return count;
};

/**
 * Cache for visualLength results (LRU cache with max 1000 entries)
 */
const visualLengthCache = new Map();
const MAX_CACHE_SIZE = 1000;
registerCache(visualLengthCache, 'string:visualLengthCache');

/**
 * Get visual length of string (accounting for ANSI codes, emoji, and wide characters)
 * Uses string-width for accurate ANSI-aware length calculation with caching
 * @param {string} str - Input string (may contain ANSI codes, emoji, wide chars)
 * @param string_
 * @returns {number} - Visual length
 * @example
 * visualLength('hello')           // => 5
 * visualLength('\x1b[31mred\x1b[0m')  // => 3
 * visualLength('你好')            // => 4 (wide characters)
 * visualLength('👋')              // => 2 (emoji)
 */
export const visualLength = (string_) => {
  if (!string_) return 0;
  if (typeof string_ !== 'string') return 0;

  // Check cache first (only for short strings to avoid memory bloat)
  if (string_.length < 100) {
    const cached = visualLengthCache.get(string_);
    if (cached !== undefined) {
      return cached;
    }
  }

  let length;

  // Use string-width for proper ANSI, emoji, and wide character handling
  try {
    // Import string-width if available
    const stringWidth = require('string-width');
    length = stringWidth(string_);
  } catch {
    // Fallback to simple ANSI code removal if string-width is not available
    // Use the optimized stripAnsi function
    if (string_.includes('\u001B')) {
      ANSI_REGEX.lastIndex = 0;
      length = string_.replace(ANSI_REGEX, '').length;
    } else {
      length = string_.length;
    }
  }

  // Cache result for short strings
  if (string_.length < 100) {
    // Simple LRU: delete oldest entries if cache is too large
    if (visualLengthCache.size >= MAX_CACHE_SIZE) {
      const firstKey = visualLengthCache.keys().next().value;
      visualLengthCache.delete(firstKey);
    }
    visualLengthCache.set(string_, length);
  }

  return length;
};

/**
 * Unicode to ASCII character mapping for fallback mode
 * Maps Unicode symbols to their ASCII equivalents for terminals with limited Unicode support
 */
const UNICODE_TO_ASCII = {
  // Progress and meter bars
  '█': '#',
  '░': '-',
  '▓': '=',
  '▒': ':',
  '●': '*',

  // Bullets and list markers
  '•': '*',
  '▪': '-',
  '⚬': 'o',
  '◦': 'o',
  '▸': '>',

  // Checkmarks and symbols
  '✓': 'x',
  '✔': 'x',
  '✗': 'x',
  '✘': 'x',
  '◉': '*',
  '○': 'o',

  // Arrows
  '→': '->',
  '←': '<-',
  '↑': '^',
  '↓': 'v',
  '↗': '^',
  '↘': 'v',
  '↙': 'v',
  '↖': '^',
  '↳': '>',
  '▶': '>',
  '▼': 'v',
  '◀': '<',
  '▲': '^',

  // Box drawing characters (single line)
  '─': '-',
  '│': '|',
  '┌': '+',
  '┐': '+',
  '└': '+',
  '┘': '+',
  '├': '+',
  '┤': '+',
  '┬': '+',
  '┴': '+',
  '┼': '+',

  // Box drawing characters (double line)
  '═': '=',
  '║': '|',
  '╔': '+',
  '╗': '+',
  '╚': '+',
  '╝': '+',
  '╠': '+',
  '╣': '+',
  '╦': '+',
  '╩': '+',
  '╬': '+',

  // Box drawing characters (bold)
  '┃': '|',
  '┏': '+',
  '┓': '+',
  '┗': '+',
  '┛': '+',
  '┣': '+',
  '┫': '+',
  '┳': '+',
  '┻': '+',
  '╋': '+',

  // Box drawing characters (rounded)
  '╭': '+',
  '╮': '+',
  '╰': '+',
  '╯': '+',

  // Subscript and superscript markers
  '₍': '_(',
  '₎': ')_',
  '⁽': '^(',
  '⁾': ')^',
};

/**
 * Convert Unicode characters to ASCII equivalents
 * Useful for terminals that don't support Unicode properly
 * @param {string} str - Input string with Unicode characters
 * @param string_
 * @returns {string} - String with ASCII equivalents
 * @example
 * toAscii('Progress: ████░░░░')  // => 'Progress: ####----'
 * toAscii('✓ Done')               // => 'x Done'
 * toAscii('┌─────┐')              // => '+-----+'
 */
export const toAscii = (string_) => {
  if (!string_) return string_;

  let result = string_;
  for (const [unicode, ascii] of Object.entries(UNICODE_TO_ASCII)) {
    result = result.replaceAll(unicode, ascii);
  }

  return result;
};

/**
 * Convert a marker (symbol) to ASCII if needed
 * Used to convert individual markers based on ASCII mode setting
 * @param {string} marker - Original marker (may be Unicode)
 * @param {boolean} asciiMode - Whether ASCII mode is enabled
 * @returns {string} - ASCII marker if asciiMode is true, original otherwise
 * @example
 * markerToAscii('█', true)   // => '#'
 * markerToAscii('█', false)  // => '█'
 * markerToAscii('✓', true)   // => 'x'
 */
export const markerToAscii = (marker, asciiMode = false) => {
  if (!asciiMode || !marker) return marker;
  return UNICODE_TO_ASCII[marker] || marker;
};
