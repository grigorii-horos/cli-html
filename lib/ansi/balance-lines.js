import { createSgrState } from './sgr-state.js';

const ESC = '\u001B';
const RESET = `${ESC}[0m`;
// eslint-disable-next-line no-control-regex
const SGR = /\u001B\[([\d;]*)m/g;

// wrap-ansi resets the foreground at every wrap point but keeps the background
// (and other stateful attributes) open until the end of the string. A newline
// emitted while an attribute is active makes the terminal paint it to the right
// edge of the line, and any marker/indentation added afterward inherits it.
// balanceLines makes every line self-contained: it closes whatever is still open
// before each newline and reopens it at the start of the next line's content.
const balanceLines = (text) => {
  if (typeof text !== 'string' || !text.includes('\n') || !text.includes(ESC)) {
    return text;
  }

  const state = createSgrState();

  return text
    .split('\n')
    .map((line) => {
      const prefix = state.openCodes(); // attributes carried from the previous line

      SGR.lastIndex = 0;
      let match;
      while ((match = SGR.exec(line)) !== null) {
        state.apply(match[1]);
      }

      const suffix = state.hasOpen() ? RESET : '';
      return `${prefix}${line}${suffix}`;
    })
    .join('\n');
};

export default balanceLines;
