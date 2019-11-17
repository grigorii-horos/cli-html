const parse5 = require('parse5');
const { filterAst } = require('./lib/utils');
const { textNode, body: bodyTag, i } = require('./lib/tags');

const htmlToCli = (rawHTML) => {
  // @type Object
  const document = parse5.parse(rawHTML);

  const body = document.childNodes[0].childNodes[1];

  console.dir(filterAst(body), { depth: null });

  console.log('------');
  console.log(bodyTag(body, { pre: false, lineWidth: 80 }).value);

  return '';
};


module.exports = htmlToCli;
