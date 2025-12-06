import { NumberToAlphabet } from 'number-to-alphabet';
import romanize from 'romanize';

const listTypes = ['disc', 'square', 'circle'];
const symbolsChar = {
  disc: '•',
  square: '-',
  circle: '‣',
};
const orderedListTypes = ['1', 'I', 'A', 'i', 'a'];
const alphabet = new NumberToAlphabet();

export const getListType = (tagType, contextType) => {
  if (tagType) {
    return tagType;
  }

  if (!contextType || !listTypes.includes(contextType)) {
    return 'disc';
  }

  const index = listTypes.indexOf(contextType);
  return listTypes[(index + 1) % listTypes.length];
};

export const getOrderedListType = (tagType, contextType, customMarkers = null) => {
  if (tagType) {
    return tagType;
  }

  // If custom markers array is provided, use it for rotation
  if (Array.isArray(customMarkers) && customMarkers.length > 0) {
    if (!contextType || !customMarkers.includes(contextType)) {
      return customMarkers[0];
    }
    const index = customMarkers.indexOf(contextType);
    return customMarkers[(index + 1) % customMarkers.length];
  }

  // Default rotation using orderedListTypes
  if (!contextType || !orderedListTypes.includes(contextType)) {
    return '1';
  }

  const index = orderedListTypes.indexOf(contextType);
  return orderedListTypes[(index + 1) % orderedListTypes.length];
};

export const getListMarker = (markerType, customMarkers = symbolsChar) => {
  const map = {
    ...symbolsChar,
    ...(customMarkers || {}),
  };

  if (!markerType) {
    return map.disc;
  }

  return map[markerType] || map.disc;
};

export const getListColor = (listType, depth, customColors = null) => {
  // If custom colors array provided, use it for rotation
  if (Array.isArray(customColors) && customColors.length > 0) {
    return customColors[depth % customColors.length];
  }

  // Default: use first color or null
  return customColors?.[0] || null;
};

export const getListItemNumber = (number = 1, type = '1') => {
  const types = {
    1: `${number}`,
    A: alphabet.numberToString(number).toUpperCase(),
    a: alphabet.numberToString(number),
    I: romanize(number),
    i: romanize(number).toLowerCase(),
  };

  return types[type];
};
