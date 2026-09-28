import ansiAlign from 'ansi-align';
import Table from 'cli-table3';
import styleParser from 'inline-style-parser';

import { getAttr } from '../core/attr.js';
import { maxLineWidth } from '../utils/string.js';
import { applyColor, applyThemeColor } from '../core/color.js';
import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttribute } from '../utilities.js';
import { concatTwoBlockTags } from '../utils/concat-block-tags.js';

/**
 * Apply zebra striping to cell content
 * @param {string} content - Cell content
 * @param {number} rowIndex - Row index (0-based)
 * @param {object} stripingConfig - Striping configuration with flexible color cycling
 * @returns {string} - Styled content
 */
const applyZebraStriping = (content, rowIndex, stripingConfig) => {
  if (!stripingConfig || !stripingConfig.enabled) {
    return content;
  }

  // Get count (default to 2 for classic zebra striping)
  const count = stripingConfig.count || 2;

  // Validate count is in range 2-5
  const clampedCount = Math.max(2, Math.min(5, count));

  // Calculate array index using modulo for cycling (0-based)
  const arrayIndex = rowIndex % clampedCount;

  // Get the row style object from rows array
  const rowStyle = stripingConfig.rows?.[arrayIndex];

  // Handle both object format {color: '...'} and direct string format
  const rowColor = typeof rowStyle === 'object' ? rowStyle?.color : rowStyle;

  // If no color specified or empty string, return content as-is
  if (!rowColor) {
    return content;
  }

  // Apply the color using applyColor
  return applyColor(rowColor, content);
};

/**
 * Add alignment indicator to cell content
 * @param {string} content - Cell content
 * @param {string} align - Alignment (left, center, right)
 * @param {object} alignmentConfig - Alignment configuration
 * @returns {string} - Content with indicator
 */
const addAlignmentIndicator = (content, align, alignmentConfig) => {
  if (!alignmentConfig || !alignmentConfig.enabled || !align) {
    return content;
  }

  const indicatorConfig = alignmentConfig[align];
  if (!indicatorConfig || !indicatorConfig.indicator) {
    return content;
  }

  const styledIndicator = indicatorConfig.color
    ? applyColor(indicatorConfig.color, indicatorConfig.indicator)
    : indicatorConfig.indicator;

  return styledIndicator + content;
};

export const td = (tag, context) => {
  return blockTag(
    (value, _tag, context_) => {
      // Priority: custom td color > custom tr color > custom section color > theme.td > theme.tr > theme.table
      const cellColor = getAttr(_tag, 'color')
        || context_.customTrColor
        || context_.customSectionColor
        || context_.customTableColor
        || null;

      // Empty strings in config.yaml mean "inherit", so use || rather than ??
      const themeTdColor = context_.theme.td?.color
        || context_.theme.tr?.color
        || context_.theme[context_.tableSection]?.color
        || context_.theme.table?.color;
      const styledValue = applyThemeColor(cellColor, themeTdColor, value);
      return styledValue;
    },
  )(tag, context);
};

export const th = (tag, context) => {
  return blockTag(
    (value, _tag, context_) => {
      // Priority: custom th color > custom tr color > custom section color > theme.th > theme.thead > theme.table
      const headerColor = getAttr(_tag, 'color')
        || context_.customTrColor
        || context_.customSectionColor
        || context_.customTableColor
        || null;

      const themeThColor = context_.theme.th?.color
        || context_.theme.tr?.color
        || context_.theme[context_.tableSection]?.color
        || context_.theme.table?.color;
      const styledValue = applyThemeColor(headerColor, themeThColor, value);
      return styledValue;
    },
  )(tag, context);
};

export const caption = (tag, context) => {
  return blockTag(
    (value, _tag, context_) => {
      const customColor = getAttr(_tag, 'color');
      const styledValue = applyThemeColor(customColor, context_.theme.caption?.color, value);
      return styledValue;
    },
  )(tag, context);
};

const captions = caption;

// Structural table elements - these are handled within table rendering
export const tr = blockTag();
export const thead = blockTag();
export const tbody = blockTag();
export const tfoot = blockTag();
export const col = blockTag();
export const colgroup = blockTag();

