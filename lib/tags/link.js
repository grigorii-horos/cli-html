const supportsHyperlinks = require('supports-hyperlinks');
const ansiEscapes = require('ansi-escapes');
const ansiStyles = require('ansi-colors');
const compose = require('compose-function');

const inlineTag = require('../tag-helpers/inlineTag');

const {
  getAttribute,
} = require('../utils');

const link = inlineTag(
  (value, tag) => {
    const rawHref = getAttribute(tag, 'href', null);

    const href = (
      rawHref
      // eslint-disable-next-line no-script-url
      && !rawHref.startsWith('javascript:')
    )
      ? rawHref
      : null;

    const title = getAttribute(tag, 'title', null);

    let linkText = ansiStyles.blue(value);

    linkText = title
      ? `${linkText} - ${title}`
      : linkText;

    linkText = ansiStyles.underline.blue(linkText);

    const linkValue = (supportsHyperlinks.stdout && href)
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      ? ansiEscapes.link(linkText, href)
      : linkText;

    return linkValue;
  },
);

module.exports.a = link;
