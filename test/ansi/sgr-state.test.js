import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createSgrState } from '../../lib/ansi/sgr-state.js';

describe('createSgrState', () => {
  it('starts with nothing open', () => {
    const s = createSgrState();
    assert.strictEqual(s.hasOpen(), false);
    assert.strictEqual(s.openCodes(), '');
  });

  it('tracks a basic background', () => {
    const s = createSgrState();
    s.apply('43');
    assert.strictEqual(s.hasOpen(), true);
    assert.strictEqual(s.openCodes(), '\u001B[43m');
  });

  it('tracks a 256-color background (48;5;n)', () => {
    const s = createSgrState();
    s.apply('48;5;200');
    assert.strictEqual(s.openCodes(), '\u001B[48;5;200m');
  });

  it('tracks a truecolor background (48;2;r;g;b)', () => {
    const s = createSgrState();
    s.apply('48;2;10;20;30');
    assert.strictEqual(s.openCodes(), '\u001B[48;2;10;20;30m');
  });

  it('combines multiple attributes in one openCodes call', () => {
    const s = createSgrState();
    s.apply('1;4;48;5;200');
    assert.strictEqual(s.openCodes(), '\u001B[1;4;48;5;200m');
  });

  it('clears everything on reset (0)', () => {
    const s = createSgrState();
    s.apply('1;43');
    s.apply('0');
    assert.strictEqual(s.hasOpen(), false);
    assert.strictEqual(s.openCodes(), '');
  });

  it('treats empty params as a reset', () => {
    const s = createSgrState();
    s.apply('43');
    s.apply('');
    assert.strictEqual(s.hasOpen(), false);
  });

  it('honors selective closers (49 closes bg, keeps bold)', () => {
    const s = createSgrState();
    s.apply('1;43');
    s.apply('49');
    assert.strictEqual(s.openCodes(), '\u001B[1m');
  });

  it('foreground 39 closes fg only', () => {
    const s = createSgrState();
    s.apply('31;43');
    s.apply('39');
    assert.strictEqual(s.openCodes(), '\u001B[43m');
  });

  it('ignores unknown codes without corrupting state', () => {
    const s = createSgrState();
    s.apply('43');
    s.apply('53'); // overline — not tracked
    assert.strictEqual(s.openCodes(), '\u001B[43m');
  });
  it("tracks a 256-color foreground (38;5;n) without misreading neighbours", () => {
    const st = createSgrState();
    st.apply("38;5;200;48;5;17");
    assert.strictEqual(st.openCodes(), "\u001B[38;5;200;48;5;17m");
  });

  it("ignores a truncated extended-color sequence (48;5 with no index)", () => {
    const st = createSgrState();
    st.apply("48;5");
    assert.strictEqual(st.hasOpen(), false);
    assert.strictEqual(st.openCodes(), "");
  });
});

