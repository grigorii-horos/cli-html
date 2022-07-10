import ansiEscapes from 'ansi-escapes';
import chalk from 'chalk';
import { stdout } from 'supports-hyperlinks';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utils.js';
import findParrentTag from '../utils/find-parrent-tag.js';

export const a = inlineTag((value, tag) => {
  const rawHref = getAttribute(tag, 'href', null);

  const inHeader = findParrentTag(tag, ['h1', 'h2', 'h3']);

  const cleeanUrls = [
    // eslint-disable-next-line no-script-url
    'javascript:',
    'vbscript:',
    'vbscript:',
    'data:',
    'mailto:',
    'tel:',
    'sms:',
    'callto:',
    'cid:',
    'xmpp:',
    'skype:',
    'sip:',
    'sips:',
    'mms:',
    'rtmp:',
    'rtmpt:',
    'rtmps:',
    'rtmpts:',
    'magnet:',

    '#',
  ];

  const href = !rawHref
    || (cleeanUrls.some((url) => rawHref.startsWith(url)))
    ? null
    : rawHref;

  const title = getAttribute(tag, 'title', null);

  let linkText = (inHeader ? chalk.whiteBright : chalk.blue)(value);

  linkText = title ? `${linkText} - ${title}` : linkText;

  linkText = (inHeader ? chalk.whiteBright : chalk.blue)(linkText);

  const linkValue = stdout && href
    ? ansiEscapes.link(linkText, href)
    : linkText;

  return linkValue;
});
