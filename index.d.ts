/**
 * TypeScript definitions for cli-html
 * Renderer for HTML and Markdown in the Terminal
 *
 * Theme defaults live in `config.yaml` (under `theme:`); every property here is
 * optional and deep-merged over those defaults.
 */

// ============================================================================
// Primitive types
// ============================================================================

/**
 * Chalk-string compatible color/style value
 * Examples: "red bold", "bgBlue white underline", "cyan", "" (no styling)
 */
export type ChalkString = string;

/** Function that styles text (e.g. a chalk instance). */
export type ColorFunction = (text: string) => string;

/** A color: chalk-string spec or styling function. */
export type Color = ChalkString | ColorFunction;

/**
 * An object style with a `color` key, which may also be given in shorthand
 * as just a color (`h1: 'red bold'` is expanded to `h1: { color: 'red bold' }`).
 */
export type Styled<T extends { color?: Color }> = Color | T;

/** Boxen border style for figure, fieldset, details and dialog elements */
export type BorderStyle = 'single' | 'double' | 'round' | 'bold' | 'singleDouble' | 'doubleSingle' | 'classic' | 'arrow';

/** Ordered list marker types */
export type OrderedListMarker = '1' | 'A' | 'a' | 'I' | 'i';

/** Placement of an indicator relative to its content */
export type Position = 'before' | 'after';

// ============================================================================
// Shared structures
// ============================================================================

/** Plain color entry: `{ color }` */
export interface ColorStyle {
  color?: Color;
}

/** Marker with its own color (prefix / suffix / indicator / state pattern) */
export interface MarkerStyle {
  marker?: string;
  color?: Color;
}

/** Border configuration for box elements */
export interface BorderConfig {
  color?: Color;
  style?: BorderStyle;
  dim?: boolean;
}

