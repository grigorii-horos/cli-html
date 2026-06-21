import { describe, it } from 'node:test';
import assert from 'node:assert';
import { renderHTML } from '../../index.js';
import { createSgrState } from '../../lib/ansi/sgr-state.js';

const ESC = '\u001B';
// eslint-disable-next-line no-control-regex
const SGR = /\u001B\[([\d;]*)m/g;
// A background token inside an SGR parameter run: 40-47, 100-107, or 48;5/48;2.
const BG_OPEN = /(?:^|;)(?:4[0-7]|10[0-7]|48;[25];)/;

// A line "bleeds" when a BACKGROUND is still open at the newline: the terminal
// then paints that background across whatever follows (the next line's marker /
// indentation). Walk each non-final line with the same SGR state machine the
// renderer uses and report any line that ends with the background still open.
const bleedingLines = (output) => {
  const lines = output.split('\n');
  const offenders = [];
  for (let i = 0; i < lines.length - 1; i += 1) {
    const line = lines[i];
    if (!line.includes(ESC)) continue;
    const state = createSgrState();
    SGR.lastIndex = 0;
    let match;
    while ((match = SGR.exec(line)) !== null) {
      state.apply(match[1]);
    }
    // openCodes() is '' or `ESC[<params>m`. Pull the param run and check ONLY
    // for an open background — not underline (4) or any foreground.
    const open = state.openCodes();
    const params = open === '' ? '' : open.slice(open.indexOf('[') + 1, -1);
    if (BG_OPEN.test(params)) {
      offenders.push(i);
    }
  }
  return offenders;
};

describe('background bleed regression', () => {
  it('wrapped <mark> does not bleed past the newline', () => {
    const long = 'highlight '.repeat(20).trim();
    const out = renderHTML(`<p><mark>${long}</mark></p>`);
    assert.deepStrictEqual(bleedingLines(out), []);
  });

  it('wrapped backgrounded inline code does not bleed', () => {
    const long = 'codeword '.repeat(20).trim();
    const out = renderHTML(`<p><code>${long}</code></p>`);
    assert.deepStrictEqual(bleedingLines(out), []);
  });

  it('blockquote marker stays outside a wrapped background', () => {
    const long = 'quoted '.repeat(20).trim();
    const out = renderHTML(`<blockquote><mark>${long}</mark></blockquote>`);
    assert.deepStrictEqual(bleedingLines(out), []);
  });

  it('detector actually flags an open background (not vacuous)', () => {
    // A line that opens bg and closes only the foreground before the newline.
    const bleeding = `${ESC}[43m${ESC}[30mAAAA${ESC}[39m\nBBBB`;
    assert.deepStrictEqual(bleedingLines(bleeding), [0]);
    // Underline left open must NOT count as a background bleed.
    const underlineOnly = `${ESC}[4mAAAA\nBBBB`;
    assert.deepStrictEqual(bleedingLines(underlineOnly), []);
  });
});
