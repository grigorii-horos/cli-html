/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable global-require */
/* eslint-disable security/detect-non-literal-require */
/* eslint-disable import/no-dynamic-require */
const fs = require('fs');

const textNode = require(`${__dirname}/tag-helpers/textNode`);

fs.readdirSync(`${__dirname}/tags`).forEach((moduleUrl) => {
  Object.entries(require(`${__dirname}/tags/${moduleUrl}`)).forEach(([key, value]) => {
    module.exports[key] = value;
  });
});

module.exports['#text'] = textNode;
