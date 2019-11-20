const ansiStyles = require('ansi-colors');

const hrLine = (inputHrString, length) => {
  const lengthHr = length || process.stdout.columns;
  return (new Array(lengthHr)).join(inputHrString);
};


const hr = (tag, context) => ({
  marginTop: 1,
  value: ansiStyles.gray(hrLine('─', context.lineWidth)),
  marginBottom: 1,
  type: 'block',
});

module.exports.hr = hr;
