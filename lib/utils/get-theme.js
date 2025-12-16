import chalkString from 'chalk-string';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import YAML from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '../../config.yaml');
const baseConfig = YAML.parse(readFileSync(configPath, 'utf8'));

// Check for NO_COLOR environment variable (https://no-color.org/)
const noColor =
  typeof process !== 'undefined' &&
  process.env.NO_COLOR !== undefined &&
  process.env.NO_COLOR !== '';

const forceColor =
  !noColor &&
  typeof process !== 'undefined' &&
  process.env.FORCE_COLOR &&
  process.env.FORCE_COLOR !== '0';

const baseThemeConfig = baseConfig?.theme ?? baseConfig ?? {};

const toConfigObject = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    return null;
  }

  if (typeof value === 'object') {
    return { ...value };
  }

  return { color: value };
};

const pickFirst = (...values) => values.find((value) => value !== undefined && value !== null);

const parseStyleEntry = (customValue, fallback, extraKeys = []) => {
  const base = toConfigObject(fallback) || {};
  const override = toConfigObject(customValue);
  const config = override ? { ...base, ...override } : base;

  const colorValue = config.color;

  const extras = extraKeys.reduce((accumulator, key) => {
    if (config[key] !== undefined) {
      return { ...accumulator, [key]: config[key] };
    }
    return accumulator;
  }, {});

  // Support for nested prefix/suffix format: { marker, color }
  // If prefix/suffix are in extraKeys, keep them as objects; otherwise convert to flat format
  if (config.prefix && typeof config.prefix === 'object' && !Array.isArray(config.prefix)) {
    if (extraKeys.includes('prefix')) {
      // Keep as object
      extras.prefix = config.prefix;
    } else {
      // Convert to flat format for backwards compatibility
      extras.prefix = config.prefix.marker ?? '';
      extras.prefixColor = config.prefix.color ?? '';
    }
  }
  if (config.suffix && typeof config.suffix === 'object' && !Array.isArray(config.suffix)) {
    if (extraKeys.includes('suffix')) {
      // Keep as object
      extras.suffix = config.suffix;
    } else {
      // Convert to flat format for backwards compatibility
      extras.suffix = config.suffix.marker ?? '';
      extras.suffixColor = config.suffix.color ?? '';
    }
  }

  // Support for nested href format: { enabled, color }
  if (config.href && typeof config.href === 'object' && !Array.isArray(config.href)) {
    extras.hrefEnabled = config.href.enabled ?? false;
    extras.hrefColor = config.href.color ?? '';
  }

  // Support for nested title format: { enabled, color, prefix, suffix }
  if (config.title && typeof config.title === 'object' && !Array.isArray(config.title)) {
    extras.titleEnabled = config.title.enabled ?? false;
    extras.titleColor = config.title.color ?? '';

    // Handle nested prefix/suffix within title
    if (config.title.prefix && typeof config.title.prefix === 'object') {
      extras.titlePrefix = config.title.prefix.marker ?? '';
      extras.titlePrefixColor = config.title.prefix.color ?? '';
    } else {
      extras.titlePrefix = config.title.prefix ?? '';
    }

    if (config.title.suffix && typeof config.title.suffix === 'object') {
      extras.titleSuffix = config.title.suffix.marker ?? '';
      extras.titleSuffixColor = config.title.suffix.color ?? '';
    } else {
      extras.titleSuffix = config.title.suffix ?? '';
    }
  }

  // Support for nested external format: { enabled, marker, color, position, spacing }
  if (config.external && typeof config.external === 'object' && !Array.isArray(config.external)) {
    extras.external = config.external;
  }

  // Support for nested text format: { color } (for input file)
  if (config.text && typeof config.text === 'object' && !Array.isArray(config.text)) {
    extras.textColor = config.text.color ?? '';
  }

  // Support for nested indicators format (for ol/ul): use 'indicators' instead of 'markers'
  if (config.indicators && typeof config.indicators === 'object' && !Array.isArray(config.indicators)) {
    extras.indicators = config.indicators;
    extras.markers = config.indicators; // Backwards compatibility
  } else if (config.markers && typeof config.markers === 'object' && !Array.isArray(config.markers)) {
    // Backwards compatibility: markers → indicators
    extras.indicators = config.markers;
    extras.markers = config.markers;
  }

  // Support for nested indicator format: { marker, color } or { open: {marker, color}, closed: {marker, color} }
  // For backwards compatibility, also check for 'marker' key
  if (config.indicator && typeof config.indicator === 'object' && !Array.isArray(config.indicator)) {
    // If it has open/closed (for details/summary)
    if (config.indicator.open !== undefined || config.indicator.closed !== undefined) {
      // Process nested structure: open/closed can be objects or strings
      const processState = (state) => {
        if (typeof state === 'object' && !Array.isArray(state)) {
          // New format: { marker, color }
          return state;
        } else if (typeof state === 'string') {
          // Legacy format: just a string, convert to { marker }
          return { marker: state };
        }
        return state;
      };

      extras.indicator = {
        open: processState(config.indicator.open),
        closed: processState(config.indicator.closed),
      };
    } else {
      // Otherwise it's { marker, color } format
      extras.indicator = config.indicator;
    }
  } else if (config.marker && typeof config.marker === 'object' && !Array.isArray(config.marker)) {
    // Backwards compatibility: marker → indicator
    if (config.marker.open !== undefined || config.marker.closed !== undefined) {
      const processState = (state) => {
        if (typeof state === 'object' && !Array.isArray(state)) {
          return state;
        } else if (typeof state === 'string') {
          return { marker: state };
        }
        return state;
      };

      extras.indicator = {
        open: processState(config.marker.open),
        closed: processState(config.marker.closed),
      };
      extras.marker = extras.indicator; // Keep both for compatibility
    } else {
      extras.indicator = config.marker;
      extras.marker = config.marker;
    }
  }

  const applyStyle = (colorValue && !noColor)
    ? (value = '') => {
      const styler = chalkString(
        colorValue,
        forceColor ? { colors: true } : undefined,
      );
      return styler(value);
    }
    : (value = '') => value;

  return {
    color: applyStyle,
    ...extras,
  };
};

