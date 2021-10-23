import ansiColors from "ansi-colors";
const { underline, grey, cyan, italic, blue, dim, yellow, bold, red, green } =
  ansiColors;

import { getAttribute } from "../utils.js";

export const img = (tag) => {
  const text =
    getAttribute(tag, "alt", null) ||
    getAttribute(tag, "title", null) ||
    "Image";

  return {
    pre: null,
    value: cyan("!") + grey("[") + cyan(text) + grey("]"),
    post: null,
    type: "inline",
  };
};
