const toMarginNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const concatTwoBlockTags = (first, second) => {
  if (first == null && second == null) {
    return null;
  }

  if (first == null) {
    return second;
  }

  if (second == null) {
    return first;
  }

  const firstMarginTop = toMarginNumber(first.marginTop);
  const firstMarginBottom = toMarginNumber(first.marginBottom);
  const secondMarginTop = toMarginNumber(second.marginTop);
  const secondMarginBottom = toMarginNumber(second.marginBottom);

  if (second.value == null) {
    return {
      marginTop: firstMarginTop,
      value: first.value,
      marginBottom: Math.max(firstMarginBottom, secondMarginTop, secondMarginBottom),
    };
  }

  if (first.value == null) {
    return {
      marginTop: Math.max(firstMarginTop, firstMarginBottom, secondMarginTop),
      value: second.value,
      marginBottom: secondMarginBottom,
    };
  }

  const separatorLines = Math.max(firstMarginBottom, secondMarginTop);

  return {
    marginTop: firstMarginTop,
    value: `${first.value}${'\n'.repeat(separatorLines)}${second.value}`,
    marginBottom: secondMarginBottom,
  };
};

export { concatTwoBlockTags };
