const parse5 = require('parse5');
const htmlparser2Adapter = require('parse5-htmlparser2-tree-adapter');

const { filterAst } = require('./lib/utils');
const { html } = require('./lib/tags');


const htmlToCli = (rawHTML) => {
  // @type Object

  const document = parse5.parse(rawHTML);


  // console.dir(
  //   filterAst(document.childNodes[0].childNodes[1]),
  //   { depth: null },
  // );

  return `${(html(document, { pre: false, lineWidth: 80 }) || { value: '' }).value}\n`;
};


module.exports = htmlToCli;
