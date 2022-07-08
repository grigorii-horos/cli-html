import chalk from 'chalk';

const {
  grey,
} = chalk;

const hrLine = (inputHrString, length) => {
  const lengthHr = length || process.stdout.columns;
  return Array.from({ length: lengthHr }).join(inputHrString);
};

export const hr = (tag, context) => ({
  marginTop: 1,
  value: grey(hrLine('─', context.lineWidth)),
  marginBottom: 1,
  type: 'block',
});
