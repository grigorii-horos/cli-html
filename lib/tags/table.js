import Table from 'cli-table3';
import compose from 'compose-function';
import boxen from 'boxen';
import ansiAlign from 'ansi-align';
import longestLine from 'longest-line';
import inlineTag from '../tag-helpers/inlineTag.js';
import {blockTag} from '../tag-helpers/blockTag.js';

import { concatTwoBlockTags } from '../utils/concatBlockTags.js';
import { indentify, getAttribute, filterAst } from '../utils.js';
import ansiColors from "ansi-colors";
const {
  underline,
  grey,
  cyan,
  italic,
  blue,
  dim,
  yellow,
  bold,
  red,
  green,
  bgBlack,
} = ansiColors;

const td = blockTag();
const th = blockTag((value) => bold.red(value));

export const caption = blockTag();

const captions = (tag, context) => blockTag((value) => bold.blue(value))(tag, context);

const trVals = (tr) => {
  const theadTds = !tr || !tr.childNodes
    ? null
    : tr.childNodes.filter((tag) => ['td', 'th'].includes(tag.nodeName));

  const theadTdsValue = !theadTds
    ? null
    : theadTds.map((tag, context) => {
      const det = tag.nodeName === 'td' ? td(tag, context) : th(tag, context);

      const hAlign = getAttribute(tag, 'align', 'right');
      const vAlign = getAttribute(tag, 'valign', 'top');

      const colSpan = parseInt(getAttribute(tag, 'colspan', '1'), 10);

      return {
        content: det && det.value ? det.value : '',
        hAlign,
        vAlign,
        colSpan,
      };
    });
  return theadTdsValue;
};

const tbodyVals = (tbody) => {
  const theadTrs = !tbody ? null : tbody.childNodes.filter((tag) => ['tr'].includes(tag.nodeName));

  const theadTrsVals = theadTrs.map(trVals);
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

  const theadTr = !thead || !thead.childNodes ? null : thead.childNodes.find((child) => child.nodeName === 'tr');

  const theadsValue = !theadTr ? null : trVals(theadTr);

  if (theadsValue && theadsValue[0]) {
    tableArray.push(theadsValue);
  }

  const trs = tag.childNodes.filter((child) => ['tbody'].includes(child.nodeName));

  trs.map(tbodyVals).map((value) => tableArray.push(...value));

  const tfoot = tag.childNodes.find((child) => child.nodeName === 'tfoot');

  const tfootTr = !tfoot || !tfoot.childNodes ? null : tfoot.childNodes.find((child) => child.nodeName === 'tr');

  const tfootdsValue = !tfootTr ? null : trVals(tfootTr);

  if (tfootdsValue && tfootdsValue[0]) {
    tableArray.push(tfootdsValue);
  }

  const table = new Table({});

  table.push(...tableArray);

  const tableString = table.toString();

  const longestLineInTable = longestLine(tableString);

  if (captionsValue && captionsValue.value) {
    captionsValue.value = `${captionsValue.value}\n${' '.repeat(longestLineInTable)}`;

    captionsValue.value = ansiAlign(captionsValue.value);
  }

  return {
    marginTop: 1,
    value: concatTwoBlockTags(captionsValue, { value: tableString }).value,
    marginBottom: 1,
    type: 'block',
  };
};
