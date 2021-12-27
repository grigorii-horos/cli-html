import ansiColors from 'ansi-colors';
import { blockTag } from '../tag-helpers/blockTag.js';

const { italic } = ansiColors;

export const address = blockTag((value) => italic(value));
