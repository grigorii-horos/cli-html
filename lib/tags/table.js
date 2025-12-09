import ansiAlign from 'ansi-align';
import chalkString from 'chalk-string';
import Table from 'cli-table3';
import styleParser from 'inline-style-parser';
import longestLine from 'longest-line';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttribute, getCustomAttributes, applyCustomColor } from '../utilities.js';
import { concatTwoBlockTags } from '../utils/concat-block-tags.js';

export const td = (tag, context) => {
  const custom = getCustomAttributes(tag);

  return blockTag(
    (value, _tag, ctx) => {
      // Priority: td color > tr color > thead/tbody/tfoot color > theme.td > theme.cell
      const cellColor = custom.color
        || ctx.customTrColor
        || ctx.customSectionColor
        || null;

      const themeTdColor = ctx.theme.table.td?.color || ctx.theme.table.cell.color;
      const styledValue = applyCustomColor(cellColor, themeTdColor, value, chalkString);
      return styledValue;
    },
  )(tag, context);
};

export const th = (tag, context) => {
  const custom = getCustomAttributes(tag);

  return blockTag(
    (value, _tag, ctx) => {
      // Priority: th color > tr color > thead/tbody/tfoot color > theme.th > theme.header
      const headerColor = custom.color
        || ctx.customTrColor
        || ctx.customSectionColor
        || null;

      const themeThColor = ctx.theme.table.th?.color || ctx.theme.table.header.color;
      const styledValue = applyCustomColor(headerColor, themeThColor, value, chalkString);
      return styledValue;
    },
  )(tag, context);
};

