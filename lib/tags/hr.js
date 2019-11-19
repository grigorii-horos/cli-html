const ansiStyles = require('ansi-colors');

const hrLine = (inputHrString, length) => {
  const lengthHr = length || process.stdout.columns;
  return (new Array(lengthHr)).join(inputHrString);
};


const hr = () => ({
  pre: '',
  value: ansiStyles.gray(hrLine('─')),
  post: '',
  type: 'inline',
});

module.exports.hr = hr;
