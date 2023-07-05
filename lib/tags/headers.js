import { blockTag } from '../tag-helpers/block-tag.js';

export const h1 = blockTag(
  (value, tag, context) => context.theme.h1(`# ${value} `),
  {
    marginTop: 2,
    marginBottom: 1,
  },
);
export const h2 = blockTag(
  (value, tag, context) => context.theme.h2(`## ${value} `),
  {
    marginTop: 1,
    marginBottom: 1,
  },
);
export const h3 = blockTag(
  (value, tag, context) => context.theme.h3(`### ${value} `),
  {
    marginTop: 1,
    marginBottom: 1,
  },
);
export const h4 = blockTag(
  (value, tag, context) => context.theme.h4(`#### ${value}`),
  {
    marginTop: 1,
    marginBottom: 1,
  },
);
export const h5 = blockTag(
  (value, tag, context) => context.theme.h5(`##### ${value}`),
  {
    marginTop: 1,
    marginBottom: 1,
  },
);
export const h6 = blockTag(
  (value, tag, context) => context.theme.h6(`###### ${value}`),
  {
    marginTop: 1,
    marginBottom: 1,
  },
);
