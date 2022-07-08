import ansiAlign from 'ansi-align';

import { blockTag } from '../tag-helpers/block-tag.js';

export const center = blockTag((value) => ansiAlign(value, { align: 'center' }));
