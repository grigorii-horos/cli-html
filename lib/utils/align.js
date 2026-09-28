import styleParser from 'inline-style-parser';
import stringWidth from 'string-width';

import { getAttribute } from '../utilities.js';

const ALIGNMENTS = new Set(['left', 'center', 'right']);

/**
 * Horizontal alignment requested by an element: CSS `text-align` in its
 * style attribute, or the legacy `align` attribute.
 * @param {object} tag - HTML tag
 * @returns {'left' | 'center' | 'right' | null} - Alignment, or null when not set
 */
export const getTextAlign = (tag) => {
  let declarations = [];
  try {
    declarations = styleParser(getAttribute(tag, 'style', ''));
  } catch {
    // Invalid inline CSS: ignore it like browsers do
  }

  const value = (declarations.findLast((declaration) => declaration.property === 'text-align')?.value
    ?? getAttribute(tag, 'align', ''))?.trim().toLowerCase();

  if (value === 'start') return 'left';
  if (value === 'end') return 'right';
  return ALIGNMENTS.has(value) ? value : null;
};

/**
 * Align every line of already wrapped text within the given width.
 * @param {string} text - Text (may contain ANSI codes)
 * @param {'left' | 'center' | 'right'} align - Alignment
 * @param {number} width - Available width
 * @returns {string} - Aligned text
 */
export const alignLines = (text, align, width) => {
  if (!text || align === 'left') return text;

  return text
    .split('\n')
    .map((line) => {
      const free = width - stringWidth(line);
      if (free <= 0 || !line.trim()) return line;
      return ' '.repeat(align === 'center' ? Math.floor(free / 2) : free) + line;
    })
    .join('\n');
};
