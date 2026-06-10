import { describe, it } from 'node:test';
import assert from 'node:assert';
import { deepMerge } from '../../lib/core/merge.js';

describe('deepMerge', () => {
  it('merges flat objects, override wins', () => {
    assert.deepStrictEqual(
      deepMerge({ a: 1, b: 2 }, { b: 3, c: 4 }),
      { a: 1, b: 3, c: 4 },
    );
  });

  it('merges nested objects recursively', () => {
    assert.deepStrictEqual(
      deepMerge({ a: { x: 1, y: 2 } }, { a: { y: 3 } }),
      { a: { x: 1, y: 3 } },
    );
  });

  it('null override preserves base value', () => {
    assert.deepStrictEqual(
      deepMerge({ a: 'red' }, { a: null }),
      { a: 'red' },
    );
  });

  it('undefined override preserves base value', () => {
    assert.deepStrictEqual(
      deepMerge({ a: 'red' }, { a: undefined }),
      { a: 'red' },
    );
  });

  it('array override replaces entirely (not concat)', () => {
    assert.deepStrictEqual(
      deepMerge({ a: [1, 2] }, { a: [3] }),
      { a: [3] },
    );
  });

  it('empty override returns base unchanged', () => {
    assert.deepStrictEqual(deepMerge({ a: 1 }, {}), { a: 1 });
  });

  it('handles null base gracefully', () => {
    assert.deepStrictEqual(deepMerge(null, { a: 1 }), { a: 1 });
  });

  it('handles null override gracefully', () => {
    assert.deepStrictEqual(deepMerge({ a: 1 }, null), { a: 1 });
  });
});
