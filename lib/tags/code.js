import languages from 'languages-aliases';
import { highlight } from 'cli-highlight';
import boxen from 'boxen';

import ansiColors from 'ansi-colors';
import inlineTag from '../tag-helpers/inlineTag.js';
import { blockTag } from '../tag-helpers/blockTag.js';

import { getAttribute } from '../utils.js';

const {
  underline, grey, cyan, italic, blue, dim, yellow,
} = ansiColors;

const getLangName = (lang) => {
  if (!lang) {
    return lang;
  }
  return languages[lang] ? languages[lang] : lang;
};

export const code = (tag, context) => inlineTag((value, tag) => {
  const classAttributes = [...tag.classList.values()];

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
    ? highlight(value, {
      language: langName,
      theme: {
        comment: grey,
      },
    })
    : yellow(value);

  return codeValue;
})(tag, context);

export const pre = (tag, context) => blockTag(
  (value, tag) => {
    const classAttributes = [...tag.childNodes[0].classList.values()];

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

    const codeValueInBox = boxen(value, {
      title: getLangName(langName),
      padding: {
        top: 1,
        bottom: 1,
        left: 2,
        right: 2,
      },
      borderColor: 'gray',
      dimBorder: false,
      borderStyle: 'round',
      titleColor: 'red',
      dimTitle: true,
    });

    return codeValueInBox;
  },
  { marginTop: 2, marginBottom: 2 },
)(tag, { ...context, pre: true, lineWidth: context.lineWidth - 6 });
