import ansiColors from 'ansi-colors';
import { blockTag } from '../tag-helpers/blockTag.js';

export const h1 = blockTag((value) => ansiColors.bgCyan.bold(` § ${value} `), {
  marginTop: 2,
  marginBottom: 1,
});
export const h2 = blockTag((value) => ansiColors.bgCyanBright.bold(` § ${value} `), {
  marginTop: 1,
  marginBottom: 1,
});
export const h3 = blockTag((value) => ansiColors.yellow.bgBlack.bold(` § ${value} `), {
  marginTop: 1,
  marginBottom: 1,
});
export const h4 = blockTag((value) => ` ${ansiColors.green.bold(`§ ${value}`)}`, {
  marginTop: 1,
  marginBottom: 1,
});
export const h5 = blockTag((value) => ` ${ansiColors.green(`§ ${value}`)}`, { marginTop: 1, marginBottom: 1 });
export const h6 = blockTag((value) => ` ${ansiColors.green.dim(`§ ${value}`)}`, {
  marginTop: 1,
  marginBottom: 1,
});
