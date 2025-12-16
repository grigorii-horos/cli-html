/**
 * TypeScript definitions for cli-html
 * Renderer for HTML and Markdown in the Terminal
 */

/**
 * Chalk-string compatible color/style value
 * Examples: "red bold", "bgBlue white underline", "cyan"
 */
export type ChalkString = string;

/**
 * Border style for figure, fieldset, and details elements
 */
export type BorderStyle = 'single' | 'double' | 'round' | 'bold' | 'singleDouble' | 'doubleSingle' | 'classic';

/**
 * Ordered list marker types
 */
export type OrderedListMarker = '1' | 'A' | 'a' | 'I' | 'i';

/**
 * Border configuration for box elements
 */
export interface BorderConfig {
  color?: ChalkString;
  style?: BorderStyle;
  dim?: boolean;
}

/**
 * Padding configuration
 */
export interface PaddingConfig {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

/**
 * Code block padding configuration
 */
export interface CodePaddingConfig {
  left?: number;
}

/**
 * Heading style configuration
 */
export interface HeadingStyle {
  color?: ChalkString;
  marker?: string;
}

/**
 * Figure element style configuration
 */
export interface FigureStyle {
  color?: ChalkString;
  border?: BorderConfig;
  padding?: PaddingConfig;
}

/**
 * Figure caption style configuration
 */
export interface FigcaptionStyle {
  color?: ChalkString;
  prefix?: string;
  suffix?: string;
}

/**
 * Fieldset element style configuration
 */
export interface FieldsetStyle {
  color?: ChalkString;
  border?: BorderConfig;
  title?: {
    color?: ChalkString;
  };
  padding?: PaddingConfig;
}

/**
 * Details element style configuration
 */
export interface DetailsStyle {
  color?: ChalkString;
  marker?: string;
  border?: BorderConfig;
  padding?: PaddingConfig;
}

/**
 * Blockquote style configuration
 */
export interface BlockquoteStyle {
  color?: ChalkString;
  marker?: string;
}

/**
 * Code numbers style configuration
 */
export interface CodeNumbersStyle {
  color?: ChalkString;
  enabled?: boolean;
}

/**
 * Code inline style configuration
 */
export interface CodeInlineStyle {
  color?: ChalkString;
}

/**
 * Code gutter style configuration
 */
export interface CodeGutterStyle {
  enabled?: boolean;
  marker?: string;
  color?: ChalkString;
}

/**
 * Code label prefix/suffix style configuration
 */
export interface CodeLabelAffixStyle {
  marker?: string;
  color?: ChalkString;
}

/**
 * Code label style configuration
 */
export interface CodeLabelStyle {
  enabled?: boolean;
  position?: 'top' | 'bottom';
  color?: ChalkString;
  prefix?: CodeLabelAffixStyle;
  suffix?: CodeLabelAffixStyle;
}

/**
 * Code highlight style configuration
 */
export interface CodeHighlightStyle {
  color?: ChalkString;
}

/**
 * Code overflow indicator style configuration
 */
export interface CodeOverflowIndicatorStyle {
  enabled?: boolean;
  marker?: string;
  color?: ChalkString;
}

/**
 * Code diff line type style configuration
 */
export interface CodeDiffLineStyle {
  color?: ChalkString;
  indicator?: {
    marker?: string;
    color?: ChalkString;
  };
}

/**
 * Code diff style configuration (git-style diff highlighting)
 */
export interface CodeDiffStyle {
  enabled?: boolean;
  added?: CodeDiffLineStyle;
  removed?: CodeDiffLineStyle;
  modified?: CodeDiffLineStyle;
  unchanged?: CodeDiffLineStyle;
}

/**
 * Code block style configuration
 */
export interface CodeBlockStyle {
  color?: ChalkString;
  numbers?: CodeNumbersStyle;
  gutter?: CodeGutterStyle;
  label?: CodeLabelStyle;
  highlight?: CodeHighlightStyle;
  overflowIndicator?: CodeOverflowIndicatorStyle;
  diff?: CodeDiffStyle;
  padding?: CodePaddingConfig;
}

/**
 * Code style configuration (can be string or object)
 */
export interface CodeStyle {
  inline?: ChalkString | CodeInlineStyle;
  block?: CodeBlockStyle;
  color?: ChalkString;
  numbers?: ChalkString | CodeNumbersStyle;
}

/**
 * Table responsive mode configuration
 */
export interface TableResponsiveStyle {
  enabled?: boolean;
  threshold?: number;
  separator?: string;
  itemSeparator?: string;
}

/**
 * Table style configuration
 */
/**
 * Table striping row style
 */
export interface TableStripingRowStyle {
  color?: ChalkString;
}

/**
 * Table striping configuration
 */
export interface TableStripingStyle {
  enabled?: boolean;
  count?: number; // 2-5
  rows?: TableStripingRowStyle[]; // Array of row styles (0-based), data-cli attributes use 1-based numbering
}

export interface TableStyle {
  header?: {
    color?: ChalkString;
  };
  caption?: {
    color?: ChalkString;
  };
  cell?: {
    color?: ChalkString;
  };
  td?: {
    color?: ChalkString;
  };
  th?: {
    color?: ChalkString;
  };
  tr?: {
    color?: ChalkString;
  };
  thead?: {
    color?: ChalkString;
  };
  tbody?: {
    color?: ChalkString;
  };
  tfoot?: {
    color?: ChalkString;
  };
  responsive?: TableResponsiveStyle;
  striping?: TableStripingStyle;
}

/**
 * Abbreviation style configuration
 */
export interface AbbrStyle {
  color?: ChalkString;
  title?: {
    color?: ChalkString;
    prefix?: {
      color?: ChalkString;
      marker?: string;
    };
    suffix?: {
      color?: ChalkString;
      marker?: string;
    };
  };
}

/**
 * Definition (dfn) style configuration
 */
export interface DfnStyle {
  color?: ChalkString;
  title?: {
    color?: ChalkString;
    prefix?: {
      color?: ChalkString;
      marker?: string;
    };
    suffix?: {
      color?: ChalkString;
      marker?: string;
    };
  };
}

/**
 * Unordered list markers configuration (can be array or object)
 */
export type UnorderedListMarkers = string[] | {
  disc?: string;
  square?: string;
  circle?: string;
};

/**
 * Unordered list style configuration
 */
export interface UnorderedListStyle {
  color?: ChalkString;
  colors?: ChalkString[];
  markers?: UnorderedListMarkers;
  indent?: string;
}

/**
 * Ordered list style configuration
 */
export interface OrderedListStyle {
  color?: ChalkString;
  colors?: ChalkString[];
  markers?: OrderedListMarker[];
  decimal?: string;
  indent?: string;
}

/**
 * Horizontal rule style configuration
 */
export interface HrStyle {
  color?: ChalkString;
  marker?: string;
}

/**
 * Progress bar component style configuration
 */
export interface ProgressComponentStyle {
  color?: ChalkString;
  marker?: string;
}

/**
 * Progress bar style configuration
 */
export interface ProgressStyle {
  width?: number;
  filled?: ChalkString | ProgressComponentStyle;
  empty?: ChalkString | ProgressComponentStyle;
  color?: ChalkString;
}

/**
 * Checkbox style configuration
 */
export interface CheckboxStyle {
  checked?: {
    color?: ChalkString;
    marker?: string;
  };
  unchecked?: {
    color?: ChalkString;
    marker?: string;
  };
  open?: {
    color?: ChalkString;
    marker?: string;
  };
  close?: {
    color?: ChalkString;
    marker?: string;
  };
}

/**
 * Radio button style configuration
 */
export interface RadioStyle {
  checked?: {
    color?: ChalkString;
    marker?: string;
  };
  unchecked?: {
    color?: ChalkString;
    marker?: string;
  };
  open?: {
    color?: ChalkString;
    marker?: string;
  };
  close?: {
    color?: ChalkString;
    marker?: string;
  };
}

/**
 * Button style configuration
 */
export interface ButtonStyle {
  open?: {
    color?: ChalkString;
    marker?: string;
  };
  close?: {
    color?: ChalkString;
    marker?: string;
  };
  text?: {
    color?: ChalkString;
  };
}

/**
 * Input elements style configuration
 */
export interface InputStyle {
  checkbox?: CheckboxStyle;
  radio?: RadioStyle;
  button?: ButtonStyle;
}

/**
 * Image style configuration
 */
export interface ImgStyle {
  prefix?: {
    color?: ChalkString;
    marker?: string;
  };
  open?: {
    color?: ChalkString;
    marker?: string;
  };
  close?: {
    color?: ChalkString;
    marker?: string;
  };
  text?: {
    color?: ChalkString;
  };
}

/**
 * Keyboard input (kbd) key style configuration
 */
export interface KbdKeyStyle {
  enabled?: boolean;
  style?: 'simple' | 'box';
  separator?: string;
}

/**
 * Keyboard input (kbd) style configuration
 */
export interface KbdStyle {
  color?: ChalkString;
  prefix?: {
    marker?: string;
    color?: ChalkString;
  };
  suffix?: {
    marker?: string;
    color?: ChalkString;
  };
  key?: KbdKeyStyle;
}

/**
 * External link indicator style configuration
 */
export interface ExternalLinkIndicatorStyle {
  enabled?: boolean;
  marker?: string;
  color?: ChalkString;
  position?: 'before' | 'after';
  spacing?: string;
}

/**
 * Link (a) style configuration
 */
export interface LinkStyle {
  color?: ChalkString;
  hrefEnabled?: boolean | 'auto';
  hrefColor?: ChalkString;
  titleEnabled?: boolean;
  titleColor?: ChalkString;
  titlePrefix?: string;
  titleSuffix?: string;
  titlePrefixColor?: ChalkString;
  titleSuffixColor?: ChalkString;
  external?: ExternalLinkIndicatorStyle;
}

/**
 * Diff style configuration for del/ins
 */
export interface DiffStyle {
  enabled?: boolean;
  style?: 'simple' | 'git';
  marker?: string;
  color?: ChalkString;
}

/**
 * Deleted text (del) style configuration
 */
export interface DelStyle {
  color?: ChalkString;
  diff?: DiffStyle;
}

/**
 * Inserted text (ins) style configuration
 */
export interface InsStyle {
  color?: ChalkString;
  diff?: DiffStyle;
}

/**
 * Complete theme configuration for styling terminal output
 */
export interface Theme {
  // Headings
  h1?: ChalkString | HeadingStyle;
  h2?: ChalkString | HeadingStyle;
  h3?: ChalkString | HeadingStyle;
  h4?: ChalkString | HeadingStyle;
  h5?: ChalkString | HeadingStyle;
  h6?: ChalkString | HeadingStyle;

