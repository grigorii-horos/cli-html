# Tag Configuration Consistency Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all places where tag handlers access theme with wrong key paths, ignore configured markers, or use hardcoded fallbacks instead of config.yaml values.

**Architecture:** Four independent bug categories across `lib/tags/a.js`, `lib/tags/text-styles.js`, `lib/tags/abbr.js`, and `lib/tags/details.js`. Each fix is isolated: correct the theme access path to match `config.yaml` structure, remove hardcoded fallbacks that duplicate config values, and wire `sub`/`sup`/`samp` to the prefix/suffix factories they already have.

**Tech Stack:** Node.js ESM, `lib/core/attr.js` (`getAttr`), `lib/core/color.js` (`applyColor`, `applyThemeColor`), Node built-in test runner (`node --test`)

---

## File Map

| File | Change |
|---|---|
| `lib/tags/a.js` | Fix 8 flat theme keys → nested; remove 8 hardcoded fallbacks |
| `lib/tags/text-styles.js` | Fix `createStyledTagWithMarkers`/`customInlineWithMarkers` prefix/suffix access; wire `samp`, `sub`, `sup` to marker factory |
| `lib/tags/abbr.js` | Remove 4 hardcoded `'('`/`')'` fallbacks |
| `lib/tags/details.js` | Remove legacy `theme.marker` fallback; remove hardcoded padding fallback |
| `test/rendering/snapshot.test.js` | Add regression tests for all fixed behaviors |

---

## Task 1: Fix `a.js` flat theme access

**Root cause:** `a.js` uses flat keys (`theme.hrefEnabled`, `theme.hrefColor`, `theme.titleColor`, etc.) but `config.yaml` stores these as nested objects (`theme.href.enabled`, `theme.href.color`, `theme.title.color`, etc.). Theme customisation for `href`, `title`, and the hardcoded fallback strings is completely ignored.

**Verified with:**
```bash
node -e "
import('/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/utils/get-theme.js').then(m => {
  const t = m.getTheme({ a: { href: { color: 'red' } } }).a;
  console.log('flat (broken):', t.hrefColor);   // undefined
  console.log('nested (correct):', t.href?.color); // red
});"
```

**Files:**
- Modify: `lib/tags/a.js`
- Modify: `test/rendering/snapshot.test.js`

- [ ] **Step 1: Write failing test**

Add to `test/rendering/snapshot.test.js` inside the `Links` describe block:

```js
it('href color from theme is applied', () => {
  const result = renderHTML(
    '<a href="https://example.com" data-cli-href-enabled="true">link</a>',
    { a: { href: { color: 'red bold' } } }
  );
  // Strip ANSI and verify text still present; color tested separately
  assert.ok(stripAnsi(result).includes('example.com'));
  // Actual color injection check: red bold produces ANSI 31 + 1
  assert.ok(result.includes('\x1B[') ); // some ANSI applied to href
});

it('title text from theme is shown when title.enabled=true in theme', () => {
  const result = renderHTML(
    '<a href="https://x.com" title="My Title">link</a>',
    { a: { title: { enabled: true } } }
  );
  assert.ok(stripAnsi(result).includes('My Title'));
});

it('title prefix/suffix from theme are applied', () => {
  const result = renderHTML(
    '<a href="https://x.com" title="T">link</a>',
    { a: { title: { enabled: true, prefix: { marker: '<<' }, suffix: { marker: '>>' } } } }
  );
  const plain = stripAnsi(result);
  assert.ok(plain.includes('<<'), `Expected << in: ${plain}`);
  assert.ok(plain.includes('>>'), `Expected >> in: ${plain}`);
});
```

- [ ] **Step 2: Run tests, confirm new ones fail**

```bash
cd /home/grigorii/Projects/GitHub/grigorii-horos/cli-html
npm test 2>&1 | grep -E "fail|pass|not ok"
```

Expected: 2–3 new failures for `title text from theme` and `title prefix/suffix`.

- [ ] **Step 3: Fix `lib/tags/a.js`**