export const getTheme = (customThemeInput = {}) => {
  const baseTheme = baseThemeConfig;
  const customTheme = customThemeInput?.theme ?? customThemeInput;

  const dtStyle = parseStyleEntry(customTheme.dt, baseTheme.dt);
  const ddStyle = parseStyleEntry(
    customTheme.dd ?? customTheme.dt,
    baseTheme.dd ?? baseTheme.dt,
  );

  const italicStyle = parseStyleEntry(customTheme.italic, baseTheme.italic);

  // Code styles - new structure
  // Default color (used for inline code and as base)
  const codeStyle = parseStyleEntry(
    customTheme.code,
    baseTheme.code,
    ["padding", "block", "highlight"],
  );

  // Highlight feature (can be used with any code)
  const codeHighlightFeature = parseStyleEntry(
    customTheme.code?.highlight,
    baseTheme.code?.highlight,
  );

  // Block feature (optional override for block code)
  const codeBlockFeature = parseStyleEntry(
    customTheme.code?.block,
    baseTheme.code?.block,
    ["enabled", "numbers", "gutter", "label", "overflowIndicator", "diff"],
  );

  // Numbers feature (inside block)
  const codeNumbersFeature = parseStyleEntry(
    customTheme.code?.block?.numbers,
    baseTheme.code?.block?.numbers,
    ["enabled"],
  );

  // Gutter feature (inside block)
  const codeGutterFeature = parseStyleEntry(
    customTheme.code?.block?.gutter,
    baseTheme.code?.block?.gutter,
    ["enabled", "marker"],
  );

  // Label feature (inside block)
  const codeLabelFeature = parseStyleEntry(
    customTheme.code?.block?.label,
    baseTheme.code?.block?.label,
    ["enabled", "position", "prefix", "suffix"],
  );

  // Overflow indicator feature (inside block)
  const codeOverflowIndicatorFeature = parseStyleEntry(
    customTheme.code?.block?.overflowIndicator,
    baseTheme.code?.block?.overflowIndicator,
    ["enabled", "marker"],
  );

  // Diff feature (git-style diff highlighting, inside block)
  const codeDiffFeature = parseStyleEntry(
    customTheme.code?.block?.diff,
    baseTheme.code?.block?.diff,
    ["enabled", "added", "removed", "modified", "unchanged"],
  );

  // Pre styles (padding for code blocks)
  const preStyle = parseStyleEntry(
    customTheme.pre,
    baseTheme.pre,
    ["padding"],
  );
  const prePadding = preStyle.padding ?? { left: 0, right: 0, top: 0, bottom: 0 };

  // Table styles
  const tableStyle = parseStyleEntry(
    customTheme.table,
    baseTheme.table,
    ["responsive"],
  );

  const tableHeaderStyle = parseStyleEntry(
    customTheme.table?.header ?? customTheme.tableHeader,
    baseTheme.table?.header ?? baseTheme.tableHeader,
  );

  const captionStyle = parseStyleEntry(
    customTheme.caption ?? customTheme.table?.caption ?? customTheme.tableCaption,
    baseTheme.caption ?? baseTheme.table?.caption ?? baseTheme.tableCaption,
  );

  const tdStyle = parseStyleEntry(
    customTheme.td ?? customTheme.table?.td ?? customTheme.table?.cell ?? customTheme.tableCell,
    baseTheme.td ?? baseTheme.table?.td ?? baseTheme.table?.cell ?? baseTheme.tableCell,
  );

  const thStyle = parseStyleEntry(
    customTheme.th ?? customTheme.table?.th,
    baseTheme.th ?? baseTheme.table?.th,
  );

  const trStyle = parseStyleEntry(
    customTheme.tr ?? customTheme.table?.tr,
    baseTheme.tr ?? baseTheme.table?.tr,
  );

  const theadStyle = parseStyleEntry(
    customTheme.thead ?? customTheme.table?.thead,
    baseTheme.thead ?? baseTheme.table?.thead,
  );

  const tbodyStyle = parseStyleEntry(
    customTheme.tbody ?? customTheme.table?.tbody,
    baseTheme.tbody ?? baseTheme.table?.tbody,
  );

  const tfootStyle = parseStyleEntry(
    customTheme.tfoot ?? customTheme.table?.tfoot,
    baseTheme.tfoot ?? baseTheme.table?.tfoot,
  );

  // Abbr styles
  const abbrStyle = parseStyleEntry(
    customTheme.abbr?.color ?? customTheme.abbr,
    baseTheme.abbr?.color ?? baseTheme.abbr,
  );

  const abbrTitleStyle = parseStyleEntry(
    customTheme.abbr?.title ?? customTheme.abbrTitle,
    baseTheme.abbr?.title ?? baseTheme.abbrTitle,
  );

  const normalizeParens = (value) => {
    if (!value) return null;
    if (typeof value === "string") return { color: value };
    if (typeof value === "object") return { ...value };
    return null;
  };

  const baseParens = normalizeParens(baseTheme.abbr?.parens ?? baseTheme.abbrParens);
  const customParens = normalizeParens(customTheme.abbr?.parens ?? customTheme.abbrParens);

  const abbrPrefixStyle = parseStyleEntry(
    customTheme.abbr?.title?.prefix ?? customParens,
    baseTheme.abbr?.title?.prefix ?? baseParens,
    ["marker"],
  );

  const abbrSuffixStyle = parseStyleEntry(
    customTheme.abbr?.title?.suffix ?? customParens,
    baseTheme.abbr?.title?.suffix ?? baseParens,
    ["marker"],
  );

  // Dfn styles (similar to abbr but separate)
  const dfnStyle = parseStyleEntry(
    customTheme.dfn?.color ?? customTheme.dfn,
    baseTheme.dfn?.color ?? baseTheme.dfn,
  );

  const dfnTitleStyle = parseStyleEntry(
    customTheme.dfn?.title ?? customTheme.dfnTitle,
    baseTheme.dfn?.title ?? baseTheme.dfnTitle,
  );

  const baseDfnParens = normalizeParens(baseTheme.dfn?.parens ?? baseTheme.dfnParens);
  const customDfnParens = normalizeParens(customTheme.dfn?.parens ?? customTheme.dfnParens);

  const dfnPrefixStyle = parseStyleEntry(
    customTheme.dfn?.title?.prefix ?? customDfnParens,
    baseTheme.dfn?.title?.prefix ?? baseDfnParens,
    ["marker"],
  );

  const dfnSuffixStyle = parseStyleEntry(
    customTheme.dfn?.title?.suffix ?? customDfnParens,
    baseTheme.dfn?.title?.suffix ?? baseDfnParens,
    ["marker"],
  );

  // Progress filled: try filled.color, filled (if string), progress.color, progress (if string)
  const progressFilledValue = pickFirst(
    customTheme.progress?.filled?.color,
    typeof customTheme.progress?.filled === 'string' ? customTheme.progress?.filled : undefined,
    customTheme.progress?.color,
    typeof customTheme.progress === 'string' ? customTheme.progress : undefined,
  );

  const progressFilledStyle = parseStyleEntry(
    progressFilledValue ? { color: progressFilledValue, ...customTheme.progress?.filled } : customTheme.progress?.filled,
    baseTheme.progress?.filled,
    ["marker"],
  );

  // Progress empty: try empty.color, empty (if string)
  const progressEmptyValue = pickFirst(
    customTheme.progress?.empty?.color,
    typeof customTheme.progress?.empty === 'string' ? customTheme.progress?.empty : undefined,
  );

  const progressEmptyStyle = parseStyleEntry(
    progressEmptyValue ? { color: progressEmptyValue, ...customTheme.progress?.empty } : customTheme.progress?.empty,
    baseTheme.progress?.empty,
    ["marker"],
  );

  // Input styles - disabled (applies to all input types)
  const inputDisabledStyle = parseStyleEntry(
    customTheme.input?.disabled,
    baseTheme.input?.disabled,
    [],
  );

  // Input styles - required field indicator
  const inputRequiredStyle = parseStyleEntry(
    customTheme.input?.required,
    baseTheme.input?.required,
    ["enabled", "indicator"],
  );

  // Input styles - checkbox
  const checkboxCheckedStyle = parseStyleEntry(
    customTheme.input?.checkbox?.checked,
    baseTheme.input?.checkbox?.checked,
    ["marker"],
  );
  const checkboxUncheckedStyle = parseStyleEntry(
    customTheme.input?.checkbox?.unchecked,
    baseTheme.input?.checkbox?.unchecked,
    ["marker"],
  );
  const checkboxPrefixStyle = parseStyleEntry(
    customTheme.input?.checkbox?.prefix,
    baseTheme.input?.checkbox?.prefix,
    ["marker"],
  );
  const checkboxSuffixStyle = parseStyleEntry(
    customTheme.input?.checkbox?.suffix,
    baseTheme.input?.checkbox?.suffix,
    ["marker"],
  );

  // Input styles - radio
  const radioCheckedStyle = parseStyleEntry(
    customTheme.input?.radio?.checked,
    baseTheme.input?.radio?.checked,
    ["marker"],
  );
  const radioUncheckedStyle = parseStyleEntry(
    customTheme.input?.radio?.unchecked,
    baseTheme.input?.radio?.unchecked,
    ["marker"],
  );
  const radioPrefixStyle = parseStyleEntry(
    customTheme.input?.radio?.prefix,
    baseTheme.input?.radio?.prefix,
    ["marker"],
  );
  const radioSuffixStyle = parseStyleEntry(
    customTheme.input?.radio?.suffix,
    baseTheme.input?.radio?.suffix,
    ["marker"],
  );

  // Input styles - button (for input type="button")
  const inputButtonStyle = parseStyleEntry(
    customTheme.input?.button,
    baseTheme.input?.button,
    ["prefix", "suffix"],
  );

  // Convert input button prefix/suffix colors to functions
  const inputButtonPrefixColorFunction = inputButtonStyle.prefix?.color
    ? (typeof inputButtonStyle.prefix.color === 'function'
        ? inputButtonStyle.prefix.color
        : (text) => chalkString(inputButtonStyle.prefix.color, forceColor ? { colors: true } : undefined)(text))
    : null;
  const inputButtonSuffixColorFunction = inputButtonStyle.suffix?.color
    ? (typeof inputButtonStyle.suffix.color === 'function'
        ? inputButtonStyle.suffix.color
        : (text) => chalkString(inputButtonStyle.suffix.color, forceColor ? { colors: true } : undefined)(text))
    : null;

  // Input styles - text input
  const textInputStyle = parseStyleEntry(
    customTheme.input?.textInput,
    baseTheme.input?.textInput,
    [],
  );

  // Input styles - textarea
  const textareaStyle = parseStyleEntry(
    customTheme.input?.textarea,
    baseTheme.input?.textarea,
    [],
  );

  // Input styles - range
  const rangeFilledStyle = parseStyleEntry(
    customTheme.input?.range?.filled,
    baseTheme.input?.range?.filled,
    ["marker"],
  );
  const rangeEmptyStyle = parseStyleEntry(
    customTheme.input?.range?.empty,
    baseTheme.input?.range?.empty,
    ["marker"],
  );
  const rangeThumbStyle = parseStyleEntry(
    customTheme.input?.range?.thumb,
    baseTheme.input?.range?.thumb,
    ["marker"],
  );

  // Input styles - color
  const colorIndicatorStyle = parseStyleEntry(
    customTheme.input?.color?.indicator,
    baseTheme.input?.color?.indicator,
    ["marker"],
  );
  const colorPrefixStyle = parseStyleEntry(
    customTheme.input?.color?.prefix,
    baseTheme.input?.color?.prefix,
    ["marker"],
  );
  const colorSuffixStyle = parseStyleEntry(
    customTheme.input?.color?.suffix,
    baseTheme.input?.color?.suffix,
    ["marker"],
  );
  const colorValueStyle = parseStyleEntry(
    customTheme.input?.color?.value,
    baseTheme.input?.color?.value,
  );

  // Input styles - password
  const passwordStyle = parseStyleEntry(
    customTheme.input?.password,
    baseTheme.input?.password,
    ["char", "count"],
  );

  // Input styles - email (parseStyleEntry auto-flattens prefix: {marker, color} to prefix + prefixColor)
  const emailStyle = parseStyleEntry(
    customTheme.input?.email,
    baseTheme.input?.email,
    [],  // Empty because prefix/suffix are auto-handled
  );

  // Extract email properties (parseStyleEntry converts nested format to flat)
  const emailPrefix = emailStyle.prefix;
  const emailPrefixColorValue = emailStyle.prefixColor;
  const emailColorValue = emailStyle.color;

  // Input styles - date (parseStyleEntry auto-flattens prefix: {marker, color} to prefix + prefixColor)
  const dateStyle = parseStyleEntry(
    customTheme.input?.date,
    baseTheme.input?.date,
    [],  // Empty because prefix/suffix are auto-handled
  );

  // Extract date properties
  const datePrefix = dateStyle.prefix;
  const datePrefixColorValue = dateStyle.prefixColor;
  const dateColorValue = dateStyle.color;

  // Input styles - file (prefix auto-flattened, placeholder is a plain string field)
  const fileStyle = parseStyleEntry(
    customTheme.input?.file,
    baseTheme.input?.file,
    ["placeholder"]
  );

  // Extract file properties (parseStyleEntry converts nested format to flat)
  const filePrefix = fileStyle.prefix;
  const filePrefixColorValue = fileStyle.prefixColor;
  const fileTextColorValue = fileStyle.color;  // Use color directly for file text
  const filePlaceholder = fileStyle.placeholder;

  // Create color functions for file
  const filePrefixColorFunction = filePrefixColorValue
    ? (text) => chalkString(filePrefixColorValue, forceColor ? { colors: true } : undefined)(text)
    : null;
  const fileTextColorFunction = fileTextColorValue
    ? (text) => chalkString(fileTextColorValue, forceColor ? { colors: true } : undefined)(text)
    : null;

  // Create color functions for email
  const emailPrefixColorFunction = emailPrefixColorValue
    ? (typeof emailPrefixColorValue === 'function'
        ? emailPrefixColorValue
        : (text) => chalkString(emailPrefixColorValue, forceColor ? { colors: true } : undefined)(text))
    : null;
  const emailColorFunction = emailColorValue
    ? (typeof emailColorValue === 'function'
        ? emailColorValue
        : (text) => chalkString(emailColorValue, forceColor ? { colors: true } : undefined)(text))
    : null;

  // Create color functions for date
  const datePrefixColorFunction = datePrefixColorValue
    ? (typeof datePrefixColorValue === 'function'
        ? datePrefixColorValue
        : (text) => chalkString(datePrefixColorValue, forceColor ? { colors: true } : undefined)(text))
    : null;
  const dateColorFunction = dateColorValue
    ? (typeof dateColorValue === 'function'
        ? dateColorValue
        : (text) => chalkString(dateColorValue, forceColor ? { colors: true } : undefined)(text))
    : null;

  // Button styles (for <button> tag, separate from input type="button")
  const buttonStyle = parseStyleEntry(
    customTheme.button,
    baseTheme.button,
    ["prefix", "suffix", "disabled"],
  );

  // Convert button prefix/suffix colors to functions
  const buttonPrefixColorFunction = buttonStyle.prefix?.color
    ? (typeof buttonStyle.prefix.color === 'function'
        ? buttonStyle.prefix.color
        : (text) => chalkString(buttonStyle.prefix.color, forceColor ? { colors: true } : undefined)(text))
    : null;
  const buttonSuffixColorFunction = buttonStyle.suffix?.color
    ? (typeof buttonStyle.suffix.color === 'function'
        ? buttonStyle.suffix.color
        : (text) => chalkString(buttonStyle.suffix.color, forceColor ? { colors: true } : undefined)(text))
    : null;

  // Select styles
  const selectStyle = parseStyleEntry(
    customTheme.select,
    baseTheme.select,
    ["prefix", "suffix", "disabled"],
  );

  // Option styles
  const optionStyle = parseStyleEntry(
    customTheme.option,
    baseTheme.option,
    ["disabled"],
  );
  const optionSelectedStyle = parseStyleEntry(
    customTheme.option?.selected,
    baseTheme.option?.selected,
    ["marker"],
  );
  const optionUnselectedStyle = parseStyleEntry(
    customTheme.option?.unselected,
    baseTheme.option?.unselected,
    ["marker"],
  );

  // Optgroup styles
  const optgroupStyle = parseStyleEntry(
    customTheme.optgroup,
    baseTheme.optgroup,
    [],
  );
  const optgroupIndicatorStyle = parseStyleEntry(
    customTheme.optgroup?.indicator ?? customTheme.optgroup?.marker,
    baseTheme.optgroup?.indicator ?? baseTheme.optgroup?.marker,
    ["marker"],
  );
  const optgroupLabelStyle = parseStyleEntry(
    customTheme.optgroup?.label,
    baseTheme.optgroup?.label,
    [],
  );

  // Img styles
  const imgIndicatorStyle = parseStyleEntry(
    customTheme.img?.indicator,
    baseTheme.img?.indicator,
    ["marker"],
  );
  const imgPrefixStyle = parseStyleEntry(
    customTheme.img?.prefix,
    baseTheme.img?.prefix,
    ["marker"],
  );
  const imgSuffixStyle = parseStyleEntry(
    customTheme.img?.suffix,
    baseTheme.img?.suffix,
    ["marker"],
  );
  const imgAltStyle = parseStyleEntry(
    customTheme.img?.alt ?? customTheme.img?.text,  // Fallback to old 'text' for backwards compatibility
    baseTheme.img?.alt ?? baseTheme.img?.text,
    [],
  );

  // Header styles
  const h1Style = parseStyleEntry(customTheme.h1, baseTheme.h1, ["indicator"]);
  const h2Style = parseStyleEntry(customTheme.h2, baseTheme.h2, ["indicator"]);
  const h3Style = parseStyleEntry(customTheme.h3, baseTheme.h3, ["indicator"]);
  const h4Style = parseStyleEntry(customTheme.h4, baseTheme.h4, ["indicator"]);
  const h5Style = parseStyleEntry(customTheme.h5, baseTheme.h5, ["indicator"]);
  const h6Style = parseStyleEntry(customTheme.h6, baseTheme.h6, ["indicator"]);

  // Create color functions for headers
  const createHeaderTheme = (style) => {
    // Check if color is already a function or a string
    const colorFunction = style.color
      ? (typeof style.color === 'function'
          ? style.color
          : (text) => chalkString(style.color, forceColor ? { colors: true } : undefined)(text))
      : null;

    const indicatorColorFunction = style.indicator?.color
      ? (typeof style.indicator.color === 'function'
          ? style.indicator.color
          : (text) => chalkString(style.indicator.color, forceColor ? { colors: true } : undefined)(text))
      : null;

    return {
      color: colorFunction,
      indicator: style.indicator ? {
        marker: style.indicator.marker,
        color: indicatorColorFunction,
      } : undefined,
    };
  };

  // Blink styles
  const blinkStyle = parseStyleEntry(customTheme.blink, baseTheme.blink, ["animation"]);

  // Marquee styles
  const marqueeStyle = parseStyleEntry(customTheme.marquee, baseTheme.marquee, ["direction"]);

  // Meter styles
  const meterStyle = parseStyleEntry(customTheme.meter, baseTheme.meter, ["width", "ranges", "empty", "labels"]);

  // Data styles
  const dataStyle = parseStyleEntry(customTheme.data, baseTheme.data, ["value"]);

  return {
    h1: createHeaderTheme(h1Style),
    h2: createHeaderTheme(h2Style),
    h3: createHeaderTheme(h3Style),
    h4: createHeaderTheme(h4Style),
    h5: createHeaderTheme(h5Style),
    h6: createHeaderTheme(h6Style),

    //
    span: { color: parseStyleEntry(customTheme.span, baseTheme.span).color },
    center: { color: parseStyleEntry(customTheme.center, baseTheme.center).color },

    // Container elements
    div: { color: parseStyleEntry(customTheme.div, baseTheme.div).color },
    header: { color: parseStyleEntry(customTheme.header, baseTheme.header).color },
    footer: { color: parseStyleEntry(customTheme.footer, baseTheme.footer).color },
    article: { color: parseStyleEntry(customTheme.article, baseTheme.article).color },
    section: { color: parseStyleEntry(customTheme.section, baseTheme.section).color },
    main: { color: parseStyleEntry(customTheme.main, baseTheme.main).color },
    nav: { color: parseStyleEntry(customTheme.nav, baseTheme.nav).color },
    aside: { color: parseStyleEntry(customTheme.aside, baseTheme.aside).color },
    form: { color: parseStyleEntry(customTheme.form, baseTheme.form).color },
    picture: { color: parseStyleEntry(customTheme.picture, baseTheme.picture).color },
    hgroup: { color: parseStyleEntry(customTheme.hgroup, baseTheme.hgroup).color },
    dialog: { color: parseStyleEntry(customTheme.dialog, baseTheme.dialog).color },
    label: { color: parseStyleEntry(customTheme.label, baseTheme.label).color },
    blink: { color: parseStyleEntry(customTheme.blink, baseTheme.blink).color },

    a: parseStyleEntry(
      customTheme.a,
      baseTheme.a,
      ["hrefEnabled", "hrefColor", "titleEnabled", "titleColor", "titlePrefix", "titleSuffix", "titlePrefixColor", "titleSuffixColor", "href", "title", "externalIndicator"]
    ),

    figure: parseStyleEntry(
      customTheme.figure,
      baseTheme.figure,
      ["border", "padding"],
    ),
    figcaption: parseStyleEntry(
      customTheme.figcaption,
      baseTheme.figcaption,
      ["prefix", "suffix"],
    ),

    fieldset: parseStyleEntry(
      customTheme.fieldset,
      baseTheme.fieldset,
      ["border", "title", "padding", "disabled"],
    ),

    details: parseStyleEntry(
      customTheme.details,
      baseTheme.details,
      ["border", "indicator", "marker", "padding"],
    ),

    blockquote: (() => {
      const style = parseStyleEntry(customTheme.blockquote, baseTheme.blockquote, ["indicators", "indicator"]);

      // Support new indicators array (cycling through multiple indicators by depth)
      const indicators = style.indicators || baseTheme.blockquote?.indicators;

      // Legacy single indicator support (fallback)
      const indicatorColorFunction = style.indicator?.color
        ? (text) => chalkString(style.indicator.color, forceColor ? { colors: true } : undefined)(text)
        : null;

      return {
        color: style.color ? (text) => chalkString(style.color, forceColor ? { colors: true } : undefined)(text) : null,
        // New indicators array (takes precedence)
        indicators: indicators || undefined,
        // Legacy single indicator (fallback)
        indicator: style.indicator ? {
          marker: style.indicator.marker,
          color: indicatorColorFunction,
        } : undefined,
      };
    })(),
    address: { color: parseStyleEntry(customTheme.address, baseTheme.address).color },

    // CODE - new structure
    code: {
      color: codeStyle.color,  // Default color (used for inline and base)
      highlight: codeHighlightFeature,  // Highlight feature (can be used with any code)
      block: {
        ...codeBlockFeature,  // Block feature with enabled flag and color
        numbers: codeNumbersFeature,  // Numbers feature (inside block)
        gutter: codeGutterFeature,  // Gutter feature (inside block)
        label: codeLabelFeature,  // Label feature (inside block)
        overflowIndicator: codeOverflowIndicatorFeature,  // Overflow indicator feature (inside block)
        diff: codeDiffFeature,  // Diff highlighting feature (git-style, inside block)
      },
    },
    pre: {
      padding: prePadding,  // Padding for code blocks
    },
    table: {
      color: tableStyle.color,
      header: { color: tableHeaderStyle.color },
      responsive: customTheme.table?.responsive ?? baseTheme.table?.responsive,
      striping: customTheme.table?.striping ?? baseTheme.table?.striping,
      alignment: customTheme.table?.alignment ?? baseTheme.table?.alignment,
      span: customTheme.table?.span ?? baseTheme.table?.span,
    },

    caption: { color: captionStyle.color },
    td: { color: tdStyle.color },
    th: { color: thStyle.color },
    tr: { color: trStyle.color },
    thead: { color: theadStyle.color },
    tbody: { color: tbodyStyle.color },
    tfoot: { color: tfootStyle.color },

    dt: { color: dtStyle.color },
    dd: { color: ddStyle.color },
    dl: { color: parseStyleEntry(customTheme.dl, baseTheme.dl).color },
    p: { color: parseStyleEntry(customTheme.p, baseTheme.p).color },

    del: parseStyleEntry(customTheme.del, baseTheme.del, ["diff"]),
    ins: parseStyleEntry(customTheme.ins, baseTheme.ins, ["diff"]),
    strike: { color: parseStyleEntry(customTheme.strikethrough, baseTheme.strikethrough).color },
    underline: { color: parseStyleEntry(customTheme.underline, baseTheme.underline).color },
    bold: { color: parseStyleEntry(customTheme.bold, baseTheme.bold).color },
    samp: parseStyleEntry(customTheme.samp, baseTheme.samp, ["prefix", "prefixColor", "suffix", "suffixColor"]),
    kbd: parseStyleEntry(customTheme.kbd, baseTheme.kbd, ["prefix", "suffix", "key"]),
    sub: parseStyleEntry(customTheme.sub, baseTheme.sub, ["prefix", "prefixColor", "suffix", "suffixColor"]),
    sup: parseStyleEntry(customTheme.sup, baseTheme.sup, ["prefix", "prefixColor", "suffix", "suffixColor"]),
    var: { color: parseStyleEntry(customTheme.variableTag, baseTheme.variableTag).color },
    mark: { color: parseStyleEntry(customTheme.mark, baseTheme.mark).color },
    time: { color: parseStyleEntry(
      customTheme.time ?? customTheme.mark,
      baseTheme.time ?? baseTheme.mark
    ).color },
    abbr: {
      color: abbrStyle.color,
      title: {
        color: abbrTitleStyle.color,
        prefix: { color: abbrPrefixStyle.color, marker: abbrPrefixStyle.marker },
        suffix: { color: abbrSuffixStyle.color, marker: abbrSuffixStyle.marker },
      },
    },
    dfn: {
      color: dfnStyle.color,
      title: {
        color: dfnTitleStyle.color,
        prefix: { color: dfnPrefixStyle.color, marker: dfnPrefixStyle.marker },
        suffix: { color: dfnSuffixStyle.color, marker: dfnSuffixStyle.marker },
      },
    },

    //
    italic: { color: italicStyle.color },
    i: { color: parseStyleEntry(
      customTheme.i ?? customTheme.italic,
      baseTheme.i ?? baseTheme.italic
    ).color },
    em: { color: parseStyleEntry(
      customTheme.em ?? customTheme.italic,
      baseTheme.em ?? baseTheme.italic
    ).color },
    cite: { color: parseStyleEntry(
      customTheme.cite ?? customTheme.italic,
      baseTheme.cite ?? baseTheme.italic
    ).color },

    // Lists and separators
    li: { color: parseStyleEntry(customTheme.li, baseTheme.li).color },
    ol: parseStyleEntry(
      customTheme.ol,
      baseTheme.ol,
      ["indicators", "markers", "colors", "decimal", "indent"],
    ),
    ul: parseStyleEntry(
      customTheme.ul,
      baseTheme.ul,
      ["indicators", "markers", "colors", "indent"],
    ),
    hr: parseStyleEntry(
      customTheme.hr,
      baseTheme.hr,
      ["marker"],
    ),

    // Widgets
    progress: {
      width: customTheme.progress?.width,
      filled: progressFilledStyle,
      empty: progressEmptyStyle,
    },
    input: {
      disabled: inputDisabledStyle,
      required: inputRequiredStyle,
      checkbox: {
        checked: checkboxCheckedStyle,
        unchecked: checkboxUncheckedStyle,
        prefix: checkboxPrefixStyle,
        suffix: checkboxSuffixStyle,
      },
      radio: {
        checked: radioCheckedStyle,
        unchecked: radioUncheckedStyle,
        prefix: radioPrefixStyle,
        suffix: radioSuffixStyle,
      },
      button: {
        color: inputButtonStyle.color,
        prefix: {
          marker: inputButtonStyle.prefix?.marker,
          color: inputButtonPrefixColorFunction,
        },
        suffix: {
          marker: inputButtonStyle.suffix?.marker,
          color: inputButtonSuffixColorFunction,
        },
      },
      textInput: textInputStyle,
      textarea: textareaStyle,
      range: {
        filled: { color: rangeFilledStyle.color, marker: rangeFilledStyle.marker },
        empty: { color: rangeEmptyStyle.color, marker: rangeEmptyStyle.marker },
        thumb: { color: rangeThumbStyle.color, marker: rangeThumbStyle.marker },
      },
      color: {
        indicator: {
          marker: colorIndicatorStyle.marker,
        },
        prefix: {
          marker: colorPrefixStyle.marker,
          color: colorPrefixStyle.color,
        },
        suffix: {
          marker: colorSuffixStyle.marker,
          color: colorSuffixStyle.color,
        },
        value: {
          color: colorValueStyle.color,
        },
      },
      password: {
        char: passwordStyle.char,
        count: passwordStyle.count,
        color: passwordStyle.color,
      },
      email: {
        prefix: {
          marker: emailStyle.prefix,
          color: emailPrefixColorFunction,
        },
        color: emailColorFunction,  // Function for coloring email text
      },
      date: {
        prefix: {
          marker: dateStyle.prefix,
          color: datePrefixColorFunction,
        },
        color: dateColorFunction,  // Function for coloring date text
      },
      file: {
        color: fileTextColorFunction,
        prefix: {
          marker: filePrefix,
          color: filePrefixColorFunction,
        },
        placeholder: filePlaceholder,
      },
    },
    button: {
      color: buttonStyle.color,
      prefix: {
        marker: buttonStyle.prefix?.marker,
        color: buttonPrefixColorFunction,
      },
      suffix: {
        marker: buttonStyle.suffix?.marker,
        color: buttonSuffixColorFunction,
      },
      disabled: buttonStyle.disabled,
    },
    img: {
      indicator: imgIndicatorStyle,
      prefix: imgPrefixStyle,
      suffix: imgSuffixStyle,
      alt: imgAltStyle,
    },
    select: {
      color: selectStyle.color,
      disabled: selectStyle.disabled,
      prefix: selectStyle.prefix,
      prefixColor: selectStyle.prefixColor,
      suffix: selectStyle.suffix,
      suffixColor: selectStyle.suffixColor,
    },
    option: {
      color: optionStyle.color,
      disabled: optionStyle.disabled,
      selected: {
        color: optionSelectedStyle.color,
        marker: optionSelectedStyle.marker,
      },
      unselected: {
        color: optionUnselectedStyle.color,
        marker: optionUnselectedStyle.marker,
      },
    },
    optgroup: {
      color: optgroupStyle.color,
      indicator: {
        marker: optgroupIndicatorStyle.marker,
        color: optgroupIndicatorStyle.color,
      },
      label: {
        color: optgroupLabelStyle.color,
      },
    },
    blink: {
      color: blinkStyle.color,
      animation: customTheme.blink?.animation || baseTheme.blink?.animation,
    },
    marquee: {
      color: marqueeStyle.color,
      direction: customTheme.marquee?.direction || baseTheme.marquee?.direction,
    },
    meter: {
      width: customTheme.meter?.width || baseTheme.meter?.width,
      ranges: customTheme.meter?.ranges || baseTheme.meter?.ranges,
      empty: customTheme.meter?.empty || baseTheme.meter?.empty,
      labels: customTheme.meter?.labels || baseTheme.meter?.labels,
    },
    data: {
      color: dataStyle.color,
      value: customTheme.data?.value || baseTheme.data?.value,
    },
  };
};
