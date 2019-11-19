const parse5 = require('parse5');
const { html } = require('./lib/tags');

const htmlToCli = (rawHTML) => {
  // @type Object
  const document = parse5.parse(rawHTML);

  return `${(html(document, { pre: false, lineWidth: 80 }) || { value: '' }).value}\n`;
};


module.exports = htmlToCli;
