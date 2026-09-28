import boxen from 'boxen';
import stringWidth from 'string-width';
import wrapAnsi from 'wrap-ansi';

import { getAttr } from '../core/attr.js';
import { applyColor } from '../core/color.js';
import { extractBaseColor } from '../utilities.js';
import { stripAnsi } from '../utils/string.js';

const BORDER_WIDTH = 2;

const paddingOf = (padding) => ({
  top: padding?.top ?? 0,
  bottom: padding?.bottom ?? 0,
  left: padding?.left ?? 0,
  right: padding?.right ?? 0,
});

const toNumber = (value, fallback) => {
  const number = Number.parseInt(value, 10);
  return Number.isInteger(number) && number >= 0 ? number : fallback;
};

/**
 * Read border and padding settings of a boxed element: data-cli-* attributes
 * first, then the element's own theme section.
 * @param {object} tag - HTML tag
 * @param {object} theme - Theme section of the element (e.g. context.theme.figure)
 * @returns {object} - { borderColor, borderStyle, dimBorder, padding }
 */
export const getBoxSettings = (tag, theme = {}) => {
  const dimAttribute = getAttr(tag, 'border.dim');
  const themePadding = paddingOf(theme.padding);

  return {
    // `data-cli-border` is the legacy name of `data-cli-border-color`
    borderColor: getAttr(tag, 'border.color') ?? getAttr(tag, 'border') ?? theme.border?.color,
    borderStyle: getAttr(tag, 'border.style') ?? theme.border?.style,
    dimBorder: dimAttribute === null ? theme.border?.dim === true : dimAttribute === 'true',
    padding: Object.fromEntries(Object.entries(themePadding).map(
      ([side, value]) => [side, toNumber(getAttr(tag, `padding.${side}`), value)],
    )),
  };
};

/**
 * Width available for content inside a box that must fit into lineWidth.
 * @param {number} lineWidth - Total width available for the box
 * @param {object} padding - Box padding ({ left, right })
 * @returns {number} - Content width
 */
export const boxContentWidth = (lineWidth, padding) => {
  const { left, right } = paddingOf(padding);
  return Math.max(1, lineWidth - BORDER_WIDTH - left - right);
};

export const truncateAnsi = (text, width) => {
  if (stringWidth(text) <= width) return text;
  if (width <= 1) return '…';
  return `${wrapAnsi(text, width - 1, { hard: true, wordWrap: false, trim: false }).split('\n')[0]}…`;
};

/**
 * Draw a bordered box that never exceeds lineWidth.
 *
 * The title is drawn by hand instead of via boxen's `title` option: boxen
 * measures some symbols (e.g. ▶) differently from the rest of the renderer,
 * which misaligns the top border, and it has no way to color the title.
 * @param {string} content - Already rendered content (fits the content width)
 * @param {object} options - Box options
 * @param {number} options.lineWidth - Maximum total width
 * @param {string} [options.title] - Title shown in the top border
 * @param {string} [options.titleColor] - Title color spec
 * @param {string} [options.borderColor] - Border color spec
 * @param {boolean} [options.dimBorder] - Dim the border
 * @param {string} [options.borderStyle] - boxen border style
 * @param {object} [options.padding] - Padding ({ top, bottom, left, right })
 * @returns {string} - Boxed content
 */
export const renderBox = (content, {
  lineWidth,
  title,
  titleColor,
  borderColor,
  dimBorder = false,
  borderStyle,
  padding,
}) => {
  const baseBorderColor = extractBaseColor(borderColor) || undefined;
  const boxOptions = {
    padding: paddingOf(padding),
    borderColor: baseBorderColor,
    dimBorder,
    borderStyle,
  };

  let box = boxen(content ?? '', boxOptions);

  if (!title) {
    return box;
  }

  // Widen the box for a long title, but never beyond lineWidth
  const titleWidth = stringWidth(title);
  const boxWidth = stringWidth(box.split('\n')[0]);
  if (titleWidth + 4 > boxWidth) {
    box = boxen(content ?? '', { ...boxOptions, width: Math.min(titleWidth + 4, lineWidth) });
  }

  const lines = box.split('\n');
  const top = stripAnsi(lines[0]);
  const width = stringWidth(top);
  const [left, horizontal, right] = [top[0], top[1], top.at(-1)];

  const fittedTitle = truncateAnsi(title, width - 4);
  const styledTitle = titleColor ? applyColor(titleColor, fittedTitle) : fittedTitle;
  const fill = horizontal.repeat(Math.max(0, width - 4 - stringWidth(fittedTitle)));

  const borderSpec = [baseBorderColor, dimBorder ? 'dim' : ''].filter(Boolean).join(' ');
  const paintBorder = (text) => (borderSpec ? applyColor(borderSpec, text) : text);

  lines[0] = `${paintBorder(`${left} `)}${styledTitle}${paintBorder(` ${fill}${right}`)}`;
  return lines.join('\n');
};
