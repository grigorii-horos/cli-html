/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable no-nested-ternary */

const concatTwoInlineTags = (first, second) => {
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
      pre: first.pre,
      value: first.value,
      post:
        first.post != null
          ? first.post
          : second.pre != null
            ? second.pre
            : second.post != null
              ? second.post
              : '',
    };
  }

  if (first.value == null) {
    return {
      pre:
        first.pre != null
          ? first.pre
          : first.post != null
            ? first.post
            : second.pre != null
              ? second.pre
              : '',
      value: second.value,
      post: second.post,
    };
  }

  if (first.post != null) {
    return {
      pre: first.pre,
      value: `${first.value}${first.post}${second.value}`,
      post: second.post,
    };
  }

  if (second.pre != null) {
    return {
      pre: first.pre,
      value: `${first.value}${second.pre}${second.value}`,
      post: second.post,
    };
  }

  return {
    pre: first.pre,
    value: `${first.value}${second.value}`,
    post: second.post,
  };
};

export { concatTwoInlineTags };
