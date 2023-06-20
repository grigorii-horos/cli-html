import chalk from 'chalk';

import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';

const block = blockTag();

const inline = inlineTag();

const blockWithNewlines = blockTag((value) => value, { marginTop: 1, marginBottom: 1 });

export const span = inline;
export const label = inline;
export const blink = inline;

export const p = blockWithNewlines;

export const div = block;
export const header = block;
export const article = block;
export const footer = block;
export const section = block;
export const main = block;
export const nav = block;
export const aside = block;
export const form = block;
export const picture = block;
export const hgroup = block;

export const figcaption = blockTag(
  (value) => chalk.bgGreen.bold(` ${value} `),
  {
    marginTop: 1,
    marginBottom: 1,
  },
);
