const Table = require('cli-table3');
const compose = require('compose-function');
const blockTag = require('../tag-helpers/blockTag');
const inlineTag = require('../tag-helpers/inlineTag');
const boxen = require('boxen');
const ansiStyles = require('ansi-colors');
const { filterAst } = require('../utils');


// // table is an Array, so you can `push`, `unshift`, `splice` and friends
// table.push(
//   ['First value', 'Second value'],
//   ['First value', 'Second value'],
// );

const td = inlineTag();
const caption = inlineTag();
const captions = inlineTag();

const trVals = (tr) => {
  const theadTds = !tr
    ? null
    : tr.childNodes.filter((tag) => ['td', 'th'].includes(tag.nodeName));

  const theadTdsValue = !theadTds
    ? null
    : theadTds.map((tag, context) => td(tag, context)).map((value) => (
      (value && value.value)
        ? value.value
        : ''));

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


  const thead = tag.childNodes.find((child) => child.nodeName === 'thead');


  const theadTr = !thead
    ? null
    : thead.childNodes.filter((child) => child.nodeName === 'tr');


  const theadTdsValue = theadTr
    ? (theadTr.map(trVals))
    : [];

  const table = new Table({
    head: theadTdsValue[0],
  });

  const trs = tag.childNodes.filter((child) => ['tbody'].includes(child.nodeName));

  trs.map(tbodyVals).map((value) => table.push(...value));

  const tfoot = tag.childNodes.find((child) => child.nodeName === 'tfoot');

  const tfootTr = !tfoot
    ? null
    : tfoot.childNodes.find((child) => child.nodeName === 'tr');

  const tfootdsValue = trVals(tfootTr);

  if (tfootdsValue) {
    table.push(tfootdsValue);
  }

  return {
    pre: '\n\n',
    value: table.toString(),
    post: '\n\n',
    type: 'block',
  };
};

module.exports.table = table;
module.exports.caption = caption;
