import chalk from 'chalk';
import { blockTag } from '../tag-helpers/blockTag.js';

export const h1 = blockTag((value) => chalk.bgCyan.bold(` § ${value} `), {
  marginTop: 2,
  marginBottom: 1,
});
export const h2 = blockTag((value) => chalk.bgCyanBright.bold(` § ${value} `), {
  marginTop: 1,
  marginBottom: 1,
});
export const h3 = blockTag((value) => chalk.blue.bgBlack.bold(` § ${value} `), {
  marginTop: 1,
  marginBottom: 1,
});
export const h4 = blockTag((value) => ` ${chalk.greenBright.bold(`§ ${value}`)}`, {
  marginTop: 1,
  marginBottom: 1,
});
export const h5 = blockTag((value) => ` ${chalk.greenBright(`§ ${value}`)}`, {
  marginTop: 1,
  marginBottom: 1,
});
export const h6 = blockTag((value) => ` ${chalk.green(`§ ${value}`)}`, {
  marginTop: 1,
  marginBottom: 1,
});
