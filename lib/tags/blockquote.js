import chalkString from "chalk-string";

import { blockTag } from "../tag-helpers/block-tag.js";
import { getAttribute, getColorFromClass, indentify } from "../utilities.js";

const newStyle = (color, string) => chalkString(color, { colors: true })(string);

export const blockquote = (tag, context) => {
  const classAttributes = getAttribute(tag, "class", "")
    ?.split(" ")
    ?.find((classAttribute) => classAttribute.startsWith("x-cli-color-"));

  const color = getColorFromClass(classAttributes);
  const marker = context.theme.blockquote.marker || "│ ";

  return blockTag(
    indentify(
      color ? newStyle(color, marker) : context.theme.blockquote.color(marker),
      false
    ),

    { marginTop: 1, marginBottom: 1 }
  )(tag, { ...context, lineWidth: context.lineWidth - 2 });
};
