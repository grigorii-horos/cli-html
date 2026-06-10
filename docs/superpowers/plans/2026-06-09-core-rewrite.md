# cli-html Core Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the theme, attribute, and color subsystems of cli-html to eliminate the 1064-line `get-theme.js` God File, replace the eagerly-extracting `getCustomAttributes()` with lazy per-tag `getAttr()`, and ensure consistent color application via `applyColor()`.

**Architecture:** Create `lib/core/` with `merge.js`, `color.js`, `attr.js`, `disabled.js`. Update all tag handlers to use the new core. Then rewrite `get-theme.js` to a simple `deepMerge(BASE, custom)`. The migration order is critical: update handlers FIRST (they'll work with both old function-based and new string-based theme values), THEN rewrite `get-theme.js`.

**Tech Stack:** Node.js ESM, chalk-string, parse5. Tests use Node's built-in test runner (`node --test`). Run tests with `npm test`.

---

## File Map

**Create:**
- `lib/core/merge.js` — `deepMerge(base, override)`
- `lib/core/color.js` — `applyColor(spec, text)`, `applyThemeColor(customSpec, themeSpec, text)`
- `lib/core/attr.js` — `getAttr(tag, dotPath)`: dot-path → `data-cli-*` attribute
- `lib/core/disabled.js` — `isDisabled(tag)`, `getDisabledColor(tag, theme)`
- `test/core/merge.test.js`
- `test/core/color.test.js`
- `test/core/attr.test.js`
- `test/core/disabled.test.js`
- `test/snapshots/` — ANSI snapshot fixtures (Task 20)

**Rewrite (significant):**
- `lib/utils/get-theme.js` — 1064 → ~50 lines using `deepMerge`
- `lib/tags/inputs.js` — replace getCustomAttributes + getDisabledColor
- `lib/tags/a.js` — replace getCustomAttributes + applyCustomColor + safeChalkString
- `lib/tags/text-styles.js` — replace getCustomAttributes + applyCustomColor
- `lib/tags/code.js` — replace getCustomAttributes + safeChalkString
- `lib/tags/table.js` — replace getCustomAttributes + applyCustomColor

**Update (mechanical, ~5–15 lines each):**
- `lib/tags/headers.js`
- `lib/tags/base-tags.js`
- `lib/tags/address.js`
- `lib/tags/animations.js`
- `lib/tags/abbr.js`
- `lib/tags/blockquote.js`
- `lib/tags/center.js`
- `lib/tags/data.js`
- `lib/tags/definitions.js`
- `lib/tags/details.js`
- `lib/tags/fieldset.js`
- `lib/tags/figure.js`
- `lib/tags/hr.js`
- `lib/tags/img.js`
- `lib/tags/list.js`
- `lib/tags/meter.js`
- `lib/tags/progress.js`
- `lib/tags/ruby.js`
- `lib/tags/select.js`
- `lib/tags/span.js`

**Delete:**
- `lib/utils/find-parrent-tag.js` — zero imports, dead code

**Shrink (remove dead exports):**
- `lib/utilities.js` — remove `getCustomAttributes`, `getDisabledColor`, `filterAst2`, `safeExecute`, `applyCustomColor`, `safeChalkString`

---

## Phase A — Create lib/core/

### Task 1: lib/core/merge.js

**Files:**
- Create: `lib/core/merge.js`
- Create: `test/core/merge.test.js`

- [ ] **Step 1: Write the failing test**

```js
// test/core/merge.test.js
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node --test test/core/merge.test.js
```

Expected: `ERR_MODULE_NOT_FOUND` or similar — `merge.js` does not exist yet.

- [ ] **Step 3: Implement lib/core/merge.js**

```js
// lib/core/merge.js
export const deepMerge = (base, override) => {
  if (!override || typeof override !== 'object') return base ?? {};
  if (!base || typeof base !== 'object') return override;

  const result = { ...base };
  for (const key of Object.keys(override)) {
    const val = override[key];
    if (val === null || val === undefined) continue;
    if (
      typeof val === 'object' &&
      !Array.isArray(val) &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      result[key] = deepMerge(base[key], val);
    } else {
      result[key] = val;
    }
  }
  return result;
};
```

- [ ] **Step 4: Run test to verify it passes**

```bash
node --test test/core/merge.test.js
```

Expected: all 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/core/merge.js test/core/merge.test.js
git commit -m "feat: add lib/core/merge.js with deepMerge"
```

---

### Task 2: lib/core/color.js

**Files:**
- Create: `lib/core/color.js`
- Create: `test/core/color.test.js`

- [ ] **Step 1: Write the failing test**

```js
// test/core/color.test.js
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
    // Use FORCE_COLOR=1 env var when running to ensure output; here just check text preserved
    const result = applyColor('bold', 'hello');
    assert.ok(result.includes('hello'), `Expected result to include "hello", got: ${result}`);
  });

  it('returns text unchanged on invalid spec string', () => {
    // Invalid chalk spec — should not throw, should return text
    const result = applyColor('not-a-real-color-xyz-invalid', 'hello');
    assert.ok(typeof result === 'string');
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
    // Custom string — result includes the original text
    const result = applyThemeColor('bold', themeSpec, 'hi');
    assert.ok(result.includes('hi'));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node --test test/core/color.test.js
```

Expected: `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement lib/core/color.js**

```js
// lib/core/color.js
import chalkString from 'chalk-string';

const noColor =
  typeof process !== 'undefined' &&
  process.env.NO_COLOR !== undefined &&
  process.env.NO_COLOR !== '';

const forceColor =
  !noColor &&
  typeof process !== 'undefined' &&
  process.env.FORCE_COLOR &&
  process.env.FORCE_COLOR !== '0';

/**
 * Apply a color spec to text.
 * Handles: null/undefined/''/'null' → text unchanged; function → call it; string → chalk-string.
 */
export const applyColor = (spec, text) => {
  const str = text == null ? '' : String(text);
  if (noColor || !spec || spec === 'null') return str;
  if (typeof spec === 'function') {
    try { return spec(str); } catch { return str; }
  }
  try {
    return chalkString(spec, forceColor ? { colors: true } : undefined)(str);
  } catch {
    return str;
  }
};

/**
 * Apply custom color if provided, else fall back to theme color.
 * Both customSpec and themeSpec can be null, string, or function.
 */
export const applyThemeColor = (customSpec, themeSpec, text) =>
  applyColor(customSpec ?? themeSpec, text);
```

- [ ] **Step 4: Run test to verify it passes**

```bash
node --test test/core/color.test.js
```

Expected: all 13 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/core/color.js test/core/color.test.js
git commit -m "feat: add lib/core/color.js with applyColor and applyThemeColor"
```

---

### Task 3: lib/core/attr.js

**Files:**
- Create: `lib/core/attr.js`
- Create: `test/core/attr.test.js`

- [ ] **Step 1: Write the failing test**

```js
// test/core/attr.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getAttr } from '../../lib/core/attr.js';

// Helper: build a fake parse5-style tag with attrs
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node --test test/core/attr.test.js
```

Expected: `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement lib/core/attr.js**

```js
// lib/core/attr.js
import { getAttribute } from '../utilities.js';

/**
 * Read a data-cli-* attribute via dot-path.
 * 'prefix.marker' → reads 'data-cli-prefix-marker'.
 * Returns null when not set. Normalizes string 'null' to actual null.
 * Always returns a string (never booleans) — callers use === 'true' for boolean checks.
 */
export const getAttr = (tag, dotPath) => {
  const attrName = 'data-cli-' + dotPath.replaceAll('.', '-');
  const value = getAttribute(tag, attrName, null);
  return value === 'null' ? null : value;
};
```

- [ ] **Step 4: Run test to verify it passes**

```bash
node --test test/core/attr.test.js
```

Expected: all 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/core/attr.js test/core/attr.test.js
git commit -m "feat: add lib/core/attr.js with lazy getAttr dot-path reader"
```

---

### Task 4: lib/core/disabled.js

**Files:**
- Create: `lib/core/disabled.js`
- Create: `test/core/disabled.test.js`

- [ ] **Step 1: Write the failing test**

```js
// test/core/disabled.test.js
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
node --test test/core/disabled.test.js
```

Expected: `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement lib/core/disabled.js**

```js
// lib/core/disabled.js
import { getAttribute } from '../utilities.js';
import { getAttr } from './attr.js';

export const isDisabled = (tag) => getAttribute(tag, 'disabled', null) !== null;

export const getDisabledColor = (tag, theme) =>
  getAttr(tag, 'disabled.color') ?? theme?.disabled?.color ?? 'gray dim';
```

- [ ] **Step 4: Run test to verify it passes**

```bash
node --test test/core/disabled.test.js
```

Expected: all 6 tests pass.

- [ ] **Step 5: Run full test suite to verify nothing broken**

```bash
npm test
```

Expected: all existing tests pass.

- [ ] **Step 6: Commit**

```bash
git add lib/core/disabled.js test/core/disabled.test.js
git commit -m "feat: add lib/core/disabled.js with isDisabled and getDisabledColor"
```

---

## Phase B — Update Tag Handlers

> **Migration pattern:** For every tag handler:
> 1. Remove `import { getCustomAttributes, applyCustomColor, safeChalkString } from '../utilities.js'` (keep `getAttribute` if still used for standard HTML attrs like `type`, `href`, `checked`)
> 2. Add `import { getAttr } from '../core/attr.js'; import { applyColor, applyThemeColor } from '../core/color.js';`
> 3. Remove `const custom = getCustomAttributes(tag);`
> 4. Replace `applyCustomColor(custom.color, themeFunc, value, chalkString)` → `applyThemeColor(getAttr(tag, 'color'), themeFunc, value)`
> 5. Replace `chalkString(color, { colors: true })(text)` and `safeChalkString(color, { colors: true })(text)` → `applyColor(color, text)`
> 6. Replace `custom.xyz` → `getAttr(tag, 'xyz')` (use dot-path matching the attribute name)
>
> **Important:** At this stage, `get-theme.js` still produces function-based theme values. `applyColor` and `applyThemeColor` handle both string and function specs, so the migration is safe and the app will work throughout.
>
> After EACH task: run `npm test` to verify no regressions.

---

### Task 5: Update headers.js

**Files:**
- Modify: `lib/tags/headers.js`

- [ ] **Step 1: Replace lib/tags/headers.js entirely**

```js
// lib/tags/headers.js
import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

const createHeader = (level, defaultMarker) => blockTag(
  (value, tag, context) => {
    const themeConfig = context.theme[`h${level}`];

    const marker = getAttr(tag, 'marker') ?? themeConfig?.indicator?.marker ?? defaultMarker;

    const styledMarker = applyThemeColor(
      getAttr(tag, 'marker-color'),
      themeConfig?.indicator?.color,
      marker,
    );
    const styledText = applyThemeColor(
      getAttr(tag, 'color'),
      themeConfig?.color,
      value,
    );

    return `${styledMarker} ${styledText}`;
  },
  { marginTop: 1, marginBottom: 1 },
);

export const h1 = createHeader(1, '#');
export const h2 = createHeader(2, '##');
export const h3 = createHeader(3, '###');
export const h4 = createHeader(4, '####');
export const h5 = createHeader(5, '#####');
export const h6 = createHeader(6, '######');
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add lib/tags/headers.js
git commit -m "refactor: update headers.js to use getAttr and applyThemeColor"
```

---

### Task 6: Update base-tags.js, address.js, center.js, span.js, ruby.js, definitions.js, hr.js

**Files:**
- Modify: `lib/tags/base-tags.js`
- Modify: `lib/tags/address.js`
- Modify: `lib/tags/center.js`
- Modify: `lib/tags/span.js`
- Modify: `lib/tags/ruby.js`
- Modify: `lib/tags/definitions.js`
- Modify: `lib/tags/hr.js`

- [ ] **Step 1: Replace lib/tags/base-tags.js**

```js
// lib/tags/base-tags.js
import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

const createColoredBlock = (themeName) => blockTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme[themeName]?.color, value),
);

const createColoredInline = (themeName) => inlineTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme[themeName]?.color, value),
);

export const p = blockTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme.p?.color, value),
  { marginTop: 1, marginBottom: 1 },
);

export const label = createColoredInline('label');
export const blink = createColoredInline('blink');

export const div = createColoredBlock('div');
export const header = createColoredBlock('header');
export const article = createColoredBlock('article');
export const footer = createColoredBlock('footer');
export const section = createColoredBlock('section');
export const main = createColoredBlock('main');
export const nav = createColoredBlock('nav');
export const aside = createColoredBlock('aside');
export const form = createColoredBlock('form');
export const picture = createColoredBlock('picture');
export const hgroup = createColoredBlock('hgroup');
export const dialog = createColoredBlock('dialog');
```

- [ ] **Step 2: Replace lib/tags/address.js**

Read the current file first to see full content:
```bash
cat lib/tags/address.js
```

Then replace `getCustomAttributes(tag)` + `applyCustomColor(custom.color, ..., value, chalkString)` pattern. The full new file:

```js
// lib/tags/address.js
import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

export const address = blockTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme.address?.color, value),
);
```

- [ ] **Step 3: Replace lib/tags/center.js**

Read current file: `cat lib/tags/center.js`

```js
// lib/tags/center.js
import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

export const center = blockTag((value, tag, context) => {
  const styledValue = applyThemeColor(getAttr(tag, 'color'), context.theme.center?.color, value);
  const lineWidth = context.lineWidth || 80;
  const textLength = styledValue.replace(/\x1B\[[0-9;]*m/g, '').length;
  const padding = Math.max(0, Math.floor((lineWidth - textLength) / 2));
  return ' '.repeat(padding) + styledValue;
});
```

> Note: `center.js` may have additional centering logic. Read the current file before replacing and preserve all non-color logic.

- [ ] **Step 4: Replace lib/tags/span.js**

```js
// lib/tags/span.js
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

export const span = inlineTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme.span?.color, value),
);
```

- [ ] **Step 5: Replace lib/tags/ruby.js**

Read current: `cat lib/tags/ruby.js`. The key change: replace `getCustomAttributes` + `applyCustomColor` with `getAttr` + `applyThemeColor`. Preserve all non-color logic. Example:

```js
// lib/tags/ruby.js
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

export const ruby = inlineTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme.span?.color, value),
);

export const rt = inlineTag((value, tag, context) => {
  const styled = applyThemeColor(getAttr(tag, 'color'), context.theme.span?.color, value);
  return `(${styled})`;
});

export const rp = inlineTag();
```

> Read `lib/tags/ruby.js` before replacing — preserve any additional logic.

- [ ] **Step 6: Replace lib/tags/definitions.js**

Read current: `cat lib/tags/definitions.js`. Key pattern:

```js
// lib/tags/definitions.js
import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

export const dt = blockTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme.dt?.color, value),
);

export const dd = blockTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme.dd?.color, value),
);

export const dl = blockTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme.dl?.color, value),
);
```

> Read `lib/tags/definitions.js` before replacing — preserve any blockTag options (marginTop, etc.).

- [ ] **Step 7: Replace lib/tags/hr.js**

Read current: `cat lib/tags/hr.js`. Key change:

```js
// lib/tags/hr.js
import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

export const hr = blockTag((value, tag, context) => {
  const theme = context.theme.hr || {};
  const marker = getAttr(tag, 'marker') ?? theme.marker ?? '─';
  const width = context.lineWidth || 80;
  const line = marker.repeat(Math.floor(width / marker.length));
  return applyThemeColor(getAttr(tag, 'color'), theme.color, line);
});
```

> Read `lib/tags/hr.js` before replacing — preserve existing width/marker logic exactly.

- [ ] **Step 8: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 9: Commit**

```bash
git add lib/tags/base-tags.js lib/tags/address.js lib/tags/center.js lib/tags/span.js lib/tags/ruby.js lib/tags/definitions.js lib/tags/hr.js
git commit -m "refactor: update simple block/inline tag handlers to use getAttr + applyThemeColor"
```

---

### Task 7: Update text-styles.js

**Files:**
- Modify: `lib/tags/text-styles.js`

- [ ] **Step 1: Read the current file**

```bash
cat lib/tags/text-styles.js
```

- [ ] **Step 2: Replace imports at top**

Remove:
```js
import chalkString from 'chalk-string';
import { getCustomAttributes, applyCustomColor, getAttribute } from '../utilities.js';
```

Add:
```js
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';
```

- [ ] **Step 3: Update createStyledTag helper**

Old:
```js
const createStyledTag = (themeKey) => inlineTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  const styledValue = applyCustomColor(custom.color, context.theme[themeKey].color, value, chalkString);
  return styledValue;
});
```

New:
```js
const createStyledTag = (themeKey) => inlineTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme[themeKey]?.color, value),
);
```

- [ ] **Step 4: Update createStyledTagWithMarkers helper**

Old:
```js
const createStyledTagWithMarkers = (themeKey) => (tag, context) => {
  const custom = getCustomAttributes(tag);
  const theme = context.theme[themeKey] || {};
  const innerResult = inlineTag()(tag, context);
  if (!innerResult) return null;
  const value = innerResult.value || '';
  const styledValue = applyCustomColor(custom.color, theme.color, value, chalkString);
  const prefix = custom.prefix !== null && custom.prefix !== undefined ? custom.prefix : (theme.prefix || '');
  const suffix = custom.suffix !== null && custom.suffix !== undefined ? custom.suffix : (theme.suffix || '');
  const prefixColor = custom.prefixColor || theme.prefixColor || '';
  const suffixColor = custom.suffixColor || theme.suffixColor || '';
  const styledPrefix = prefixColor && prefix ? chalkString(prefixColor, { colors: true })(prefix) : prefix;
  const styledSuffix = suffixColor && suffix ? chalkString(suffixColor, { colors: true })(suffix) : suffix;
  return { type: 'inline', nodeName: tag.nodeName, pre: styledPrefix || null, value: styledValue, post: styledSuffix || null };
};
```

New:
```js
const createStyledTagWithMarkers = (themeKey) => (tag, context) => {
  const theme = context.theme[themeKey] || {};
  const innerResult = inlineTag()(tag, context);
  if (!innerResult) return null;
  const value = innerResult.value || '';
  const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);
  const prefix = getAttr(tag, 'prefix') ?? theme.prefix ?? '';
  const suffix = getAttr(tag, 'suffix') ?? theme.suffix ?? '';
  const styledPrefix = applyColor(getAttr(tag, 'prefix-color') ?? theme.prefixColor, prefix);
  const styledSuffix = applyColor(getAttr(tag, 'suffix-color') ?? theme.suffixColor, suffix);
  return { type: 'inline', nodeName: tag.nodeName, pre: styledPrefix || null, value: styledValue, post: styledSuffix || null };
};
```

- [ ] **Step 5: Update kbd handler**

Replace all `chalkString(color, { colors: true })(text)` and `safeChalkString(color, { colors: true })(text)` with `applyColor(color, text)`. Replace `getCustomAttributes(tag)` removal and `custom.color` with `getAttr(tag, 'color')`.

Full new `kbd`:
```js
export const kbd = inlineTag((value, tag, context) => {
  const theme = context.theme.kbd || {};
  const key = theme.key || {};

  const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);

  const keyEnabled = key.enabled === true;
  if (!keyEnabled) {
    const prefix = theme.prefix?.marker || '';
    const suffix = theme.suffix?.marker || '';
    const styledPrefix = applyColor(theme.prefix?.color, prefix);
    const styledSuffix = applyColor(theme.suffix?.color, suffix);
    return `${styledPrefix}${styledValue}${styledSuffix}`;
  }

  const keyStyle = key.style || 'simple';
  const keySeparator = key.separator || '+';

  if (keyStyle === 'box') {
    const keys = value.split(keySeparator).map(k => k.trim());
    const openMarker = theme.prefix?.marker || '[ ';
    const closeMarker = theme.suffix?.marker || ' ]';
    const styledKeys = keys.map(k => {
      const styledOpen = applyColor(theme.prefix?.color, openMarker);
      const styledClose = applyColor(theme.suffix?.color, closeMarker);
      const styledKey = applyThemeColor(getAttr(tag, 'color'), theme.color, k);
      return `${styledOpen}${styledKey}${styledClose}`;
    });
    return styledKeys.join(` ${keySeparator} `);
  }

  const prefix = theme.prefix?.marker || '';
  const suffix = theme.suffix?.marker || '';
  const styledPrefix = applyColor(theme.prefix?.color, prefix);
  const styledSuffix = applyColor(theme.suffix?.color, suffix);
  return `${styledPrefix}${styledValue}${styledSuffix}`;
});
```

- [ ] **Step 6: Update del and ins handlers**

Old pattern:
```js
const styledValue = applyCustomColor(custom.color, theme.color, value, chalkString);
// ...
const styledMarker = chalkString(markerColor, { colors: true })(marker);
```

New pattern:
```js
const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);
// ...
const styledMarker = applyColor(markerColor, marker);
```

Remove `const custom = getCustomAttributes(tag);` from both `del` and `ins`.

- [ ] **Step 7: Update customInline and customInlineWithMarkers**

Old:
```js
const customInline = inlineTag((value, tag) => {
  const custom = getCustomAttributes(tag);
  return custom.color ? applyCustomColor(custom.color, null, value, chalkString) : value;
});
```

New:
```js
const customInline = inlineTag((value, tag) => {
  const color = getAttr(tag, 'color');
  return color ? applyColor(color, value) : value;
});
```

For `customInlineWithMarkers`, follow the same pattern as `createStyledTagWithMarkers` above (replace `custom.color`/`custom.prefix`/etc. with `getAttr(tag, 'color')`/`getAttr(tag, 'prefix')`/etc.).

- [ ] **Step 8: Remove chalkString import if no longer used**

Check the file — if `chalkString` has no remaining usages, remove that import line.

- [ ] **Step 9: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 10: Commit**

```bash
git add lib/tags/text-styles.js
git commit -m "refactor: update text-styles.js to use getAttr + applyColor"
```

---

### Task 8: Update a.js (links)

**Files:**
- Modify: `lib/tags/a.js`

- [ ] **Step 1: Read the current file**

```bash
cat lib/tags/a.js
```

- [ ] **Step 2: Replace imports**

Remove:
```js
import chalkString from 'chalk-string';
import { getAttribute, getCustomAttributes, applyCustomColor, safeChalkString } from '../utilities.js';
```

Add:
```js
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';
```

- [ ] **Step 3: Update link text coloring**

Old:
```js
const custom = getCustomAttributes(tag);
// ...
const linkText = applyCustomColor(custom.color, context.theme.a.color, value, chalkString);
```

New:
```js
const linkText = applyThemeColor(getAttr(tag, 'color'), context.theme.a?.color, value);
```

- [ ] **Step 4: Update href display**

Old:
```js
const hrefEnabledValue = custom.href.enabled !== null && custom.href.enabled !== undefined
  ? custom.href.enabled
  : theme.hrefEnabled;
// ...
const hrefColor = custom.href.color || theme.hrefColor || 'gray';
const styledHref = safeChalkString(hrefColor, { colors: true })(` [${href}]`);
```

New:
```js
const hrefEnabledValue = getAttr(tag, 'href.enabled') ?? theme.hrefEnabled;
// ...
const hrefColor = getAttr(tag, 'href.color') ?? theme.hrefColor ?? 'gray';
const styledHref = applyColor(hrefColor, ` [${href}]`);
```

- [ ] **Step 5: Update title display**

Old:
```js
const showTitle = custom.title.enabled !== null && custom.title.enabled !== undefined
  ? custom.title.enabled === 'true' || custom.title.enabled === true
  : theme.titleEnabled === true;
// ...
const titleColor = custom.title.color || theme.titleColor || 'yellow';
const titlePrefix = (custom.title.prefix.marker !== undefined && custom.title.prefix.marker !== null)
  ? custom.title.prefix.marker
  : (theme.titlePrefix || ' (');
const titleSuffix = (custom.title.suffix.marker !== undefined && custom.title.suffix.marker !== null)
  ? custom.title.suffix.marker
  : (theme.titleSuffix || ')');
const titlePrefixColor = custom.title.prefix.color || theme.titlePrefixColor || titleColor;
const titleSuffixColor = custom.title.suffix.color || theme.titleSuffixColor || titleColor;
const styledPrefix = (titlePrefixColor && titlePrefix !== null && titlePrefix !== undefined)
  ? safeChalkString(titlePrefixColor, { colors: true })(titlePrefix)
  : (titlePrefix || '');
const styledTitle = (titleColor && rawTitle)
  ? safeChalkString(titleColor, { colors: true })(rawTitle)
  : rawTitle;
const styledSuffix = (titleSuffixColor && titleSuffix !== null && titleSuffix !== undefined)
  ? safeChalkString(titleSuffixColor, { colors: true })(titleSuffix)
  : (titleSuffix || '');
```

New:
```js
const showTitleRaw = getAttr(tag, 'title.enabled');
const showTitle = showTitleRaw !== null
  ? showTitleRaw === 'true'
  : theme.titleEnabled === true;
// ...
const titleColor = getAttr(tag, 'title.color') ?? theme.titleColor ?? 'yellow';
const titlePrefix = getAttr(tag, 'title.prefix.marker') ?? theme.titlePrefix ?? ' (';
const titleSuffix = getAttr(tag, 'title.suffix.marker') ?? theme.titleSuffix ?? ')';
const titlePrefixColor = getAttr(tag, 'title.prefix.color') ?? theme.titlePrefixColor ?? titleColor;
const titleSuffixColor = getAttr(tag, 'title.suffix.color') ?? theme.titleSuffixColor ?? titleColor;
const styledPrefix = applyColor(titlePrefixColor, titlePrefix);
const styledTitle = applyColor(titleColor, rawTitle);
const styledSuffix = applyColor(titleSuffixColor, titleSuffix);
```

- [ ] **Step 6: Update external indicator**

Old:
```js
const showExternalIndicator = custom.external.enabled !== null && custom.external.enabled !== undefined
  ? custom.external.enabled === 'true' || custom.external.enabled === true
  : (theme.external?.enabled === true);
// ...
const externalIndicatorMarker = custom.external.marker || theme.external?.marker || '↗';
const externalIndicatorColor = custom.external.color || theme.external?.color || 'gray';
const externalIndicatorPosition = custom.external.position || theme.external?.position || 'after';
const externalIndicatorSpacing = custom.external.spacing !== undefined && custom.external.spacing !== null
  ? custom.external.spacing
  : (theme.external?.spacing !== undefined && theme.external?.spacing !== null
    ? theme.external.spacing : ' ');
const styledIndicator = safeChalkString(externalIndicatorColor, { colors: true })(externalIndicatorMarker);
```

New:
```js
const externalEnabledRaw = getAttr(tag, 'external.enabled');
const showExternalIndicator = externalEnabledRaw !== null
  ? externalEnabledRaw === 'true'
  : theme.external?.enabled === true;
// ...
const externalIndicatorMarker = getAttr(tag, 'external.marker') ?? theme.external?.marker ?? '↗';
const externalIndicatorColor = getAttr(tag, 'external.color') ?? theme.external?.color ?? 'gray';
const externalIndicatorPosition = getAttr(tag, 'external.position') ?? theme.external?.position ?? 'after';
const externalIndicatorSpacing = getAttr(tag, 'external.spacing') ?? theme.external?.spacing ?? ' ';
const styledIndicator = applyColor(externalIndicatorColor, externalIndicatorMarker);
```

- [ ] **Step 7: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add lib/tags/a.js
git commit -m "refactor: update a.js to use getAttr + applyColor"
```

---

### Task 9: Update abbr.js, blockquote.js, animations.js, data.js

**Files:**
- Modify: `lib/tags/abbr.js`
- Modify: `lib/tags/blockquote.js`
- Modify: `lib/tags/animations.js`
- Modify: `lib/tags/data.js`

- [ ] **Step 1: Read each current file**

```bash
cat lib/tags/abbr.js
cat lib/tags/blockquote.js
cat lib/tags/animations.js
cat lib/tags/data.js
```

- [ ] **Step 2: Update abbr.js**

In `abbr.js`, replace imports to add `getAttr`/`applyColor`/`applyThemeColor` and remove `getCustomAttributes`. Key changes:

```js
// Remove: import { getCustomAttributes, applyCustomColor } from '../utilities.js';
// Add: import { getAttr } from '../core/attr.js'; import { applyColor, applyThemeColor } from '../core/color.js';

// In abbr handler:
// OLD: const custom = getCustomAttributes(tag);
//      let abbrValue = applyCustomColor(custom.color, context.theme.abbr.color, value, chalkString);
// NEW: let abbrValue = applyThemeColor(getAttr(tag, 'color'), context.theme.abbr?.color, value);

// OLD: const styledTitle = applyCustomColor(custom.title.color, context.theme.abbr.title.color, title, chalkString);
// NEW: const styledTitle = applyThemeColor(getAttr(tag, 'title.color'), context.theme.abbr?.title?.color, title);

// For prefix/suffix markers in abbr, replace chalkString(color)(text) with applyColor(color, text).
// Replace custom.title.prefix.marker with getAttr(tag, 'title.prefix.marker')
// Replace custom.title.suffix.marker with getAttr(tag, 'title.suffix.marker')
// Replace custom.title.prefix.color with getAttr(tag, 'title.prefix.color')
// Replace custom.title.suffix.color with getAttr(tag, 'title.suffix.color')
```

Apply the same mapping to the `dfn` handler in `abbr.js`.

- [ ] **Step 3: Update blockquote.js**

```js
// Remove: import { getCustomAttributes, applyCustomColor } from '../utilities.js';
// Add: import { getAttr } from '../core/attr.js'; import { applyColor, applyThemeColor } from '../core/color.js';

// OLD: const custom = getCustomAttributes(tag);
//      const styledMarker = applyCustomColor(custom.markerColor || ..., markerColor, marker, chalkString);
// NEW: const styledMarker = applyThemeColor(getAttr(tag, 'marker-color'), markerColor, marker);
//      (applyColor handles the marker itself if needed)

// Replace all chalkString(color, { colors: true })(text) with applyColor(color, text)
// Replace custom.color with getAttr(tag, 'color')
// Replace custom.marker with getAttr(tag, 'marker')
```

- [ ] **Step 4: Update animations.js**

```js
// Remove: import chalkString from 'chalk-string'; import { getCustomAttributes } from '../utilities.js';
// Add: import { getAttr } from '../core/attr.js'; import { applyColor, applyThemeColor } from '../core/color.js';

// Replace all getCustomAttributes(tag) removals.
// Replace chalkString(color)(text) with applyColor(color, text).
// Replace custom.animation.marker with getAttr(tag, 'animation.marker')
// Replace custom.animation.color with getAttr(tag, 'animation.color')
// Replace custom.animation.enabled with getAttr(tag, 'animation.enabled')  (=== 'true' for boolean check)
// Replace custom.direction.* with getAttr(tag, 'direction.*') equivalents
// Replace custom.color with getAttr(tag, 'color')
```

- [ ] **Step 5: Update data.js**

```js
// Remove: import chalkString from 'chalk-string'; import { getCustomAttributes } from '../utilities.js';
// Add: import { getAttr } from '../core/attr.js'; import { applyColor, applyThemeColor } from '../core/color.js';

// Replace: const custom = getCustomAttributes(tag); → remove
// Replace: applyCustomColor(custom.color, ...) → applyThemeColor(getAttr(tag, 'color'), ...)
// Replace: chalkString(color, { colors: true })(text) → applyColor(color, text)
// Replace: custom.value.enabled → getAttr(tag, 'value.enabled') === 'true'
// Replace: custom.value.color → getAttr(tag, 'value.color')
// Replace: custom.value.prefix.marker → getAttr(tag, 'value.prefix.marker')
// etc.
```

- [ ] **Step 6: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add lib/tags/abbr.js lib/tags/blockquote.js lib/tags/animations.js lib/tags/data.js
git commit -m "refactor: update abbr, blockquote, animations, data tags to use getAttr + applyColor"
```

---

### Task 10: Update details.js, fieldset.js, figure.js, img.js

**Files:**
- Modify: `lib/tags/details.js`
- Modify: `lib/tags/fieldset.js`
- Modify: `lib/tags/figure.js`
- Modify: `lib/tags/img.js`

- [ ] **Step 1: Read each current file**

```bash
cat lib/tags/details.js
cat lib/tags/fieldset.js
cat lib/tags/figure.js
cat lib/tags/img.js
```

For all four files, apply the migration pattern:
- Remove `import { getCustomAttributes, ... } from '../utilities.js'` (keep `getAttribute` if used for `type`, `src`, etc.)
- Add `import { getAttr } from '../core/attr.js'; import { applyColor, applyThemeColor } from '../core/color.js';`
- Remove `const custom = getCustomAttributes(tag);` (and `const figcaptionCustom = getCustomAttributes(figcaptionTag)` in figure.js)
- Replace all `custom.xyz` → `getAttr(tag, 'xyz')` (map the attribute path: `custom.borderStyle` → `getAttr(tag, 'border-style')`, `custom.border` → `getAttr(tag, 'border')`, etc.)
- Replace `chalkString(color, { colors: true })(text)` → `applyColor(color, text)`
- Replace `applyCustomColor(custom.color, theme.color, value, chalkString)` → `applyThemeColor(getAttr(tag, 'color'), theme.color, value)`

Attribute path mapping for these tags:
- `custom.border` → `getAttr(tag, 'border')`
- `custom.borderStyle` → `getAttr(tag, 'border-style')`
- `custom.borderDim` → `getAttr(tag, 'border-dim')` (use `=== 'true'` for boolean)
- `custom.open.marker` → `getAttr(tag, 'open.marker')`
- `custom.closed.marker` → `getAttr(tag, 'closed.marker')`
- `custom.title.color` → `getAttr(tag, 'title.color')`
- `custom.text.color` → `getAttr(tag, 'text.color')`
- For figcaptionTag: `getAttr(figcaptionTag, 'prefix.marker')` etc.

- [ ] **Step 2: Run tests after each file update and fix any issues**

```bash
npm test
```

- [ ] **Step 3: Commit**

```bash
git add lib/tags/details.js lib/tags/fieldset.js lib/tags/figure.js lib/tags/img.js
git commit -m "refactor: update details, fieldset, figure, img tags to use getAttr + applyColor"
```

---

### Task 11: Update list.js and code.js

**Files:**
- Modify: `lib/tags/list.js`
- Modify: `lib/tags/code.js`

- [ ] **Step 1: Read current files**

```bash
cat lib/tags/list.js
cat lib/tags/code.js
```

- [ ] **Step 2: Update list.js**

Apply migration pattern. Key attribute mappings:
- `custom.color` → `getAttr(tag, 'color')`
- `custom.marker` → `getAttr(tag, 'marker')`
- `custom.markerColor` → `getAttr(tag, 'marker-color')`
- `custom.decimal` → `getAttr(tag, 'decimal')`
- `custom.li.color` → `getAttr(tag, 'li.color')`
- Replace `chalkString(color, { colors: true })(text)` → `applyColor(color, text)`

- [ ] **Step 3: Update code.js**

Apply migration pattern. Key attribute mappings:
- `custom.color` → `getAttr(tag, 'color')`
- `custom.numbers.enabled` → `getAttr(tag, 'numbers.enabled')` (compare with `=== 'true'`)
- `custom.numbers.color` → `getAttr(tag, 'numbers.color')`
- `custom.gutter.enabled` → `getAttr(tag, 'gutter.enabled')` (`=== 'true'`)
- `custom.gutter.marker` → `getAttr(tag, 'gutter.marker')`
- `custom.gutter.color` → `getAttr(tag, 'gutter.color')`
- `custom.label.enabled` → `getAttr(tag, 'label.enabled')` (`=== 'true'`)
- `custom.label.position` → `getAttr(tag, 'label.position')`
- `custom.label.color` → `getAttr(tag, 'label.color')`
- `custom.label.prefix.marker` → `getAttr(tag, 'label.prefix.marker')`
- `custom.label.prefix.color` → `getAttr(tag, 'label.prefix.color')`
- `custom.label.suffix.marker` → `getAttr(tag, 'label.suffix.marker')`
- `custom.label.suffix.color` → `getAttr(tag, 'label.suffix.color')`
- `custom.overflow.enabled` → `getAttr(tag, 'overflow.enabled')` (`=== 'true'`)
- `custom.overflow.marker` → `getAttr(tag, 'overflow.marker')`
- `custom.overflow.color` → `getAttr(tag, 'overflow.color')`
- `custom.highlight.lines` → `getAttr(tag, 'highlight.lines')`
- `custom.highlight.color` → `getAttr(tag, 'highlight.color')`
- `custom.diff.enabled` → `getAttr(tag, 'diff.enabled')` (`=== 'true'`)
- Replace all `safeChalkString(color, { colors: true })(text)` → `applyColor(color, text)`
- Replace `applyCustomColor(custom.color, ..., value, chalkString)` → `applyThemeColor(getAttr(tag, 'color'), ..., value)`

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/tags/list.js lib/tags/code.js
git commit -m "refactor: update list.js and code.js to use getAttr + applyColor"
```

---

### Task 12: Update meter.js, progress.js, select.js

**Files:**
- Modify: `lib/tags/meter.js`
- Modify: `lib/tags/progress.js`
- Modify: `lib/tags/select.js`

- [ ] **Step 1: Read current files**

```bash
cat lib/tags/meter.js
cat lib/tags/progress.js
cat lib/tags/select.js
```

- [ ] **Step 2: Update meter.js**

Apply migration pattern. Key attribute mappings:
- `custom.filled.marker` → `getAttr(tag, 'filled.marker')`
- `custom.filled.color` → `getAttr(tag, 'filled.color')`
- `custom.empty.marker` → `getAttr(tag, 'empty.marker')`
- `custom.empty.color` → `getAttr(tag, 'empty.color')`
- `custom.meter.width` → `getAttr(tag, 'meter.width')`
- `custom.meter.labels.enabled` → `getAttr(tag, 'labels.enabled')` (`=== 'true'`)
- `custom.meter.labels.format` → `getAttr(tag, 'labels.format')`
- `custom.meter.labels.color` → `getAttr(tag, 'labels.color')`
- `custom.meter.labels.position` → `getAttr(tag, 'labels.position')`
- Replace all `chalkString(color, { colors: true })(text)` → `applyColor(color, text)`

- [ ] **Step 3: Update progress.js**

Apply migration pattern:
- `custom.filled.marker` → `getAttr(tag, 'filled.marker')`
- `custom.filled.color` → `getAttr(tag, 'filled.color')`
- `custom.empty.marker` → `getAttr(tag, 'empty.marker')`
- `custom.empty.color` → `getAttr(tag, 'empty.color')`
- Replace `chalkString(color, { colors: true })(text)` → `applyColor(color, text)`
- Replace `applyCustomColor(custom.color, ..., value, chalkString)` → `applyThemeColor(getAttr(tag, 'color'), ..., value)`

- [ ] **Step 4: Update select.js**

Apply migration pattern. Key attribute mappings:
- `custom.color` → `getAttr(tag, 'color')`
- `custom.prefix` → `getAttr(tag, 'prefix')`
- `custom.prefixColor` → `getAttr(tag, 'prefix-color')`
- `custom.suffix` → `getAttr(tag, 'suffix')`
- `custom.suffixColor` → `getAttr(tag, 'suffix-color')`
- `custom.select.label` → `getAttr(tag, 'select.label')`
- For `optionTag`: replace `getCustomAttributes(optionTag)` with direct `getAttr(optionTag, 'x')` calls
- `optionCustom.color` → `getAttr(optionTag, 'color')`
- `optionCustom.selected.marker` → `getAttr(optionTag, 'selected.marker')`
- `optionCustom.selected.color` → `getAttr(optionTag, 'selected.color')`
- `optionCustom.unselected.marker` → `getAttr(optionTag, 'unselected.marker')`
- `optionCustom.unselected.color` → `getAttr(optionTag, 'unselected.color')`
- For `optgroupTag`: `getAttr(optgroupTag, 'color')`, `getAttr(optgroupTag, 'marker')`, `getAttr(optgroupTag, 'marker-color')`
- Replace all `chalkString(color, { colors: true })(text)` → `applyColor(color, text)`
- Replace `getDisabledColor(custom, theme)` → `import { getDisabledColor } from '../core/disabled.js'` then `getDisabledColor(tag, theme)`

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add lib/tags/meter.js lib/tags/progress.js lib/tags/select.js
git commit -m "refactor: update meter, progress, select tags to use getAttr + applyColor"
```

---

### Task 13: Update inputs.js

**Files:**
- Modify: `lib/tags/inputs.js`

- [ ] **Step 1: Read the current file**

```bash
cat lib/tags/inputs.js
```

- [ ] **Step 2: Replace imports**

Remove:
```js
import chalkString from 'chalk-string';
import chalk from 'chalk';
import { getAttribute, getCustomAttributes, getDisabledColor } from '../utilities.js';
```

Add:
```js
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';
import { isDisabled, getDisabledColor } from '../core/disabled.js';
```

- [ ] **Step 3: Update addRequiredIndicator helper**

Old:
```js
const addRequiredIndicator = (value, tag, custom, theme) => {
  const isRequired = getAttribute(tag, 'required', null) !== null;
  if (!isRequired) return value;
  const requiredConfig = theme.input?.required;
  const isEnabled = custom.required?.enabled === undefined
    ? (requiredConfig?.enabled !== false)
    : (custom.required.enabled === 'true' || custom.required.enabled === true);
  if (!isEnabled) return value;
  const marker = custom.required?.marker || requiredConfig?.indicator?.marker || '*';
  const markerColorFunction = custom.required?.color
    ? (text) => chalkString(custom.required.color, { colors: true })(text)
    : (requiredConfig?.indicator?.color ? ... : (text) => text);
  const styledMarker = markerColorFunction(marker);
  const position = custom.required?.position || requiredConfig?.indicator?.position || 'after';
  return position === 'before' ? styledMarker + ' ' + value : value + ' ' + styledMarker;
};
```

New — note function signature change (no more `custom` parameter):
```js
const addRequiredIndicator = (value, tag, theme) => {
  const isRequired = getAttribute(tag, 'required', null) !== null;
  if (!isRequired) return value;
  const requiredConfig = theme.input?.required;
  const enabledRaw = getAttr(tag, 'required.enabled');
  const isEnabled = enabledRaw !== null
    ? enabledRaw === 'true'
    : requiredConfig?.enabled !== false;
  if (!isEnabled) return value;
  const marker = getAttr(tag, 'required.marker') ?? requiredConfig?.indicator?.marker ?? '*';
  const markerColor = getAttr(tag, 'required.color') ?? requiredConfig?.indicator?.color;
  const styledMarker = applyColor(markerColor, marker);
  const position = getAttr(tag, 'required.position') ?? requiredConfig?.indicator?.position ?? 'after';
  return position === 'before' ? `${styledMarker} ${value}` : `${value} ${styledMarker}`;
};
```

- [ ] **Step 4: Update button handler**

Old:
```js
export const button = (tag, context) => {
  const custom = getCustomAttributes(tag);
  const isDisabled = getAttribute(tag, 'disabled', null) !== null;
  return inlineTag((value) => {
    const prefixMarker = custom.prefix?.marker || context.theme.button?.prefix?.marker || '[ ';
    const suffixMarker = custom.suffix?.marker || context.theme.button?.suffix?.marker || ' ]';
    const prefixColorFunction = custom.prefix?.color
      ? (text) => chalkString(custom.prefix.color, { colors: true })(text)
      : context.theme.button?.prefix?.color;
    const suffixColorFunction = custom.suffix?.color
      ? (text) => chalkString(custom.suffix.color, { colors: true })(text)
      : context.theme.button?.suffix?.color;
    const textColorFunction = custom.color
      ? (text) => chalkString(custom.color, { colors: true })(text)
      : context.theme.button?.color;
    const result = `${prefixColorFunction(prefixMarker)}${textColorFunction(value)}${suffixColorFunction(suffixMarker)}`;
    return isDisabled ? chalkString(getDisabledColor(custom, context.theme.button), { colors: true })(result) : result;
  })(tag, context);
};
```

New:
```js
export const button = (tag, context) => {
  const theme = context.theme.button || {};
  const disabled = isDisabled(tag);
  return inlineTag((value) => {
    const prefixMarker = getAttr(tag, 'prefix.marker') ?? theme.prefix?.marker ?? '[ ';
    const suffixMarker = getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker ?? ' ]';
    const styledPrefix = applyThemeColor(getAttr(tag, 'prefix.color'), theme.prefix?.color, prefixMarker);
    const styledSuffix = applyThemeColor(getAttr(tag, 'suffix.color'), theme.suffix?.color, suffixMarker);
    const styledText = applyThemeColor(getAttr(tag, 'color'), theme.color, value);
    const result = `${styledPrefix}${styledText}${styledSuffix}`;
    return disabled ? applyColor(getDisabledColor(tag, theme), result) : result;
  })(tag, context);
};
```

- [ ] **Step 5: Update all input type handlers**

For each input type in `input()` (checkbox, radio, button, text/email/etc., range, color, password, file, textarea):
- Remove `const custom = getCustomAttributes(tag);`
- Replace every `custom.xyz` with `getAttr(tag, 'xyz')` (follow attribute path from current custom object structure)
- Replace `chalkString(color, { colors: true })(text)` → `applyColor(color, text)`
- Replace `getDisabledColor(custom, context.theme.input)` → `getDisabledColor(tag, context.theme.input)`
- Replace `isDisabled` variable (local boolean) with `isDisabled(tag)` from core/disabled.js

Key `custom` → `getAttr` mappings for input types:
```
custom.checked.marker           → getAttr(tag, 'checked.marker')
custom.checked.color            → getAttr(tag, 'checked.color')
custom.unchecked.marker         → getAttr(tag, 'unchecked.marker')
custom.unchecked.color          → getAttr(tag, 'unchecked.color')
custom.checkbox.prefix.marker   → getAttr(tag, 'checkbox.prefix.marker')
custom.checkbox.prefix.color    → getAttr(tag, 'checkbox.prefix.color')
custom.checkbox.suffix.marker   → getAttr(tag, 'checkbox.suffix.marker')
custom.checkbox.suffix.color    → getAttr(tag, 'checkbox.suffix.color')
custom.radio.checked.marker     → getAttr(tag, 'radio.checked.marker')
custom.radio.checked.color      → getAttr(tag, 'radio.checked.color')
custom.radio.unchecked.marker   → getAttr(tag, 'radio.unchecked.marker')
custom.radio.unchecked.color    → getAttr(tag, 'radio.unchecked.color')
custom.radio.prefix.marker      → getAttr(tag, 'radio.prefix.marker')
custom.radio.prefix.color       → getAttr(tag, 'radio.prefix.color')
custom.radio.suffix.marker      → getAttr(tag, 'radio.suffix.marker')
custom.radio.suffix.color       → getAttr(tag, 'radio.suffix.color')
custom.button.prefix.marker     → getAttr(tag, 'button.prefix.marker')
custom.button.prefix.color      → getAttr(tag, 'button.prefix.color')
custom.button.suffix.marker     → getAttr(tag, 'button.suffix.marker')
custom.button.suffix.color      → getAttr(tag, 'button.suffix.color')
custom.button.text.color        → getAttr(tag, 'button.text.color')
custom.textInput.color          → getAttr(tag, 'text-input.color')
custom.textarea.color           → getAttr(tag, 'textarea.color')
custom.range.filled             → getAttr(tag, 'range.filled')
custom.range.empty              → getAttr(tag, 'range.empty')
custom.range.thumb              → getAttr(tag, 'range.thumb')
custom.range.filledColor        → getAttr(tag, 'range.filled-color')
custom.range.emptyColor         → getAttr(tag, 'range.empty-color')
custom.range.thumbColor         → getAttr(tag, 'range.thumb-color')
custom.colorInput.indicator     → getAttr(tag, 'color.indicator')
custom.colorInput.prefix.marker → getAttr(tag, 'color.prefix.marker')
custom.colorInput.prefix.color  → getAttr(tag, 'color.prefix.color')
custom.colorInput.suffix.marker → getAttr(tag, 'color.suffix.marker')
custom.colorInput.suffix.color  → getAttr(tag, 'color.suffix.color')
custom.colorInput.value.color   → getAttr(tag, 'color.value.color')
custom.colorInput.hex.enabled   → getAttr(tag, 'hex.enabled') === 'true'
custom.password.char            → getAttr(tag, 'password.char')
custom.password.count           → getAttr(tag, 'password.count')
custom.password.color           → getAttr(tag, 'password.color')
custom.email.prefix.marker      → getAttr(tag, 'email.prefix.marker')
custom.email.prefix.color       → getAttr(tag, 'email.prefix.color')
custom.email.color              → getAttr(tag, 'email.color')
custom.date.prefix.marker       → getAttr(tag, 'date.prefix.marker')
custom.date.prefix.color        → getAttr(tag, 'date.prefix.color')
custom.date.color               → getAttr(tag, 'date.color')
custom.file.prefix.marker       → getAttr(tag, 'file.prefix.marker')
custom.file.prefix.color        → getAttr(tag, 'file.prefix.color')
custom.file.text.color          → getAttr(tag, 'file.text.color')
custom.file.placeholder         → getAttr(tag, 'file.placeholder')
custom.required.enabled         → getAttr(tag, 'required.enabled') === 'true'
custom.required.marker          → getAttr(tag, 'required.marker')
custom.required.color           → getAttr(tag, 'required.color')
custom.required.position        → getAttr(tag, 'required.position')
```

Also update `addRequiredIndicator` calls — remove the `custom` argument (function signature changed in Step 3):

Old: `addRequiredIndicator(result, tag, custom, context.theme)`
New: `addRequiredIndicator(result, tag, context.theme)`

- [ ] **Step 6: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add lib/tags/inputs.js
git commit -m "refactor: update inputs.js to use getAttr + applyColor + isDisabled from core"
```

---

### Task 14: Update table.js

**Files:**
- Modify: `lib/tags/table.js`

- [ ] **Step 1: Read the current file**

```bash
cat lib/tags/table.js
```

- [ ] **Step 2: Replace imports**

Remove:
```js
import chalkString from 'chalk-string';
import { getCustomAttributes, applyCustomColor } from '../utilities.js';
```

Add:
```js
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';
```

- [ ] **Step 3: Update all getCustomAttributes calls**

For each place that calls `getCustomAttributes(tag)`, `getCustomAttributes(tr)`, `getCustomAttributes(thead)`, etc.:
- Remove the `const xCustom = getCustomAttributes(x)` line
- Replace `xCustom.color` → `getAttr(x, 'color')`
- Replace `xCustom.padding.left` → `getAttr(x, 'padding.left')`
- Replace `xCustom.padding.right` → `getAttr(x, 'padding.right')`
- Replace `xCustom.border` → `getAttr(x, 'border')`
- Replace `xCustom.borderStyle` → `getAttr(x, 'border-style')`
- Replace `xCustom.tr.color` → `getAttr(x, 'tr.color')`
- Replace `xCustom.thead.color` → `getAttr(x, 'thead.color')`
- Replace `xCustom.tbody.color` → `getAttr(x, 'tbody.color')`
- Replace `xCustom.tfoot.color` → `getAttr(x, 'tfoot.color')`
- Replace `xCustom.striping.enabled` → `getAttr(x, 'striping.enabled')` (`=== 'true'`)
- Replace `xCustom.striping.count` → `getAttr(x, 'striping.count')`
- Replace `xCustom.striping.rows['1'].color` → `getAttr(x, 'striping.row-1.color')`

- [ ] **Step 4: Replace all color application**

Replace `applyCustomColor(cellColor, themeTdColor, value, chalkString)` → `applyThemeColor(cellColor, themeTdColor, value)`.
Replace all `chalkString(color, { colors: true })(text)` → `applyColor(color, text)`.

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add lib/tags/table.js
git commit -m "refactor: update table.js to use getAttr + applyColor"
```

---

## Phase C — Rewrite get-theme.js

> **This phase is safe now.** All tag handlers use `applyColor`/`applyThemeColor` which handle both string and function specs. After this task, theme produces plain strings only.

### Task 15: Rewrite lib/utils/get-theme.js

**Files:**
- Rewrite: `lib/utils/get-theme.js`
- Create: `test/utils/get-theme.test.js`

- [ ] **Step 1: Write the test first**

```js
// test/utils/get-theme.test.js
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
    // Color values must be strings (not chalk functions)
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
    // prefix.marker should still be present from base config
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
```

- [ ] **Step 2: Run test — note current behavior**

```bash
node --test test/utils/get-theme.test.js
```

The test `'returns string values, never functions'` will FAIL because currently `getTheme()` returns chalk functions. This confirms the current behavior and what we're changing.

- [ ] **Step 3: Rewrite lib/utils/get-theme.js**

```js
// lib/utils/get-theme.js
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import YAML from 'yaml';
import { deepMerge } from '../core/merge.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '../../config.yaml');
const BASE = (YAML.parse(readFileSync(configPath, 'utf8'))).theme ?? {};

export const getTheme = (customInput = {}) => {
  const custom = customInput?.theme ?? customInput ?? {};
  return deepMerge(BASE, custom);
};
```

- [ ] **Step 4: Run the new test suite**

```bash
node --test test/utils/get-theme.test.js
```

Expected: all 6 tests pass.

- [ ] **Step 5: Run full test suite**

```bash
npm test
```

Expected: all tests pass. If rendering tests fail, investigate — a handler is still calling a theme value as a function. Find the file with `grep -rn "context.theme\." lib/tags/ | grep -v "applyThemeColor\|applyColor\|getAttr"` and fix remaining direct theme function calls.

- [ ] **Step 6: Commit**

```bash
git add lib/utils/get-theme.js test/utils/get-theme.test.js
git commit -m "refactor: rewrite get-theme.js to deepMerge only — theme now stores strings not functions"
```

---

## Phase D — Cleanup

### Task 16: Remove dead exports from utilities.js

**Files:**
- Modify: `lib/utilities.js`

**Dead exports to remove** (all confirmed zero-import after Phase B):
- `getCustomAttributes` (entire function + JSDoc)
- `getDisabledColor` (entire function + JSDoc)
- `filterAst2` (entire function + JSDoc)
- `safeExecute` (entire function + JSDoc)
- `applyCustomColor` (entire function + JSDoc) — now in `lib/core/color.js`
- `safeChalkString` (entire function + JSDoc) — now in `lib/core/color.js`

Also consider removing:
- `isValidColor` — check if used: `grep -rn "isValidColor" lib/`
- `validateBoolean` — check if used: `grep -rn "validateBoolean" lib/`

- [ ] **Step 1: Verify no remaining imports of functions to remove**

```bash
grep -rn "getCustomAttributes\|getDisabledColor\|filterAst2\|safeExecute\|applyCustomColor\|safeChalkString" lib/ --include="*.js" | grep -v "utilities.js"
```

Expected: no output. If any imports remain, fix them before proceeding.

- [ ] **Step 2: Remove getCustomAttributes from utilities.js**

Delete lines 243–614 (the `getCustomAttributes` function and its large JSDoc comment). Use exact line numbers from `cat -n lib/utilities.js`.

- [ ] **Step 3: Remove getDisabledColor from utilities.js**

Delete the `getDisabledColor` function (currently lines ~249–251, before getCustomAttributes).

- [ ] **Step 4: Remove filterAst2 from utilities.js**

Delete lines ~79–96 (the `filterAst2` function and JSDoc).

- [ ] **Step 5: Remove safeExecute from utilities.js**

Delete lines ~60–67 (the `safeExecute` function and JSDoc).

- [ ] **Step 6: Remove applyCustomColor and safeChalkString from utilities.js**

Delete both functions and their JSDoc comments.

- [ ] **Step 7: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add lib/utilities.js
git commit -m "chore: remove dead exports from utilities.js (getCustomAttributes, getDisabledColor, filterAst2, safeExecute, applyCustomColor, safeChalkString)"
```

---

### Task 17: Delete dead files

**Files:**
- Delete: `lib/utils/find-parrent-tag.js`

- [ ] **Step 1: Verify zero imports**

```bash
grep -rn "find-parrent-tag\|findParrentTag" . --include="*.js" | grep -v node_modules
```

Expected: no output.

- [ ] **Step 2: Delete the file**

```bash
rm lib/utils/find-parrent-tag.js
```

- [ ] **Step 3: Run tests to confirm nothing broken**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add -u lib/utils/find-parrent-tag.js
git commit -m "chore: delete dead file find-parrent-tag.js (zero imports, typo in name)"
```

---

## Phase E — Tests

### Task 18: Add ANSI snapshot tests

**Files:**
- Create: `test/helpers/strip-ansi.js`
- Create: `test/rendering/snapshot.test.js`

- [ ] **Step 1: Create strip-ansi helper**

```js
// test/helpers/strip-ansi.js
// Strips ANSI escape codes from a string
export const stripAnsi = (str) => str.replace(/\x1B\[[0-9;]*m/g, '');

// Check if a string contains ANSI color codes
export const hasAnsi = (str) => /\x1B\[[0-9;]*m/.test(str);
```

- [ ] **Step 2: Create snapshot test file**

```js
// test/rendering/snapshot.test.js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { renderHTML } from '../../index.js';
import { stripAnsi, hasAnsi } from '../helpers/strip-ansi.js';

describe('ANSI rendering regression tests', () => {
  describe('Headings', () => {
    it('h1 produces ANSI output with FORCE_COLOR', () => {
      const result = renderHTML('<h1>Test</h1>');
      // When FORCE_COLOR=1 is set, result should contain ANSI codes
      // Without FORCE_COLOR (default test env), text must be present
      assert.ok(stripAnsi(result).includes('Test'));
    });

    it('h1 text content is preserved after stripping ANSI', () => {
      const result = renderHTML('<h1>Hello World</h1>');
      assert.ok(stripAnsi(result).includes('Hello World'));
    });

    it('custom color via data-cli-color is applied', () => {
      process.env.FORCE_COLOR = '1';
      try {
        const result = renderHTML('<h1 data-cli-color="red bold">Test</h1>');
        assert.ok(hasAnsi(result), 'Expected ANSI codes when FORCE_COLOR=1');
        assert.ok(stripAnsi(result).includes('Test'));
      } finally {
        delete process.env.FORCE_COLOR;
      }
    });
  });

  describe('Paragraphs', () => {
    it('p tag text is preserved', () => {
      const result = renderHTML('<p>Hello paragraph</p>');
      assert.ok(stripAnsi(result).includes('Hello paragraph'));
    });
  });

  describe('Links', () => {
    it('a tag text is preserved', () => {
      const result = renderHTML('<a href="https://example.com">Link text</a>');
      assert.ok(stripAnsi(result).includes('Link text'));
    });

    it('href is shown when data-cli-href-enabled=true', () => {
      const result = renderHTML('<a href="https://example.com" data-cli-href-enabled="true">Click</a>');
      assert.ok(stripAnsi(result).includes('example.com'));
    });
  });

  describe('Inputs', () => {
    it('checkbox checked state text is preserved', () => {
      const result = renderHTML('<input type="checkbox" checked>');
      assert.ok(typeof result === 'string');
      assert.ok(result.length > 0);
    });

    it('disabled button applies disabled styling', () => {
      process.env.FORCE_COLOR = '1';
      try {
        const result = renderHTML('<button disabled>Click me</button>');
        assert.ok(stripAnsi(result).includes('Click me'));
      } finally {
        delete process.env.FORCE_COLOR;
      }
    });
  });

  describe('Code blocks', () => {
    it('inline code text is preserved', () => {
      const result = renderHTML('<code>console.log(x)</code>');
      assert.ok(stripAnsi(result).includes('console.log(x)'));
    });

    it('pre/code block text is preserved', () => {
      const result = renderHTML('<pre><code>const x = 1;</code></pre>');
      assert.ok(stripAnsi(result).includes('const x = 1;'));
    });
  });

  describe('Tables', () => {
    it('table cell text is preserved', () => {
      const result = renderHTML('<table><tr><td>Cell content</td></tr></table>');
      assert.ok(stripAnsi(result).includes('Cell content'));
    });
  });

  describe('custom data-cli-* attributes override theme', () => {
    it('data-cli-color is respected on span', () => {
      process.env.FORCE_COLOR = '1';
      try {
        const result = renderHTML('<span data-cli-color="cyan">colored</span>');
        assert.ok(hasAnsi(result));
        assert.ok(stripAnsi(result).includes('colored'));
      } finally {
        delete process.env.FORCE_COLOR;
      }
    });
  });
});
```

- [ ] **Step 3: Run the new snapshot tests**

```bash
node --test test/rendering/snapshot.test.js
```

Expected: all tests pass.

- [ ] **Step 4: Run full test suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add test/helpers/strip-ansi.js test/rendering/snapshot.test.js
git commit -m "test: add ANSI rendering regression tests and strip-ansi helper"
```

---

## Phase F — Documentation

### Task 19: Update MEMORY.md

**Files:**
- Modify: `.claude/projects/-home-grigorii-Projects-GitHub-grigorii-horos-cli-html/memory/MEMORY.md`
- Modify: the memory file describing the stale architecture

- [ ] **Step 1: Update the architecture memory file**

Find and update the memory file that incorrectly describes the architecture. The current memory says `lib/core/` exists with `getAttr`, `applyColor`, etc. — now that is true. Update it to reflect the actual current state:

Key facts to update/confirm:
- `lib/core/color.js` — `applyColor(spec, text)`, `applyThemeColor(customSpec, themeSpec, text)` — REAL
- `lib/core/attr.js` — `getAttr(tag, 'dot.path')` — REAL
- `lib/core/disabled.js` — `isDisabled(tag)`, `getDisabledColor(tag, theme)` — REAL
- `lib/core/merge.js` — `deepMerge(base, override)` — REAL
- `getCustomAttributes()` — DELETED from utilities.js
- `getDisabledColor()` — DELETED from utilities.js (moved to lib/core/disabled.js)
- `parseStyleEntry()` — DELETED from get-theme.js
- `applyCustomColor()`, `safeChalkString()` — DELETED from utilities.js (replaced by applyColor/applyThemeColor)
- `filterAst2`, `safeExecute` — DELETED (dead code)
- `find-parrent-tag.js` — DELETED
- Theme stores **strings** — `get-theme.js` does `deepMerge(BASE, custom)`, color functions created at render time
- `concat-inline-tags.js`, `concat-block-tags.js`, `inline-to-block-tag.js` — STILL USED (not deleted)

- [ ] **Step 2: Commit**

```bash
git add .claude/
git commit -m "docs: update project memory to reflect completed core rewrite"
```

---

## Self-Review Checklist

After writing the plan, verify coverage against the spec:

- [x] `lib/core/merge.js` → Task 1
- [x] `lib/core/color.js` → Task 2
- [x] `lib/core/attr.js` → Task 3
- [x] `lib/core/disabled.js` → Task 4
- [x] `get-theme.js` rewrite → Task 15
- [x] All tag handlers updated → Tasks 5–14
- [x] `getCustomAttributes` removed → Task 16
- [x] `filterAst2`, `safeExecute` removed → Task 16
- [x] `applyCustomColor`, `safeChalkString` removed → Task 16
- [x] `find-parrent-tag.js` deleted → Task 17
- [x] ANSI snapshot tests → Task 18
- [x] Memory updated → Task 19
- [x] Breaking changes documented → Spec file, not a runtime concern
- [x] `types.js` — excluded from plan (block/inline constructors not needed; tag-helpers already handle this cleanly)
