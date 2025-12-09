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

  // Get language display name
  const displayName = languages[langName] || langName.toUpperCase();

  // Build label parts
  const parts = [];

  if (prefixMarker) {
    const styledPrefix = safeChalkString(prefixColor, { colors: true })(prefixMarker);
    parts.push(styledPrefix);
  }

  // Apply color to the language name
  const styledDisplayName = safeChalkString(color, { colors: true })(displayName);
  parts.push(styledDisplayName);

  if (suffixMarker) {
    const styledSuffix = safeChalkString(suffixColor, { colors: true })(suffixMarker);
    parts.push(styledSuffix);
  }

  return parts.join('');
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
    const custom = getCustomAttributes(tag);
    const styledValue = applyCustomColor(custom.color, context.theme.code.inline.color, content, chalkString);
    return styledValue;
  }

  // Apply custom code color if provided (for block code)
  const codeColorFn = context.customCodeColor
    ? (text) => safeChalkString(context.customCodeColor, { colors: true })(text)
    : context.theme.code.block.color;

  const codeValue = langName
    ? highlight(content, {
      language: langName,
      theme: {
        comment: chalk.blackBright,
      },
    })
    : codeColorFn(content);

  const codeValueLines = codeValue.split('\n');

  // Check custom attribute first, then theme
  const showLineNumbers = context.customNumbersEnabled !== null
    ? context.customNumbersEnabled
    : context.theme.code.block.numbers.enabled;
  const paddingLeft = context.theme.code.block.padding.left;
  const leftIndent = ' '.repeat(paddingLeft);

  // Highlight lines support (parse "1,3,5-7" format)
  const highlightLines = new Set();
  if (context.customHighlightLines) {
    const parts = context.customHighlightLines.split(',');
    parts.forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        for (let i = start; i <= end; i++) {
          highlightLines.add(i);
        }
      } else {
        highlightLines.add(parseInt(part.trim()));
      }
    });
  }

  // Gutter separator - use custom or theme
  const showGutter = context.customGutterEnabled !== null && context.customGutterEnabled !== undefined
    ? (context.customGutterEnabled === 'true' || context.customGutterEnabled === '1' || context.customGutterEnabled === true)
    : (context.theme.code.block.gutter.enabled !== false);
  const gutterSeparatorMarker = showGutter
    ? (context.customGutterSeparatorMarker || context.theme.code.block.gutter.marker)
    : '';
  const gutterSeparatorColorFn = showGutter && context.customGutterSeparatorColor
    ? (text) => safeChalkString(context.customGutterSeparatorColor, { colors: true })(text)
    : showGutter
      ? (text) => safeChalkString(context.theme.code.block.gutter.color, { colors: true })(text)
      : (text) => text;

  if (!showLineNumbers) {
    const codeContent = codeValueLines.map(
      (codeLine) => indentify(
        leftIndent,
        true,
      )(
        wrapAnsi(`|${codeLine}|`, context.lineWidth - (paddingLeft * 2), {
          trim: true,
        }).slice(1, -1),
      ),
    );

    return indentify(leftIndent, false)(codeContent.join('\n'));
  }

  const codeLinesLength = `${codeValueLines.length}`.length;
  const gutterWidth = codeLinesLength + gutterSeparatorMarker.length;
  const pad = `${Array.from({ length: gutterWidth - 1 }).join(' ')}`;

  // Apply custom numbers color if provided
  const numbersColorFn = context.customNumbersColor
    ? (text) => safeChalkString(context.customNumbersColor, { colors: true })(text)
    : context.theme.code.block.numbers.color;

  // Overflow indicator settings
  const overflowIndicatorEnabled = context.customOverflowIndicatorEnabled !== null && context.customOverflowIndicatorEnabled !== undefined
    ? (context.customOverflowIndicatorEnabled === 'true' || context.customOverflowIndicatorEnabled === true)
    : (context.theme.code.block.overflowIndicator?.enabled === true);
  const overflowIndicatorMarker = context.customOverflowIndicatorMarker || context.theme.code.block.overflowIndicator?.marker || '↳';
  const overflowIndicatorColorFn = context.customOverflowIndicatorColor
    ? (text) => safeChalkString(context.customOverflowIndicatorColor, { colors: true })(text)
    : (context.theme.code.block.overflowIndicator?.color
      ? (text) => safeChalkString(context.theme.code.block.overflowIndicator.color, { colors: true })(text)
      : numbersColorFn);

  const codeContent = codeValueLines.flatMap(
    (codeLine, index) => {
      const lineNumber = index + 1;

      // Line highlighting
      const isHighlighted = highlightLines.has(lineNumber);

      // Build line number with gutter
      const lineNumberText = `${lineNumber}`.padStart(codeLinesLength, ' ');
      const gutter = numbersColorFn(lineNumberText) + ' ' + gutterSeparatorColorFn(gutterSeparatorMarker);

      // Wrap and process the code line
      const wrappedLine = wrapAnsi(`|${codeLine}|`, context.lineWidth - pad.length - (paddingLeft * 2), {
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
          currentGutter = overflowIndicatorColorFn(overflowMarkerPadded) + ' ' + gutterSeparatorColorFn(gutterSeparatorMarker);
        }

        let styledLine = indentify(pad, true)(wrappedPart);

        // Apply highlight to entire line
        if (isHighlighted) {
          const highlightColor = context.customHighlightColor || context.theme.code.block.highlight.color;
          styledLine = safeChalkString(highlightColor, { colors: true })(styledLine);
        }

        return `${currentGutter}${styledLine}`;
      });
    },
  );

  // Language label support
  const codeBlock = indentify(leftIndent, false)(codeContent.join('\n'));

  if (context.customLangLabelEnabled && langName) {
    const label = createLanguageLabel(langName, {
      color: context.customLangLabelColor || context.theme.code.block.label.color,
      prefixMarker: context.customLangLabelPrefixMarker || context.theme.code.block.label.prefix.marker,
      prefixColor: context.customLangLabelPrefixColor || context.theme.code.block.label.prefix.color,
      suffixMarker: context.customLangLabelSuffixMarker || context.theme.code.block.label.suffix.marker,
      suffixColor: context.customLangLabelSuffixColor || context.theme.code.block.label.suffix.color,
    });

    const labelLine = indentify(leftIndent, false)(label);

    if (context.customLangLabelPosition === 'bottom') {
      return codeBlock + '\n' + labelLine;
    } else { // top
      return labelLine + '\n' + codeBlock;
    }
  }

  return codeBlock;
})(tag, context);

