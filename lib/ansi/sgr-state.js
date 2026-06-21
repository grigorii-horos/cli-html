const ESC = '\u001B';

// A small state machine over "stateful" SGR attributes — the ones that persist
// across characters (and therefore across a newline) and must be reopened on the
// next line. Unknown codes are intentionally ignored so they cannot corrupt the
// balanced output.
export const createSgrState = () => {
  const state = {
    intensity: null, // '1' bold | '2' dim | null
    italic: false,
    underline: false,
    inverse: false,
    strike: false,
    fg: null, // e.g. '31' | '38;5;200' | '38;2;1;2;3'
    bg: null, // e.g. '43' | '48;5;200' | '48;2;1;2;3'
  };

  const clear = () => {
    state.intensity = null;
    state.italic = false;
    state.underline = false;
    state.inverse = false;
    state.strike = false;
    state.fg = null;
    state.bg = null;
  };

  const apply = (parameters) => {
    const codes = parameters === '' ? ['0'] : parameters.split(';');
    for (let index = 0; index < codes.length; index += 1) {
      const number = Number.parseInt(codes[index], 10);

      // Mixed equality + range conditions (e.g. 30-37) can't map to switch cases.
      // eslint-disable-next-line unicorn/prefer-switch
      if (number === 0) {
        clear();
      } else if (number === 1 || number === 2) {
        state.intensity = String(number);
      } else if (number === 22) {
        state.intensity = null;
      } else if (number === 3) {
        state.italic = true;
      } else if (number === 23) {
        state.italic = false;
      } else if (number === 4) {
        state.underline = true;
      } else if (number === 24) {
        state.underline = false;
      } else if (number === 7) {
        state.inverse = true;
      } else if (number === 27) {
        state.inverse = false;
      } else if (number === 9) {
        state.strike = true;
      } else if (number === 29) {
        state.strike = false;
      } else if (number === 39) {
        state.fg = null;
      } else if (number === 49) {
        state.bg = null;
      } else if ((number >= 30 && number <= 37) || (number >= 90 && number <= 97)) {
        state.fg = String(number);
      } else if ((number >= 40 && number <= 47) || (number >= 100 && number <= 107)) {
        state.bg = String(number);
      } else if (number === 38 || number === 48) {
        const target = number === 38 ? 'fg' : 'bg';
        // Guard against truncated sequences (e.g. `48;5` with no index): only
        // accept a complete sub-parameter run, otherwise leave the state alone.
        if (codes[index + 1] === '5' && codes[index + 2] !== undefined) {
          state[target] = `${number};5;${codes[index + 2]}`;
          index += 2;
        } else if (codes[index + 1] === '2' && codes[index + 4] !== undefined) {
          state[target] = `${number};2;${codes[index + 2]};${codes[index + 3]};${codes[index + 4]}`;
          index += 4;
        }
      }
      // unknown codes: ignored on purpose
    }
  };

  const hasOpen = () =>
    Boolean(
      state.intensity ||
        state.italic ||
        state.underline ||
        state.inverse ||
        state.strike ||
        state.fg ||
        state.bg,
    );

  const openCodes = () => {
    const parts = [];
    if (state.intensity) parts.push(state.intensity);
    if (state.italic) parts.push('3');
    if (state.underline) parts.push('4');
    if (state.inverse) parts.push('7');
    if (state.strike) parts.push('9');
    if (state.fg) parts.push(state.fg);
    if (state.bg) parts.push(state.bg);
    return parts.length === 0 ? '' : `${ESC}[${parts.join(';')}m`;
  };

  return { apply, openCodes, hasOpen };
};
