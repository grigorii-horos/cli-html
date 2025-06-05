import { NumberToAlphabet } from 'number-to-alphabet';
import romanize from 'romanize';

const listTypes = ['disc', 'square', 'circle'];
const symbolsChar = {
  disc: '•',
  square: '-',
  circle: '‣',
};
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

export const getListSymbol = (symbolType) => {
  if (!symbolType) {
    return symbolsChar.disc;
  }

  return symbolsChar[symbolType] || symbolsChar.disc;
};

export const getListItemNumber = (number = 1, type = '1') => {
  const types = {
    1: `${number}`,
    A: alphabet.numberToString(number).toUpperCase(),
    a: alphabet.numberToString(number),
    I: romanize(number).toUpperCase(),
    i: romanize(number),
  };

  return types[type];
};
