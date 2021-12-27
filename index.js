import parse5 from 'parse5';

import { parse } from 'node-html-parser';
import { filterAst, filterAst2 } from './lib/utils.js';
import { html } from './lib/tags/document.js';

const htmlToCli = (rawHTML) => {
  // @type Object

  // const document = parse5.parse(rawHTML);
  const document2 = parse(rawHTML, {
    blockTextElements: {
      script: false,
      noscript: false,
      style: false,
      // pre: true,
      code: true,
    },
  });

  // console.dir(filterAst(document.childNodes[0].childNodes[1]), { depth: null });

  // console.log("----");

  // console.dir(filterAst2(document2), {
  //   depth: null,
  // });

  return `${
    (
      html(document2, {
        pre: false,
        lineWidth: +(process.env.CLI_HTML_LINE_WIDTH || '120'),
      }) || { value: '' }
    ).value
  }\n`;
};

export default htmlToCli;
