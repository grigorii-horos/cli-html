import { describe, it } from 'node:test';
import assert from 'node:assert';
import balanceLines from '../../lib/ansi/balance-lines.js';

describe('balanceLines', () => {
  it('returns plain text unchanged (no ESC)', () => {
    assert.strictEqual(balanceLines('a\nb'), 'a\nb');
  });

  it('returns single-line ANSI unchanged (no newline)', () => {
    const input = '\u001B[43myellow\u001B[0m';
    assert.strictEqual(balanceLines(input), input);
  });

  it('closes a background before a newline and reopens after', () => {
    // bg opened on line 1, never closed, content continues on line 2
    const input = '\u001B[43mline one\nline two';
    const output = balanceLines(input);
    // line one gets a reset before the newline
    assert.ok(output.split('\n')[0].endsWith('\u001B[0m'));
    // line two gets the background reopened at its start
    assert.ok(output.split('\n')[1].startsWith('\u001B[43m'));
  });

  it('does not append a reset when nothing is open at end of line', () => {
    const input = '\u001B[43mone\u001B[0m\ntwo';
    const output = balanceLines(input);
    assert.strictEqual(output, '\u001B[43mone\u001B[0m\ntwo');
  });

  it('reopens a truecolor background across a wrap', () => {
    const input = '\u001B[48;2;10;20;30mone\ntwo';
    const output = balanceLines(input);
    assert.ok(output.split('\n')[1].startsWith('\u001B[48;2;10;20;30m'));
  });

  it('handles an empty line between content lines', () => {
    const input = '\u001B[43mone\n\ntwo';
    const lines = balanceLines(input).split('\n');
    assert.ok(lines[0].endsWith('\u001B[0m'));
    assert.ok(lines[1].startsWith('\u001B[43m')); // reopened
    assert.ok(lines[1].endsWith('\u001B[0m'));     // still open -> closed again
    assert.ok(lines[2].startsWith('\u001B[43m'));
  });

  it('carries bold across a wrap (decoration bleed)', () => {
    const input = '\u001B[1mbold one\ntwo';
    const output = balanceLines(input);
    assert.ok(output.split('\n')[1].startsWith('\u001B[1m'));
  });
});
