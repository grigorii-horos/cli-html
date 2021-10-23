import boxen from 'boxen';
import {blockTag} from '../tag-helpers/blockTag.js';
import inlineTag from '../tag-helpers/inlineTag.js';
import ansiColors from "ansi-colors";
const { underline, grey, cyan, italic, blue } = ansiColors;
const block = blockTag();

const inline = inlineTag();

const blockWithNewlines = blockTag((value) => value, { marginTop: 1, marginBottom: 1 });

export const title = blockTag((value) => boxen(blue.bold(value), {
  padding: {
    top: 0,
    bottom: 0,
    left: 4,
    right: 4,
  },
  borderColor: 'gray',
  borderStyle: 'bold',
}));

export const span = inline;
export const label = inline;

export const p = blockWithNewlines;

export const div = block;
export const head = block;
export const header = block;
export const article = block;
export const footer = block;
export const section = block;
export const main = block;
export const nav = block;
export const aside = block;
export const form = block;
export const picture = block;
export const figcaption = block;
export const hgroup = block;
