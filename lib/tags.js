/* eslint-disable security/detect-object-injection */
const textNode = require('./tag-helpers/textNode');

[require('./tags/abbr'),
 require('./tags/address'),
 require('./tags/baseTags'),
 require('./tags/blockquote'),
 require('./tags/br'),
 require('./tags/center'),
 require('./tags/code'),
 require('./tags/definitions'),
 require('./tags/details'),
 require('./tags/document'),
 require('./tags/fieldset'),
 require('./tags/figure'),
 require('./tags/headers'),
 require('./tags/hr'),
 require('./tags/img'),
 require('./tags/inputs'),
 require('./tags/link'),
 require('./tags/list'),
 require('./tags/table'),
 require('./tags/textStyles'),
].forEach((mod) => {
  Object.entries(mod).forEach(
      ([ key, value ]) => { module.exports[key] = value; });
});

module.exports['#text'] = textNode;
