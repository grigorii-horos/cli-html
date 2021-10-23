import ansiColors from "ansi-colors";
const { underline, grey, cyan, italic, blue, dim, yellow, bold, red, green } =ansiColors;

const hrLine = (inputHrString, length) => {
  const lengthHr = length || process.stdout.columns;
  return new Array(lengthHr).join(inputHrString);
};

export const hr = (tag, context) => ({
  marginTop: 1,
  value: grey(hrLine('─', context.lineWidth)),
  marginBottom: 1,
  type: 'block',
});
