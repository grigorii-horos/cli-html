import { parse } from 'parse5';

import terminalSize from 'term-size';
import { filterAst, indentify } from './lib/utils.js';
import { html } from './lib/tags/document.js';

const htmlToCli = (rawHTML) => {
  // @type Object

  const document = parse(rawHTML);

  // console.dir(
  //   filterAst(document.childNodes[0].childNodes[1]),
  //   { depth: null },
  // );

  return `\n${indentify(' ')(
    (
      html(document, {
        pre: false,
        lineWidth: Math.min(120, terminalSize().columns - 2),
      }) || { value: '' }
    ).value,
  )}\n\n`;
};

export default htmlToCli;
