import { highlight } from 'cli-highlight';

import chalk from 'chalk';
import wrapAnsi from 'wrap-ansi';
import inlineTag from '../tag-helpers/inlineTag.js';
import { blockTag } from '../tag-helpers/blockTag.js';

import { getAttribute, indentify } from '../utils.js';

export const code = (tag, context) => inlineTag((value, tag) => {
  const classAttributes = getAttribute(tag, 'class', '').split(' ');

  const content = value[value.length - 1] === '\n' ? value.slice(0, -1) : value;

  let langName = null;

  // eslint-disable-next-line unicorn/no-array-for-each
  classAttributes.forEach((classAttribute) => {
    if (classAttribute.startsWith('language-')) {
      langName = classAttribute.slice(9);
    }
    if (classAttribute.startsWith('lang-')) {
      langName = classAttribute.slice(5);
    }
  });

  const codeValue = langName
    ? highlight(content, {
      language: langName,
      theme: {
        comment: chalk.blackBright.italic,
      },
    })
    : chalk.yellow(content);

  const codeValueLines = codeValue.split('\n');

  if (tag.parentNode.nodeName !== 'pre') {
    return codeValue;
  }

  const codeLinesLength = `${codeValueLines.length}`.length;
  const pad = `${Array.from({ length: codeLinesLength }).join(' ')}  `;

  const codeContent = codeValueLines.map(
    (codeLine, index) => `${chalk.black(`${index + 1}`.padStart(codeLinesLength, ' '))} ${indentify(
      pad,
      true,
    )(
      wrapAnsi(codeLine, context.lineWidth - codeLinesLength - 1, { trim: true }),
    )}`,
  );

  return codeContent.join('\n');
})(tag, context);

export const pre = (tag, context) => blockTag((value, tag) => indentify('  ')(value), { marginTop: 2, marginBottom: 2 })(
  tag,
  { ...context, pre: true, lineWidth: context.lineWidth - 10 },
);
