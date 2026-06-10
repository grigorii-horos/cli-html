import ansiEscapes from 'ansi-escapes';
import supportsHyperlinks from "supports-hyperlinks";

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';

export const a = inlineTag((value, tag, context) => {
  const rawHref = getAttribute(tag, 'href', null);
  const rawTitle = getAttribute(tag, 'title', null);
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

  const linkText = applyThemeColor(getAttr(tag, 'color'), context.theme.a?.color, value);

  // Check if we should show href
  // Supports: true/false/'auto'
  // auto: show href only if terminal doesn't support hyperlinks
  const hrefEnabledValue = getAttr(tag, 'href.enabled') ?? theme.href?.enabled;

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
  const showTitleRaw = getAttr(tag, 'title.enabled');
  const showTitle = showTitleRaw !== null
    ? showTitleRaw === 'true'
    : theme.title?.enabled === true;

  // Only create hyperlink if we're NOT showing href explicitly (to avoid duplication)
  const useHyperlink = supportsHyperlinks.stdout && href && !showHref;
  const linkValue = useHyperlink ? ansiEscapes.link(linkText, href) : linkText;

  let result = linkValue;

  // Add href if requested (only if hyperlink is not used)
  if (showHref && href) {
    const hrefColor = getAttr(tag, 'href.color') ?? theme.href?.color;
    const styledHref = applyColor(hrefColor, ` [${href}]`);
    result += styledHref;
  }

  // Add title if requested
  if (showTitle && rawTitle) {
    const titleColor = getAttr(tag, 'title.color') ?? theme.title?.color;
    const titlePrefix = getAttr(tag, 'title.prefix.marker') ?? theme.title?.prefix?.marker;
    const titleSuffix = getAttr(tag, 'title.suffix.marker') ?? theme.title?.suffix?.marker;

    // Support for separate prefix/suffix colors
    const titlePrefixColor = getAttr(tag, 'title.prefix.color') ?? theme.title?.prefix?.color ?? titleColor;
    const titleSuffixColor = getAttr(tag, 'title.suffix.color') ?? theme.title?.suffix?.color ?? titleColor;

    const styledPrefix = applyColor(titlePrefixColor, titlePrefix);
    const styledTitle = applyColor(titleColor, rawTitle);
    const styledSuffix = applyColor(titleSuffixColor, titleSuffix);

    result += `${styledPrefix}${styledTitle}${styledSuffix}`;
  }

  // Add external link indicator if requested
  const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));
  const externalEnabledRaw = getAttr(tag, 'external.enabled');
  const showExternalIndicator = externalEnabledRaw !== null
    ? externalEnabledRaw === 'true'
    : theme.external?.enabled === true;

  if (showExternalIndicator && isExternal) {
    const externalIndicatorMarker = getAttr(tag, 'external.marker') ?? theme.external?.marker;
    const externalIndicatorColor = getAttr(tag, 'external.color') ?? theme.external?.color;
    const externalIndicatorPosition = getAttr(tag, 'external.position') ?? theme.external?.position;
    const externalIndicatorSpacing = getAttr(tag, 'external.spacing') ?? theme.external?.spacing;

    const styledIndicator = applyColor(externalIndicatorColor, externalIndicatorMarker);

    result = externalIndicatorPosition === 'before' ? `${styledIndicator}${externalIndicatorSpacing}${result}` : `${result}${externalIndicatorSpacing}${styledIndicator}`;
  }

  return result;
});
