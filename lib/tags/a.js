import ansiEscapes from 'ansi-escapes';
import chalkString from 'chalk-string';
import supportsHyperlinks from "supports-hyperlinks";

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getCustomAttributes, applyCustomColor, safeChalkString } from '../utilities.js';

export const a = inlineTag((value, tag, context) => {
  const rawHref = getAttribute(tag, 'href', null);
  const rawTitle = getAttribute(tag, 'title', null);
  const custom = getCustomAttributes(tag);
  const theme = context.theme.a || {};

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

  const linkText = applyCustomColor(custom.color, context.theme.a.color, value, chalkString);

  // Check if we should show href
  const showHref = custom.showHref !== null && custom.showHref !== undefined
    ? custom.showHref === 'true' || custom.showHref === true
    : theme.showHref === true;

  // Check if we should show title
  const showTitle = custom.showTitle !== null && custom.showTitle !== undefined
    ? custom.showTitle === 'true' || custom.showTitle === true
    : theme.showTitle === true;

  // Only create hyperlink if we're NOT showing href explicitly (to avoid duplication)
  const useHyperlink = supportsHyperlinks.stdout && href && !showHref;
  const linkValue = useHyperlink ? ansiEscapes.link(linkText, href) : linkText;

  let result = linkValue;

  // Add href if requested (only if hyperlink is not used)
  if (showHref && href) {
    const hrefColor = custom.hrefColor || theme.hrefColor || 'gray';
    const styledHref = safeChalkString(hrefColor, { colors: true })(` [${href}]`);
    result += styledHref;
  }

  // Add title if requested
  if (showTitle && rawTitle) {
    const titleColor = custom.titleColor || theme.titleColor || 'yellow';
    const titlePrefix = (custom.titlePrefix !== undefined && custom.titlePrefix !== null)
      ? custom.titlePrefix
      : (theme.titlePrefix || ' (');
    const titleSuffix = (custom.titleSuffix !== undefined && custom.titleSuffix !== null)
      ? custom.titleSuffix
      : (theme.titleSuffix || ')');

    // Support for separate prefix/suffix colors
    const titlePrefixColor = custom.titlePrefixColor || theme.titlePrefixColor || titleColor;
    const titleSuffixColor = custom.titleSuffixColor || theme.titleSuffixColor || titleColor;

    const styledPrefix = (titlePrefixColor && titlePrefix !== null && titlePrefix !== undefined)
      ? safeChalkString(titlePrefixColor, { colors: true })(titlePrefix)
      : (titlePrefix || '');
    const styledTitle = (titleColor && rawTitle)
      ? safeChalkString(titleColor, { colors: true })(rawTitle)
      : rawTitle;
    const styledSuffix = (titleSuffixColor && titleSuffix !== null && titleSuffix !== undefined)
      ? safeChalkString(titleSuffixColor, { colors: true })(titleSuffix)
      : (titleSuffix || '');

    result += `${styledPrefix}${styledTitle}${styledSuffix}`;
  }

  // Add external link indicator if requested
  const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
  const showExternalIndicator = custom.externalIndicatorEnabled !== null && custom.externalIndicatorEnabled !== undefined
    ? custom.externalIndicatorEnabled === 'true' || custom.externalIndicatorEnabled === true
    : (theme.externalIndicator?.enabled === true);

  if (showExternalIndicator && isExternal) {
    const externalIndicatorMarker = custom.externalIndicatorMarker || theme.externalIndicator?.marker || '↗';
    const externalIndicatorColor = custom.externalIndicatorColor || theme.externalIndicator?.color || 'gray';
    const externalIndicatorPosition = custom.externalIndicatorPosition || theme.externalIndicator?.position || 'after';
    const externalIndicatorSpacing = custom.externalIndicatorSpacing !== undefined && custom.externalIndicatorSpacing !== null
      ? custom.externalIndicatorSpacing
      : (theme.externalIndicator?.spacing !== undefined && theme.externalIndicator?.spacing !== null
        ? theme.externalIndicator.spacing
        : ' ');

    const styledIndicator = safeChalkString(externalIndicatorColor, { colors: true })(externalIndicatorMarker);

    if (externalIndicatorPosition === 'before') {
      result = `${styledIndicator}${externalIndicatorSpacing}${result}`;
    } else {
      result = `${result}${externalIndicatorSpacing}${styledIndicator}`;
    }
  }

  return result;
});
