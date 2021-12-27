import parse5 from 'parse5';

import { filterAst, indentify } from './lib/utils.js';
import { html } from './lib/tags/document.js';

const htmlToCli = (rawHTML) => {
  // @type Object

  const document = parse5.parse(rawHTML);

  // console.dir(
  //   filterAst(document.childNodes[0].childNodes[1]),
  //   { depth: null },
  // );

  return `\n${indentify('  ')(
    (html(document, { pre: false, lineWidth: 80 }) || { value: '' }).value,
  )}\n`;
};

export default htmlToCli;