Replace lines 35, 65, 75, 82–88 (flat key access) with nested paths. Full corrected section:

```js
// was: theme.hrefEnabled
const hrefEnabledValue = getAttr(tag, 'href.enabled') ?? theme.href?.enabled;

// ... switch statement unchanged ...

// was: theme.titleEnabled === true
const showTitle = showTitleRaw !== null
  ? showTitleRaw === 'true'
  : theme.title?.enabled === true;

// ... useHyperlink / linkValue unchanged ...

if (showHref && href) {
  // was: theme.hrefColor ?? 'gray'
  const hrefColor = getAttr(tag, 'href.color') ?? theme.href?.color;
  const styledHref = applyColor(hrefColor, ` [${href}]`);
  result += styledHref;
}

if (showTitle && rawTitle) {
  // was: theme.titleColor ?? 'yellow'
  const titleColor = getAttr(tag, 'title.color') ?? theme.title?.color;
  // was: theme.titlePrefix ?? ' ('
  const titlePrefix = getAttr(tag, 'title.prefix.marker') ?? theme.title?.prefix?.marker;
  // was: theme.titleSuffix ?? ')'
  const titleSuffix = getAttr(tag, 'title.suffix.marker') ?? theme.title?.suffix?.marker;
  // was: theme.titlePrefixColor ?? titleColor
  const titlePrefixColor = getAttr(tag, 'title.prefix.color') ?? theme.title?.prefix?.color ?? titleColor;
  // was: theme.titleSuffixColor ?? titleColor
  const titleSuffixColor = getAttr(tag, 'title.suffix.color') ?? theme.title?.suffix?.color ?? titleColor;

  const styledPrefix = applyColor(titlePrefixColor, titlePrefix);
  const styledTitle = applyColor(titleColor, rawTitle);
  const styledSuffix = applyColor(titleSuffixColor, titleSuffix);
  result += `${styledPrefix}${styledTitle}${styledSuffix}`;
}

const externalEnabledRaw = getAttr(tag, 'external.enabled');
const showExternalIndicator = externalEnabledRaw !== null
  ? externalEnabledRaw === 'true'
  : theme.external?.enabled === true;

if (showExternalIndicator && isExternal) {
  // was: ?? '↗' / ?? 'gray' / ?? 'after' / ?? ' '  — all in config.yaml, remove hardcodes
  const externalIndicatorMarker = getAttr(tag, 'external.marker') ?? theme.external?.marker;
  const externalIndicatorColor = getAttr(tag, 'external.color') ?? theme.external?.color;
  const externalIndicatorPosition = getAttr(tag, 'external.position') ?? theme.external?.position;
  const externalIndicatorSpacing = getAttr(tag, 'external.spacing') ?? theme.external?.spacing;

  const styledIndicator = applyColor(externalIndicatorColor, externalIndicatorMarker);
  result = externalIndicatorPosition === 'before'
    ? `${styledIndicator}${externalIndicatorSpacing}${result}`
    : `${result}${externalIndicatorSpacing}${styledIndicator}`;
}
```

- [ ] **Step 4: Run tests, all must pass**

```bash
npm test 2>&1 | grep -E "tests|pass|fail"
```

Expected: `# tests 132`, `# pass 132`, `# fail 0`

- [ ] **Step 5: Commit**

```bash
git add lib/tags/a.js test/rendering/snapshot.test.js
git commit -m "fix(a): use nested theme paths for href/title/external config

theme.hrefEnabled → theme.href?.enabled
theme.titleColor  → theme.title?.color
theme.titlePrefix → theme.title?.prefix?.marker  (etc.)
Removes hardcoded fallback strings that shadowed config.yaml values."
```

---

## Task 2: Fix `createStyledTagWithMarkers` and `customInlineWithMarkers` prefix/suffix access

**Root cause:** Both factory functions read `theme.prefix` as a plain string (it is actually an object `{ marker, color }`) and use flat `theme.prefixColor`/`theme.suffixColor` keys that don't exist.  Neither factory is currently exported to any tag — that gets fixed in Task 3.

