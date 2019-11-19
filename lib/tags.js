/* eslint-disable no-param-reassign */
/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-require */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const textNode = require('./tag-helpers/textNode');
const inlineTag = require('./tag-helpers/inlineTag');
const blockTag = require('./tag-helpers/blockTag');

fs
  .readdirSync(`${__dirname}/tags`)
  .forEach((moduleUrl) => {
    Object.entries(require(`${__dirname}/tags/${moduleUrl}`)).forEach(([key, value]) => {
    // @ts-ignore
      module.exports[key] = value;
    });
  });


module.exports['#text'] = textNode;