export const pre = (tag, context) => {
  const custom = getCustomAttributes(tag);

  // Also check for attributes on child <code> tag
  const codeTag = tag.childNodes?.find(child => child.nodeName === 'code');
  const codeCustom = codeTag ? getCustomAttributes(codeTag) : {};

  // Parse lang label enabled attribute
  const langLabelEnabled = custom.langLabelEnabled ?? codeCustom.langLabelEnabled;
  const parsedLangLabelEnabled = langLabelEnabled === null
    ? context.theme.code.block.label.enabled
    : (langLabelEnabled === 'true' || langLabelEnabled === '1' || langLabelEnabled === true);

  const newContext = {
    ...context,
    pre: true,
    lineWidth: context.lineWidth,
    customCodeColor: custom.color || codeCustom.color,
    customNumbersEnabled: custom.numbersEnabled ?? codeCustom.numbersEnabled,
    customNumbersColor: custom.numbersColor || codeCustom.numbersColor,
    customHighlightLines: custom.highlightLines || codeCustom.highlightLines,
    customHighlightColor: custom.highlightColor || codeCustom.highlightColor,
    customGutterEnabled: custom.gutterEnabled ?? codeCustom.gutterEnabled,
    customGutterSeparatorMarker: custom.gutterSeparatorMarker || codeCustom.gutterSeparatorMarker,
    customGutterSeparatorColor: custom.gutterSeparatorColor || codeCustom.gutterSeparatorColor,
    customLangLabelEnabled: parsedLangLabelEnabled,
    customLangLabelPosition: custom.langLabelPosition || codeCustom.langLabelPosition || context.theme.code.block.label.position,
    customLangLabelColor: custom.langLabelColor || codeCustom.langLabelColor,
    customLangLabelPrefixMarker: custom.langLabelPrefixMarker || codeCustom.langLabelPrefixMarker,
    customLangLabelPrefixColor: custom.langLabelPrefixColor || codeCustom.langLabelPrefixColor,
    customLangLabelSuffixMarker: custom.langLabelSuffixMarker || codeCustom.langLabelSuffixMarker,
    customLangLabelSuffixColor: custom.langLabelSuffixColor || codeCustom.langLabelSuffixColor,
    customOverflowIndicatorEnabled: custom.overflowIndicatorEnabled ?? codeCustom.overflowIndicatorEnabled,
    customOverflowIndicatorMarker: custom.overflowIndicatorMarker || codeCustom.overflowIndicatorMarker,
    customOverflowIndicatorColor: custom.overflowIndicatorColor || codeCustom.overflowIndicatorColor,
  };

  return blockTag((value) => value, { marginTop: 2, marginBottom: 2 })(
    tag,
    newContext,
  );
};
