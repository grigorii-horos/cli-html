import ansiAlign from 'ansi-align';
import { blockTag } from '../tag-helpers/blockTag.js';

export const center = blockTag((value) => ansiAlign(value, { align: 'center' }));