/** Padding configuration (lines for top/bottom, spaces for left/right) */
export interface PaddingConfig {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

/** Element with a color and optional prefix/suffix markers */
export interface AffixStyle {
  color?: Color;
  prefix?: Styled<MarkerStyle>;
  suffix?: Styled<MarkerStyle>;
}

/** Title pattern: colored text wrapped in prefix/suffix markers */
export interface TitleStyle extends AffixStyle {}

/** Box container (figure, dialog) */
export interface BoxStyle {
  color?: Color;
  border?: Styled<BorderConfig>;
  padding?: PaddingConfig;
}

/** Required-field indicator */
export interface RequiredStyle {
  enabled?: boolean;
  indicator?: Styled<MarkerStyle & { position?: Position }>;
}

/** Element with a separate disabled color */
export interface DisabledStyle {
  disabled?: Styled<ColorStyle>;
}

// ============================================================================
// Headings & text blocks
// ============================================================================

/** h1-h6 */
export interface HeadingStyle {
  color?: Color;
  indicator?: Styled<MarkerStyle>;
}

/** Blockquote; indicators rotate by nesting depth */
export interface BlockquoteStyle {
  color?: Color;
  indicators?: MarkerStyle[];
}

/** Preformatted block */
export interface PreStyle {
  padding?: PaddingConfig;
}

// ============================================================================
// Code
// ============================================================================

/** Code block line numbers */
export interface CodeNumbersStyle {
  enabled?: boolean;
  color?: Color;
}

/** Code block gutter between numbers and code */
export interface CodeGutterStyle {
  enabled?: boolean;
  marker?: string;
  color?: Color;
}

/** Code block language label */
export interface CodeLabelStyle {
  enabled?: boolean;
  position?: 'top' | 'bottom';
  color?: Color;
  prefix?: Styled<MarkerStyle>;
  suffix?: Styled<MarkerStyle>;
}

/** Highlighted lines */
export interface CodeHighlightStyle {
  color?: Color;
}

/** Marker for wrapped continuation lines (replaces the line number) */
export interface CodeOverflowIndicatorStyle {
  enabled?: boolean;
  marker?: string;
  color?: Color;
}

/** Style for one diff line kind */
export interface CodeDiffLineStyle {
  color?: Color;
  indicator?: Styled<MarkerStyle>;
}

/** Git-style diff highlighting in code blocks */
export interface CodeDiffStyle {
  enabled?: boolean;
  added?: Styled<CodeDiffLineStyle>;
  removed?: Styled<CodeDiffLineStyle>;
  modified?: Styled<CodeDiffLineStyle>;
  unchanged?: Styled<CodeDiffLineStyle>;
}

/** Block code (`<pre><code>`) features */
export interface CodeBlockStyle {
  enabled?: boolean;
  color?: Color;
  numbers?: Styled<CodeNumbersStyle>;
  gutter?: Styled<CodeGutterStyle>;
  label?: Styled<CodeLabelStyle>;
  overflowIndicator?: Styled<CodeOverflowIndicatorStyle>;
  diff?: CodeDiffStyle;
}

/** `<code>`; `color` is used for inline code */
export interface CodeStyle {
  color?: Color;
  highlight?: Styled<CodeHighlightStyle>;
  block?: Styled<CodeBlockStyle>;
}

// ============================================================================
// Inline semantics
// ============================================================================

/** kbd key-by-key rendering */
export interface KbdKeyStyle {
  enabled?: boolean;
  style?: 'simple' | 'box';
  separator?: string;
}

/** `<kbd>` */
export interface KbdStyle extends AffixStyle {
  key?: KbdKeyStyle;
}

/** `<samp>` */
export interface SampStyle extends AffixStyle {}

/** `<abbr>` */
export interface AbbrStyle {
  color?: Color;
  title?: Styled<TitleStyle>;
}

/** `<dfn>` */
export interface DfnStyle {
  color?: Color;
  title?: Styled<TitleStyle>;
}

/** `<ruby>` */
export interface RubyStyle {
  color?: Color;
  rt?: Styled<AffixStyle>;
}

/** `<time>` */
export interface TimeStyle {
  color?: Color;
  datetime?: Styled<AffixStyle & { enabled?: boolean }>;
}

/** `<sub>` / `<sup>` */
export interface ScriptStyle extends AffixStyle {}

/** Diff markers for del/ins */
export interface DiffStyle {
  enabled?: boolean;
  style?: 'simple' | 'git';
  marker?: string;
  color?: Color;
}

/** `<del>` */
export interface DelStyle {
  color?: Color;
  diff?: Styled<DiffStyle>;
}

/** `<ins>` */
export interface InsStyle {
  color?: Color;
  diff?: Styled<DiffStyle>;
}

/** `<q>` */
export interface QStyle extends AffixStyle {
  cite?: Styled<{ enabled?: boolean; color?: Color }>;
}

// ============================================================================
// Links
// ============================================================================

/** Link href display */
export interface LinkHrefStyle {
  /** `auto` shows the href only when the terminal lacks hyperlink support */
  enabled?: boolean | 'auto';
  color?: Color;
}

/** Link title display */
export interface LinkTitleStyle extends AffixStyle {
  enabled?: boolean;
}

/** External link indicator */
export interface ExternalLinkIndicatorStyle {
  enabled?: boolean;
  marker?: string;
  color?: Color;
  position?: Position;
  spacing?: string;
}

/** `<a>` */
export interface LinkStyle {
  color?: Color;
  href?: Styled<LinkHrefStyle>;
  title?: Styled<LinkTitleStyle>;
  external?: Styled<ExternalLinkIndicatorStyle>;
}

// ============================================================================
// Lists
// ============================================================================

/** `<ul>` */
export interface UnorderedListStyle {
  color?: Color;
  indicators?: {
    disc?: Styled<MarkerStyle>;
    square?: Styled<MarkerStyle>;
    circle?: Styled<MarkerStyle>;
  };
  indent?: string;
}

/** Ordered list indicator (marker is the numbering type) */
export interface OrderedListIndicatorStyle {
  color?: Color;
  marker?: OrderedListMarker;
  decimal?: string;
}

/** `<ol>` */
export interface OrderedListStyle {
  color?: Color;
  indicators?: Partial<Record<OrderedListMarker, Styled<OrderedListIndicatorStyle>>>;
  indent?: string;
}

/** `<dt>` */
export interface DtStyle {
  color?: Color;
  suffix?: Styled<MarkerStyle>;
}

// ============================================================================
// Tables
// ============================================================================

/** Responsive (list view) mode for narrow terminals */
export interface TableResponsiveStyle {
  enabled?: boolean;
  threshold?: number;
  separator?: string;
  itemSeparator?: string;
}

/** Zebra striping row style */
export interface TableStripingRowStyle {
  color?: Color;
}

/** Zebra striping */
export interface TableStripingStyle {
  enabled?: boolean;
  /** Number of colors to cycle through (2-5) */
  count?: number;
  /** Row styles (0-based; data-cli attributes use 1-based numbering) */
  rows?: TableStripingRowStyle[];
}

/** Alignment indicator for one alignment */
export interface TableAlignmentIndicatorStyle {
  indicator?: string;
  color?: Color;
}

/** Cell alignment indicators */
export interface TableAlignmentStyle {
  enabled?: boolean;
  left?: Styled<TableAlignmentIndicatorStyle>;
  center?: Styled<TableAlignmentIndicatorStyle>;
  right?: Styled<TableAlignmentIndicatorStyle>;
}

/** `<table>` (cell/section colors are the top-level th/td/tr/... keys) */
export interface TableStyle {
  color?: Color;
  /** Cell padding (spaces) */
  padding?: { left?: number; right?: number };
  responsive?: TableResponsiveStyle;
  striping?: TableStripingStyle;
  alignment?: TableAlignmentStyle;
}

// ============================================================================
// Forms & inputs
// ============================================================================

/** Checked/unchecked toggle (checkbox, radio) */
export interface ToggleInputStyle {
  checked?: Styled<MarkerStyle>;
  unchecked?: Styled<MarkerStyle>;
  prefix?: Styled<MarkerStyle>;
  suffix?: Styled<MarkerStyle>;
}

/** Checkbox input */
export interface CheckboxStyle extends ToggleInputStyle {}

/** Radio input */
export interface RadioStyle extends ToggleInputStyle {}

/** `<input type="button">` */
export interface InputButtonStyle extends AffixStyle {}

/** `<input type="range">` */
export interface RangeStyle {
  filled?: Styled<MarkerStyle>;
  empty?: Styled<MarkerStyle>;
  thumb?: Styled<MarkerStyle>;
}

/** `<input type="color">` */
export interface ColorInputStyle {
  /** Indicator marker, drawn in the input's own color */
  indicator?: { marker?: string };
  prefix?: Styled<MarkerStyle>;
  suffix?: Styled<MarkerStyle>;
  value?: Styled<ColorStyle>;
}

/** `<input type="password">` */
export interface PasswordStyle {
  char?: string;
  count?: number;
  color?: Color;
}

/** `<input type="email">` / `<input type="date">` */
export interface PrefixedInputStyle {
  color?: Color;
  prefix?: Styled<MarkerStyle>;
}

/** `<input type="file">` */
export interface FileInputStyle extends PrefixedInputStyle {
  placeholder?: string;
}

/** `<input>` (all types) */
export interface InputStyle extends DisabledStyle {
  required?: RequiredStyle;
  checkbox?: CheckboxStyle;
  radio?: RadioStyle;
  button?: Styled<InputButtonStyle>;
  textInput?: Styled<ColorStyle>;
  textarea?: Styled<ColorStyle>;
  range?: RangeStyle;
  color?: ColorInputStyle;
  password?: Styled<PasswordStyle>;
  email?: Styled<PrefixedInputStyle>;
  date?: Styled<PrefixedInputStyle>;
  file?: Styled<FileInputStyle>;
}

/** `<button>` (separate from `input.button`) */
export interface ButtonStyle extends AffixStyle, DisabledStyle {}

/** `<fieldset>` */
export interface FieldsetStyle extends BoxStyle, DisabledStyle {
  /** Legend color */
  title?: Styled<ColorStyle>;
  required?: RequiredStyle;
}

/** `<select>` */
export interface SelectStyle extends AffixStyle, DisabledStyle {}

/** `<option>` */
export interface OptionStyle extends DisabledStyle {
  color?: Color;
  selected?: Styled<MarkerStyle>;
  unselected?: Styled<MarkerStyle>;
}

/** `<optgroup>` */
export interface OptgroupStyle extends DisabledStyle {
  indicator?: Styled<MarkerStyle>;
  label?: Styled<ColorStyle>;
}

// ============================================================================
// Interactive / widgets
// ============================================================================

/** `<details>` */
export interface DetailsStyle extends BoxStyle {
  /** Show only the summary of a closed `<details>` (default false) */
  collapse?: { enabled?: boolean };
  indicator?: {
    open?: Styled<MarkerStyle>;
    closed?: Styled<MarkerStyle>;
  };
}

/** `<progress>` */
export interface ProgressStyle {
  /** Fixed bar width (adaptive by default) */
  width?: number;
  filled?: Styled<MarkerStyle>;
  empty?: Styled<MarkerStyle>;
}

/** Meter range */
export interface MeterRangeStyle extends MarkerStyle {
  /** Fraction of max (0-1) */
  threshold?: number;
}

/** `<meter>` */
export interface MeterStyle {
  width?: number;
  ranges?: {
    low?: Styled<MeterRangeStyle>;
    medium?: Styled<MeterRangeStyle>;
    high?: Styled<MeterRangeStyle>;
  };
  empty?: Styled<MarkerStyle>;
  labels?: Styled<{
    enabled?: boolean;
    /** `%v` value, `%m` max, `%n` min, `%%` percent */
    format?: string;
    color?: Color;
    position?: 'left' | 'right';
  }>;
}

/** `<data>` */
export interface DataStyle {
  color?: Color;
  value?: Styled<AffixStyle & { enabled?: boolean }>;
}

// ============================================================================
// Media
// ============================================================================

/** `<video>` / `<audio>` placeholder */
export interface MediaStyle {
  indicator?: Styled<MarkerStyle>;
  prefix?: Styled<MarkerStyle>;
  suffix?: Styled<MarkerStyle>;
  title?: Styled<ColorStyle>;
}

/** `<video>` */
export interface VideoStyle extends MediaStyle {}

/** `<audio>` */
export interface AudioStyle extends MediaStyle {}

/** `<img>` */
export interface ImgStyle {
  indicator?: Styled<MarkerStyle>;
  prefix?: Styled<MarkerStyle>;
  suffix?: Styled<MarkerStyle>;
  alt?: Styled<ColorStyle>;
}

// ============================================================================
// Visual / containers / legacy
// ============================================================================

/** `<hr>` */
export interface HrStyle {
  color?: Color;
  style?: 'single' | 'double' | 'bold' | 'dashed' | 'dotted';
  /** Explicit character; overrides `style` when non-empty */
  marker?: string;
}

/** `<figure>` */
export interface FigureStyle extends BoxStyle {}

/** `<dialog>` */
export interface DialogStyle extends BoxStyle {}

/** `<figcaption>` */
export interface FigcaptionStyle {
  color?: Color;
  prefix?: string;
  suffix?: string;
}

/** `<blink>` */
export interface BlinkStyle {
  color?: Color;
  animation?: {
    enabled?: boolean;
    indicator?: Styled<MarkerStyle & { position?: Position | 'both' }>;
  };
}

/** Marquee direction indicator */
export interface MarqueeDirectionIndicator {
  indicator?: Styled<MarkerStyle>;
}

/** `<marquee>` */
export interface MarqueeStyle {
  color?: Color;
  direction?: {
    enabled?: boolean;
    left?: MarqueeDirectionIndicator;
    right?: MarqueeDirectionIndicator;
    up?: MarqueeDirectionIndicator;
    down?: MarqueeDirectionIndicator;
    position?: Position;
  };
}

// ============================================================================
// Theme
// ============================================================================

/**
 * Complete theme configuration (mirrors `theme:` in config.yaml).
 * Any entry with a `color` key also accepts a plain color shorthand.
 */
export interface Theme {
  // Headings
  h1?: Styled<HeadingStyle>;
  h2?: Styled<HeadingStyle>;
  h3?: Styled<HeadingStyle>;
  h4?: Styled<HeadingStyle>;
  h5?: Styled<HeadingStyle>;
  h6?: Styled<HeadingStyle>;