**Files:**
- Modify: `lib/tags/text-styles.js`

- [ ] **Step 1: Locate both factory functions**

`createStyledTagWithMarkers` is at line 12.  
`customInlineWithMarkers` is at line 176.  
Both have identical broken code:

```js
// BROKEN — theme.prefix is { marker, color } object, not string
const prefix = getAttr(tag, 'prefix') ?? theme.prefix ?? '';
const suffix = getAttr(tag, 'suffix') ?? theme.suffix ?? '';
const styledPrefix = applyColor(getAttr(tag, 'prefix-color') ?? theme.prefixColor, prefix);
const styledSuffix = applyColor(getAttr(tag, 'suffix-color') ?? theme.suffixColor, suffix);
```

- [ ] **Step 2: Fix the prefix/suffix block in `createStyledTagWithMarkers` (line 12)**

Replace the broken 4 lines with:

```js
const prefix = getAttr(tag, 'prefix.marker') ?? theme.prefix?.marker ?? '';
const suffix = getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker ?? '';
const styledPrefix = applyColor(getAttr(tag, 'prefix.color') ?? theme.prefix?.color, prefix);
const styledSuffix = applyColor(getAttr(tag, 'suffix.color') ?? theme.suffix?.color, suffix);
```

- [ ] **Step 3: Fix the identical block in `customInlineWithMarkers` (line 176)**

Same replacement:

```js
const prefix = getAttr(tag, 'prefix.marker') ?? theme.prefix?.marker ?? '';
const suffix = getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker ?? '';
const styledPrefix = applyColor(getAttr(tag, 'prefix.color') ?? theme.prefix?.color, prefix);
const styledSuffix = applyColor(getAttr(tag, 'suffix.color') ?? theme.suffix?.color, suffix);
```

- [ ] **Step 4: Run tests — all must still pass (no regressions)**

```bash
npm test 2>&1 | grep -E "tests|pass|fail"
```

Expected: `# pass 132`, `# fail 0`

- [ ] **Step 5: Commit**

```bash
git add lib/tags/text-styles.js
git commit -m "fix(text-styles): correct prefix/suffix access in marker factories

theme.prefix (object) → theme.prefix?.marker
theme.prefixColor (flat/missing) → theme.prefix?.color
getAttr 'prefix-color' → 'prefix.color' (dot-path convention)"
```

---

## Task 3: Wire `samp`, `sub`, `sup` to prefix/suffix factories

**Root cause:** `config.yaml` defines prefix/suffix markers for `samp` (`$ `), `sub` (`₍…₎`), `sup` (`⁽…⁾`) but the exports use `createStyledTag` / `customInline` which ignore prefix/suffix entirely. Result: subscripts render as plain text with no notation.

**Verified:**
```bash
echo '<p><sub>2</sub></p>' | node bin/html.js
# renders: 2   (should render: ₍2₎)
```

**Files:**
- Modify: `lib/tags/text-styles.js`
- Modify: `test/rendering/snapshot.test.js`

- [ ] **Step 1: Write failing tests**

Add to `test/rendering/snapshot.test.js`:

```js
describe('Text style markers', () => {
  it('samp renders with prefix marker', () => {
    const plain = stripAnsi(renderHTML('<samp>ls -la</samp>'));
    assert.ok(plain.includes('$ '), `Expected '$ ' in: ${plain}`);
  });

  it('sub renders with prefix/suffix markers', () => {
    const plain = stripAnsi(renderHTML('<sub>2</sub>'));
    assert.ok(plain.includes('₍'), `Expected '₍' in: ${plain}`);
    assert.ok(plain.includes('₎'), `Expected '₎' in: ${plain}`);
  });

  it('sup renders with prefix/suffix markers', () => {
    const plain = stripAnsi(renderHTML('<sup>2</sup>'));
    assert.ok(plain.includes('⁽'), `Expected '⁽' in: ${plain}`);
    assert.ok(plain.includes('⁾'), `Expected '⁾' in: ${plain}`);
  });

  it('samp prefix can be overridden via data-cli', () => {
    const plain = stripAnsi(renderHTML('<samp data-cli-prefix-marker=">> ">cmd</samp>'));
    assert.ok(plain.includes('>> '), `Expected '>> ' in: ${plain}`);
  });
});
```

