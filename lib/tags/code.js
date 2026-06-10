import chalk from 'chalk';
import { highlight } from 'cli-highlight';
import wrapAnsi from 'wrap-ansi';

import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, indentify } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor as applyColorCore } from '../core/color.js';
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

  // Get language display name
  const displayName = languages[langName] || langName.toUpperCase();

  // Build label parts
  const parts = [];

  if (prefixMarker) {
    const styledPrefix = applyColorCore(prefixColor, prefixMarker);
    parts.push(styledPrefix);
  }

  // Apply color to the language name
  const styledDisplayName = applyColorCore(color, displayName);
  parts.push(styledDisplayName);

  if (suffixMarker) {
    const styledSuffix = applyColorCore(suffixColor, suffixMarker);
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
    styledLine = applyColorCore(typeConfig.color, line);
  }

  // Get indicator
  let indicator = '';
  if (typeConfig.indicator && typeConfig.indicator.marker) {
    const markerText = typeConfig.indicator.marker;
    indicator = typeConfig.indicator.color
      ? applyColorCore(typeConfig.indicator.color, markerText)
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

  // Handle inline code separately (before syntax highlighting)
  if (tag.parentNode.nodeName !== 'pre') {
    const styledValue = applyColorCore(getAttr(tag, 'color') ?? context.theme.code.color, content);
    return styledValue;
  }

  // Apply custom code color if provided (for block code)
  // Use block.color if enabled and specified, otherwise fallback to default code.color
  const blockColor = context.theme.code.block?.enabled && context.theme.code.block?.color
    ? context.theme.code.block.color
    : context.theme.code.color;

  const customColor = getAttr(tag, 'color');
  const codeColorFunction = (text) => applyColorCore(customColor ?? blockColor, text);

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
  const diffEnabledRaw = getAttr(tag, 'diff.enabled');
  const diffEnabled = diffEnabledRaw !== null
    ? diffEnabledRaw === 'true'
    : (context.theme.code.block?.diff?.enabled === true || langName === 'diff');

  // Get diff config and force enable if language is 'diff'
  const baseDiffConfig = context.theme.code.block?.diff;
  const diffConfig = (diffEnabled && langName === 'diff')
    ? { ...baseDiffConfig, enabled: true }
    : baseDiffConfig;

  // Check custom attribute first, then theme
  const numbersEnabledRaw = getAttr(tag, 'numbers.enabled');
  const showLineNumbers = numbersEnabledRaw !== null
    ? (numbersEnabledRaw === 'true' || numbersEnabledRaw === '1')
    : context.theme.code.block?.numbers?.enabled;

  // Highlight lines support (parse "1,3,5-7" format)
  const highlightLines = new Set();
  const highlightLinesRaw = getAttr(tag, 'highlight.lines');
  if (highlightLinesRaw) {
    const parts = highlightLinesRaw.split(',');
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
  const gutterEnabledRaw = getAttr(tag, 'gutter.enabled');
  const showGutter = gutterEnabledRaw !== null
    ? (gutterEnabledRaw === 'true' || gutterEnabledRaw === '1')
    : (context.theme.code.block.gutter?.enabled !== false);
  const customGutterMarker = getAttr(tag, 'gutter.marker');
  const gutterSeparatorMarker = showGutter
    ? (customGutterMarker || context.theme.code.block.gutter?.marker)
    : '';
  const customGutterColor = getAttr(tag, 'gutter.color');
  const gutterSeparatorColorFunction = showGutter
    ? (text) => applyColorCore(customGutterColor ?? context.theme.code.block.gutter?.color, text)
    : (text) => text;

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
  const customNumbersColor = getAttr(tag, 'numbers.color');
  const numbersColorSpec = customNumbersColor ?? context.theme.code.block.numbers?.color;
  const numbersColorFunction = (text) => applyColorCore(numbersColorSpec, text);

  // Overflow indicator settings
  const overflowEnabledRaw = getAttr(tag, 'overflow.enabled');
  const overflowIndicatorEnabled = overflowEnabledRaw !== null
    ? overflowEnabledRaw === 'true'
    : (context.theme.code.block.overflowIndicator?.enabled === true);
  const customOverflowMarker = getAttr(tag, 'overflow.marker');
  const overflowIndicatorMarker = customOverflowMarker || context.theme.code.block.overflowIndicator?.marker || '↳';
  const customOverflowColor = getAttr(tag, 'overflow.color');
  const overflowColorSpec = customOverflowColor ?? context.theme.code.block.overflowIndicator?.color ?? numbersColorSpec;
  const overflowIndicatorColorFunction = (text) => applyColorCore(overflowColorSpec, text);

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
          const customHighlightColor = getAttr(tag, 'highlight.color');
          const highlightColorSpec = customHighlightColor ?? context.theme.code.highlight?.color;
          if (highlightColorSpec) {
            styledLine = applyColorCore(highlightColorSpec, styledLine);
          }
        }

        return `${currentGutter}${styledLine}`;
      });
    },
  );

  // Language label support
  const codeBlock = codeContent.join('\n');

  const labelEnabledRaw = getAttr(tag, 'label.enabled');
  const showLangLabel = labelEnabledRaw !== null
    ? (labelEnabledRaw === 'true' || labelEnabledRaw === '1')
    : context.theme.code.block.label?.enabled;

  if (showLangLabel && langName) {
    const label = createLanguageLabel(langName, {
      color: getAttr(tag, 'label.color') || context.theme.code.block.label?.color,
      prefixMarker: getAttr(tag, 'label.prefix.marker') || context.theme.code.block.label?.prefix?.marker,
      prefixColor: getAttr(tag, 'label.prefix.color') || context.theme.code.block.label?.prefix?.color,
      suffixMarker: getAttr(tag, 'label.suffix.marker') || context.theme.code.block.label?.suffix?.marker,
      suffixColor: getAttr(tag, 'label.suffix.color') || context.theme.code.block.label?.suffix?.color,
    });

    const labelPosition = getAttr(tag, 'label.position') || context.theme.code.block.label?.position || 'top';

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
