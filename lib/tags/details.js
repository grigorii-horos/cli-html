import boxen from 'boxen';
import chalkString from 'chalk-string';

import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getCustomAttributes, extractBaseColor } from '../utilities.js';

export const details = (tag, context) => {
  const custom = getCustomAttributes(tag);
  const summaryTag = tag.childNodes.find((tag) => tag.tagName === 'summary');
  const summary = inlineTag()(summaryTag || null, context);

  // Check if details is open (HTML 'open' attribute)
  const isOpen = getAttribute(tag, 'open', null) !== null;

  const borderColorRaw = custom.border || context.theme.details?.border?.color || 'gray';
  const borderColor = extractBaseColor(borderColorRaw);
  const borderStyle = custom.borderStyle || context.theme.details?.border?.style || 'single';
  const dimBorder = custom.borderDim !== null ? custom.borderDim : (context.theme.details?.border?.dim ?? false);

  // Support for open/closed indicators
  const theme = context.theme.details || {};
  let marker;
  let markerColor = null;

  // Support both 'indicator' (new) and 'marker' (legacy) keys
  const indicatorConfig = theme.indicator || theme.marker;

  if (typeof indicatorConfig === 'object') {
    // Extract marker from nested structure
    const openConfig = indicatorConfig.open;
    const closedConfig = indicatorConfig.closed;

    // Extract marker text and color from { marker, color } or plain string
    const openMarker = custom.openMarkerDetails
      || (typeof openConfig === 'object' ? openConfig.marker : openConfig)
      || '▼ ';
    const closedMarker = custom.closedMarker
      || (typeof closedConfig === 'object' ? closedConfig.marker : closedConfig)
      || '▶ ';

    // Extract color
    const openColor = (typeof openConfig === 'object' && openConfig.color) || null;
    const closedColor = (typeof closedConfig === 'object' && closedConfig.color) || null;

    marker = isOpen ? openMarker : closedMarker;
    markerColor = isOpen ? openColor : closedColor;
  } else {
    // Legacy format: single marker string
    marker = custom.marker || indicatorConfig || '> ';
  }

  const padding = theme.padding ?? { top: 0, bottom: 0, left: 1, right: 1 };

  // Apply color to marker if specified
  const styledMarker = markerColor
    ? chalkString(markerColor, { colors: true })(marker)
    : marker;

  return blockTag(
    (value) => `${boxen(value || '', {
      title: summary && summary.value ? `${styledMarker}${summary.value.replaceAll('\n', ' ')}` : `${styledMarker}Summary`,
      padding,
      borderColor,
      dimBorder,
      borderStyle,
    })}`,
    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: context.lineWidth - 8 });
};
