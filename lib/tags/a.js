import { stdout } from 'supports-hyperlinks';
import ansiEscapes from 'ansi-escapes';
import ansiColors from 'ansi-colors';
import inlineTag from '../tag-helpers/inlineTag.js';

import { getAttribute } from '../utils.js';

export const a = inlineTag((value, tag) => {
  const rawHref = getAttribute(tag, 'href', null);

  const href = rawHref
    // eslint-disable-next-line no-script-url
    && !rawHref.startsWith('javascript:')
    ? rawHref
    : null;

  const title = getAttribute(tag, 'title', null);

  let linkText = ansiColors.blue(value);

  linkText = title ? `${linkText} - ${title}` : linkText;

  linkText = ansiColors.blue(linkText);

  const linkValue = stdout && href
    ? ansiEscapes.link(linkText, href)
    : linkText;

  return linkValue;
});
