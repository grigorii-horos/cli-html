import ansiEscapes from 'ansi-escapes';
import chalk from 'chalk';
import { stdout } from 'supports-hyperlinks';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utils.js';
import findParrentTag from '../utils/find-parrent-tag.js';

export const a = inlineTag((value, tag) => {
  const rawHref = getAttribute(tag, 'href', null);

  const inHeader = findParrentTag(tag, ['h1', 'h2', 'h3']);

  const href = rawHref
    // eslint-disable-next-line no-script-url
    && !rawHref.startsWith('javascript:')
    ? rawHref
    : null;

  const title = getAttribute(tag, 'title', null);

  let linkText = (inHeader ? chalk.whiteBright : chalk.blue)(value);

  linkText = title ? `${linkText} - ${title}` : linkText;

  linkText = (inHeader ? chalk.whiteBright : chalk.blue)(linkText);

  const linkValue = stdout && href
    ? ansiEscapes.link(linkText, href)
    : linkText;

  return linkValue;
});
