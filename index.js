import { parse } from 'parse5';

import { indentify } from './lib/utils.js';
import { getGlobalConfig } from './lib/utils/get-global-config.js';
import { renderTag } from './lib/utils/render-tag.js';

const htmlToCli = (rawHTML, theme = {}) => {
  const document = parse(rawHTML);

  // console.dir(
  //   filterAst(document).childNodes[0].childNodes[1].childNodes,
  //   { depth: null },
  // );

  const globalConfig = getGlobalConfig(document, theme);

  return `\n${indentify(' ', false)(
    (renderTag(document, globalConfig) || { value: '' }).value,
  )}\n\n`;
};

export default htmlToCli;