const trVals = (context, sectionColor = null, section = 'tbody') => (tr) => {
  const theadTds = !tr || !tr.childNodes
    ? null
    : tr.childNodes.filter((tag) => ['td', 'th'].includes(tag.nodeName));

  // Get tr custom color
  const trColor = getAttr(tr, 'color') || null;

  // Create context with tr and section colors
  const contextWithColors = {
    ...context,
    customTrColor: trColor,
    customSectionColor: sectionColor,
    tableSection: section,
  };

  const theadTdsValue = theadTds
    ? theadTds.map((tag) => {
      const cellTag = tag.nodeName === 'td' ? td : th;
      const render = (lineWidth) => cellTag(tag, { ...contextWithColors, lineWidth })?.value || '';

      const parsedStyle = styleParser(getAttribute(tag, 'style', ''));

      const hAlign = getAttribute(tag, 'align')
        || parsedStyle.find((element) => element.property === 'text-align')?.value;
      const vAlign = getAttribute(tag, 'valign')
        || parsedStyle.find((element) => element.property === 'vertical-align')?.value;

      const colSpan = Number.parseInt(getAttribute(tag, 'colspan', '1'), 10);
      const rowSpan = Number.parseInt(getAttribute(tag, 'rowspan', '1'), 10);

      return {
        content: render(context.lineWidth),
        render,  // Re-render at a given width when the table has to shrink
        hAlign,
        vAlign,
        colSpan,
        rowSpan,
        tag,  // Keep tag reference for later processing
      };
    })
    : null;
  return theadTdsValue;
};

const sectionRows = (context, section) => (sectionTag) => {
  const sectionColor = getAttr(sectionTag, 'color') || null;
  return (sectionTag.childNodes ?? [])
    .filter((child) => child.nodeName === 'tr')
    .map((tr) => trVals(context, sectionColor, section)(tr))
    .filter((row) => row && row.length > 0);
};

const isHeaderRow = (row) => row.length > 0 && row.every((cell) => cell.tag?.nodeName === 'th');

// Helper: Parse row ranges like "1,3,5-7" into array of indices
const parseRowRanges = (rangeString) => {
  if (!rangeString) return [];

  const indices = new Set();
  const parts = rangeString.split(',').map(p => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => Number.parseInt(n, 10));
      for (let index = start; index <= end; index++) {
        indices.add(index);
      }
    } else {
      indices.add(Number.parseInt(part, 10));
    }
  }

  return [...indices];
};

// Helper: Parse column colors "red,green,blue"
const parseColumnColors = (colorsString) => {
  if (!colorsString) return [];
  return colorsString.split(',').map(c => c.trim());
};

// Helper: Parse column alignments "left,center,right"
const parseColumnAlignments = (alignString) => {
  if (!alignString) return [];
  return alignString.split(',').map(a => a.trim());
};


const BORDER_CHARS = {
  single: {
    'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
    'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
    'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
    'right': '│', 'right-mid': '┤', 'middle': '│',
  },
  double: {
    'top': '═', 'top-mid': '╦', 'top-left': '╔', 'top-right': '╗',
    'bottom': '═', 'bottom-mid': '╩', 'bottom-left': '╚', 'bottom-right': '╝',
    'left': '║', 'left-mid': '╠', 'mid': '═', 'mid-mid': '╬',
    'right': '║', 'right-mid': '╣', 'middle': '║',
  },
  rounded: {
    'top': '─', 'top-mid': '┬', 'top-left': '╭', 'top-right': '╮',
    'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '╰', 'bottom-right': '╯',
    'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
    'right': '│', 'right-mid': '┤', 'middle': '│',
  },
  bold: {
    'top': '━', 'top-mid': '┳', 'top-left': '┏', 'top-right': '┓',
    'bottom': '━', 'bottom-mid': '┻', 'bottom-left': '┗', 'bottom-right': '┛',
    'left': '┃', 'left-mid': '┣', 'mid': '━', 'mid-mid': '╋',
    'right': '┃', 'right-mid': '┫', 'middle': '┃',
  },
  ascii: {
    'top': '-', 'top-mid': '+', 'top-left': '+', 'top-right': '+',
    'bottom': '-', 'bottom-mid': '+', 'bottom-left': '+', 'bottom-right': '+',
    'left': '|', 'left-mid': '+', 'mid': '-', 'mid-mid': '+',
    'right': '|', 'right-mid': '+', 'middle': '|',
  },
};

// Names used by the other boxed elements (figure, details, ...) in config.yaml
const BORDER_STYLE_ALIASES = {
  round: 'rounded',
  classic: 'ascii',
};