  // Text blocks
  p?: Styled<ColorStyle>;
  blockquote?: Styled<BlockquoteStyle>;
  address?: Styled<ColorStyle>;
  pre?: PreStyle;

  // Inline formatting
  span?: Styled<ColorStyle>;
  bold?: Styled<ColorStyle>;
  italic?: Styled<ColorStyle>;
  i?: Styled<ColorStyle>;
  em?: Styled<ColorStyle>;
  cite?: Styled<ColorStyle>;
  underline?: Styled<ColorStyle>;
  strikethrough?: Styled<ColorStyle>;
  mark?: Styled<ColorStyle>;

  // Semantic inline
  code?: Styled<CodeStyle>;
  kbd?: Styled<KbdStyle>;
  samp?: Styled<SampStyle>;
  var?: Styled<ColorStyle>;
  abbr?: Styled<AbbrStyle>;
  dfn?: Styled<DfnStyle>;
  ruby?: Styled<RubyStyle>;
  time?: Styled<TimeStyle>;
  sub?: Styled<ScriptStyle>;
  sup?: Styled<ScriptStyle>;
  del?: Styled<DelStyle>;
  ins?: Styled<InsStyle>;

  // Links & quotes
  a?: Styled<LinkStyle>;
  q?: Styled<QStyle>;

