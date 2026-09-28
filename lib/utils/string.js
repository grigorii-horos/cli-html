/**
 * String Utility Functions
 *
 * Common string manipulation utilities to reduce code duplication.
 * @module string-utils
 */

import stringWidth from 'string-width';

/**
 * Trim trailing newline from string
 * @param {string} string_ - Input string
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
 * Cached ANSI regex for performance
 */
const ANSI_REGEX = /\u001B\[[0-9;]*m/g;

/**
 * Strip all ANSI escape codes from string (optimized with cached regex)
 * @param {string} string_ - Input string with ANSI codes
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
  '↯': '*',

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

/**
 * Display width of the widest line (ANSI codes ignored, wide characters counted as 2)
 * @param {string} text - Possibly multi-line text
 * @returns {number} - Width of the widest line
 */
export const maxLineWidth = (text) => Math.max(0, ...String(text ?? '').split('\n').map((line) => stringWidth(line)));
