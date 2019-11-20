/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable no-nested-ternary */
const ansiStyles = require('ansi-colors');
const languages = require('languages-aliases');
const { highlight } = require('cli-highlight');
const boxen = require('boxen');

const inlineTag = require('../tag-helpers/inlineTag');
const {
  getAttribute,
} = require('../utils');

const getLangName = (lang) => {
  if (!lang) {
    return lang;
  }
  return languages[lang] ? languages[lang] : lang;
};

const code = (tag, context) => inlineTag(
  (value, tag) => {
    const classAttribute = getAttribute(tag, 'class', null);


    let langName = null;

    if (classAttribute) {
      if (classAttribute.startsWith('language-')) {
        langName = classAttribute.slice(9);
      } if (classAttribute.startsWith('lang-')) {
        langName = classAttribute.slice(5);
      }
    }

    const codeValue = langName
      ? highlight(value, {
        language: langName,
        theme: {
          comment: ansiStyles.grey,
        },
      })
      : ansiStyles.yellow(value);


    return codeValue;
  },
)(tag, context);


const blockTag = require('../tag-helpers/blockTag');

const pre = (tag, context) => blockTag(
  (value, tag) => {
    const classAttribute = (tag.childNodes && tag.childNodes[0])
      ? getAttribute(tag.childNodes[0], 'class', null)
      : null;

    let langName = null;

    if (classAttribute) {
      if (classAttribute.startsWith('language-')) {
        langName = classAttribute.slice(9);
      }
      if (classAttribute.startsWith('lang-')) {
        langName = classAttribute.slice(5);
      }
    }

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
  }, { marginTop: 1, marginBottom: 1 },

)(tag, { ...context, pre: true, lineWidth: context.lineWidth - 6 });

module.exports.code = code;
module.exports.pre = pre;
