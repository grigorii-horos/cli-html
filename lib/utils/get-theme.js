import chalkString from 'chalk-string';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import YAML from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '../../config.yaml');
const baseConfig = YAML.parse(readFileSync(configPath, 'utf8'));

const forceColor =
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

  const applyStyle = colorValue
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

  const dtStyle = parseStyleEntry(customTheme.dt, baseTheme.dt ?? "blue bold");
  const ddStyle = parseStyleEntry(
    customTheme.dd ?? customTheme.dt,
    baseTheme.dd ?? baseTheme.dt ?? "cyan",
  );

  const italicStyle = parseStyleEntry(customTheme.italic, baseTheme.italic ?? "italic");

  // Code styles
  const codeBlockStyle = parseStyleEntry(
    customTheme.code?.block?.color ?? customTheme.code?.color ?? customTheme.code,
    baseTheme.code?.block?.color ?? baseTheme.code?.color ?? baseTheme.code ?? "yellowBright",
  );

  const inlineCodeStyle = parseStyleEntry(
    customTheme.code?.inline ?? customTheme.inlineCode,
    baseTheme.code?.inline ?? baseTheme.inlineCode ?? "bgBlack",
  );

  const codeNumbersStyle = parseStyleEntry(
    customTheme.code?.block?.numbers ?? customTheme.code?.numbers ?? customTheme.codeNumbers,
    baseTheme.code?.block?.numbers ?? baseTheme.code?.numbers ?? baseTheme.codeNumbers ?? "blackBright dim",
    ["enabled"],
  );

  const codeBlockPadding = customTheme.code?.block?.padding ?? baseTheme.code?.block?.padding ?? {
    left: 1,
    lineWidth: 10,
  };

  // Table styles
  const tableHeaderStyle = parseStyleEntry(
    customTheme.table?.header ?? customTheme.tableHeader,
    baseTheme.table?.header ?? baseTheme.tableHeader ?? "bold red",
  );

  const tableCaptionStyle = parseStyleEntry(
    customTheme.table?.caption ?? customTheme.tableCaption,
    baseTheme.table?.caption ?? baseTheme.tableCaption ?? "bold blue",
  );

  const tableCellStyle = parseStyleEntry(
    customTheme.table?.cell ?? customTheme.tableCell,
    baseTheme.table?.cell ?? baseTheme.tableCell ?? "",
  );

  // Abbr styles
  const abbrStyle = parseStyleEntry(
    customTheme.abbr?.color ?? customTheme.abbr,
    baseTheme.abbr?.color ?? baseTheme.abbr ?? "underline",
  );

  const abbrTitleStyle = parseStyleEntry(
    customTheme.abbr?.title ?? customTheme.abbrTitle,
    baseTheme.abbr?.title ?? baseTheme.abbrTitle ?? "cyan",
  );

  const abbrParensStyle = parseStyleEntry(
    customTheme.abbr?.parens ?? customTheme.abbrParens,
    baseTheme.abbr?.parens ?? baseTheme.abbrParens ?? "gray",
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
    baseTheme.progress?.filled ?? { color: "bgWhite green", marker: "█" },
    ["marker"],
  );

  // Progress empty: try empty.color, empty (if string)
  const progressEmptyValue = pickFirst(
    customTheme.progress?.empty?.color,
    typeof customTheme.progress?.empty === 'string' ? customTheme.progress?.empty : undefined,
  );

  const progressEmptyStyle = parseStyleEntry(
    progressEmptyValue ? { color: progressEmptyValue, ...customTheme.progress?.empty } : customTheme.progress?.empty,
    baseTheme.progress?.empty ?? { color: "bgBlack gray", marker: "█" },
    ["marker"],
  );

  // Input styles - checkbox
  const checkboxCheckedStyle = parseStyleEntry(
    customTheme.input?.checkbox?.checked,
    baseTheme.input?.checkbox?.checked ?? { color: "green bold", marker: "✓" },
    ["marker"],
  );
  const checkboxUncheckedStyle = parseStyleEntry(
    customTheme.input?.checkbox?.unchecked,
    baseTheme.input?.checkbox?.unchecked ?? { color: "gray", marker: " " },
    ["marker"],
  );
  const checkboxOpenStyle = parseStyleEntry(
    customTheme.input?.checkbox?.open,
    baseTheme.input?.checkbox?.open ?? { color: "gray", marker: "[" },
    ["marker"],
  );
  const checkboxCloseStyle = parseStyleEntry(
    customTheme.input?.checkbox?.close,
    baseTheme.input?.checkbox?.close ?? { color: "gray", marker: "]" },
    ["marker"],
  );

  // Input styles - radio
  const radioCheckedStyle = parseStyleEntry(
    customTheme.input?.radio?.checked,
    baseTheme.input?.radio?.checked ?? { color: "red bold", marker: "•" },
    ["marker"],
  );
  const radioUncheckedStyle = parseStyleEntry(
    customTheme.input?.radio?.unchecked,
    baseTheme.input?.radio?.unchecked ?? { color: "red bold", marker: " " },
    ["marker"],
  );
  const radioOpenStyle = parseStyleEntry(
    customTheme.input?.radio?.open,
    baseTheme.input?.radio?.open ?? { color: "gray", marker: "(" },
    ["marker"],
  );
  const radioCloseStyle = parseStyleEntry(
    customTheme.input?.radio?.close,
    baseTheme.input?.radio?.close ?? { color: "gray", marker: ")" },
    ["marker"],
  );

  // Input styles - button
  const buttonOpenStyle = parseStyleEntry(
    customTheme.input?.button?.open,
    baseTheme.input?.button?.open ?? { color: "bgBlack gray", marker: "[ " },
    ["marker"],
  );
  const buttonCloseStyle = parseStyleEntry(
    customTheme.input?.button?.close,
    baseTheme.input?.button?.close ?? { color: "bgBlack gray", marker: " ]" },
    ["marker"],
  );
  const buttonTextStyle = parseStyleEntry(
    customTheme.input?.button?.text,
    baseTheme.input?.button?.text ?? { color: "bgBlack bold" },
    [],
  );

  // Img styles
  const imgPrefixStyle = parseStyleEntry(
    customTheme.img?.prefix,
    baseTheme.img?.prefix ?? { color: "cyan", marker: "!" },
    ["marker"],
  );
  const imgOpenStyle = parseStyleEntry(
    customTheme.img?.open,
    baseTheme.img?.open ?? { color: "gray", marker: "[" },
    ["marker"],
  );
  const imgCloseStyle = parseStyleEntry(
    customTheme.img?.close,
    baseTheme.img?.close ?? { color: "gray", marker: "]" },
    ["marker"],
  );
  const imgTextStyle = parseStyleEntry(
    customTheme.img?.text,
    baseTheme.img?.text ?? { color: "cyan" },
    [],
  );

  return {
    h1: parseStyleEntry(customTheme.h1, baseTheme.h1 ?? { color: "red bold", marker: "#" }, ["marker"]),
    h2: parseStyleEntry(customTheme.h2, baseTheme.h2 ?? { color: "blue bold", marker: "##" }, ["marker"]),
    h3: parseStyleEntry(customTheme.h3, baseTheme.h3 ?? { color: "blue bold", marker: "###" }, ["marker"]),
    h4: parseStyleEntry(customTheme.h4, baseTheme.h4 ?? { color: "cyan bold", marker: "####" }, ["marker"]),
    h5: parseStyleEntry(customTheme.h5, baseTheme.h5 ?? { color: "cyan", marker: "#####" }, ["marker"]),
    h6: parseStyleEntry(customTheme.h6, baseTheme.h6 ?? { color: "cyan", marker: "######" }, ["marker"]),

    //
    span: { color: parseStyleEntry(customTheme.span, baseTheme.span ?? "").color },
    a: { color: parseStyleEntry(customTheme.a, baseTheme.a ?? "blue underline").color },

    figure: parseStyleEntry(
      customTheme.figure,
      baseTheme.figure ?? { color: "gray" },
      ["border", "padding"],
    ),
    figcaption: parseStyleEntry(
      customTheme.figcaption,
      baseTheme.figcaption ?? { color: "bgGreen bold", prefix: " ", suffix: " " },
      ["prefix", "suffix"],
    ),

    fieldset: parseStyleEntry(
      customTheme.fieldset,
      baseTheme.fieldset ?? { color: "gray" },
      ["border", "title", "padding"],
    ),

    details: parseStyleEntry(
      customTheme.details,
      baseTheme.details ?? { color: "gray", marker: "> " },
      ["border", "marker", "padding"],
    ),

    blockquote: parseStyleEntry(
      customTheme.blockquote,
      baseTheme.blockquote ?? { color: "black", marker: "│ " },
      ["marker"],
    ),
    address: { color: parseStyleEntry(customTheme.address, baseTheme.address ?? "italic").color },

    // CODE
    code: {
      inline: { color: inlineCodeStyle.color },
      block: {
        color: codeBlockStyle.color,
        numbers: codeNumbersStyle,
        padding: codeBlockPadding,
      },
    },
    table: {
      header: { color: tableHeaderStyle.color },
      caption: { color: tableCaptionStyle.color },
      cell: { color: tableCellStyle.color },
    },

    dt: { color: dtStyle.color },
    dd: { color: ddStyle.color },
    dl: { color: parseStyleEntry(customTheme.dl, baseTheme.dl ?? "").color },

    del: { color: parseStyleEntry(customTheme.del, baseTheme.del ?? "bgRed black").color },
    ins: { color: parseStyleEntry(customTheme.ins, baseTheme.ins ?? "bgGreen black").color },
    strike: { color: parseStyleEntry(customTheme.strikethrough, baseTheme.strikethrough ?? "strikethrough").color },
    underline: { color: parseStyleEntry(customTheme.underline, baseTheme.underline ?? "underline").color },
    bold: { color: parseStyleEntry(customTheme.bold, baseTheme.bold ?? "bold").color },
    samp: { color: parseStyleEntry(customTheme.samp, baseTheme.samp ?? "yellowBright").color },
    kbd: { color: parseStyleEntry(customTheme.kbd, baseTheme.kbd ?? "bgBlack").color },
    var: { color: parseStyleEntry(customTheme.variableTag, baseTheme.variableTag ?? "blue italic").color },
    mark: { color: parseStyleEntry(customTheme.mark, baseTheme.mark ?? "bgYellow black").color },
    time: { color: parseStyleEntry(
      customTheme.time ?? customTheme.mark,
      baseTheme.time ?? baseTheme.mark ?? "cyan"
    ).color },
    abbr: {
      color: abbrStyle.color,
      title: { color: abbrTitleStyle.color },
      parens: { color: abbrParensStyle.color },
    },
    dfn: { color: parseStyleEntry(customTheme.dfn, baseTheme.dfn ?? "underline italic").color },

    //
    italic: { color: italicStyle.color },
    i: { color: parseStyleEntry(
      customTheme.i ?? customTheme.italic,
      baseTheme.i ?? baseTheme.italic ?? "italic"
    ).color },
    em: { color: parseStyleEntry(
      customTheme.em ?? customTheme.italic,
      baseTheme.em ?? baseTheme.italic ?? "italic"
    ).color },
    cite: { color: parseStyleEntry(
      customTheme.cite ?? customTheme.italic,
      baseTheme.cite ?? baseTheme.italic ?? "italic"
    ).color },

    // Lists and separators
    ol: parseStyleEntry(
      customTheme.ol,
      baseTheme.ol ?? { color: "blueBright", colors: ["blueBright", "cyanBright", "magentaBright"], markers: ['1', 'I', 'A', 'i', 'a'], decimal: ".", indent: "   " },
      ["markers", "colors", "decimal", "indent"],
    ),
    ul: parseStyleEntry(
      customTheme.ul,
      baseTheme.ul ?? { color: "redBright", colors: ["redBright", "yellowBright", "cyanBright"], indent: "  " },
      ["markers", "colors", "indent"],
    ),
    hr: parseStyleEntry(
      customTheme.hr,
      baseTheme.hr ?? { color: "gray", marker: "─" },
      ["marker"],
    ),

    // Widgets
    progress: {
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
    },
    img: {
      prefix: imgPrefixStyle,
      open: imgOpenStyle,
      close: imgCloseStyle,
      text: imgTextStyle,
    },
  };
};
