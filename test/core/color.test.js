import { describe, it } from 'node:test';
import assert from 'node:assert';
import { applyColor, applyThemeColor } from '../../lib/core/color.js';

describe('applyColor', () => {
  it('returns text unchanged when spec is null', () => {
    assert.strictEqual(applyColor(null, 'hello'), 'hello');
  });

  it('returns text unchanged when spec is undefined', () => {
    assert.strictEqual(applyColor(undefined, 'hello'), 'hello');
  });

  it('returns text unchanged when spec is empty string', () => {
    assert.strictEqual(applyColor('', 'hello'), 'hello');
  });

  it('returns text unchanged when spec is the string "null"', () => {
    assert.strictEqual(applyColor('null', 'hello'), 'hello');
  });

  it('returns empty string when text is null', () => {
    assert.strictEqual(applyColor('red', null), '');
  });

  it('returns empty string when text is undefined', () => {
    assert.strictEqual(applyColor('red', undefined), '');
  });

  it('calls function spec with string text', () => {
    const fn = (t) => `[${t}]`;
    assert.strictEqual(applyColor(fn, 'hello'), '[hello]');
  });

  it('applies string spec and result includes original text', () => {
    const result = applyColor('bold', 'hello');
    assert.ok(result.includes('hello'), `Expected result to include "hello", got: ${result}`);
  });

  it('returns text unchanged on invalid spec string', () => {
    const result = applyColor('not-a-real-color-xyz-invalid', 'hello');
    assert.ok(result.includes('hello'));
  });
});

describe('applyThemeColor', () => {
  it('uses theme spec when custom is null', () => {
    const themeSpec = (t) => `theme:${t}`;
    assert.strictEqual(applyThemeColor(null, themeSpec, 'hi'), 'theme:hi');
  });

  it('uses custom spec when provided', () => {
    const themeSpec = (t) => `theme:${t}`;
    const fn = (t) => `custom:${t}`;
    assert.strictEqual(applyThemeColor(fn, themeSpec, 'hi'), 'custom:hi');
  });

  it('returns text unchanged when both specs are null', () => {
    assert.strictEqual(applyThemeColor(null, null, 'hi'), 'hi');
  });

  it('custom string spec overrides theme function', () => {
    const themeSpec = (t) => `theme:${t}`;
    const result = applyThemeColor('bold', themeSpec, 'hi');
    assert.ok(result.includes('hi'));
  });
});
