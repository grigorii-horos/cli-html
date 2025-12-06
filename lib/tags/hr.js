const hrLine = (inputHrString, length) => {
  const lengthHr = length || process.stdout.columns;
  return Array.from({ length: lengthHr }).join(inputHrString);
};

export const hr = (tag, context) => {
  const marker = context.theme.hr.marker || '─';
  return {
    marginTop: 1,
    value: context.theme.hr.color(hrLine(marker, context.lineWidth)),
    marginBottom: 1,
    type: 'block',
  };
};