  // Lists
  ul?: Styled<UnorderedListStyle>;
  ol?: Styled<OrderedListStyle>;
  li?: Styled<ColorStyle>;
  dl?: Styled<ColorStyle>;
  dt?: Styled<DtStyle>;
  dd?: Styled<ColorStyle>;

  // Tables
  table?: Styled<TableStyle>;
  caption?: Styled<ColorStyle>;
  thead?: Styled<ColorStyle>;
  tbody?: Styled<ColorStyle>;
  tfoot?: Styled<ColorStyle>;
  tr?: Styled<ColorStyle>;
  th?: Styled<ColorStyle>;
  td?: Styled<ColorStyle>;

  // Forms
  input?: InputStyle;
  button?: Styled<ButtonStyle>;
  fieldset?: Styled<FieldsetStyle>;
  label?: Styled<ColorStyle>;
  select?: Styled<SelectStyle>;
  option?: Styled<OptionStyle>;
  optgroup?: OptgroupStyle;

  // Interactive / widgets
  details?: Styled<DetailsStyle>;
  progress?: ProgressStyle;
  meter?: MeterStyle;
  data?: Styled<DataStyle>;

  // Media
  video?: VideoStyle;
  audio?: AudioStyle;
  img?: ImgStyle;

  // Visual
  hr?: Styled<HrStyle>;
  figure?: Styled<FigureStyle>;
  figcaption?: Styled<FigcaptionStyle>;