export const caption = (tag, context) => {
  const custom = getCustomAttributes(tag);

  return blockTag(
    (value, _tag, ctx) => {
      const styledValue = applyCustomColor(custom.color, ctx.theme.table.caption.color, value, chalkString);
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

const trVals = (context, sectionColor = null) => (tr) => {
  const theadTds = !tr || !tr.childNodes
    ? null
    : tr.childNodes.filter((tag) => ['td', 'th'].includes(tag.nodeName));

  // Get tr custom color
  const trCustom = getCustomAttributes(tr);
  const trColor = trCustom.trColor || null;

  // Create context with tr and section colors
  const contextWithColors = {
    ...context,
    customTrColor: trColor,
    customSectionColor: sectionColor,
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
      };
    })
    : null;
  return theadTdsValue;
};

const tbodyVals = (context, sectionColor = null) => (tbody) => {
  const theadTrs = tbody
    ? tbody.childNodes.filter((tag) => ['tr'].includes(tag.nodeName))
    : null;

  const theadTrsVals = theadTrs.map(trVals(context, sectionColor));
  return theadTrsVals;
};

// Helper: Parse row ranges like "1,3,5-7" into array of indices
const parseRowRanges = (rangeString) => {
  if (!rangeString) return [];

  const indices = new Set();
  const parts = rangeString.split(',').map(p => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n, 10));
      for (let i = start; i <= end; i++) {
        indices.add(i);
      }
    } else {
      indices.add(parseInt(part, 10));
    }
  }

  return Array.from(indices);
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

  // Get table-level custom attributes
  const tableCustom = getCustomAttributes(tag);

  // Responsive table settings
  const responsiveEnabled = (tableCustom.responsiveEnabled || getAttribute(tag, 'data-cli-responsive-enabled')) !== 'false';
  const responsiveThreshold = parseInt(tableCustom.responsiveThreshold || getAttribute(tag, 'data-cli-responsive-threshold') || '60', 10);
  const responsiveSeparator = tableCustom.responsiveSeparator || getAttribute(tag, 'data-cli-responsive-separator') || ': ';
  const responsiveItemSeparator = tableCustom.responsiveItemSeparator || getAttribute(tag, 'data-cli-responsive-item-separator') || '\n\n';

  // Check if we should use responsive mode (list view)
  const useResponsiveMode = responsiveEnabled && context.lineWidth < responsiveThreshold;

  const highlightRows = parseRowRanges(tableCustom.highlightRows || getAttribute(tag, 'data-cli-highlight-rows'));
  const highlightColor = tableCustom.highlightColor || getAttribute(tag, 'data-cli-highlight-color');
  const alternateRows = (tableCustom.alternateRows || getAttribute(tag, 'data-cli-alternate-rows')) === 'true';
  const alternateColors = parseColumnColors(tableCustom.alternateColors || getAttribute(tag, 'data-cli-alternate-colors') || 'white,gray');
  const showRowNumbers = (tableCustom.showRowNumbers || getAttribute(tag, 'data-cli-show-row-numbers')) === 'true';
  const rowNumberColor = tableCustom.rowNumberColor || getAttribute(tag, 'data-cli-row-number-color') || 'gray';
  const rowNumberStart = parseInt(tableCustom.rowNumberStart || getAttribute(tag, 'data-cli-row-number-start') || '1', 10);
  const rowNumberSeparator = tableCustom.rowNumberSeparator || getAttribute(tag, 'data-cli-row-number-separator') || '│';
  const colColors = parseColumnColors(tableCustom.colColors || getAttribute(tag, 'data-cli-col-colors'));
  const colAlignments = parseColumnAlignments(tableCustom.colAlign || getAttribute(tag, 'data-cli-col-align'));
  const borderStyle = tableCustom.borderStyle || getAttribute(tag, 'data-cli-border-style');
  const borderColor = tableCustom.borderColor || getAttribute(tag, 'data-cli-border-color');

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
  const theadCustom = thead ? getCustomAttributes(thead) : {};
  const theadColor = theadCustom.theadColor || null;

  const theadsValue = theadTr ? trVals(context, theadColor)(theadTr) : null;

  if (theadsValue && theadsValue[0]) {
    tableArray.push(theadsValue);
  }

  const trs = tag.childNodes.filter((child) => ['tbody'].includes(child.nodeName));

  trs.map((tbody) => {
    // Get tbody custom color
    const tbodyCustom = getCustomAttributes(tbody);
    const tbodyColor = tbodyCustom.tbodyColor || null;
    return tbodyVals(context, tbodyColor)(tbody);
  }).map((value) => tableArray.push(...value));

  const tfoot = tag.childNodes.find((child) => child.nodeName === 'tfoot');

  const tfootTr = !tfoot || !tfoot.childNodes
    ? null
    : tfoot.childNodes.find((child) => child.nodeName === 'tr');

  // Get tfoot custom color
  const tfootCustom = tfoot ? getCustomAttributes(tfoot) : {};
  const tfootColor = tfootCustom.tfootColor || null;

  const tfootdsValue = tfootTr ? trVals(context, tfootColor)(tfootTr) : null;

  if (tfootdsValue && tfootdsValue[0]) {
    tableArray.push(tfootdsValue);
  }

  // Apply row highlighting, alternating colors, and column colors
  const hasHeader = theadsValue && theadsValue[0];
  tableArray.forEach((row, rowIndex) => {
    const actualRowIndex = hasHeader ? rowIndex : rowIndex + 1; // Adjust for header

    // Apply row highlighting
    if (highlightRows.includes(actualRowIndex) && highlightColor) {
      row.forEach(cell => {
        cell.content = chalkString(highlightColor, { colors: true })(cell.content);
      });
    }

    // Apply alternating row colors
    if (alternateRows && !highlightRows.includes(actualRowIndex)) {
      const colorIndex = actualRowIndex % 2;
      const altColor = alternateColors[colorIndex];
      if (altColor) {
        row.forEach(cell => {
          cell.content = chalkString(altColor, { colors: true })(cell.content);
        });
      }
    }

    // Apply column colors
    if (colColors.length > 0) {
      row.forEach((cell, colIndex) => {
        const colColor = colColors[colIndex];
        if (colColor) {
          cell.content = chalkString(colColor, { colors: true })(cell.content);
        }
      });
    }

    // Apply column alignments
    if (colAlignments.length > 0) {
      row.forEach((cell, colIndex) => {
        const colAlign = colAlignments[colIndex];
        if (colAlign) {
          cell.hAlign = colAlign;
        }
      });
    }

    // Add row numbers
    if (showRowNumbers && rowIndex > 0) { // Skip header row
      const rowNum = rowNumberStart + rowIndex - (hasHeader ? 1 : 0);
      const rowNumberCell = {
        content: chalkString(rowNumberColor, { colors: true })(`${rowNum} ${rowNumberSeparator}`),
        hAlign: 'right',
      };
      row.unshift(rowNumberCell);
    }
  });

  // Add empty cell for row numbers in header
  if (showRowNumbers && hasHeader && tableArray[0]) {
    const headerRowNum = {
      content: chalkString(rowNumberColor, { colors: true })(`# ${rowNumberSeparator}`),
      hAlign: 'right',
    };
    tableArray[0].unshift(headerRowNum);
  }

  // Responsive mode: render as list instead of table
  if (useResponsiveMode && tableArray.length > 0) {
    const headers = hasHeader ? tableArray[0].map(cell => cell.content) : [];
    const dataRows = hasHeader ? tableArray.slice(1) : tableArray;

    const listItems = dataRows.map((row, rowIndex) => {
      const rowNum = showRowNumbers ? rowNumberStart + rowIndex : null;
      const lines = row.map((cell, cellIndex) => {
        const headerLabel = headers[cellIndex] || `Column ${cellIndex + 1}`;
        const cleanHeader = headerLabel.replace(/\x1b\[[0-9;]*m/g, ''); // Strip ANSI from header for label
        return `${cleanHeader}${responsiveSeparator}${cell.content}`;
      });

      let itemText = lines.join('\n');

      // Add row number if enabled
      if (rowNum !== null) {
        itemText = `${chalkString(rowNumberColor, { colors: true })(`#${rowNum}`)}\\n${itemText}`;
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
    tableString = tableString.replace(borderRegex, (match) => chalkString(borderColor, { colors: true })(match));
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
