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
  // Supports: true/false/'auto'
  // auto: show href only if terminal doesn't support hyperlinks
  const hrefEnabledValue = custom.href.enabled !== null && custom.href.enabled !== undefined
    ? custom.href.enabled
    : theme.hrefEnabled;

  let showHref;
  switch (hrefEnabledValue) {
  case true: 
  case 'true': {
    showHref = true;
  
  break;
  }
  case false: 
  case 'false': {
    showHref = false;
  
  break;
  }
  case 'auto': {
    showHref = !supportsHyperlinks.stdout;
  
  break;
  }
  default: {
    showHref = false; // default
  }
  }

  // Check if we should show title
  const showTitle = custom.title.enabled !== null && custom.title.enabled !== undefined
    ? custom.title.enabled === 'true' || custom.title.enabled === true
    : theme.titleEnabled === true;

  // Only create hyperlink if we're NOT showing href explicitly (to avoid duplication)
  const useHyperlink = supportsHyperlinks.stdout && href && !showHref;
  const linkValue = useHyperlink ? ansiEscapes.link(linkText, href) : linkText;

  let result = linkValue;

  // Add href if requested (only if hyperlink is not used)
  if (showHref && href) {
    const hrefColor = custom.href.color || theme.hrefColor || 'gray';
    const styledHref = safeChalkString(hrefColor, { colors: true })(` [${href}]`);
    result += styledHref;
  }

  // Add title if requested
  if (showTitle && rawTitle) {
    const titleColor = custom.title.color || theme.titleColor || 'yellow';
    const titlePrefix = (custom.title.prefix.marker !== undefined && custom.title.prefix.marker !== null)
      ? custom.title.prefix.marker
      : (theme.titlePrefix || ' (');
    const titleSuffix = (custom.title.suffix.marker !== undefined && custom.title.suffix.marker !== null)
      ? custom.title.suffix.marker
      : (theme.titleSuffix || ')');

    // Support for separate prefix/suffix colors
    const titlePrefixColor = custom.title.prefix.color || theme.titlePrefixColor || titleColor;
    const titleSuffixColor = custom.title.suffix.color || theme.titleSuffixColor || titleColor;

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
  const showExternalIndicator = custom.external.enabled !== null && custom.external.enabled !== undefined
    ? custom.external.enabled === 'true' || custom.external.enabled === true
    : (theme.external?.enabled === true);

  if (showExternalIndicator && isExternal) {
    const externalIndicatorMarker = custom.external.marker || theme.external?.marker || '↗';
    const externalIndicatorColor = custom.external.color || theme.external?.color || 'gray';
    const externalIndicatorPosition = custom.external.position || theme.external?.position || 'after';
    const externalIndicatorSpacing = custom.external.spacing !== undefined && custom.external.spacing !== null
      ? custom.external.spacing
      : (theme.external?.spacing !== undefined && theme.external?.spacing !== null
        ? theme.external.spacing
        : ' ');

    const styledIndicator = safeChalkString(externalIndicatorColor, { colors: true })(externalIndicatorMarker);

    result = externalIndicatorPosition === 'before' ? `${styledIndicator}${externalIndicatorSpacing}${result}` : `${result}${externalIndicatorSpacing}${styledIndicator}`;
  }

  return result;
});
