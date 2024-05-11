import chalk from 'chalk';
import { highlight } from 'cli-highlight';
import wrapAnsi from 'wrap-ansi';

import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, indentify } from '../utils.js';

export const code = (tag, context) => inlineTag((value, tag) => {
  const classAttributes = getAttribute(tag, 'class', '').split(' ');

  const content = value.at(-1) === '\n' ? value.slice(0, -1) : value;

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
        comment: chalk.blackBright,
      },
    })
    : context.theme.code(content);

  if (tag.parentNode.nodeName !== 'pre') {
    return context.theme.inlineCode(codeValue);
  }

  const codeValueLines = codeValue.split('\n');

  const codeLinesLength = `${codeValueLines.length}`.length;
  const pad = `${Array.from({ length: codeLinesLength + 2 }).join(' ')}`;

  const codeContent = codeValueLines.map(
    (codeLine, index) => `${context.theme.codeNumbers(
      `${index + 1}`.padStart(codeLinesLength, ' '),
    )} ${indentify(
      pad,
      true,
    )(
      wrapAnsi(codeLine, context.lineWidth - pad.length - 2, {
        trim: true,
      }),
    )}`,
  );

  return indentify('', false)(codeContent.join('\n'));
})(tag, context);

export const pre = (tag, context) => blockTag((value) => value, { marginTop: 2, marginBottom: 2 })(
  tag,
  { ...context, pre: true, lineWidth: context.lineWidth - 10 },
);
