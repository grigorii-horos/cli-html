import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getTheme } from '../../lib/utils/get-theme.js';

describe('getTheme', () => {
  it('returns an object with default string values for h1.color', () => {
    const theme = getTheme();
    assert.strictEqual(typeof theme.h1?.color, 'string');
    assert.ok(theme.h1.color.length > 0);
  });

  it('returns string values, never functions', () => {
    const theme = getTheme();
    assert.strictEqual(typeof theme.button?.color, 'string');
    assert.strictEqual(typeof theme.h1?.indicator?.color, 'string');
  });

  it('custom top-level color override applies', () => {
    const theme = getTheme({ h1: { color: 'blue bold' } });
    assert.strictEqual(theme.h1.color, 'blue bold');
  });

  it('custom nested override applies without losing other keys', () => {
    const theme = getTheme({ button: { color: 'cyan' } });
    assert.strictEqual(theme.button.color, 'cyan');
    assert.ok(theme.button.prefix?.marker !== undefined);
  });

  it('accepts { theme: {...} } wrapper format', () => {
    const theme = getTheme({ theme: { h1: { color: 'magenta' } } });
    assert.strictEqual(theme.h1.color, 'magenta');
  });

  it('unrelated keys not in override remain from base', () => {
    const theme = getTheme({ h1: { color: 'blue' } });
    assert.ok(theme.h2?.color);
    assert.ok(theme.code?.color !== undefined);
  });
});
