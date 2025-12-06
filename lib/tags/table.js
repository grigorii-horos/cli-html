import ansiAlign from 'ansi-align';
import Table from 'cli-table3';
import styleParser from 'inline-style-parser';
import longestLine from 'longest-line';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttribute } from '../utilities.js';
import { concatTwoBlockTags } from '../utils/concat-block-tags.js';

export const td = (tag, context) => blockTag(
  (value, _tag, ctx) => ctx.theme.table.cell.color(value),
)(tag, context);

export const th = (tag, context) => blockTag(
  (value, _tag, ctx) => ctx.theme.table.header.color(value),
)(tag, context);

export const caption = (tag, context) => blockTag(
  (value, _tag, ctx) => ctx.theme.table.caption.color(value),
)(tag, context);

const captions = caption;

// Structural table elements - these are handled within table rendering
export const tr = blockTag();
export const thead = blockTag();
export const tbody = blockTag();
export const tfoot = blockTag();
export const col = blockTag();
export const colgroup = blockTag();

const trVals = (context) => (tr) => {
  const theadTds = !tr || !tr.childNodes
    ? null
    : tr.childNodes.filter((tag) => ['td', 'th'].includes(tag.nodeName));

  const theadTdsValue = theadTds
    ? theadTds.map((tag) => {
      const det = tag.nodeName === 'td' ? td(tag, context) : th(tag, context);

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

const tbodyVals = (context) => (tbody) => {
  const theadTrs = tbody
    ? tbody.childNodes.filter((tag) => ['tr'].includes(tag.nodeName))
    : null;

  const theadTrsVals = theadTrs.map(trVals(context));
  return theadTrsVals;
};

export const table = (tag, context) => {
  if (!tag.childNodes) {
    return null;
  }

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

  const theadsValue = theadTr ? trVals(context)(theadTr) : null;

  if (theadsValue && theadsValue[0]) {
    tableArray.push(theadsValue);
  }

  const trs = tag.childNodes.filter((child) => ['tbody'].includes(child.nodeName));

  trs.map(tbodyVals(context)).map((value) => tableArray.push(...value));

  const tfoot = tag.childNodes.find((child) => child.nodeName === 'tfoot');

  const tfootTr = !tfoot || !tfoot.childNodes
    ? null
    : tfoot.childNodes.find((child) => child.nodeName === 'tr');

  const tfootdsValue = tfootTr ? trVals(context)(tfootTr) : null;

  if (tfootdsValue && tfootdsValue[0]) {
    tableArray.push(tfootdsValue);
  }

  const tableRender = new Table({});
  tableRender.push(...tableArray);

  const tableString = tableRender.toString();

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
