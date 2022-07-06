import { NumberToAlphabet } from 'number-to-alphabet';
import romanize from 'romanize';

export const getListType = (tagType, contextType) => {
  const types = ['disc', 'square', 'circle'];

  if (tagType) {
    return tagType;
  }

  if (!contextType || !types.includes(contextType)) {
    return 'disc';
  }

  while (types[0] !== contextType) {
    const symbol = types.shift();
    types.push(symbol);
  }

  return types[1];
};

export const getListSymbol = (symbolType) => {
  const symbolsChar = {
    disc: '•',
    square: '-',
    circle: '‣',
  };
  if (!symbolType) {
    return symbolsChar.disc;
  }

  return symbolsChar[symbolType] || symbolsChar.disc;
};

export const getListItemNumber = (number = 1, type = '1') => {
  const defaultAlphabet = new NumberToAlphabet();

  const types = {
    1: `${number}`,
    A: defaultAlphabet.numberToString(number).toUpperCase(),
    a: defaultAlphabet.numberToString(number),
    I: romanize(number).toUpperCase(),
    i: romanize(number),
  };

  return types[type];
};
