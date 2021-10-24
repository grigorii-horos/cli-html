import parse5 from 'parse5';

import { filterAst } from './lib/utils.js';
import { html } from './lib/tags/document.js';

const htmlToCli = (rawHTML) => {
  // @type Object

  const document = parse5.parse(rawHTML);

  // console.dir(
  //   filterAst(document.childNodes[0].childNodes[1]),
  //   { depth: null },
  // );

  return `${(html(document, { pre: false, lineWidth: +(process.env.CLI_HTML_LINE_WIDTH || '120') }) || { value: '' }).value}\n`;
};

export default htmlToCli;
