/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable no-nested-ternary */
const ansiStyles = require('ansi-colors');
const languages = require('languages-aliases');
const { highlight } = require('cli-highlight');
const boxen = require('boxen');

const inlineTag = require('../tag-helpers/inlineTag');


const getLangName = (lang) => {
  if (!lang) {
    return lang;
  }
  return languages[lang] ? languages[lang] : lang;
};

const code = (tag, context) => inlineTag(
  (value, tag) => {
    const classAttribute = tag.attrs
      .find((attribute_) => attribute_.name === 'class');

    const lang = (classAttribute && classAttribute.value)
      ? classAttribute.value === 'language-js' && 'js'
      : false;
    const langName = lang
      ? getLangName(lang)
      : null;
    const codeValue = lang
      ? highlight(value, {
        language: lang,
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
    const classAttribute = !tag.childNodes
      ? null
      : (!tag.childNodes[0]
        ? null
        : (!tag.childNodes[0].attrs
          ? null
          : tag.childNodes[0].attrs
            .find((attribute_) => attribute_.name === 'class')));

    const lang = (classAttribute && classAttribute.value)
      ? classAttribute.value === 'language-js' && 'js'
      : false;

    const langName = lang
      ? getLangName(lang)
      : null;

    const codeValueInBox = boxen(value, {
      title: langName,
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
  }, { pre: '\n\n', post: '\n\n' },

)(tag, { ...context, pre: true });

module.exports.code = code;
module.exports.pre = pre;
