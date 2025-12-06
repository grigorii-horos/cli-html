import { blockTag } from '../tag-helpers/block-tag.js';

export const h1 = blockTag(
  (value, tag, context) => `${context.theme.h1.color(context.theme.h1.marker || '#')} ${value}`,
  {
    marginTop: 2,
    marginBottom: 1,
  },
);
export const h2 = blockTag(
  (value, tag, context) => `${context.theme.h2.color(context.theme.h2.marker || '##')} ${value}`,
  {
    marginTop: 1,
    marginBottom: 1,
  },
);
export const h3 = blockTag(
  (value, tag, context) => `${context.theme.h3.color(context.theme.h3.marker || '###')} ${value}`,
  {
    marginTop: 1,
    marginBottom: 1,
  },
);
export const h4 = blockTag(
  (value, tag, context) => `${context.theme.h4.color(context.theme.h4.marker || '####')} ${value}`,
  {
    marginTop: 1,
    marginBottom: 1,
  },
);
export const h5 = blockTag(
  (value, tag, context) => `${context.theme.h5.color(context.theme.h5.marker || '#####')} ${value}`,
  {
    marginTop: 1,
    marginBottom: 1,
  },
);
export const h6 = blockTag(
  (value, tag, context) => `${context.theme.h6.color(context.theme.h6.marker || '######')} ${value}`,
  {
    marginTop: 1,
    marginBottom: 1,
  },
);
