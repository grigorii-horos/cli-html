import normalizeWhitespace from 'normalize-html-whitespace';

export const textNode = (tag, context) => {
  if (context.pre) {
    return {
      pre: null,
      value: tag.value,
      post: null,
      type: 'inline',
      nodeName: '#text',
    };
  }

  const normalized = [...(normalizeWhitespace(tag.value) || '').replaceAll('\n', ' ')];

  const pre = [' ', '\n'].includes(normalized[0]) ? normalized.shift() : null;
  const post = [' ', '\n'].includes(normalized.at(-1)) ? normalized.pop() : null;

  return {
    pre,
    // parse5 already decodes entities; decoding again would turn &amp;lt; into <
    value: normalized.length > 0 ? normalized.join('') : null,
    post,
    type: 'inline',
    nodeName: '#text',
  };
};
