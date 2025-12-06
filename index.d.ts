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
  lineWidth?: number;
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
 * Code block style configuration
 */
export interface CodeBlockStyle {
  color?: ChalkString;
  numbers?: CodeNumbersStyle;
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
 * Table style configuration
 */
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
}

/**
 * Abbreviation style configuration
 */
export interface AbbrStyle {
  color?: ChalkString;
  title?: {
    color?: ChalkString;
  };
  parens?: {
    color?: ChalkString;
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
  a?: ChalkString;

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
  del?: ChalkString;
  ins?: ChalkString;
  strikethrough?: ChalkString;
  underline?: ChalkString;
  bold?: ChalkString;
  samp?: ChalkString;
  kbd?: ChalkString;
  variableTag?: ChalkString;
  mark?: ChalkString;
  time?: ChalkString;
  abbr?: ChalkString | AbbrStyle;

  // Legacy abbr properties (for backward compatibility)
  abbrTitle?: ChalkString;
  abbrParens?: ChalkString;

  dfn?: ChalkString;

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
 * Configuration wrapper (can contain theme property)
 */
export interface Config {
  theme?: Theme;
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
