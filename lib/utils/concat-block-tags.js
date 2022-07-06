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

  if (second.value == null) {
    return {
      marginTop: first.marginTop,
      value: first.value,
      marginBottom: Math.max(+first.marginBottom, +second.marginTop, +second.marginBottom),
    };
  }

  if (first.value == null) {
    return {
      marginTop: Math.max(+first.marginTop, +first.marginBottom, +second.marginTop),
      value: second.value,
      marginBottom: second.marginBottom,
    };
  }

  return {
    marginTop: first.marginTop,
    value: `${first.value}${
      first.marginBottom > second.marginTop
        ? '\n'.repeat(first.marginBottom || 0)
        : '\n'.repeat(second.marginTop || 0)
    }${second.value}`,
    marginBottom: second.marginBottom,
  };
};

export { concatTwoBlockTags };