  // Containers
  div?: Styled<ColorStyle>;
  header?: Styled<ColorStyle>;
  footer?: Styled<ColorStyle>;
  article?: Styled<ColorStyle>;
  section?: Styled<ColorStyle>;
  main?: Styled<ColorStyle>;
  nav?: Styled<ColorStyle>;
  aside?: Styled<ColorStyle>;
  form?: Styled<ColorStyle>;
  picture?: Styled<ColorStyle>;
  hgroup?: Styled<ColorStyle>;
  dialog?: Styled<DialogStyle>;

  // Legacy
  center?: Styled<ColorStyle>;
  blink?: Styled<BlinkStyle>;
  marquee?: Styled<MarqueeStyle>;
}

// ============================================================================
// Render configuration
// ============================================================================

/** Line width configuration */
export interface LineWidthConfig {
  /** Maximum line width when auto-detecting from the terminal (default 120) */
  max?: number;
  /** Fixed line width (overrides automatic detection) */
  value?: number;
}

/** Full render configuration */
export interface Config {
  /** Theme overrides */
  theme?: Theme;
  /** Line width configuration */
  lineWidth?: LineWidthConfig;
  /** ASCII fallback mode for limited terminals (default: false) */
  asciiMode?: boolean;
}

/**
 * Second argument of the render functions: a full {@link Config}, or a bare
 * {@link Theme} (used as the theme when no `theme` key is present).
 */
export type RenderOptions = Config | Theme;

// ============================================================================
// API
// ============================================================================

/**
 * Renders HTML content to formatted terminal output
 *
 * @param html - HTML content to render
 * @param options - Optional config (`{ theme, lineWidth, asciiMode }`) or bare theme
 * @returns Formatted terminal output
 *
 * @example
 * ```typescript
 * import { renderHTML } from 'cli-html';
 *
 * console.log(renderHTML('<h1>Hello</h1>', {
 *   theme: { h1: 'magenta bold', code: { color: 'bgBlack yellow' } },
 *   lineWidth: { value: 80 },
 * }));
 * ```
 */
export function renderHTML(html: string, options?: RenderOptions): string;

/**
 * Renders Markdown content (GitHub Flavored Markdown) to formatted terminal output
 *
 * @param markdown - Markdown content to render
 * @param options - Optional config (`{ theme, lineWidth, asciiMode }`) or bare theme
 * @returns Formatted terminal output
 *
 * @example
 * ```typescript
 * import { renderMarkdown } from 'cli-html';
 *
 * console.log(renderMarkdown('# Title\n\n- [x] Task', { h1: 'cyan bold' }));
 * ```
 */
export function renderMarkdown(markdown: string, options?: RenderOptions): string;

/**
 * Renders a React/JSX element or component to formatted terminal output.
 *
 * `react` and `react-dom` are loaded lazily, so importing cli-html for plain
 * HTML/Markdown rendering never pays for them; they ship as dependencies.
 *
 * @param jsx - A React element (e.g. `<App />`) or a component to instantiate
 * @param options - Optional config (`{ theme, lineWidth, asciiMode }`) or bare theme
 * @returns Promise resolving to formatted terminal output
 *
 * @example
 * ```tsx
 * import { renderJSX } from 'cli-html';
 *
 * const App = () => <h1>Hello from JSX</h1>;
 * console.log(await renderJSX(<App />));
 * ```
 */
export function renderJSX(jsx: unknown, options?: RenderOptions): Promise<string>;

/**
 * Default export - alias for {@link renderHTML}
 */
export default renderHTML;
