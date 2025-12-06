import ansiEscapes from 'ansi-escapes';
import supportsHyperlinks from "supports-hyperlinks";

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utilities.js';

export const a = inlineTag((value, tag, context) => {
  const rawHref = getAttribute(tag, 'href', null);

  const schemes = [
    'file://',
    'http://',
    'https://',
    'mailto:',
    'ftp://',
    'ftps://',
    'sftp://',
    'ssh://',
    'dav://',
    'tel:',
    'git://',
  ];

  const href = !rawHref || schemes.some((url) => rawHref.startsWith(url)) ? rawHref : null;

  const linkText = context.theme.a.color(value);

  const linkValue =
    supportsHyperlinks.stdout && href
      ? ansiEscapes.link(linkText, href)
      : linkText;

  return linkValue;
});
