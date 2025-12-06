import chalk from 'chalk';
import { highlight } from 'cli-highlight';
import wrapAnsi from 'wrap-ansi';

import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, indentify } from '../utilities.js';

export const code = (tag, context) => inlineTag((value, tag) => {
  const classAttributes = getAttribute(tag, 'class', '').split(' ');

  const content = value?.at(-1) === "\n" ? value.slice(0, -1) : value;

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
    : context.theme.code.block.color(content);

  if (tag.parentNode.nodeName !== 'pre') {
    return context.theme.code.inline.color(codeValue);
  }

  const codeValueLines = codeValue.split('\n');

  const showLineNumbers = context.theme.code.block.numbers.enabled !== false;
  const paddingLeft = context.theme.code.block.padding?.left ?? 1;
  const leftIndent = ' '.repeat(paddingLeft);

  if (!showLineNumbers) {
    const codeContent = codeValueLines.map(
      (codeLine) => indentify(
        leftIndent,
        true,
      )(
        wrapAnsi(`|${codeLine}|`, context.lineWidth - (paddingLeft * 2), {
          trim: true,
        }).slice(1, -1),
      ),
    );

    return indentify(leftIndent, false)(codeContent.join('\n'));
  }

  const codeLinesLength = `${codeValueLines.length}`.length;
  const pad = `${Array.from({ length: codeLinesLength + 2 }).join(' ')}`;

  const codeContent = codeValueLines.map(
    (codeLine, index) => `${context.theme.code.block.numbers.color(
      `${index + 1}`.padStart(codeLinesLength, ' '),
    )} ${indentify(
      pad,
      true,
    )(
      wrapAnsi(`|${codeLine}|`, context.lineWidth - pad.length - (paddingLeft * 2), {
        trim: true,
      }).slice(1, -1),
    )}`,
  );

  return indentify(leftIndent, false)(codeContent.join('\n'));
})(tag, context);

export const pre = (tag, context) => {
  const lineWidthReduction = context.theme.code.block.padding?.lineWidth ?? 10;
  return blockTag((value) => value, { marginTop: 2, marginBottom: 2 })(
    tag,
    { ...context, pre: true, lineWidth: context.lineWidth - lineWidthReduction },
  );
};
