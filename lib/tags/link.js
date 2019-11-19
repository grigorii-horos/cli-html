const supportsHyperlinks = require('supports-hyperlinks');
const ansiEscapes = require('ansi-escapes');
const ansiStyles = require('ansi-colors');
const compose = require('compose-function');

const inlineTag = require('../tag-helpers/inlineTag');

const link = inlineTag(
  (value, tag) => {
    const hrefAttribute = tag.attrs
      .find((attribute_) => attribute_.name === 'href');

    const href = (
      hrefAttribute
      && hrefAttribute.value
      // eslint-disable-next-line no-script-url
      && !hrefAttribute.value.startsWith('javascript:')
    )
      ? hrefAttribute.value
      : null;

    const titleAttribute = tag.attrs
      .find((attribute_) => attribute_.name === 'title');

    const title = (
      titleAttribute
      && titleAttribute.value
    )
      ? titleAttribute.value
      : false;

    const linkText = value + (title !== false
      ? ` - ${title}`
      : '');

    const linkValue = (supportsHyperlinks.stdout && href)
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      ? ansiEscapes.link(linkText, href)
      : linkText;


    return linkValue;
  },
);

module.exports.a = link;