- [ ] **Step 2: Run tests, confirm 4 new failures**

```bash
npm test 2>&1 | grep -E "fail|not ok"
```

Expected: 4 failing tests about samp/sub/sup markers.

- [ ] **Step 3: Change `samp`, `sub`, `sup` exports**

In `lib/tags/text-styles.js`, find:

```js
export const samp = createStyledTag('samp');
// ...
export const sub = customInline;
export const sup = customInline;
```

Replace with:

```js
export const samp = createStyledTagWithMarkers('samp');
// ...
export const sub = customInlineWithMarkers('sub');
export const sup = customInlineWithMarkers('sup');
```

Note: `createStyledTagWithMarkers` is already defined at line 12 (fixed in Task 2). `customInlineWithMarkers` is already defined at line 176 (fixed in Task 2). Both are now correct.

- [ ] **Step 4: Run tests — all must pass**

```bash
npm test 2>&1 | grep -E "tests|pass|fail"
```

Expected: `# tests 136`, `# pass 136`, `# fail 0`

Also manually verify:

```bash
echo '<p>H<sub>2</sub>O and E=mc<sup>2</sup></p>' | node bin/html.js
# Expected: H₍2₎O and E=mc⁽2⁾
echo '<samp>ls -la</samp>' | node bin/html.js
# Expected: $ ls -la
```

- [ ] **Step 5: Commit**

```bash
git add lib/tags/text-styles.js test/rendering/snapshot.test.js
git commit -m "fix(text-styles): samp/sub/sup now render configured prefix/suffix markers

samp: createStyledTag → createStyledTagWithMarkers (shows '$ ' prompt)
sub:  customInline    → customInlineWithMarkers    (shows ₍…₎)
sup:  customInline    → customInlineWithMarkers    (shows ⁽…⁾)"
```

---

## Task 4: Remove hardcoded fallbacks from `abbr.js`

**Root cause:** `abbr.js` and `dfn.js` (same file) each have two hardcoded `?? '('` and `?? ')'` fallbacks for title prefix/suffix. `config.yaml` already defines these values under `abbr.title.prefix.marker` and `abbr.title.suffix.marker`.

**Files:**
- Modify: `lib/tags/abbr.js`
- Modify: `test/rendering/snapshot.test.js`

- [ ] **Step 1: Write a test for abbr title prefix override via theme**

Add to `test/rendering/snapshot.test.js`:

```js
describe('abbr', () => {
  it('shows title with default brackets', () => {
    const plain = stripAnsi(renderHTML('<abbr title="HyperText Markup Language">HTML</abbr>'));
    assert.ok(plain.includes('(HyperText Markup Language)'), `Got: ${plain}`);
  });

  it('title prefix/suffix from theme are respected', () => {
    const plain = stripAnsi(renderHTML(
      '<abbr title="HyperText Markup Language">HTML</abbr>',
      { abbr: { title: { prefix: { marker: '[' }, suffix: { marker: ']' } } } }
    ));
    assert.ok(plain.includes('[HyperText Markup Language]'), `Got: ${plain}`);
  });
});
```

- [ ] **Step 2: Run tests, second abbr test must fail**

```bash
npm test 2>&1 | grep -E "fail|not ok"
```

Expected: 1 failure — `title prefix/suffix from theme are respected` (because `?? '('` hardcode overrides custom theme value).

- [ ] **Step 3: Remove hardcoded fallbacks in `abbr.js`**

Four occurrences total (lines 14, 16 for `abbr`, lines 39, 41 for `dfn`):

