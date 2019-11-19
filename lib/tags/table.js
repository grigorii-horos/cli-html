
const Table = require('cli-table3');
const compose = require('compose-function');
const blockTag = require('../tag-helpers/blockTag');
const inlineTag = require('../tag-helpers/inlineTag');
const boxen = require('boxen');
const ansiStyles = require('ansi-colors');
const ansiAlign = require('ansi-align');
const longestLine = require('longest-line');


const { concatTwoTags } = require('../concat');
const {
  indentify,
  getAttribute,
  filterAst,
} = require('../utils');


// // table is an Array, so you can `push`, `unshift`, `splice` and friends
// table.push(
//   ['First value', 'Second value'],
//   ['First value', 'Second value'],
// );

const td = blockTag();
const th = blockTag((value) => ansiStyles.bold.red(value));

const caption = blockTag();


const captions = (tag, context) => {
  void 0;
  return blockTag(
    compose(
      (value) => ansiStyles.bold.blue(value),
      (value) => indentify((''))(value),
    ),
  )(tag, context);
};

const trVals = (tr) => {
  const theadTds = (!tr || !tr.childNodes)
    ? null
    : tr.childNodes.filter((tag) => ['td', 'th'].includes(tag.nodeName));

  const theadTdsValue = !theadTds
    ? null
    : theadTds.map(
      (tag, context) => {
        const det = tag.nodeName === 'td'
          ? td(tag, context)
          : th(tag, context);

        const hAlign = getAttribute(tag, 'align', 'right');
        const vAlign = getAttribute(tag, 'valign', 'top');

        const colSpan = parseInt(getAttribute(tag, 'colspan', '1'), 10);


        return {
          content: det.value,
          hAlign,
          vAlign,
          colSpan,

        };
      },
    );
  return theadTdsValue;
};

const tbodyVals = (tbody) => {
  const theadTrs = !tbody
    ? null
    : tbody.childNodes.filter((tag) => ['tr'].includes(tag.nodeName));

  const theadTrsVals = theadTrs.map(trVals);
  return theadTrsVals;
};

const table = (tag, context) => {
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

  const theadTr = (!thead || !thead.childNodes)
    ? null
    : thead.childNodes.find((child) => child.nodeName === 'tr');

  const theadsValue = !theadTr
    ? null
    : trVals(theadTr);

  if (theadsValue && theadsValue[0]) {
    tableArray.push(theadsValue);
  }


  const trs = tag.childNodes.filter((child) => ['tbody'].includes(child.nodeName));

  trs.map(tbodyVals).map((value) => tableArray.push(...value));

  
  const tfoot = tag.childNodes.find((child) => child.nodeName === 'tfoot');

  const tfootTr = (!tfoot || !tfoot.childNodes)
    ? null
    : tfoot.childNodes.find((child) => child.nodeName === 'tr');

  const tfootdsValue = !tfootTr
    ? null
    : trVals(tfootTr);

  if (tfootdsValue && tfootdsValue[0]) {
    tableArray.push(tfootdsValue);
  }

  const table = new Table({
  });

  console.log('--))==', tableArray);
  table.push(...tableArray);

  const tableString = table.toString();

  const longestLineInTable = longestLine(tableString);

  if (captionsValue && captionsValue.value) {
    captionsValue.value = `${
      captionsValue.value
    }\n${
      ' '.repeat(longestLineInTable)
    }`;

    captionsValue.value = ansiAlign(captionsValue.value);
  }

  return {
    pre: '\n',
    value: concatTwoTags(captionsValue, { value: tableString }).value,
    post: '\n',
    type: 'block',
  };
};

module.exports.table = table;
module.exports.caption = caption;
