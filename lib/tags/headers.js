import chalk from 'chalk';

import { blockTag } from '../tag-helpers/block-tag.js';

export const h1 = blockTag((value) => chalk.blue.bold(` # ${value} `), {
  marginTop: 2,
  marginBottom: 1,
});
export const h2 = blockTag((value) => chalk.blue.bold(` ## ${value} `), {
  marginTop: 1,
  marginBottom: 1,
});
export const h3 = blockTag((value) => chalk.blue.bold(` ### ${value} `), {
  marginTop: 1,
  marginBottom: 1,
});
export const h4 = blockTag((value) => chalk.cyan.bold(` #### ${value}`), {
  marginTop: 1,
  marginBottom: 1,
});
export const h5 = blockTag((value) => chalk.cyan(` ##### ${value}`), {
  marginTop: 1,
  marginBottom: 1,
});
export const h6 = blockTag((value) => chalk.cyan(` ###### ${value}`), {
  marginTop: 1,
  marginBottom: 1,
});
