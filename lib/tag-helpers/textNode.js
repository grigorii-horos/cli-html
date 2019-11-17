const normalizeWhitespace = require('normalize-html-whitespace');


const textNode = (tag, context) => {
  if (context.pre) {
    // console.log('+++++', {
    //   pre: '',
    //   value: tag.value,
    //   post: '',
    //   type: 'inline',
    //   nodeName: '#text',
    // });


    return {
      pre: '',
      value: tag.value,
      post: '',
      type: 'inline',
      nodeName: '#text',
    };
  }
  const normalized = normalizeWhitespace(tag.value).replace(/\n/g, ' ').split('');

  const pre = normalized[0] === ' ' ? normalized.shift() : null;
  const post = normalized[normalized.length - 1] === ' ' ? normalized.pop() : null;

  // console.log('***********', {
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
      ? normalized.join('')
      : null,
    post,
    type: 'inline',
    nodeName: '#text',
  };
};
module.exports = textNode;
