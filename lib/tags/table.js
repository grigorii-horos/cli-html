import ansiAlign from 'ansi-align';
import Table from 'cli-table3';
import styleParser from 'inline-style-parser';
import longestLine from 'longest-line';

import { getAttr } from '../core/attr.js';
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
        || null;

      const themeTdColor = context_.theme.td?.color ?? context_.theme.tr?.color ?? context_.theme.table?.color;
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
        || null;

      const themeThColor = context_.theme.th?.color ?? context_.theme.thead?.color ?? context_.theme.table?.color;
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

const trVals = (context, sectionColor = null, rowIndex = 0) => (tr) => {
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
    tableRowIndex: rowIndex,
  };

  const theadTdsValue = theadTds
    ? theadTds.map((tag) => {
      const det = tag.nodeName === 'td' ? td(tag, contextWithColors) : th(tag, contextWithColors);

      const parsedStyle = styleParser(getAttribute(tag, 'style', ''));

      const hAlign = getAttribute(tag, 'align')
        || parsedStyle.find((element) => element.property === 'text-align')?.value;
      const vAlign = getAttribute(tag, 'valign')
        || parsedStyle.find((element) => element.property === 'vertical-align')?.value;

      const colSpan = Number.parseInt(getAttribute(tag, 'colspan', '1'), 10);
      const rowSpan = Number.parseInt(getAttribute(tag, 'rowspan', '1'), 10);

      return {
        content: det && det.value ? det.value : '',
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

const tbodyVals = (context, sectionColor = null, startIndex = 0) => (tbody) => {
  const theadTrs = tbody
    ? tbody.childNodes.filter((tag) => ['tr'].includes(tag.nodeName))
    : null;

  const theadTrsVals = theadTrs.map((tr, index) => trVals(context, sectionColor, startIndex + index)(tr));
  return theadTrsVals;
};

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

export const table = (tag, context) => {
  if (!tag.childNodes) {
    return null;
  }

  // Responsive table settings
  const responsiveEnabledAttr = getAttr(tag, 'responsive.enabled');
  const responsiveEnabled = responsiveEnabledAttr !== null ? responsiveEnabledAttr !== 'false' : true;
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

  const captionTag = {
    ...tag,
    childNodes: tag.childNodes.filter((child) => child.nodeName === 'caption'),
  };

  const captionsValue = captions(captionTag, context);

  const tableArray = [];

  const thead = tag.childNodes.find((child) => child.nodeName === 'thead');

  const theadTr = !thead || !thead.childNodes
    ? null
    : thead.childNodes.find((child) => child.nodeName === 'tr');

  // Get thead custom color
  const theadColor = thead ? getAttr(thead, 'color') : null;

  const theadsValue = theadTr ? trVals(context, theadColor)(theadTr) : null;

  if (theadsValue && theadsValue[0]) {
    tableArray.push(theadsValue);
  }

  const trs = tag.childNodes.filter((child) => ['tbody'].includes(child.nodeName));

  trs.map((tbody) => {
    // Get tbody custom color
    const tbodyColor = getAttr(tbody, 'color') || null;
    return tbodyVals(context, tbodyColor)(tbody);
  }).map((value) => tableArray.push(...value));

  const tfoot = tag.childNodes.find((child) => child.nodeName === 'tfoot');

  // Get tfoot custom color
  const tfootColor = tfoot ? getAttr(tfoot, 'color') : null;

  const tfootTrs = !tfoot || !tfoot.childNodes
    ? []
    : tfoot.childNodes.filter((child) => child.nodeName === 'tr');

  for (const tfootTr of tfootTrs) {
    const tfootdsValue = trVals(context, tfootColor)(tfootTr);
    if (tfootdsValue && tfootdsValue[0]) {
      tableArray.push(tfootdsValue);
    }
  }

  // Apply row highlighting, alternating colors, and column colors
  const hasHeader = theadsValue && theadsValue[0];
  for (const [rowIndex, row] of tableArray.entries()) {
    const actualRowIndex = hasHeader ? rowIndex : rowIndex + 1; // Adjust for header
    const dataRowIndex = hasHeader && rowIndex > 0 ? rowIndex - 1 : rowIndex; // Index for body rows only

    // Apply row highlighting
    if (highlightRows.includes(actualRowIndex) && highlightColor) {
      for (const cell of row) {
        cell.content = applyColor(highlightColor, cell.content);
      }
    }

    // Apply zebra striping (new flexible system)
    // Skip header row if present, apply to all data rows
    if (stripingConfig && (!hasHeader || rowIndex > 0) && !highlightRows.includes(actualRowIndex)) {
      for (const cell of row) {
        cell.content = applyZebraStriping(cell.content, dataRowIndex, stripingConfig);
      }
    }
    // Apply alternating row colors (legacy, only if striping is disabled)
    else if (alternateRows && !stripingConfig && !highlightRows.includes(actualRowIndex)) {
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

    // Add row numbers
    if (showRowNumbers && rowIndex > 0) { // Skip header row
      const rowNumber = rowNumberStart + rowIndex - (hasHeader ? 1 : 0);
      const rowNumberCell = {
        content: applyColor(rowNumberColor, `${rowNumber} ${rowNumberSeparator}`),
        hAlign: 'right',
      };
      row.unshift(rowNumberCell);
    }
  }

  // Add empty cell for row numbers in header
  if (showRowNumbers && hasHeader && tableArray[0]) {
    const headerRowNumber = {
      content: applyColor(rowNumberColor, `# ${rowNumberSeparator}`),
      hAlign: 'right',
    };
    tableArray[0].unshift(headerRowNumber);
  }

  // Responsive mode: render as list instead of table
  if (useResponsiveMode && tableArray.length > 0) {
    const headers = hasHeader ? tableArray[0].map(cell => cell.content) : [];
    const dataRows = hasHeader ? tableArray.slice(1) : tableArray;

    const listItems = dataRows.map((row, rowIndex) => {
      const rowNumber = showRowNumbers ? rowNumberStart + rowIndex : null;
      const lines = row.map((cell, cellIndex) => {
        const headerLabel = headers[cellIndex] || `Column ${cellIndex + 1}`;
        const cleanHeader = headerLabel.replaceAll(/\u001B\[[0-9;]*m/g, ''); // Strip ANSI from header for label
        return `${cleanHeader}${responsiveSeparator}${cell.content}`;
      });

      let itemText = lines.join('\n');

      // Add row number if enabled
      if (rowNumber !== null) {
        itemText = String.raw`${applyColor(rowNumberColor, `#${rowNumber}`)}\n${itemText}`;
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

  // Configure table style
  const tableConfig = {};

  // Apply border style if specified
  if (borderStyle) {
    const borderChars = {
      'single': {
        'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐',
        'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘',
        'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
        'right': '│', 'right-mid': '┤', 'middle': '│'
      },
      'double': {
        'top': '═', 'top-mid': '╦', 'top-left': '╔', 'top-right': '╗',
        'bottom': '═', 'bottom-mid': '╩', 'bottom-left': '╚', 'bottom-right': '╝',
        'left': '║', 'left-mid': '╠', 'mid': '═', 'mid-mid': '╬',
        'right': '║', 'right-mid': '╣', 'middle': '║'
      },
      'rounded': {
        'top': '─', 'top-mid': '┬', 'top-left': '╭', 'top-right': '╮',
        'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '╰', 'bottom-right': '╯',
        'left': '│', 'left-mid': '├', 'mid': '─', 'mid-mid': '┼',
        'right': '│', 'right-mid': '┤', 'middle': '│'
      },
      'bold': {
        'top': '━', 'top-mid': '┳', 'top-left': '┏', 'top-right': '┓',
        'bottom': '━', 'bottom-mid': '┻', 'bottom-left': '┗', 'bottom-right': '┛',
        'left': '┃', 'left-mid': '┣', 'mid': '━', 'mid-mid': '╋',
        'right': '┃', 'right-mid': '┫', 'middle': '┃'
      },
      'ascii': {
        'top': '-', 'top-mid': '+', 'top-left': '+', 'top-right': '+',
        'bottom': '-', 'bottom-mid': '+', 'bottom-left': '+', 'bottom-right': '+',
        'left': '|', 'left-mid': '+', 'mid': '-', 'mid-mid': '+',
        'right': '|', 'right-mid': '+', 'middle': '|'
      }
    };

    // Use ASCII character set if ASCII mode is enabled
    let effectiveBorderStyle = borderStyle;
    if (context.asciiMode) {
      effectiveBorderStyle = 'ascii';
    }

    if (borderChars[effectiveBorderStyle]) {
      tableConfig.chars = borderChars[effectiveBorderStyle];
    }
  }

  const tableRender = new Table(tableConfig);
  tableRender.push(...tableArray);

  let tableString = tableRender.toString();

  // Apply border color if specified
  if (borderColor && tableString) {
    // Color all border characters (different regex for ASCII vs Unicode)
    const borderRegex = context.asciiMode
      ? /[\-+|]/g  // ASCII: -, +, |
      : /[─━│┃═║┌┐└┘╔╗╚╝╭╮╰╯┏┓┗┛├┤┬┴┼╠╣╦╩╬┳┻┣┫]/g;  // Unicode box drawing
    tableString = tableString.replace(borderRegex, (match) => applyColor(borderColor, match));
  }

  const longestLineInTable = longestLine(tableString);

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
