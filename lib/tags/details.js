import boxen from 'boxen';

import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, extractBaseColor } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor } from '../core/color.js';

export const details = (tag, context) => {
  const summaryTag = tag.childNodes.find((tag) => tag.tagName === 'summary');
  const summary = inlineTag()(summaryTag || null, context);

  // Check if details is open (HTML 'open' attribute)
  const isOpen = getAttribute(tag, 'open', null) !== null;

  const borderColorRaw = getAttr(tag, 'border') || context.theme.details?.border?.color || 'gray';
  const borderColor = extractBaseColor(borderColorRaw);
  const borderStyle = getAttr(tag, 'border-style') || context.theme.details?.border?.style || 'single';
  const borderDimAttr = getAttr(tag, 'border-dim');
  const dimBorder = borderDimAttr !== null ? borderDimAttr === 'true' : (context.theme.details?.border?.dim ?? false);

  // Support for open/closed indicators
  const theme = context.theme.details || {};
  let marker;
  let markerColor = null;

  const indicatorConfig = theme.indicator;

  if (typeof indicatorConfig === 'object') {
    // Extract marker from nested structure
    const openConfig = indicatorConfig.open;
    const closedConfig = indicatorConfig.closed;

    // Extract marker text and color from { marker, color } or plain string
    const openMarker = getAttr(tag, 'open.marker')
      || (typeof openConfig === 'object' ? openConfig.marker : openConfig)
      || '▼ ';
    const closedMarker = getAttr(tag, 'closed.marker')
      || (typeof closedConfig === 'object' ? closedConfig.marker : closedConfig)
      || '▶ ';

    // Extract color
    const openColor = getAttr(tag, 'open.color') || (typeof openConfig === 'object' && openConfig.color) || null;
    const closedColor = getAttr(tag, 'closed.color') || (typeof closedConfig === 'object' && closedConfig.color) || null;

    marker = isOpen ? openMarker : closedMarker;
    markerColor = isOpen ? openColor : closedColor;
  } else {
    // Legacy format: single marker string
    marker = getAttr(tag, 'marker') || indicatorConfig || '> ';
  }

  const padding = theme.padding;

  // Apply color to marker if specified
  const styledMarker = markerColor ? applyColor(markerColor, marker) : marker;

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
