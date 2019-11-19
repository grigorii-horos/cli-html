const { NumberToAlphabet } = require('number-to-alphabet');
const romanize = require('romanize');

const getListType = (tagType, contextType) => {
  const types = [
    'disc',
    'square',
    'circle',
  ];

  if (tagType) {
    // eslint-disable-next-line security/detect-object-injection
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

const getListSymbol = (symbolType) => {
  const symbolsChar = {
    disc: '•',
    square: '-',
    circle: '‣',
  };
  if (!symbolType) {
    return symbolsChar.disc;
  }

  // eslint-disable-next-line security/detect-object-injection
  return symbolsChar[symbolType] || symbolsChar.disc;
};

const getListItemNumber = (number = 1, type = '1') => {
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


module.exports.getListType = getListType;
module.exports.getListSymbol = getListSymbol;
module.exports.getListItemNumber = getListItemNumber;
