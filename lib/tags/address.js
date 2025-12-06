import { blockTag } from '../tag-helpers/block-tag.js';

export const address = blockTag((value, tag, context) => context.theme.address.color(value));
