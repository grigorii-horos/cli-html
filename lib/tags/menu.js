import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';

// menu can be used as a list of commands/options
// For CLI rendering, we'll treat it similar to ul
export const menu = blockTag();

// menuitem is deprecated but we'll support it for backward compatibility
export const menuitem = inlineTag();
