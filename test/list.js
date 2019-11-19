const { getListSymbol, getListType } = require('../lib/utils/list');


console.log(getListType('disc', 'square'));
console.log(getListType(null, 'square'));
console.log(getListType(null, 'void'));
console.log(getListType(null, null));

console.log(getListSymbol('disc'));
