/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable no-nested-ternary */

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
      marginBottom: first.marginBottom > 0
        ? +first.marginBottom
        : (second.marginTop > 0
          ? +second.marginTop : (
            second.marginBottom > 0
              ? +second.marginBottom
              : 0
          )),
    };
  }

  if (first.value == null) {
    return {
      marginTop: first.marginTop > 0
        ? +first.marginTop
        : (first.marginBottom > 0
          ? first.marginBottom : (
            second.marginTop > 0
              ? second.marginTop
              : 0
          )),
      value: second.value,
      marginBottom: second.marginBottom,
    };
  }

  if (first.marginBottom && second.marginTop) {
    return {
      marginTop: first.marginTop,
      value: `${first.value}${
        first.marginBottom > second.marginTop
          ? ('\n').repeat((first.marginBottom || 0))
          : ('\n').repeat((second.marginTop || 0))
      }${second.value}`,
      marginBottom: second.marginBottom,
    };
  }

  if (first.marginBottom) {
    return {
      marginTop: first.marginTop,
      value: `${first.value}${('\n').repeat((first.marginBottom || 0))}${second.value}`,
      marginBottom: second.marginBottom,
    };
  }

  if (second.marginTop) {
    return {
      marginTop: first.marginTop,
      value: `${first.value}${('\n').repeat((second.marginTop || 0))}${second.value}`,
      marginBottom: second.marginBottom,
    };
  }

  return {
    marginTop: first.marginTop,
    value: `${first.value}\n${second.value}`,
    marginBottom: second.marginBottom,
  };
};

module.exports.concatTwoBlockTags = concatTwoBlockTags;
