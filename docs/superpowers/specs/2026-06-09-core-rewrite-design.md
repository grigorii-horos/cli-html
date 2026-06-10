# cli-html Core Rewrite Design

Date: 2026-06-09
Status: Approved

## Summary

Full rewrite of the theme, attribute, and color subsystems. Goal: maintainability + testability + performance. Breaking changes allowed (v6).

## Problems Being Solved

1. `get-theme.js` — 1064 lines, God File. Manually builds every theme element. Color function conversion pattern repeated ~15 times (`typeof value === 'function' ? value : ...`). Backwards compat fallback chains (`x ?? y ?? z`).

2. `getCustomAttributes()` — 350+ lines, eagerly extracts ALL possible attributes for EVERY tag call, regardless of which tag is rendering.

3. Color type inconsistency — theme sometimes stores strings, sometimes functions. Forces type-checking at every use site.

4. Tests check only `result.includes('text')` — cannot catch ANSI style regressions.

5. `filterAst` vs `filterAst2` — duplicate functions.

6. Typo: `find-parrent-tag.js` should be `find-parent-tag.js`.

7. `utilities.js` mixes unrelated concerns: logger, safeExecute, filterAst, getAttribute, getCustomAttributes, validateNumber.

8. Memory files (`MEMORY.md`) describe `lib/core/` that doesn't exist — stale.

## Architecture

### lib/core/ (new directory)

**`lib/core/color.js`**
```js
export const applyColor = (colorSpec, text) => { ... }
// null / undefined / '' / 'null' → text unchanged
// string → chalkString(colorSpec)(text)  [respects NO_COLOR, FORCE_COLOR]

export const applyThemeColor = (customSpec, themeSpec, text) =>
  applyColor(customSpec ?? themeSpec, text);
```

**`lib/core/attr.js`**
```js
export const getAttr = (tag, dotPath) => { ... }
// 'prefix.marker' → reads data-cli-prefix-marker
// returns null when attribute not set
// 'null' string → normalized to null
// always returns string (caller uses === 'true' for booleans)
```

**`lib/core/disabled.js`**
```js
export const isDisabled = (tag) => getAttribute(tag, 'disabled', null) !== null;
export const getDisabledColor = (tag, theme) =>
  getAttr(tag, 'disabled.color') ?? theme?.disabled?.color;
```

**`lib/core/merge.js`**
```js
export const deepMerge = (base, override) => { ... }
// Recursive merge, override wins on conflicts
// Arrays: override replaces (not appended)
// null override → keeps base value
```

**`lib/core/types.js`**
```js
export const inline = (value, pre = null, post = null) =>
  ({ type: 'inline', value, pre, post });
export const block = (value, marginTop = 1, marginBottom = 1, nodeName) =>
  ({ type: 'block', value, marginTop, marginBottom, nodeName });
```

### get-theme.js refactor

Theme stores **only strings** (color spec values). No color functions in theme object. No `parseStyleEntry`. No `createHeaderTheme`.

```js
// lib/utils/get-theme.js — ~150 lines
export const getTheme = (customInput = {}) => {
  const custom = customInput?.theme ?? customInput;
  return deepMerge(BASE, custom);
};
```

Backwards compat fallback chains removed. This is the breaking change for v6.

Color functions are created at render time in each tag handler via `applyColor()`.

### Tag handler pattern

Each handler reads only the attributes it needs via lazy `getAttr()`:

```js
// lib/tags/button.js
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';
import { isDisabled, getDisabledColor } from '../core/disabled.js';

export const button = (tag, context) => {
  const theme = context.theme.button;
  if (isDisabled(tag)) { /* ... */ }
  const prefixMarker = getAttr(tag, 'prefix.marker') ?? theme.prefix?.marker;
  const prefixColor  = getAttr(tag, 'prefix.color')  ?? theme.prefix?.color;
  // ...
};
```

### utilities.js cleanup

Remove (confirmed dead code — zero imports outside utilities.js):
- `getCustomAttributes()` — replaced by per-tag `getAttr()` calls
- `getDisabledColor()` — moved to `lib/core/disabled.js`
- `filterAst2` — duplicate of `filterAst`, never imported
- `safeExecute` — never imported anywhere

Keep: `getAttribute`, `indentify`, `validateNumber`, `validateInteger`, `logger`, `filterAst`.

### Dead file deletion

- `lib/utils/find-parrent-tag.js` — zero imports, dead code, delete entirely (do NOT rename)

### Tests upgrade

Add `test/helpers/strip-ansi.js` and `test/helpers/extract-ansi.js`.
Add `test/snapshots/` directory with fixture files.

New test pattern:
```js
it('h1 renders with correct ANSI styling', () => {
  const result = renderHTML('<h1>Hello</h1>');
  // snapshot comparison against fixture file
  assert.strictEqual(result, readFixture('h1-basic'));
});
```

## Final File Structure

```
lib/
  core/
    attr.js        ← NEW
    color.js       ← NEW
    disabled.js    ← NEW
    merge.js       ← NEW
    types.js       ← NEW
  tag-helpers/     ← unchanged (block-tag, inline-tag use concat utils)
  utils/
    get-theme.js   ← ~150 lines (from 1064)
    render-tag.js  ← unchanged
    concat-block-tags.js    ← still used
    concat-inline-tags.js   ← still used
    inline-to-block-tag.js  ← still used
    find-parrent-tag.js     ← DELETE (dead code, no imports)
    ...
  tags/            ← all handlers updated to use getAttr
  utilities.js     ← smaller (getCustomAttributes removed)
test/
  helpers/
    strip-ansi.js  ← NEW
    extract-ansi.js ← NEW
  snapshots/       ← NEW fixture files
  rendering/       ← updated tests
```

## Breaking Changes (v6)

- Theme config backwards compat aliases removed (`customTheme.tableHeader` → must use `customTheme.thead`)
- No longer accepts color functions in theme (only chalk-string format strings)
- `getCustomAttributes()` removed from public exports

## Implementation Phases

1. **Phase 0** — Create `lib/core/` with `color.js`, `attr.js`, `disabled.js`, `merge.js`, `types.js`
2. **Phase 1** — Rewrite `get-theme.js` to use `deepMerge` only
3. **Phase 2** — Update all tag handlers to use `getAttr` + `applyColor`
4. **Phase 3** — Remove `getCustomAttributes()`, `filterAst2`, `safeExecute`, `getDisabledColor` from `utilities.js`
5. **Phase 4** — Delete `lib/utils/find-parrent-tag.js` (dead code, no imports)
6. **Phase 5** — Add ANSI snapshot tests
7. **Phase 6** — Update `MEMORY.md` to reflect actual architecture

Note: Phase 2 touches ~20 tag files (~40+ `getCustomAttributes` call sites). Each file gets its own `getAttr` calls for only the attributes it uses.
