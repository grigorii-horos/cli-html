const ansiStyles = require('ansi-colors');

const hrLine = (inputHrString, length) => {
  const lengthHr = length || process.stdout.columns;
  return (new Array(lengthHr)).join(inputHrString);
};


const hr = () => ({
  pre: '\n',
  value: ansiStyles.gray(hrLine('─')),
  post: '\n',
  type: 'block',
});

module.exports.hr = hr;