  // Inline elements
  span?: ChalkString;
  a?: ChalkString | LinkStyle;
  p?: ChalkString;

  // Box elements
  figure?: ChalkString | FigureStyle;
  figcaption?: ChalkString | FigcaptionStyle;
  fieldset?: ChalkString | FieldsetStyle;
  details?: ChalkString | DetailsStyle;
  blockquote?: ChalkString | BlockquoteStyle;
  address?: ChalkString;

  // Code
  code?: ChalkString | CodeStyle;

  // Legacy code properties (for backward compatibility)
  inlineCode?: ChalkString;
  codeNumbers?: ChalkString;

  // Tables
  table?: TableStyle;

  // Legacy table properties (for backward compatibility)
  tableHeader?: ChalkString;
  tableCaption?: ChalkString;
  tableCell?: ChalkString;

  // Definition lists
  dt?: ChalkString;
  dd?: ChalkString;
  dl?: ChalkString;

  // Text modifications
  del?: ChalkString | DelStyle;
  ins?: ChalkString | InsStyle;
  strikethrough?: ChalkString;
  underline?: ChalkString;
  bold?: ChalkString;
  samp?: ChalkString;
  kbd?: ChalkString | KbdStyle;
  variableTag?: ChalkString;
  mark?: ChalkString;
  time?: ChalkString;
  abbr?: ChalkString | AbbrStyle;

