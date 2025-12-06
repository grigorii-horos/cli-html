import inlineTag from '../tag-helpers/inline-tag.js';

// Ruby annotations are used for showing pronunciation of East Asian characters
// In CLI, we'll show base text with annotation in parentheses
export const ruby = inlineTag();

// rt (ruby text) - the annotation/pronunciation
export const rt = inlineTag((value) => ` (${value})`);

// rp (ruby parenthesis) - fallback parentheses for browsers that don't support ruby
// We'll hide these since we're adding our own parentheses
export const rp = () => null;