const renderTable = (options, rows) => {
  const tableRender = new Table(options);
  // cli-table3 mutates cell objects, so give it copies
  tableRender.push(...rows.map((row) => row.map((cell) => ({ ...cell }))));
  return tableRender.toString();
};

const MIN_COLUMN_WIDTH = 3;

/**
 * Column widths (including cell padding) that make the table fit lineWidth,
 * shrinking the widest columns first. Returns null when nothing can be done.
 * @param {Array<Array<object>>} rows - Table rows
 * @param {number} lineWidth - Available width
 * @param {number} cellPadding - Left + right padding of every cell
 * @returns {number[] | null} - cli-table3 colWidths
 */
const fitColumnWidths = (rows, lineWidth, cellPadding) => {
  const widths = [];
  for (const row of rows) {
    let column = 0;
    for (const cell of row) {
      const span = cell.colSpan ?? 1;
      if (span === 1) {
        const cellWidth = maxLineWidth(cell.content);
        widths[column] = Math.max(widths[column] ?? MIN_COLUMN_WIDTH, cellWidth);
      }
      column += span;
    }
  }

  const columnCount = widths.length;
  if (columnCount === 0) return null;
  for (let index = 0; index < columnCount; index++) {
    widths[index] ??= MIN_COLUMN_WIDTH;
  }

  // Each column has 1 border + the cell padding, plus the closing border
  const available = lineWidth - (columnCount * (1 + cellPadding)) - 1;
  if (available < columnCount * MIN_COLUMN_WIDTH) return null;

  let total = widths.reduce((sum, width) => sum + width, 0);
  while (total > available) {
    const widest = widths.indexOf(Math.max(...widths));
    widths[widest] -= 1;
    total -= 1;
  }

  return widths.map((width) => width + cellPadding);
};

