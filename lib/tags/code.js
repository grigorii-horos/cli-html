import chalk from 'chalk';
import chalkString from 'chalk-string';
import { highlight } from 'cli-highlight';
import wrapAnsi from 'wrap-ansi';

import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getCustomAttributes, applyCustomColor, indentify, safeChalkString } from '../utilities.js';
import { languages } from '../data/languages.js';
import { trimTrailingNewline } from '../utils/string.js';

/**
 * Create a language label for code block
 * @param {string} langName - Language name (e.g., 'js', 'python')
 * @param {object} options - Label options
 * @returns {string} - Formatted language label
 */
const createLanguageLabel = (langName, options) => {
  const {
    color = 'white',
    prefixMarker = '',
    prefixColor = 'white',
    suffixMarker = '',
    suffixColor = 'white',
  } = options;

  // Helper to apply color (handles both string colors and color functions)
  const applyColor = (colorInput, text) => {
    if (typeof colorInput === 'function') {
      return colorInput(text);
    }
    return safeChalkString(colorInput, { colors: true })(text);
  };

  // Get language display name
  const displayName = languages[langName] || langName.toUpperCase();

  // Build label parts
  const parts = [];

  if (prefixMarker) {
    const styledPrefix = applyColor(prefixColor, prefixMarker);
    parts.push(styledPrefix);
  }

  // Apply color to the language name
  const styledDisplayName = applyColor(color, displayName);
  parts.push(styledDisplayName);

  if (suffixMarker) {
    const styledSuffix = applyColor(suffixColor, suffixMarker);
    parts.push(styledSuffix);
  }

  return parts.join('');
};

/**
 * Detect diff line type from content
 * @param {string} line - Code line
 * @returns {string} - Diff type: 'added', 'removed', 'modified', 'unchanged'
 */
const detectDiffType = (line) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('+ ') || trimmed.startsWith('+')) {
    return 'added';
  }
  if (trimmed.startsWith('- ') || trimmed.startsWith('-')) {
    return 'removed';
  }
  if (trimmed.startsWith('~ ') || trimmed.startsWith('~')) {
    return 'modified';
  }
  return 'unchanged';
};

/**
 * Apply diff styling to a line
 * @param {string} line - Code line
 * @param {string} diffType - Diff type
 * @param {object} diffConfig - Diff configuration from theme
 * @param {object} custom - Custom attributes
 * @returns {object} - {styledLine, indicator}
 */
const applyDiffStyling = (line, diffType, diffConfig, custom) => {
  if (!diffConfig || !diffConfig.enabled) {
    return { styledLine: line, indicator: '' };
  }

  const typeConfig = diffConfig[diffType];
  if (!typeConfig) {
    return { styledLine: line, indicator: '' };
  }

  // Apply color to line
  let styledLine = line;
  if (typeConfig.color) {
    const colorFunction = typeof typeConfig.color === 'function'
      ? typeConfig.color
      : (text) => safeChalkString(typeConfig.color, { colors: true })(text);
    styledLine = colorFunction(line);
  }

  // Get indicator
  let indicator = '';
  if (typeConfig.indicator && typeConfig.indicator.marker) {
    const markerText = typeConfig.indicator.marker;
    indicator = typeConfig.indicator.color
      ? (typeof typeConfig.indicator.color === 'function'
          ? typeConfig.indicator.color(markerText)
          : safeChalkString(typeConfig.indicator.color, { colors: true })(markerText))
      : markerText;
  }

  return { styledLine, indicator };
};

