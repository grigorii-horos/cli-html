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


    let langName = null;

    if (classAttribute && classAttribute.value) {
      if (classAttribute.value.startsWith('language-')) {
        langName = classAttribute.value.slice(9);
      } if (classAttribute.value.startsWith('lang-')) {
        langName = classAttribute.value.slice(5);
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
    const classAttribute = !tag.childNodes
      ? null
      : (!tag.childNodes[0]
        ? null
        : (!tag.childNodes[0].attrs
          ? null
          : tag.childNodes[0].attrs
            .find((attribute_) => attribute_.name === 'class')));

    let langName = null;

    if (classAttribute && classAttribute.value) {
      if (classAttribute.value.startsWith('language-')) {
        langName = classAttribute.value.slice(9);
      } if (classAttribute.value.startsWith('lang-')) {
        langName = classAttribute.value.slice(5);
      }
    }

    const codeValueInBox = boxen(value, {
      title: languages[langName],
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
