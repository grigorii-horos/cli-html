import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getAttr } from '../../lib/core/attr.js';

const makeTag = (attrs) => ({
  attrs: Object.entries(attrs).map(([name, value]) => ({ name, value })),
  nodeName: 'div',
});

describe('getAttr', () => {
  it('reads a simple attribute', () => {
    const tag = makeTag({ 'data-cli-color': 'red' });
    assert.strictEqual(getAttr(tag, 'color'), 'red');
  });

  it('reads a dot-path attribute (one level)', () => {
    const tag = makeTag({ 'data-cli-prefix-marker': '[ ' });
    assert.strictEqual(getAttr(tag, 'prefix.marker'), '[ ');
  });

  it('reads a dot-path attribute (two levels)', () => {
    const tag = makeTag({ 'data-cli-title-prefix-marker': '(' });
    assert.strictEqual(getAttr(tag, 'title.prefix.marker'), '(');
  });

  it('returns null when attribute is not set', () => {
    const tag = makeTag({});
    assert.strictEqual(getAttr(tag, 'color'), null);
  });

  it('normalizes the string "null" to actual null', () => {
    const tag = makeTag({ 'data-cli-color': 'null' });
    assert.strictEqual(getAttr(tag, 'color'), null);
  });

  it('returns string "true" as-is (not boolean)', () => {
    const tag = makeTag({ 'data-cli-numbers-enabled': 'true' });
    assert.strictEqual(getAttr(tag, 'numbers.enabled'), 'true');
    assert.strictEqual(typeof getAttr(tag, 'numbers.enabled'), 'string');
  });

  it('handles tag with no attrs array', () => {
    const tag = { nodeName: 'div' };
    assert.strictEqual(getAttr(tag, 'color'), null);
  });
});
