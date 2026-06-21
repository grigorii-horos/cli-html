import { describe, it } from 'node:test';
import assert from 'node:assert';
import wrapLineWidth from '../../lib/wrap-line-width.js';

describe('wrapLineWidth', () => {
  it('wraps plain text to the given width', () => {
    const out = wrapLineWidth('one two three four five', { lineWidth: 8 });
    assert.ok(out.includes('\n'));
    for (const line of out.split('\n')) {
      assert.ok(line.length <= 8 || !line.includes(' '));
    }
  });

  it('closes a background before each wrap-induced newline (real bleed case)', () => {
    // chalk emits bg+fg together (e.g. `bgYellow black` -> \u001B[43m\u001B[30m).
    // wrap-ansi closes the foreground (39) at each wrap point but leaves the
    // BACKGROUND open across the newline — that is the bleed balanceLines fixes.
    const input = `\u001B[43m\u001B[30m${'word '.repeat(12).trim()}\u001B[39m\u001B[49m`;
    const out = wrapLineWidth(input, { lineWidth: 12 });
    const lines = out.split('\n').filter((line) => line.length > 0);
    assert.ok(lines.length > 1, 'expected the text to wrap');
    // every non-final line closes the still-open background with a full reset
    for (let i = 0; i < lines.length - 1; i += 1) {
      assert.ok(lines[i].endsWith('\u001B[0m'), `line ${i} should end with a reset`);
    }
    // continuation lines reopen the background at column 0
    assert.ok(lines[1].startsWith('\u001B[43m'), 'continuation line reopens bg');
  });

  it('does not convert a selective background-close into a full reset', () => {
    // \u001B[49m closes only the background; turning it into \u001B[0m would also
    // kill the bold (1). Guards against a tempting replaceAll('[49m','[0m') hack.
    const input = '\u001B[1m\u001B[43mAA\u001B[49mBB';
    const out = wrapLineWidth(input, { lineWidth: 80 });
    assert.ok(out.includes('\u001B[49m'), 'selective bg close must survive');
    assert.ok(!out.includes('\u001B[0m'), 'must not introduce a full reset');
  });

  it('does not contain a literal ESC byte and delegates to balanceLines', async () => {
    const { readFile } = await import('node:fs/promises');
    const { fileURLToPath } = await import('node:url');
    const src = await readFile(
      fileURLToPath(new URL('../../lib/wrap-line-width.js', import.meta.url)),
      'utf8',
    );
    assert.ok(!src.includes('\u001B'), 'source must not contain a literal ESC byte');
    assert.ok(src.includes('balance-lines'), 'should delegate to balanceLines');
  });
});
