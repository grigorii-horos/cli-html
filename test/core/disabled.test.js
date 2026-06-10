import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isDisabled, getDisabledColor } from '../../lib/core/disabled.js';

const makeTag = (attrs) => ({
  attrs: Object.entries(attrs).map(([name, value]) => ({ name, value })),
  nodeName: 'input',
});

describe('isDisabled', () => {
  it('returns true when disabled attribute is present', () => {
    const tag = makeTag({ disabled: '' });
    assert.strictEqual(isDisabled(tag), true);
  });

  it('returns true when disabled attribute has value', () => {
    const tag = makeTag({ disabled: 'disabled' });
    assert.strictEqual(isDisabled(tag), true);
  });

  it('returns false when disabled attribute is absent', () => {
    const tag = makeTag({});
    assert.strictEqual(isDisabled(tag), false);
  });
});

describe('getDisabledColor', () => {
  it('returns custom data-cli-disabled-color when set', () => {
    const tag = makeTag({ 'data-cli-disabled-color': 'blue dim' });
    assert.strictEqual(getDisabledColor(tag, {}), 'blue dim');
  });

  it('falls back to theme.disabled.color', () => {
    const tag = makeTag({});
    assert.strictEqual(getDisabledColor(tag, { disabled: { color: 'gray dim' } }), 'gray dim');
  });

  it('falls back to "gray dim" when nothing set', () => {
    const tag = makeTag({});
    assert.strictEqual(getDisabledColor(tag, {}), 'gray dim');
  });
});
