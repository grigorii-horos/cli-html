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
    extras.showHref = config.href.enabled ?? false;
    extras.hrefColor = config.href.color ?? '';
  }

  // Support for nested title format: { enabled, color, prefix, suffix }
  if (config.title && typeof config.title === 'object' && !Array.isArray(config.title)) {
    extras.showTitle = config.title.enabled ?? false;
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

  // Support for nested externalIndicator format: { enabled, marker, color, position, spacing }
  if (config.externalIndicator && typeof config.externalIndicator === 'object' && !Array.isArray(config.externalIndicator)) {
    extras.externalIndicator = config.externalIndicator;
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

  // Code styles
  const codeBlockStyle = parseStyleEntry(
    customTheme.code?.block?.color ?? customTheme.code?.color ?? customTheme.code,
    baseTheme.code?.block?.color ?? baseTheme.code?.color ?? baseTheme.code,
  );

  const inlineCodeStyle = parseStyleEntry(
    customTheme.code?.inline ?? customTheme.inlineCode,
    baseTheme.code?.inline ?? baseTheme.inlineCode,
  );

  const codeNumbersStyle = parseStyleEntry(
    customTheme.code?.block?.numbers ?? customTheme.code?.numbers ?? customTheme.codeNumbers,
    baseTheme.code?.block?.numbers ?? baseTheme.code?.numbers ?? baseTheme.codeNumbers,
    ["enabled"],
  );

  const codeBlockPadding = customTheme.code?.block?.padding ?? baseTheme.code?.block?.padding;

  const codeBlockGutter = customTheme.code?.block?.gutter ?? baseTheme.code?.block?.gutter;

  const codeBlockLabel = customTheme.code?.block?.label ?? baseTheme.code?.block?.label;

  const codeBlockHighlight = customTheme.code?.block?.highlight ?? baseTheme.code?.block?.highlight;

  const codeBlockOverflowIndicator = customTheme.code?.block?.overflowIndicator ?? baseTheme.code?.block?.overflowIndicator;

  // Table styles
  const tableHeaderStyle = parseStyleEntry(
    customTheme.table?.header ?? customTheme.tableHeader,
    baseTheme.table?.header ?? baseTheme.tableHeader,
  );

  const tableCaptionStyle = parseStyleEntry(
    customTheme.table?.caption ?? customTheme.tableCaption,
    baseTheme.table?.caption ?? baseTheme.tableCaption,
  );

  const tableCellStyle = parseStyleEntry(
    customTheme.table?.cell ?? customTheme.tableCell,
    baseTheme.table?.cell ?? baseTheme.tableCell,
  );

  const tableTdStyle = parseStyleEntry(
    customTheme.table?.td,
    baseTheme.table?.td,
  );

  const tableThStyle = parseStyleEntry(
    customTheme.table?.th,
    baseTheme.table?.th,
  );

  const tableTrStyle = parseStyleEntry(
    customTheme.table?.tr,
    baseTheme.table?.tr,
  );

  const tableTheadStyle = parseStyleEntry(
    customTheme.table?.thead,
    baseTheme.table?.thead,
  );

  const tableTbodyStyle = parseStyleEntry(
    customTheme.table?.tbody,
    baseTheme.table?.tbody,
  );

  const tableTfootStyle = parseStyleEntry(
    customTheme.table?.tfoot,
    baseTheme.table?.tfoot,
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
  const checkboxOpenStyle = parseStyleEntry(
    customTheme.input?.checkbox?.open,
    baseTheme.input?.checkbox?.open,
    ["marker"],
  );
  const checkboxCloseStyle = parseStyleEntry(
    customTheme.input?.checkbox?.close,
    baseTheme.input?.checkbox?.close,
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
  const radioOpenStyle = parseStyleEntry(
    customTheme.input?.radio?.open,
    baseTheme.input?.radio?.open,
    ["marker"],
  );
  const radioCloseStyle = parseStyleEntry(
    customTheme.input?.radio?.close,
    baseTheme.input?.radio?.close,
    ["marker"],
  );

  // Input styles - button
  const buttonOpenStyle = parseStyleEntry(
    customTheme.input?.button?.open,
    baseTheme.input?.button?.open,
    ["marker"],
  );
  const buttonCloseStyle = parseStyleEntry(
    customTheme.input?.button?.close,
    baseTheme.input?.button?.close,
    ["marker"],
  );
  const buttonTextStyle = parseStyleEntry(
    customTheme.input?.button?.text,
    baseTheme.input?.button?.text,
    [],
  );

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
  const colorBracketsStyle = parseStyleEntry(
    customTheme.input?.color?.brackets,
    baseTheme.input?.color?.brackets,
    ["open", "close"],
  );
  const colorValueStyle = parseStyleEntry(
    customTheme.input?.color?.value,
    baseTheme.input?.color?.value,
  );

  // Input styles - password
  const passwordStyle = parseStyleEntry(
    customTheme.input?.password,
    baseTheme.input?.password,
    ["char"],
  );

  // Input styles - email
  const emailStyle = parseStyleEntry(
    customTheme.input?.email,
    baseTheme.input?.email,
    ["prefix"],
  );

  // Extract email properties (parseStyleEntry converts nested format to flat)
  const emailPrefix = emailStyle.prefix;
  const emailPrefixColorValue = emailStyle.prefixColor;
  const emailColorValue = emailStyle.color;

  // Input styles - date
  const dateStyle = parseStyleEntry(
    customTheme.input?.date,
    baseTheme.input?.date,
    ["prefix"],
  );

  // Extract date properties
  const datePrefix = dateStyle.prefix;
  const datePrefixColorValue = dateStyle.prefixColor;
  const dateColorValue = dateStyle.color;

  // Input styles - file
  const fileStyle = parseStyleEntry(
    customTheme.input?.file,
    baseTheme.input?.file,
    ["prefix", "text", "placeholder"]
  );

  // Extract file properties (parseStyleEntry converts nested format to flat)
  const filePrefix = fileStyle.prefix;
  const filePrefixColorValue = fileStyle.prefixColor;
  const fileTextColorValue = fileStyle.textColor;
  const filePlaceholder = fileStyle.placeholder;

  // Create color functions for file
  const filePrefixColorFn = filePrefixColorValue
    ? (text) => chalkString(filePrefixColorValue, forceColor ? { colors: true } : undefined)(text)
    : null;
  const fileTextColorFn = fileTextColorValue
    ? (text) => chalkString(fileTextColorValue, forceColor ? { colors: true } : undefined)(text)
    : null;

  // Create color functions for email
  const emailPrefixColorFn = emailPrefixColorValue
    ? (typeof emailPrefixColorValue === 'function'
        ? emailPrefixColorValue
        : (text) => chalkString(emailPrefixColorValue, forceColor ? { colors: true } : undefined)(text))
    : null;
  const emailColorFn = emailColorValue
    ? (typeof emailColorValue === 'function'
        ? emailColorValue
        : (text) => chalkString(emailColorValue, forceColor ? { colors: true } : undefined)(text))
    : null;

  // Create color functions for date
  const datePrefixColorFn = datePrefixColorValue
    ? (typeof datePrefixColorValue === 'function'
        ? datePrefixColorValue
        : (text) => chalkString(datePrefixColorValue, forceColor ? { colors: true } : undefined)(text))
    : null;
  const dateColorFn = dateColorValue
    ? (typeof dateColorValue === 'function'
        ? dateColorValue
        : (text) => chalkString(dateColorValue, forceColor ? { colors: true } : undefined)(text))
    : null;

  // Select styles
  const selectStyle = parseStyleEntry(
    customTheme.select,
    baseTheme.select,
    ["prefix", "suffix"],
  );

  // Option styles
  const optionStyle = parseStyleEntry(
    customTheme.option,
    baseTheme.option,
    [],
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
  const imgPrefixStyle = parseStyleEntry(
    customTheme.img?.prefix,
    baseTheme.img?.prefix,
    ["marker"],
  );
  const imgOpenStyle = parseStyleEntry(
    customTheme.img?.open,
    baseTheme.img?.open,
    ["marker"],
  );
  const imgCloseStyle = parseStyleEntry(
    customTheme.img?.close,
    baseTheme.img?.close,
    ["marker"],
  );
  const imgTextStyle = parseStyleEntry(
    customTheme.img?.text,
    baseTheme.img?.text,
    [],
  );

  return {
    h1: parseStyleEntry(customTheme.h1, baseTheme.h1, ["marker"]),
    h2: parseStyleEntry(customTheme.h2, baseTheme.h2, ["marker"]),
    h3: parseStyleEntry(customTheme.h3, baseTheme.h3, ["marker"]),
    h4: parseStyleEntry(customTheme.h4, baseTheme.h4, ["marker"]),
    h5: parseStyleEntry(customTheme.h5, baseTheme.h5, ["marker"]),
    h6: parseStyleEntry(customTheme.h6, baseTheme.h6, ["marker"]),

    //
    span: { color: parseStyleEntry(customTheme.span, baseTheme.span).color },
    a: parseStyleEntry(
      customTheme.a,
      baseTheme.a,
      ["showHref", "hrefColor", "showTitle", "titleColor", "titlePrefix", "titleSuffix", "titlePrefixColor", "titleSuffixColor", "href", "title", "externalIndicator"]
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
      ["border", "title", "padding"],
    ),

    details: parseStyleEntry(
      customTheme.details,
      baseTheme.details,
      ["border", "indicator", "marker", "padding"],
    ),

    blockquote: parseStyleEntry(
      customTheme.blockquote,
      baseTheme.blockquote,
      ["marker"],
    ),
    address: { color: parseStyleEntry(customTheme.address, baseTheme.address).color },

    // CODE
    code: {
      inline: { color: inlineCodeStyle.color },
      block: {
        color: codeBlockStyle.color,
        numbers: codeNumbersStyle,
        padding: codeBlockPadding,
        gutter: codeBlockGutter,
        label: codeBlockLabel,
        highlight: codeBlockHighlight,
        overflowIndicator: codeBlockOverflowIndicator,
      },
    },
    table: {
      header: { color: tableHeaderStyle.color },
      caption: { color: tableCaptionStyle.color },
      cell: { color: tableCellStyle.color },
      td: { color: tableTdStyle.color },
      th: { color: tableThStyle.color },
      tr: { color: tableTrStyle.color },
      thead: { color: tableTheadStyle.color },
      tbody: { color: tableTbodyStyle.color },
      tfoot: { color: tableTfootStyle.color },
      responsive: customTheme.table?.responsive ?? baseTheme.table?.responsive,
    },

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
      checkbox: {
        checked: checkboxCheckedStyle,
        unchecked: checkboxUncheckedStyle,
        open: checkboxOpenStyle,
        close: checkboxCloseStyle,
      },
      radio: {
        checked: radioCheckedStyle,
        unchecked: radioUncheckedStyle,
        open: radioOpenStyle,
        close: radioCloseStyle,
      },
      button: {
        open: buttonOpenStyle,
        close: buttonCloseStyle,
        text: buttonTextStyle,
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
        brackets: {
          open: colorBracketsStyle.open,
          close: colorBracketsStyle.close,
          color: colorBracketsStyle.color,
        },
        value: {
          color: colorValueStyle.color,
        },
      },
      password: {
        char: passwordStyle.char,
        color: passwordStyle.color,
      },
      email: {
        prefix: emailStyle.prefix,
        prefixColor: emailPrefixColorFn,
        color: emailColorFn,  // Function for coloring email text
      },
      date: {
        prefix: dateStyle.prefix,
        prefixColor: datePrefixColorFn,
        color: dateColorFn,  // Function for coloring date text
      },
      file: {
        prefix: filePrefix,
        prefixColor: filePrefixColorFn,
        textColor: fileTextColorFn,
        placeholder: filePlaceholder,
      },
    },
    img: {
      prefix: imgPrefixStyle,
      open: imgOpenStyle,
      close: imgCloseStyle,
      text: imgTextStyle,
    },
    select: {
      color: selectStyle.color,
      prefix: selectStyle.prefix,
      prefixColor: selectStyle.prefixColor,
      suffix: selectStyle.suffix,
      suffixColor: selectStyle.suffixColor,
    },
    option: {
      color: optionStyle.color,
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
  };
};
