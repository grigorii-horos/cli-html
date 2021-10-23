import {blockTag} from '../tag-helpers/blockTag.js';
import ansiColors from "ansi-colors";
const { underline, grey, cyan, italic, blue, dim, yellow, bold, red, green } = ansiColors;

export const h1 = blockTag((value) => red.underline.bold(`§ ${value}`), {
  marginTop: 1,
  marginBottom: 1,
});
export const h2 = blockTag((value) => yellow.underline.bold(`§ ${value}`), {
  marginTop: 1,
  marginBottom: 1,
});
export const h3 = blockTag((value) => yellow.underline(`§ ${value}`), {
  marginTop: 1,
  marginBottom: 1,
});
export const h4 = blockTag((value) => green.underline(`§ ${value}`), {
  marginTop: 1,
  marginBottom: 1,
});
export const h5 = blockTag((value) => green(`§ ${value}`), { marginTop: 1, marginBottom: 1 });
export const h6 = blockTag((value) => green.dim(`§ ${value}`), {
  marginTop: 1,
  marginBottom: 1,
});
