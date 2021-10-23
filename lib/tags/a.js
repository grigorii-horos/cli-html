import { stdout } from "supports-hyperlinks";
import ansiEscapes from "ansi-escapes";
import inlineTag from "../tag-helpers/inlineTag.js";

import { getAttribute } from "../utils.js";

import ansiColors from "ansi-colors";

const { underline, grey, cyan, italic, blue } = ansiColors;
export const a = inlineTag((value, tag) => {
  const rawHref = getAttribute(tag, "href", null);

  const href =
    rawHref &&
    // eslint-disable-next-line no-script-url
    !rawHref.startsWith("javascript:")
      ? rawHref
      : null;

  const title = getAttribute(tag, "title", null);

  let linkText = blue(value);

  linkText = title ? `${linkText} - ${title}` : linkText;

  linkText = underline.blue(linkText);

  const linkValue =
    stdout && href
      ? // eslint-disable-next-line security/detect-non-literal-fs-filename
        ansiEscapes.link(linkText, href)
      : linkText;

  return linkValue;
});