export const table = (tag, context) => {
  if (!tag.childNodes) {
    return null;
  }

  // Responsive table settings
  const responsiveEnabledAttr = getAttr(tag, 'responsive.enabled');
  const responsiveEnabled = responsiveEnabledAttr === null
    ? context.theme.table?.responsive?.enabled !== false
    : responsiveEnabledAttr !== 'false';
  const responsiveThreshold = Number.parseInt(
    getAttr(tag, 'responsive.threshold') ?? context.theme.table?.responsive?.threshold,
    10
  );
  const responsiveSeparator = getAttr(tag, 'responsive.separator')
    ?? context.theme.table?.responsive?.separator;
  const responsiveItemSeparator = getAttr(tag, 'responsive.item-separator')
    ?? context.theme.table?.responsive?.itemSeparator;

  // Check if we should use responsive mode (list view)
  const useResponsiveMode = responsiveEnabled && context.lineWidth < responsiveThreshold;

  // Striping configuration - custom attributes take priority over theme
  const stripingEnabledAttr = getAttr(tag, 'striping.enabled');
  const stripingEnabled = stripingEnabledAttr !== null
    ? stripingEnabledAttr === 'true'
    : (context.theme.table?.striping?.enabled === true);

  const stripingCountAttr = getAttr(tag, 'striping.count');
  const stripingCount = stripingCountAttr
    ? Number.parseInt(stripingCountAttr, 10)
    : Number.parseInt(context.theme.table?.striping?.count, 10);

  // Merge custom row colors with theme row colors
  // Theme rows is an array; custom rows come from data-cli-striping-row-N-color
  const themeRows = context.theme.table?.striping?.rows ?? [];

  // Read custom row colors from attributes
  const customRowsArray = [];
  for (let index = 1; index <= 5; index++) {
    const rowColor = getAttr(tag, `striping.row-${index}.color`);
    if (rowColor) {
      customRowsArray[index - 1] = { color: rowColor };
    }
  }

  // Merge custom rows with theme rows
  const mergedRows = [];
  for (let index = 0; index < 5; index++) {
    const themeRow = themeRows[index];
    const customRow = customRowsArray[index];

    if (customRow?.color || themeRow?.color) {
      mergedRows[index] = {
        color: customRow?.color ?? themeRow?.color ?? ''
      };
    }
  }

  // If no custom rows provided, use theme rows
  const hasCustomRows = customRowsArray.some(row => row?.color);
  const stripingRows = hasCustomRows ? mergedRows : themeRows;

  const stripingConfig = stripingEnabled ? {
    enabled: true,
    count: stripingCount,
    rows: stripingRows
  } : null;

  const highlightRows = parseRowRanges(getAttr(tag, 'highlight-rows'));
  const highlightColor = getAttr(tag, 'highlight-color');
  const alternateRows = getAttr(tag, 'alternate-rows') === 'true';
  const alternateColors = parseColumnColors(getAttr(tag, 'alternate-colors') || 'white,gray');
  const showRowNumbers = getAttr(tag, 'show-row-numbers') === 'true';
  const rowNumberColor = getAttr(tag, 'row-number-color') || 'gray';
  const rowNumberStart = Number.parseInt(getAttr(tag, 'row-number-start') || '1', 10);
  const rowNumberSeparator = getAttr(tag, 'row-number-separator') || '│';
  const colColors = parseColumnColors(getAttr(tag, 'col-colors') || '');
  const colAlignments = parseColumnAlignments(getAttr(tag, 'col-align') || '');
  const borderStyle = getAttr(tag, 'border-style');
  const borderColor = getAttr(tag, 'border-color');
  const paddingOf = (side) => {
    const value = Number.parseInt(getAttr(tag, `padding.${side}`), 10);
    return Number.isInteger(value) && value >= 0 ? value : context.theme.table?.padding?.[side];
  };
  const padding = { left: paddingOf('left'), right: paddingOf('right') };
  const cellPadding = padding.left + padding.right;

  const captionTag = {
    ...tag,
    childNodes: tag.childNodes.filter((child) => child.nodeName === 'caption'),
  };

  const captionsValue = captions(captionTag, context);

  const tableContext = { ...context, customTableColor: getAttr(tag, 'color') || null };
  const rowsOf = (section) => tag.childNodes
    .filter((child) => child.nodeName === section)
    .flatMap(sectionRows(tableContext, section));

  const headRows = rowsOf('thead');
  const bodyRows = rowsOf('tbody');
  const footRows = rowsOf('tfoot');

  // Without <thead>, a leading row made only of <th> cells is the header
  if (headRows.length === 0 && bodyRows.length > 1 && isHeaderRow(bodyRows[0])) {
    headRows.push(bodyRows.shift());
  }

  const headerRowCount = headRows.length;
  const hasHeader = headerRowCount > 0;
  const columnOffset = showRowNumbers ? 1 : 0;

  // Build styled rows; with columnWidths (cli-table3 colWidths) cells are
  // re-rendered to wrap inside their column instead of the full line width
  const buildRows = (columnWidths = null) => {
    const tableArray = [...headRows, ...bodyRows, ...footRows].map((row) => {
      let column = columnOffset;
      return row.map((cell) => {
        const span = cell.colSpan || 1;
        const start = column;
        column += span;
        if (!columnWidths) return { ...cell };

        // Spanned columns share their padding and inner borders
        const width = columnWidths.slice(start, start + span).reduce((sum, value) => sum + value, 0) + span - 1 - cellPadding;
        return { ...cell, content: cell.render(Math.max(1, width)) };
      });
    });

    // Apply row highlighting, alternating colors, and column colors
    for (const [rowIndex, row] of tableArray.entries()) {
      const isHeader = rowIndex < headerRowCount;
      const dataRowIndex = rowIndex - headerRowCount; // Index for body rows only (0-based)
      const actualRowIndex = dataRowIndex + 1; // 1-based data row number used by highlight-rows

      // Apply row highlighting
      if (!isHeader && highlightRows.includes(actualRowIndex) && highlightColor) {
        for (const cell of row) {
          cell.content = applyColor(highlightColor, cell.content);
        }
      }

      // Apply zebra striping (new flexible system)
      // Skip header row if present, apply to all data rows
      if (stripingConfig && !isHeader && !highlightRows.includes(actualRowIndex)) {
        for (const cell of row) {
          cell.content = applyZebraStriping(cell.content, dataRowIndex, stripingConfig);
        }
      }
      // Apply alternating row colors (legacy, only if striping is disabled)
      else if (alternateRows && !stripingConfig && !isHeader && !highlightRows.includes(actualRowIndex)) {
        const colorIndex = actualRowIndex % 2;
        const altColor = alternateColors[colorIndex];
        if (altColor) {
          for (const cell of row) {
            cell.content = applyColor(altColor, cell.content);
          }
        }
      }

      // Apply column colors
      if (colColors.length > 0) {
        for (const [colIndex, cell] of row.entries()) {
          const colColor = colColors[colIndex];
          if (colColor) {
            cell.content = applyColor(colColor, cell.content);
          }
        }
      }

      // Apply column alignments and alignment indicators
      const alignmentConfig = context.theme.table?.alignment;
      if (colAlignments.length > 0) {
        for (const [colIndex, cell] of row.entries()) {
          const colAlign = colAlignments[colIndex];
          if (colAlign) {
            cell.hAlign = colAlign;
            // Add alignment indicator if enabled
            cell.content = addAlignmentIndicator(cell.content, colAlign, alignmentConfig);
          }
        }
      } else if (alignmentConfig?.enabled) {
        // Apply alignment indicators based on cell's own hAlign property
        for (const cell of row) {
          if (cell.hAlign) {
            cell.content = addAlignmentIndicator(cell.content, cell.hAlign, alignmentConfig);
          }
        }
      }

      // Add row numbers (header rows get a "#" label on the first row only)
      if (showRowNumbers) {
        let label = '';
        if (!isHeader) {
          label = `${rowNumberStart + dataRowIndex}`;
        } else if (rowIndex === 0) {
          label = '#';
        }
        row.unshift({
          content: applyColor(rowNumberColor, `${label} ${rowNumberSeparator}`),
          hAlign: 'right',
        });
      }
    }

    return tableArray;
  };

  const tableArray = buildRows();

  // Responsive mode: render as list instead of table
  if (useResponsiveMode && tableArray.length > 0) {
    const headers = hasHeader ? tableArray[headerRowCount - 1].map(cell => cell.content) : [];
    const dataRows = tableArray.slice(headerRowCount);

    const listItems = dataRows.map((row, rowIndex) => {
      const rowNumber = showRowNumbers ? rowNumberStart + rowIndex : null;
      // Row numbers are shown as a "#N" line instead of a column
      const cells = showRowNumbers ? row.slice(1) : row;
      const cellHeaders = showRowNumbers ? headers.slice(1) : headers;
      const lines = cells.map((cell, cellIndex) => {
        const headerLabel = cellHeaders[cellIndex] || `Column ${cellIndex + 1}`;
        const cleanHeader = headerLabel.replaceAll(/\u001B\[[0-9;]*m/g, ''); // Strip ANSI from header for label
        return `${cleanHeader}${responsiveSeparator}${cell.content}`;
      });

      let itemText = lines.join('\n');

      // Add row number if enabled
      if (rowNumber !== null) {
        itemText = `${applyColor(rowNumberColor, `#${rowNumber}`)}\n${itemText}`;
      }

      return itemText;
    }).join(responsiveItemSeparator);

    return {
      marginTop: 1,
      value: listItems,
      marginBottom: 1,
      type: 'block',
    };
  }

  // Border characters: explicit style, or ASCII in ASCII mode
  const effectiveBorderStyle = context.asciiMode ? 'ascii' : BORDER_STYLE_ALIASES[borderStyle] ?? borderStyle;
  const baseChars = BORDER_CHARS[effectiveBorderStyle] ?? BORDER_CHARS.single;

  const tableConfig = {
    chars: borderColor
      ? Object.fromEntries(Object.entries(baseChars).map(([key, char]) => [key, applyColor(borderColor, char)]))
      : baseChars,
    style: {
      'padding-left': padding.left,
      'padding-right': padding.right,
      // Coloring the border characters directly (instead of recoloring the
      // rendered string) keeps box-drawing characters inside cells untouched
      ...(borderColor ? { border: [] } : {}),
    },
  };

  let tableString = renderTable(tableConfig, tableArray);

  // Shrink columns (wrapping cell text) when the table is wider than the line
  if (maxLineWidth(tableString) > context.lineWidth) {
    const colWidths = fitColumnWidths(tableArray, context.lineWidth, cellPadding);
    if (colWidths) {
      tableString = renderTable({
        ...tableConfig,
        colWidths,
        wordWrap: true,
        wrapOnWordBoundary: true,
      }, buildRows(colWidths));
    }
  }

  const longestLineInTable = maxLineWidth(tableString);

  if (captionsValue && captionsValue.value) {
    captionsValue.value = `${captionsValue.value}\n${' '.repeat(
      longestLineInTable,
    )}`;

    captionsValue.value = ansiAlign(captionsValue.value);
  }

  return {
    marginTop: 1,
    value: concatTwoBlockTags(captionsValue, { value: tableString }).value,
    marginBottom: 1,
    type: 'block',
  };
};
