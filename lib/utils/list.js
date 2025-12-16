import { NumberToAlphabet } from 'number-to-alphabet';
import romanize from 'romanize';

const listTypes = ['disc', 'square', 'circle'];
const symbolsChar = {
  disc: '•',
  square: '▪',
  circle: '⚬',
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

  // New format: object with 1/A/a/I/i keys
  if (customMarkers && typeof customMarkers === 'object' && !Array.isArray(customMarkers)) {
    // Check if it's the new structured format (has 1/A/a/I/i keys)
    const markerKeys = Object.keys(customMarkers).filter(k => orderedListTypes.includes(k));
    if (markerKeys.length > 0) {
      if (!contextType || !markerKeys.includes(contextType)) {
        return markerKeys[0];
      }
      const index = markerKeys.indexOf(contextType);
      return markerKeys[(index + 1) % markerKeys.length];
    }
  }

  // Array format (deprecated but still supported)
  if (Array.isArray(customMarkers) && customMarkers.length > 0) {
    const markerTypes = customMarkers.map(m => m.marker).filter(Boolean);
    if (markerTypes.length > 0) {
      if (!contextType || !markerTypes.includes(contextType)) {
        return markerTypes[0];
      }
      const index = markerTypes.indexOf(contextType);
      return markerTypes[(index + 1) % markerTypes.length];
    }
  }

  // Default rotation using orderedListTypes
  if (!contextType || !orderedListTypes.includes(contextType)) {
    return '1';
  }

  const index = orderedListTypes.indexOf(contextType);
  return orderedListTypes[(index + 1) % orderedListTypes.length];
};

export const getListMarker = (markerType, customMarkers = null, depth = 0) => {
  // New format: object with disc/square/circle keys
  if (customMarkers && typeof customMarkers === 'object' && !Array.isArray(customMarkers)) {
    // Check if it's the new structured format
    const markerConfig = customMarkers[markerType];
    if (markerConfig?.marker) {
      return markerConfig.marker;
    }

    // Fallback to first available marker or default
    const firstKey = Object.keys(customMarkers)[0];
    const firstConfig = customMarkers[firstKey];
    if (firstConfig?.marker) {
      return customMarkers[markerType]?.marker || firstConfig.marker;
    }
  }

  // Array format (deprecated but still supported)
  if (Array.isArray(customMarkers) && customMarkers.length > 0) {
    const markerConfig = customMarkers[depth % customMarkers.length];
    return markerConfig?.marker || symbolsChar.disc;
  }

  // Default
  return symbolsChar[markerType] || symbolsChar.disc;
};

export const getListColor = (listType, depth, customMarkers = null) => {
  // New format: object with type keys (disc/square/circle for ul, 1/A/a/I/i for ol)
  if (customMarkers && typeof customMarkers === 'object' && !Array.isArray(customMarkers)) {
    // Check if it's the new structured format
    if (customMarkers[listType]?.color) {
      return customMarkers[listType].color;
    }

    // Fallback: check for any marker with color
    const firstKey = Object.keys(customMarkers)[0];
    if (firstKey && customMarkers[firstKey]?.color) {
      const markerConfig = customMarkers[listType] || customMarkers[firstKey];
      return markerConfig?.color || null;
    }
  }

  // Array format (deprecated but still supported)
  if (Array.isArray(customMarkers) && customMarkers.length > 0) {
    const markerConfig = customMarkers[depth % customMarkers.length];
    // Support both object format {color: "red"} and string format "red"
    if (typeof markerConfig === 'object') {
      return markerConfig?.color || null;
    }
    return markerConfig || null;
  }

  return null;
};

export const getListDecimal = (listType, customMarkers = null) => {
  // New format: object with type keys (1/A/a/I/i)
  if (customMarkers && typeof customMarkers === 'object' && !Array.isArray(customMarkers) && customMarkers[listType]?.decimal) {
      return customMarkers[listType].decimal;
    }

  // Array format (deprecated but still supported)
  if (Array.isArray(customMarkers) && customMarkers.length > 0) {
    // Find marker in array by type
    const markerConfig = customMarkers.find(m => m.marker === listType);
    if (markerConfig?.decimal) {
      return markerConfig.decimal;
    }
    // Fallback to first element
    return customMarkers[0]?.decimal || '.';
  }

  return '.';
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