export const code = (tag, context) => inlineTag((value, tag) => {
  const classAttributes = getAttribute(tag, 'class', '').split(' ');

  const content = trimTrailingNewline(value);

  let langName = null;

  // eslint-disable-next-line unicorn/no-array-for-each
  classAttributes.forEach((classAttribute) => {
    if (classAttribute.startsWith('language-')) {
      langName = classAttribute.slice(9);
    }
    if (classAttribute.startsWith('lang-')) {
      langName = classAttribute.slice(5);
    }
  });

  // Get custom attributes from the code tag
  const custom = getCustomAttributes(tag);

  // Handle inline code separately (before syntax highlighting)
  if (tag.parentNode.nodeName !== 'pre') {
    const styledValue = applyCustomColor(custom.color, context.theme.code.color, content, chalkString);
    return styledValue;
  }

  // Apply custom code color if provided (for block code)
  // Use block.color if enabled and specified, otherwise fallback to default code.color
  const blockColor = context.theme.code.block?.enabled && context.theme.code.block?.color
    ? context.theme.code.block.color
    : context.theme.code.color;

  const codeColorFunction = custom.color
    ? (text) => safeChalkString(custom.color, { colors: true })(text)
    : blockColor;

  const codeValue = langName
    ? highlight(content, {
      language: langName,
      theme: {
        comment: chalk.blackBright,
      },
    })
    : codeColorFunction(content);

  const codeValueLines = codeValue.split('\n');

  // Diff mode detection
  const diffEnabled = custom.diff?.enabled !== null && custom.diff?.enabled !== undefined
    ? (custom.diff.enabled === 'true' || custom.diff.enabled === true)
    : (context.theme.code.block?.diff?.enabled === true || langName === 'diff');

  // Get diff config and force enable if language is 'diff'
  const baseDiffConfig = context.theme.code.block?.diff;
  const diffConfig = (diffEnabled && langName === 'diff')
    ? { ...baseDiffConfig, enabled: true }
    : baseDiffConfig;

  // Check custom attribute first, then theme
  const showLineNumbers = custom.numbers.enabled !== null && custom.numbers.enabled !== undefined
    ? (custom.numbers.enabled === 'true' || custom.numbers.enabled === '1' || custom.numbers.enabled === true)
    : context.theme.code.block?.numbers?.enabled;

  // Highlight lines support (parse "1,3,5-7" format)
  const highlightLines = new Set();
  if (custom.highlight.lines) {
    const parts = custom.highlight.lines.split(',');
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => Number.parseInt(n.trim()));
        for (let index = start; index <= end; index++) {
          highlightLines.add(index);
        }
      } else {
        highlightLines.add(Number.parseInt(part.trim()));
      }
    }
  }

  // Gutter separator - use custom or theme
  const showGutter = custom.gutter.enabled !== null && custom.gutter.enabled !== undefined
    ? (custom.gutter.enabled === 'true' || custom.gutter.enabled === '1' || custom.gutter.enabled === true)
    : (context.theme.code.block.gutter?.enabled !== false);
  const gutterSeparatorMarker = showGutter
    ? (custom.gutter.marker || context.theme.code.block.gutter?.marker)
    : '';
  const gutterSeparatorColorFunction = showGutter && custom.gutter.color
    ? (text) => safeChalkString(custom.gutter.color, { colors: true })(text)
    : (showGutter && context.theme.code.block.gutter?.color
      ? context.theme.code.block.gutter.color
      : (text) => text);

  if (!showLineNumbers) {
    const codeContent = codeValueLines.map(
      (codeLine) => wrapAnsi(`|${codeLine}|`, context.lineWidth, {
        trim: true,
      }).slice(1, -1),
    );

    return codeContent.join('\n');
  }

  const codeLinesLength = `${codeValueLines.length}`.length;
  const gutterWidth = codeLinesLength + gutterSeparatorMarker.length;
  const pad = ' '.repeat(gutterWidth);

  // Apply custom numbers color if provided
  const numbersColorFunction = custom.numbers.color
    ? (text) => safeChalkString(custom.numbers.color, { colors: true })(text)
    : (context.theme.code.block.numbers?.color || ((text) => text));

  // Overflow indicator settings
  const overflowIndicatorEnabled = custom.overflow.enabled !== null && custom.overflow.enabled !== undefined
    ? (custom.overflow.enabled === 'true' || custom.overflow.enabled === true)
    : (context.theme.code.block.overflowIndicator?.enabled === true);
  const overflowIndicatorMarker = custom.overflow.marker || context.theme.code.block.overflowIndicator?.marker || '↳';
  const overflowIndicatorColorFunction = custom.overflow.color
    ? (text) => safeChalkString(custom.overflow.color, { colors: true })(text)
    : (context.theme.code.block.overflowIndicator?.color || numbersColorFunction);

  const codeContent = codeValueLines.flatMap(
    (codeLine, index) => {
      const lineNumber = index + 1;

      // Diff styling detection and application
      const diffType = diffEnabled ? detectDiffType(codeLine) : null;
      const diffResult = diffEnabled ? applyDiffStyling(codeLine, diffType, diffConfig, custom) : { styledLine: codeLine, indicator: '' };

      // Use diff-styled line if diff is enabled
      let processedLine = diffEnabled ? diffResult.styledLine : codeLine;

      // Line highlighting
      const isHighlighted = highlightLines.has(lineNumber);

      // Build line number with diff indicator or regular line number
      let lineNumberText;
      if (diffEnabled && diffResult.indicator) {
        // Use diff indicator instead of line number
        lineNumberText = diffResult.indicator.padStart(codeLinesLength, ' ');
      } else {
        lineNumberText = `${lineNumber}`.padStart(codeLinesLength, ' ');
      }
      const gutter = (diffEnabled && diffResult.indicator ? lineNumberText : numbersColorFunction(lineNumberText)) + ' ' + gutterSeparatorColorFunction(gutterSeparatorMarker);

      // Wrap and process the code line
      const wrappedLine = wrapAnsi(`|${processedLine}|`, context.lineWidth - pad.length, {
        trim: true,
      }).slice(1, -1);

      // Check if line was wrapped into multiple lines
      const wrappedLines = wrappedLine.split('\n');
      const hasOverflow = overflowIndicatorEnabled && wrappedLines.length > 1;

      return wrappedLines.map((wrappedPart, partIndex) => {
        let currentGutter = gutter;

        // For continuation lines, use overflow indicator instead of line number
        if (hasOverflow && partIndex > 0) {
          const overflowMarkerPadded = overflowIndicatorMarker.padStart(codeLinesLength, ' ');
          currentGutter = overflowIndicatorColorFunction(overflowMarkerPadded) + ' ' + gutterSeparatorColorFunction(gutterSeparatorMarker);
        }

        let styledLine = indentify(pad, true)(wrappedPart);

        // Apply highlight to entire line (if not using diff styling)
        if (isHighlighted && !diffEnabled) {
          const highlightColorFunction = custom.highlight.color
            ? (text) => safeChalkString(custom.highlight.color, { colors: true })(text)
            : context.theme.code.highlight?.color;
          if (highlightColorFunction) {
            styledLine = highlightColorFunction(styledLine);
          }
        }

        return `${currentGutter}${styledLine}`;
      });
    },
  );

  // Language label support
  const codeBlock = codeContent.join('\n');

  const showLangLabel = custom.label.enabled !== null && custom.label.enabled !== undefined
    ? (custom.label.enabled === 'true' || custom.label.enabled === '1' || custom.label.enabled === true)
    : context.theme.code.block.label?.enabled;

  if (showLangLabel && langName) {
    const label = createLanguageLabel(langName, {
      color: custom.label.color || context.theme.code.block.label?.color,
      prefixMarker: custom.label.prefix.marker || context.theme.code.block.label?.prefix?.marker,
      prefixColor: custom.label.prefix.color || context.theme.code.block.label?.prefix?.color,
      suffixMarker: custom.label.suffix.marker || context.theme.code.block.label?.suffix?.marker,
      suffixColor: custom.label.suffix.color || context.theme.code.block.label?.suffix?.color,
    });

    const labelPosition = custom.label.position || context.theme.code.block.label?.position || 'top';

    if (labelPosition === 'bottom') {
      return codeBlock + '\n' + label;
    } else { // top
      return label + '\n' + codeBlock;
    }
  }

  return codeBlock;
})(tag, context);

export const pre = (tag, context) => {
  // Get padding configuration from theme
  const padding = context.theme.pre?.padding ?? { left: 0, right: 0, top: 0, bottom: 0 };

  const newContext = {
    ...context,
    pre: true,
  };

  return blockTag((value) => {
    // Apply padding to the content
    const lines = value.split('\n');

    // Add left and right padding to each line
    const leftPad = ' '.repeat(padding.left || 0);
    const rightPad = ' '.repeat(padding.right || 0);
    const paddedLines = lines.map(line => leftPad + line + rightPad);

    // Add top padding
    const topLines = new Array(padding.top || 0).fill(leftPad);
    // Add bottom padding
    const bottomLines = new Array(padding.bottom || 0).fill(leftPad);

    return [...topLines, ...paddedLines, ...bottomLines].join('\n');
  }, { marginTop: 2, marginBottom: 2 })(
    tag,
    newContext,
  );
};
