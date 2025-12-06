import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';

const block = blockTag();

const inline = inlineTag();

const blockWithNewlines = blockTag((value) => value, { marginTop: 1, marginBottom: 1 });

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

export const figcaption = (tag, context) => blockTag(
  (value) => {
    const prefix = context.theme.figcaption.prefix ?? ' ';
    const suffix = context.theme.figcaption.suffix ?? ' ';
    return context.theme.figcaption.color(`${prefix}${value}${suffix}`);
  },
  {
    marginTop: 1,
    marginBottom: 1,
  },
)(tag, context);

export const dialog = blockTag();
