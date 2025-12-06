import chalkString from 'chalk-string';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttribute, indentify } from '../utilities.js';
import { getListColor, getListItemNumber, getListMarker, getListType, getOrderedListType } from '../utils/list.js';

const defaultUnorderedMarkers = {
  disc: '•',
  square: '-',
  circle: '‣',
};

const normalizeUnorderedMarkers = (value) => {
  if (Array.isArray(value)) {
    const [disc, square, circle] = value;
    return {
      ...defaultUnorderedMarkers,
      disc: disc ?? defaultUnorderedMarkers.disc,
      square: square ?? defaultUnorderedMarkers.square,
      circle: circle ?? defaultUnorderedMarkers.circle,
    };
  }

  if (value && typeof value === 'object') {
    return {
      ...defaultUnorderedMarkers,
      disc: value.disc ?? defaultUnorderedMarkers.disc,
      square: value.square ?? defaultUnorderedMarkers.square,
      circle: value.circle ?? defaultUnorderedMarkers.circle,
    };
  }

  return defaultUnorderedMarkers;
};

export const ol = (tag, context) => {
  const tagType = getAttribute(tag, 'type');
  const customMarkers = context.theme.ol?.markers;

  // Get list type with rotation support
  const listType = getOrderedListType(
    tagType,
    context.listType,
    customMarkers
  );

  const listDepth = (context.listDepth || 0) + 1;

  const newContext = {
    ...context,
    lineWidth: context.lineWidth - 1,
    orderedList: true,
    compact: true,
    listType,
    listDepth,
  };

  return blockTag((value) => indentify(context.compact ? '' : ' ', false)(value), {
    marginTop: context.compact ? 0 : 1,
    marginBottom: context.compact ? 0 : 1,
  })(tag, newContext);
};

export const ul = (tag, context) => {
  const listDepth = (context.listDepth || 0) + 1;

  const newContext = {
    ...context,
    lineWidth: context.lineWidth - 1,
    orderedList: false,
    compact: true,
    listType: getListType(getAttribute(tag, 'type', null), context.listType),
    listDepth,
  };

  return blockTag((value) => indentify(context.compact ? '' : ' ', false)(value), {
    marginTop: context.compact ? 0 : 1,
    marginBottom: context.compact ? 0 : 1,
  })(tag, newContext);
};

export const li = (tag, context) => {
  if (context.orderedList) {
    const depth = (context.listDepth || 1) - 1;
    const colors = context.theme.ol?.colors;
    const listColor = getListColor(context.listType, depth, colors);

    const decimal = context.theme.ol.decimal || '.';
    const markerText = `${getListItemNumber(context.liItemNumber, context.listType)}${decimal}`;
    const marker = listColor
      ? chalkString(listColor)(markerText)
      : context.theme.ol.color(markerText);

    const indent = context.theme.ol.indent || '   ';
    const indentWidth = indent.length;

    return blockTag(
      (value) => `${marker} ${indentify(indent, true)(value)}`,
    )(tag, { ...context, lineWidth: context.lineWidth - indentWidth });
  }

  const depth = (context.listDepth || 1) - 1;
  const colors = context.theme.ul?.colors;
  const listColor = getListColor(context.listType, depth, colors);

  const bulletMarker = getListMarker(
    context.listType,
    normalizeUnorderedMarkers(context.theme.ul?.markers),
  );

  const bullet = listColor
    ? chalkString(listColor)(bulletMarker)
    : context.theme.ul.color(bulletMarker);

  const indent = context.theme.ul.indent || '  ';
  const indentWidth = indent.length;

  return blockTag((value) => `${indentify(indent, false)(value)}`.replace(
    new RegExp(` {${indentWidth}}`),
    `${bullet} `,
  ))(tag, { ...context, lineWidth: context.lineWidth - indentWidth });
};
