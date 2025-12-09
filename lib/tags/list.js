import chalkString from 'chalk-string';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttribute, getCustomAttributes, applyCustomColor, indentify } from '../utilities.js';
import { getListColor, getListItemNumber, getListMarker, getListType, getOrderedListType, getListDecimal } from '../utils/list.js';
import { markerToAscii } from '../utils/string.js';

export const ol = (tag, context) => {
  const tagType = getAttribute(tag, 'type');
  const customIndicators = context.theme.ol?.indicators || context.theme.ol?.markers;
  const custom = getCustomAttributes(tag);

  // Get list type with rotation support
  const listType = getOrderedListType(
    tagType,
    context.listType,
    customIndicators
  );

  const listDepth = (context.listDepth || 0) + 1;

  const newContext = {
    ...context,
    lineWidth: context.lineWidth - 1,
    orderedList: true,
    compact: true,
    listType,
    listDepth,
    customListColor: custom.color,
    customMarkerColor: custom.markerColor,
    customDecimal: custom.decimal,
  };

  return blockTag((value) => indentify(context.compact ? '' : ' ', false)(value), {
    marginTop: context.compact ? 0 : 1,
    marginBottom: context.compact ? 0 : 1,
  })(tag, newContext);
};

export const ul = (tag, context) => {
  const listDepth = (context.listDepth || 0) + 1;
  const custom = getCustomAttributes(tag);

  const newContext = {
    ...context,
    lineWidth: context.lineWidth - 1,
    orderedList: false,
    compact: true,
    listType: getListType(getAttribute(tag, 'type', null), context.listType),
    listDepth,
    customListColor: custom.color,
    customMarkerColor: custom.markerColor,
    customMarker: custom.marker,
  };

  return blockTag((value) => indentify(context.compact ? '' : ' ', false)(value), {
    marginTop: context.compact ? 0 : 1,
    marginBottom: context.compact ? 0 : 1,
  })(tag, newContext);
};

export const li = (tag, context) => {
  const custom = getCustomAttributes(tag);

  if (context.orderedList) {
    const depth = (context.listDepth || 1) - 1;
    const customIndicators = context.theme.ol?.indicators || context.theme.ol?.markers;

    // Get marker color from new structure (with custom override)
    const markerColor = context.customMarkerColor || getListColor(context.listType, depth, customIndicators);

    // Get decimal from new structure (with custom override)
    const decimal = context.customDecimal || getListDecimal(context.listType, customIndicators);

    const markerText = `${getListItemNumber(context.liItemNumber, context.listType)}${decimal}`;

    const marker = markerColor
      ? chalkString(markerColor, { colors: true })(markerText)
      : markerText;

    const indent = context.theme.ol.indent || '   ';
    const indentWidth = indent.length;

    // Apply text color from theme.li.color or theme.ol.color to li content (with custom override)
    return blockTag(
      (value) => {
        // Priority: data-cli-li-color > data-cli-color > theme.li.color > theme.ol.color
        const textColorFn = custom.liColor
          ? (text) => chalkString(custom.liColor, { colors: true })(text)
          : context.customListColor
          ? (text) => chalkString(context.customListColor, { colors: true })(text)
          : context.theme.li?.color || context.theme.ol.color;

        const styledValue = textColorFn ? textColorFn(value) : value;
        return `${marker} ${indentify(indent, true)(styledValue)}`;
      },
    )(tag, { ...context, lineWidth: context.lineWidth - indentWidth });
  }

  const depth = (context.listDepth || 1) - 1;
  const customIndicators = context.theme.ul?.indicators || context.theme.ul?.markers;

  // Get marker and color from new structure (with custom override)
  const baseBulletMarker = context.customMarker || getListMarker(context.listType, customIndicators, depth);

  // Apply ASCII conversion if ASCII mode is enabled
  const bulletMarker = markerToAscii(baseBulletMarker, context.asciiMode);

  const markerColor = context.customMarkerColor || getListColor(context.listType, depth, customIndicators);

  const bullet = markerColor
    ? chalkString(markerColor, { colors: true })(bulletMarker)
    : bulletMarker;

  const indent = context.theme.ul.indent || '  ';
  const indentWidth = indent.length;

  return blockTag((value) => {
    // Apply text color from theme.li.color or theme.ul.color to li content (with custom override)
    // Priority: data-cli-li-color > data-cli-color > theme.li.color > theme.ul.color
    const textColorFn = custom.liColor
      ? (text) => chalkString(custom.liColor, { colors: true })(text)
      : context.customListColor
      ? (text) => chalkString(context.customListColor, { colors: true })(text)
      : context.theme.li?.color || context.theme.ul.color;

    const styledValue = textColorFn ? textColorFn(value) : value;

    return indentify(indent, false)(styledValue).replace(
      new RegExp(` {${indentWidth}}`),
      `${bullet} `,
    );
  })(tag, { ...context, lineWidth: context.lineWidth - indentWidth });
};