```js
// abbr function — was:
const openParen = getAttr(tag, 'title.prefix.marker') ?? titleTheme.prefix?.marker ?? '(';
const closeParen = getAttr(tag, 'title.suffix.marker') ?? titleTheme.suffix?.marker ?? ')';

// abbr function — fix to:
const openParen = getAttr(tag, 'title.prefix.marker') ?? titleTheme.prefix?.marker;
const closeParen = getAttr(tag, 'title.suffix.marker') ?? titleTheme.suffix?.marker;

// dfn function — same change (lines ~39, ~41):
const openParen = getAttr(tag, 'title.prefix.marker') ?? titleTheme.prefix?.marker;
const closeParen = getAttr(tag, 'title.suffix.marker') ?? titleTheme.suffix?.marker;
```

- [ ] **Step 4: Run tests — all must pass**

```bash
npm test 2>&1 | grep -E "tests|pass|fail"
```

Expected: `# pass 138`, `# fail 0`

- [ ] **Step 5: Commit**

```bash
git add lib/tags/abbr.js test/rendering/snapshot.test.js
git commit -m "fix(abbr): remove hardcoded '(' ')' fallbacks — use config.yaml values"
```

---

## Task 5: Remove legacy code from `details.js`

**Root cause:** Two issues:
1. Line 28: `theme.indicator || theme.marker` — `theme.marker` is a dead legacy key, config.yaml uses `indicator` only.
2. Line 54: `theme.padding ?? { top: 0, bottom: 0, left: 1, right: 1 }` — `config.yaml` already defines this padding, hardcoded object is redundant.

**Files:**
- Modify: `lib/tags/details.js`

- [ ] **Step 1: Verify config.yaml has the padding values**

```bash
grep -A 8 "^  details:" /home/grigorii/Projects/GitHub/grigorii-horos/cli-html/config.yaml | grep -A 4 "padding:"
```

Expected output includes `top: 0`, `bottom: 0`, `left: 1`, `right: 1`.

- [ ] **Step 2: Remove legacy `theme.marker` fallback**

In `lib/tags/details.js`, line 28:

```js
// was:
const indicatorConfig = theme.indicator || theme.marker;

// fix:
const indicatorConfig = theme.indicator;
```

- [ ] **Step 3: Remove hardcoded padding fallback**

Line 54:

```js
// was:
const padding = theme.padding ?? { top: 0, bottom: 0, left: 1, right: 1 };

// fix:
const padding = theme.padding;
```

- [ ] **Step 4: Run tests — all must pass**

```bash
npm test 2>&1 | grep -E "tests|pass|fail"
```

Expected: `# pass 138`, `# fail 0`

Also manually verify details renders correctly:

```bash
echo '<details open><summary>Title</summary>Content here</details>' | node bin/html.js
```

Expected: bordered block with `▼ Title` open indicator and content indented.

- [ ] **Step 5: Commit**

```bash
git add lib/tags/details.js
git commit -m "fix(details): remove legacy theme.marker fallback and hardcoded padding

theme.indicator || theme.marker → theme.indicator only
padding ?? { hardcoded } → padding (config.yaml is source of truth)"
```

---

## Self-Review

**Spec coverage:**
- `a.js` flat keys → Task 1 ✓
- `createStyledTagWithMarkers` broken prefix → Task 2 ✓
- `samp`/`sub`/`sup` no markers → Task 3 ✓
- `abbr.js` hardcoded fallbacks → Task 4 ✓
- `details.js` legacy code + hardcoded padding → Task 5 ✓

**Placeholders:** None.

**Type consistency:**
- `theme.href?.enabled` used consistently in Task 1 (no mixed usages)
- `theme.prefix?.marker` pattern used identically in Tasks 2 and 3
- `createStyledTagWithMarkers` fixed in Task 2 before used in Task 3

**Known out-of-scope (not in this plan):**
- `blockquote.js` / `list.js` `marker-color` naming inconsistency (cosmetic, no broken behavior)
- `inputs.js` hardcoded fallbacks (config.yaml has all values; separate focused pass)
- `figure.js`, `fieldset.js` hardcoded padding fallbacks (same pattern, separate pass)
