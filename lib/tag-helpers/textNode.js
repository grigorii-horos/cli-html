const normalizeWhitespace = require('normalize-html-whitespace');


const textNode = (tag, context) => {
  const normalized = context.pre
    ? tag.value.split('')
    : normalizeWhitespace(tag.value).replace(/\n/g, ' ').split('');

  const pre = [' ', '\n'].includes(normalized[0]) ? normalized.shift() : null;
  const post = [' ', '\n'].includes(normalized[normalized.length - 1]) ? normalized.pop() : null;

  // console.log('---', {
  //   PPP: context.pre,
  //   pre,
  //   value: normalized.length > 0
  //     ? normalized.join('')
  //     : null,
  //   post,
  //   type: 'inline',
  //   nodeName: '#text',
  // });

  return {
    pre,
    value: normalized.length > 0
      ? `${normalized.join('')}`
      : null,
    post,
    type: 'inline',
    nodeName: '#text',
  };
};
module.exports = textNode;
