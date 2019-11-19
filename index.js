const parse5 = require('parse5');
const { filterAst } = require('./lib/utils');
const { textNode, body: bodyTag, i } = require('./lib/tags');

const htmlToCli = (rawHTML) => {
  // @type Object
  const document = parse5.parse(rawHTML);
  // console.log('___-----', document);


  console.log(bodyTag(document, { pre: false, lineWidth: 80 }).value || '');

  return '';
};


module.exports = htmlToCli;