  // Legacy abbr properties (for backward compatibility)
  abbrTitle?: ChalkString;
  abbrParens?: ChalkString;

  dfn?: ChalkString | DfnStyle;

  // Emphasis
  italic?: ChalkString;
  i?: ChalkString;
  em?: ChalkString;
  cite?: ChalkString;

  // Lists
  ol?: ChalkString | OrderedListStyle;
  ul?: ChalkString | UnorderedListStyle;
  hr?: ChalkString | HrStyle;

  // Widgets
  progress?: ChalkString | ProgressStyle;
  input?: InputStyle;
  img?: ImgStyle;
}

/**
 * Line width configuration
 */
export interface LineWidthConfig {
  /** Maximum line width (terminal width) */
  max?: number;
  /** Fixed line width (overrides automatic detection) */
  value?: number;
}

/**
 * Configuration wrapper (can contain theme property)
 */
export interface Config {
  /** Custom theme configuration */
  theme?: Theme;
  /** Line width configuration */
  lineWidth?: LineWidthConfig;
  /** ASCII fallback mode for limited terminals (default: false) */
  asciiMode?: boolean;
}

/**
 * Renders HTML content to formatted terminal output
 *
 * @param html - HTML content to render
 * @param theme - Optional custom theme configuration
 * @returns Formatted terminal output
 *
 * @example
 * ```typescript
 * import { renderHTML } from 'cli-html';
 *
 * const html = '<h1>Hello World</h1><p>This is <strong>bold</strong>.</p>';
 * console.log(renderHTML(html));
 * ```
 *
 * @example
 * ```typescript
 * import { renderHTML } from 'cli-html';
 *
 * const customTheme = {
 *   h1: "magenta bold",
 *   code: { inline: "bgBlack yellow" }
 * };
 *
 * const html = '<h1>Styled Title</h1>';
 * console.log(renderHTML(html, customTheme));
 * ```
 */
export function renderHTML(html: string, theme?: Theme | Config): string;

/**
 * Renders Markdown content to formatted terminal output with full GitHub Flavored Markdown support
 *
 * @param markdown - Markdown content to render
 * @param theme - Optional custom theme configuration
 * @returns Formatted terminal output
 *
 * @example
 * ```typescript
 * import { renderMarkdown } from 'cli-html';
 *
 * const markdown = `
 * # Hello World
 *
 * > [!NOTE]
 * > This is a note
 *
 * - [x] Task 1
 * - [ ] Task 2
 * `;
 *
 * console.log(renderMarkdown(markdown));
 * ```
 *
 * @example
 * ```typescript
 * import { renderMarkdown } from 'cli-html';
 *
 * const customTheme = {
 *   h1: "cyan bold",
 *   h2: "blue bold"
 * };
 *
 * const markdown = '# Title\n\nParagraph with `code`.';
 * console.log(renderMarkdown(markdown, customTheme));
 * ```
 */
export function renderMarkdown(markdown: string, theme?: Theme | Config): string;

/**
 * Default export - alias for renderHTML
 *
 * @param html - HTML content to render
 * @param theme - Optional custom theme configuration
 * @returns Formatted terminal output
 *
 * @example
 * ```typescript
 * import cliHtml from 'cli-html';
 *
 * const html = '<h1>Hello World</h1>';
 * console.log(cliHtml(html));
 * ```
 */
export default function cliHtml(html: string, theme?: Theme | Config): string;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Validate and sanitize numeric value
 * @param value - Value to validate
 * @param min - Minimum allowed value (default: -Infinity)
 * @param max - Maximum allowed value (default: Infinity)
 * @param defaultValue - Default value if invalid (default: 0)
 * @returns Validated number or default
 */
export function validateNumber(value: any, min?: number, max?: number, defaultValue?: number): number;

/**
 * Validate and sanitize integer value
 * @param value - Value to validate
 * @param min - Minimum allowed value (default: -Infinity)
 * @param max - Maximum allowed value (default: Infinity)
 * @param defaultValue - Default value if invalid (default: 0)
 * @returns Validated integer or default
 */
export function validateInteger(value: any, min?: number, max?: number, defaultValue?: number): number;

/**
 * Validate boolean value from various formats
 * @param value - Value to validate (true/false/'true'/'false'/1/0/'yes'/'no')
 * @param defaultValue - Default value if invalid (default: false)
 * @returns Validated boolean or default
 */
export function validateBoolean(value: any, defaultValue?: boolean): boolean;

/**
 * Validate color string format (chalk-string compatible)
 * @param color - Color string to validate
 * @returns True if valid color format
 */
export function isValidColor(color: string): boolean;

/**
 * Check if NO_COLOR environment variable is set
 * @returns True if colors should be disabled
 */
export function isNoColor(): boolean;

/**
 * Get visual length of string (accounting for ANSI codes, emoji, and wide characters)
 * @param str - Input string (may contain ANSI codes, emoji, wide chars)
 * @returns Visual length
 */
export function visualLength(str: string): number;

/**
 * Convert string to title case
 * @param str - Input string
 * @returns Title cased string
 * @example toTitleCase('hello world') // => 'Hello World'
 */
export function toTitleCase(str: string): string;

/**
 * Capitalize first letter of string (rest unchanged)
 * @param str - Input string
 * @returns Capitalized string
 * @example capitalize('hello world') // => 'Hello world'
 */
export function capitalize(str: string): string;

/**
 * Strip all ANSI escape codes from string
 * @param str - Input string with ANSI codes
 * @returns String without ANSI codes
 * @example stripAnsi('\x1b[31mred\x1b[0m') // => 'red'
 */
export function stripAnsi(str: string): string;

/**
 * Check if string is empty (null, undefined, or empty string)
 * @param str - Input string
 * @returns True if empty
 */
export function isEmpty(str: any): boolean;

/**
 * Reverse a string
 * @param str - Input string
 * @returns Reversed string
 * @example reverse('hello') // => 'olleh'
 */
export function reverse(str: string): string;

/**
 * Count occurrences of substring in string
 * @param str - Input string
 * @param substr - Substring to count
 * @param caseSensitive - Case sensitive search (default: true)
 * @returns Number of occurrences
 */
export function count(str: string, substr: string, caseSensitive?: boolean): number;

/**
 * Convert Unicode characters to ASCII equivalents
 * Useful for terminals that don't support Unicode properly
 * @param str - Input string with Unicode characters
 * @returns String with ASCII equivalents
 * @example toAscii('Progress: ████░░░░') // => 'Progress: ####----'
 */
export function toAscii(str: string): string;

/**
 * Convert a marker (symbol) to ASCII if needed
 * @param marker - Original marker (may be Unicode)
 * @param asciiMode - Whether ASCII mode is enabled
 * @returns ASCII marker if asciiMode is true, original otherwise
 */
export function markerToAscii(marker: string, asciiMode?: boolean): string;

/**
 * Logger with different levels (DEBUG, INFO, WARN, ERROR)
 * Only logs when DEBUG environment variable is set (except WARN and ERROR)
 */
export const logger: {
  debug(context: string, message: string, data?: any): void;
  info(context: string, message: string, data?: any): void;
  warn(context: string, message: string, data?: any): void;
  error(context: string, message: string, error?: Error | any): void;
};

/**
 * Safe wrapper for functions that might throw
 * @param fn - Function to execute
 * @param fallback - Fallback value on error
 * @param context - Context for error logging
 * @returns Function result or fallback
 */
export function safeExecute<T>(fn: () => T, fallback: T, context?: string): T;
