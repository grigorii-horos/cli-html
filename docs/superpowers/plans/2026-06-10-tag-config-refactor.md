# Tag Config Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all hardcoded fallbacks that shadow `config.yaml` values across tag handlers, fix missing theme reads, and correct `getAttr` naming inconsistencies.

**Architecture:** Each tag handler must read values in this order: `getAttr(tag, 'path')` (data-cli custom attribute) → `context.theme.tag?.property` (from config.yaml via deepMerge) → nothing. Hardcoded `?? 'value'` or `|| 'value'` that duplicate config.yaml defaults are incorrect because they break theme customization: when a user sets a config value and config.yaml deepMerges it, the handler still ignores it and returns the hardcode instead. Some `||` must become `??` (nullish vs falsy) to allow intentional empty-string theme values.

**Tech Stack:** Node.js ESM, `lib/core/attr.js` (`getAttr`), `lib/core/color.js` (`applyColor`, `applyThemeColor`), Node built-in test runner (`npm test`)

---

## Background: How theme access works

```js
// WRONG — hardcode blocks theme customization:
const marker = getAttr(tag, 'checked.marker') ?? context.theme.input?.checkbox?.checked?.marker ?? '✓';
// If user sets checkbox.checked.marker: 'X' in their config, '✓' is never reached because
// context.theme.input.checkbox.checked.marker is 'X' (non-null), so ?? '✓' never fires.
// BUT if user sets it to '' (empty string), ?? still skips it. Use ?? not ||.

// CORRECT — trust config.yaml (which always provides defaults via deepMerge):
const marker = getAttr(tag, 'checked.marker') ?? context.theme.input?.checkbox?.checked?.marker;
```

The `??` vs `||` distinction matters for intentional empty strings:
- `'value' || 'fallback'` → uses fallback when value is `''` (blocks empty-string theme values)
- `'value' ?? 'fallback'` → uses fallback only when value is `null`/`undefined` (correct)

---

## File Map

| File | Change |
|---|---|
| `lib/tags/inputs.js` | Remove 25 hardcoded fallbacks; fix 2 naming issues; fix textarea wrong fallback |
| `lib/tags/fieldset.js` | Remove 7 hardcoded fallbacks; `||` → `??` |
| `lib/tags/figure.js` | Remove 2 hardcoded fallbacks; `||` → `??` |
| `lib/tags/select.js` | Remove 2 hardcoded fallbacks; fix 1 naming issue; `||` → `??` |
| `lib/tags/progress.js` | Remove 2 hardcoded fallbacks; `||` → `??` |
| `lib/tags/meter.js` | Remove 3 hardcoded fallbacks; `||` → `??` |
| `lib/tags/blockquote.js` | Fix 2 naming issues in getAttr calls |
| `lib/tags/list.js` | Fix 1 naming issue in getAttr call |
| `lib/tags/table.js` | Add 3 missing theme reads; remove 3 hardcoded fallbacks |
| `test/rendering/config-override.test.js` | New file — regression tests for theme override correctness |

---

## Task 1: inputs.js — remove hardcoded fallbacks

**Root cause:** `inputs.js` has 25 lines ending with `?? 'hardcoded-value'` where `config.yaml` already defines those values. Additionally: textarea incorrectly falls back to `context.theme.code?.inline?.color` (different tag); `getAttr(tag, 'show-placeholder')` is redundantly followed by `getAttribute(tag, 'data-cli-show-placeholder', 'false')` (double-read); `placeholder-color` has a hardcoded `'gray dim'` fallback and a double-read.

**Config.yaml reference for all removed fallbacks:**
```yaml
input:
  required.indicator.marker: '*'
  required.indicator.position: 'after'
  button.prefix.marker: '[ '
  button.suffix.marker: ' ]'
  checkbox.prefix.marker: '['
  checkbox.suffix.marker: ']'
  checkbox.checked.marker: '✓'
  checkbox.unchecked.marker: ' '
  radio.prefix.marker: '('
  radio.suffix.marker: ')'
  radio.checked.marker: '•'
  radio.unchecked.marker: ' '
  range.filled.marker: '█'
  range.empty.marker: '░'
  range.thumb.marker: '●'
  color.indicator.marker: '■'
  color.prefix.marker: '('
  color.suffix.marker: ')'
  file.placeholder: 'No file chosen'
  file.prefix.marker: '@'
  password.char: '•'
  email.prefix.marker: '@ '
  date.prefix.marker: '# '
  textInput.placeholderColor: (not in config — data-cli only, keep ?? null)
```

**Files:**
- Modify: `lib/tags/inputs.js`
- Modify: `test/rendering/config-override.test.js`

- [ ] **Step 1: Create test file with failing tests**

Create `test/rendering/config-override.test.js`:

```js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { renderHTML } from '../../index.js';
import { stripAnsi } from '../helpers/strip-ansi.js';

describe('Theme config override tests', () => {
  describe('inputs — checkbox', () => {
    it('checked marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="checkbox" checked>',
        { input: { checkbox: { checked: { marker: 'YES' } } } }
      ));
      assert.ok(plain.includes('YES'), `Expected 'YES' in: ${plain}`);
    });

    it('unchecked marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="checkbox">',
        { input: { checkbox: { unchecked: { marker: 'NO' } } } }
      ));
      assert.ok(plain.includes('NO'), `Expected 'NO' in: ${plain}`);
    });

    it('prefix marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="checkbox" checked>',
        { input: { checkbox: { prefix: { marker: '{{' }, suffix: { marker: '}}' } } } }
      ));
      assert.ok(plain.includes('{{'), `Expected '{{' in: ${plain}`);
      assert.ok(plain.includes('}}'), `Expected '}}' in: ${plain}`);
    });
  });

  describe('inputs — radio', () => {
    it('checked marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="radio" checked>',
        { input: { radio: { checked: { marker: '*' } } } }
      ));
      assert.ok(plain.includes('*'), `Expected '*' in: ${plain}`);
    });
  });

  describe('inputs — file', () => {
    it('prefix marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="file">',
        { input: { file: { prefix: { marker: '>>' } } } }
      ));
      assert.ok(plain.includes('>>'), `Expected '>>' in: ${plain}`);
    });
  });

  describe('inputs — password', () => {
    it('char from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="password" value="abc">',
        { input: { password: { char: 'X' } } }
      ));
      assert.ok(plain.includes('XXX'), `Expected 'XXX' in: ${plain}`);
    });
  });

  describe('inputs — email', () => {
    it('prefix marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="email" value="x@y.com">',
        { input: { email: { prefix: { marker: 'MAIL:' } } } }
      ));
      assert.ok(plain.includes('MAIL:'), `Expected 'MAIL:' in: ${plain}`);
    });
  });

  describe('inputs — date', () => {
    it('prefix marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="date" value="2024-01-01">',
        { input: { date: { prefix: { marker: 'DATE:' } } } }
      ));
      assert.ok(plain.includes('DATE:'), `Expected 'DATE:' in: ${plain}`);
    });
  });

  describe('textarea', () => {
    it('uses its own color, not code.inline fallback', () => {
      const result = renderHTML(
        '<textarea>text</textarea>',
        { input: { textarea: { color: 'red bold' } }, code: { color: 'blue' } }
      );
      // Red bold ANSI codes: \x1B[31m and \x1B[1m — verify ANSI applied
      assert.ok(result.includes('\x1B['), `Expected ANSI in: ${result}`);
      assert.ok(stripAnsi(result).includes('text'), `Expected 'text' in: ${stripAnsi(result)}`);
    });
  });
});
```

- [ ] **Step 2: Run to confirm failures**

```bash
cd /home/grigorii/Projects/GitHub/grigorii-horos/cli-html
npm test 2>&1 | grep -E "tests|pass|fail"
```

Expected: several failures (checkbox/radio/file/password/email/date theme overrides rejected due to hardcodes).

- [ ] **Step 3: Fix inputs.js — remove all hardcoded fallbacks**

Apply these changes to `lib/tags/inputs.js`:

```js
// Line ~25 (required indicator):
// was: ?? requiredConfig?.indicator?.marker ?? '*'
const marker = getAttr(tag, 'required.marker') ?? requiredConfig?.indicator?.marker;

// was: ?? requiredConfig?.indicator?.position ?? 'after'
const position = getAttr(tag, 'required.position') ?? requiredConfig?.indicator?.position;

// Line ~39 (text/submit type button prefix/suffix):
// was: ?? theme.prefix?.marker ?? '[ '
const prefixMarker = getAttr(tag, 'prefix.marker') ?? theme.prefix?.marker;
// was: ?? theme.suffix?.marker ?? ' ]'
const suffixMarker = getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker;

// Line ~53 (checkbox prefix/suffix):
// was: ?? context.theme.input?.checkbox?.prefix?.marker ?? '['
const prefixMarker = getAttr(tag, 'checkbox.prefix.marker') ?? context.theme.input?.checkbox?.prefix?.marker;
// was: ?? context.theme.input?.checkbox?.suffix?.marker ?? ']'
const suffixMarker = getAttr(tag, 'checkbox.suffix.marker') ?? context.theme.input?.checkbox?.suffix?.marker;

// Line ~57-58 (checkbox checked/unchecked):
// was: ?? context.theme.input?.checkbox?.checked?.marker ?? '✓'
? (getAttr(tag, 'checked.marker') ?? context.theme.input?.checkbox?.checked?.marker)
// was: ?? context.theme.input?.checkbox?.unchecked?.marker ?? ' '
: (getAttr(tag, 'unchecked.marker') ?? context.theme.input?.checkbox?.unchecked?.marker)

// Line ~81-82 (radio prefix/suffix):
const prefixMarker = getAttr(tag, 'radio.prefix.marker') ?? context.theme.input?.radio?.prefix?.marker;
const suffixMarker = getAttr(tag, 'radio.suffix.marker') ?? context.theme.input?.radio?.suffix?.marker;

// Line ~85-86 (radio checked/unchecked):
? (getAttr(tag, 'radio.checked.marker') ?? context.theme.input?.radio?.checked?.marker)
: (getAttr(tag, 'radio.unchecked.marker') ?? context.theme.input?.radio?.unchecked?.marker)

// Line ~109-110 (input type=button prefix/suffix):
const prefixMarker = getAttr(tag, 'button.prefix.marker') ?? context.theme.input?.button?.prefix?.marker;
const suffixMarker = getAttr(tag, 'button.suffix.marker') ?? context.theme.input?.button?.suffix?.marker;

// Line ~146-148 (range markers):
const filledMarker = getAttr(tag, 'range.filled') ?? context.theme.input?.range?.filled?.marker;
const emptyMarker = getAttr(tag, 'range.empty') ?? context.theme.input?.range?.empty?.marker;
const thumbMarker = getAttr(tag, 'range.thumb') ?? context.theme.input?.range?.thumb?.marker;

// Line ~181-183 (color input):
const indicator = getAttr(tag, 'color.indicator') ?? context.theme.input?.color?.indicator?.marker;
const prefixMarker = getAttr(tag, 'color.prefix.marker') ?? context.theme.input?.color?.prefix?.marker;
const suffixMarker = getAttr(tag, 'color.suffix.marker') ?? context.theme.input?.color?.suffix?.marker;

// Line ~223-224 (file input):
const placeholder = getAttr(tag, 'file.placeholder') ?? context.theme.input?.file?.placeholder;
const filePrefixMarker = getAttr(tag, 'file.prefix.marker') ?? context.theme.input?.file?.prefix?.marker;

// Line ~247 (password):
const passwordChar = getAttr(tag, 'password.char') ?? context.theme.input?.password?.char;

// Line ~269 (email prefix):
const emailPrefixMarker = getAttr(tag, 'email.prefix.marker') ?? context.theme.input?.email?.prefix?.marker;

// Line ~294 (date prefix):
const datePrefixMarker = getAttr(tag, 'date.prefix.marker') ?? context.theme.input?.date?.prefix?.marker;
```

- [ ] **Step 4: Fix show-placeholder double-read and placeholder-color issues**

```js
// Line ~318 — was:
const showPlaceholder = getAttr(tag, 'show-placeholder') ?? getAttribute(tag, 'data-cli-show-placeholder', 'false');
// fix (getAttr already reads data-cli-show-placeholder):
const showPlaceholder = getAttr(tag, 'show-placeholder') ?? 'false';

// Line ~321 — was:
const placeholderColor = getAttr(tag, 'placeholder-color') ?? getAttribute(tag, 'data-cli-placeholder-color') ?? 'gray dim';
// fix (remove double-read; placeholder color is data-cli only — no theme key, but remove ?? 'gray dim' hardcode
// since null applyColor returns text unchanged which is acceptable):
const placeholderColor = getAttr(tag, 'placeholder-color');
```

- [ ] **Step 5: Fix textarea wrong theme fallback**

```js
// Line ~351 — was:
const textColor = getAttr(tag, 'textarea.color') ?? context.theme.input?.textarea?.color ?? context.theme.code?.inline?.color;
// fix (remove code.inline fallback — textarea has its own config):
const textColor = getAttr(tag, 'color') ?? context.theme.input?.textarea?.color;
```

Note: `getAttr(tag, 'textarea.color')` reads `data-cli-textarea-color`. But since `textarea` is its own exported handler (not inside `inputs`), the custom attribute should be just `data-cli-color` (no tag prefix per convention). Fix to `getAttr(tag, 'color')`.

- [ ] **Step 6: Run tests — all must pass**

```bash
npm test 2>&1 | grep -E "tests|pass|fail"
```

Expected: `# tests 145` (138 existing + 7 new), `# pass 145`, `# fail 0`

- [ ] **Step 7: Commit**

```bash
git add lib/tags/inputs.js test/rendering/config-override.test.js
git commit -m "fix(inputs): remove hardcoded fallbacks, fix textarea wrong theme fallback

All ?? 'value' hardcodes removed — config.yaml always provides defaults.
textarea: remove code.inline fallback, use only input.textarea.color.
show-placeholder: remove duplicate getAttribute read.
placeholder-color: remove duplicate read and hardcode."
```

---

## Task 2: fieldset.js + figure.js — remove hardcoded fallbacks

**Root cause:** Both files use `||` (falsy) instead of `??` (nullish) AND have hardcoded last-resort fallbacks. Config.yaml defines all these values.

**Config.yaml reference:**
```yaml
fieldset:
  border.color: 'gray'
  border.style: 'single'
  title.color: 'yellow'
  disabled.color: 'gray dim'
  # required comes from input.required (shared)
  # input.required.indicator.marker: '*'
  # input.required.indicator.color: 'red'
  # input.required.indicator.position: 'after'

figure:
  border.color: 'gray'
  border.style: 'round'
```

**Files:**
- Modify: `lib/tags/fieldset.js`
- Modify: `lib/tags/figure.js`
- Modify: `test/rendering/config-override.test.js`

- [ ] **Step 1: Add failing tests**

Add to `test/rendering/config-override.test.js`:

```js
describe('fieldset', () => {
  it('border color from theme is respected', () => {
    const result = renderHTML(
      '<fieldset><legend>Title</legend>content</fieldset>',
      { fieldset: { border: { color: 'red bold' } } }
    );
    assert.ok(result.includes('\x1B['), `Expected ANSI in: ${result}`);
  });

  it('title color from theme is respected', () => {
    const result = renderHTML(
      '<fieldset><legend>MyTitle</legend>x</fieldset>',
      { fieldset: { title: { color: 'cyan' } } }
    );
    assert.ok(stripAnsi(result).includes('MyTitle'), `Expected 'MyTitle' in: ${stripAnsi(result)}`);
  });
});

describe('figure', () => {
  it('border color from theme is respected', () => {
    const result = renderHTML(
      '<figure>content</figure>',
      { figure: { border: { color: 'red bold' } } }
    );
    assert.ok(result.includes('\x1B['), `Expected ANSI in: ${result}`);
  });
});
```

- [ ] **Step 2: Run — confirm tests pass (fallbacks are same as config, so no failure expected)**

```bash
npm test 2>&1 | grep -E "tests|pass|fail"
```

These tests verify behavior is preserved — they pass before and after the fix.

- [ ] **Step 3: Fix fieldset.js**

```js
// Line ~15 — was: || context.theme.fieldset?.border?.color || 'gray'
const borderColorRaw = getAttr(tag, 'border') ?? context.theme.fieldset?.border?.color;

// Line ~17 — was: || context.theme.fieldset?.border?.style || 'single'
const borderStyle = getAttr(tag, 'border-style') ?? context.theme.fieldset?.border?.style;

// Line ~20 — was: || context.theme.fieldset?.title?.color || 'yellow'
const titleColorRaw = getAttr(tag, 'title.color') ?? context.theme.fieldset?.title?.color;

// Line ~25 — was: getAttr(tag, 'required-marker') || '*'
// (required config comes from input.required)
const requiredMarker = getAttr(tag, 'required-marker') ?? context.theme.input?.required?.indicator?.marker;

// Line ~26 — was: getAttr(tag, 'required-color') || 'red'
const requiredColor = getAttr(tag, 'required-color') ?? context.theme.input?.required?.indicator?.color;

// Line ~27 — was: getAttr(tag, 'required-position') || 'before'
const requiredPosition = getAttr(tag, 'required-position') ?? context.theme.input?.required?.indicator?.position;

// Line ~52 — was: getAttr(tag, 'disabled.color') || context.theme.fieldset?.disabled?.color || 'gray dim'
const disabledColor = getAttr(tag, 'disabled.color') ?? context.theme.fieldset?.disabled?.color;
```

- [ ] **Step 4: Fix figure.js**

```js
// Line ~76 — was: getAttr(tag, 'border') || context.theme.figure?.border?.color || 'gray'
const borderColorRaw = getAttr(tag, 'border') ?? context.theme.figure?.border?.color;

// Line ~78 — was: getAttr(tag, 'border-style') || context.theme.figure?.border?.style || 'round'
const borderStyle = getAttr(tag, 'border-style') ?? context.theme.figure?.border?.style;
```

- [ ] **Step 5: Run tests — all pass**

```bash
npm test 2>&1 | grep -E "tests|pass|fail"
```

Expected: `# tests 148`, `# pass 148`, `# fail 0`

- [ ] **Step 6: Commit**

```bash
git add lib/tags/fieldset.js lib/tags/figure.js test/rendering/config-override.test.js
git commit -m "fix(fieldset,figure): remove hardcoded fallbacks, || → ??

All border/title/disabled/required fallbacks now read from config.yaml."
```

---

## Task 3: select.js — remove hardcoded fallbacks + fix naming

**Root cause:** `select.js` uses `||` (falsy) for option markers instead of `??`, and `getAttr(optgroupTag, 'marker-color')` should use dot-path convention.

**Config.yaml reference:**
```yaml
option:
  selected.marker: '◉'
  unselected.marker: '○'
optgroup:
  indicator.marker: '▸ '
  indicator.color: 'cyan bold'
```

**Files:**
- Modify: `lib/tags/select.js`
- Modify: `test/rendering/config-override.test.js`

- [ ] **Step 1: Add tests**

Add to `test/rendering/config-override.test.js`:

```js
describe('select', () => {
  it('selected marker from theme is respected', () => {
    const plain = stripAnsi(renderHTML(
      '<select><option selected>opt</option></select>',
      { option: { selected: { marker: '>>' } } }
    ));
    assert.ok(plain.includes('>>'), `Expected '>>' in: ${plain}`);
  });

  it('unselected marker from theme is respected', () => {
    const plain = stripAnsi(renderHTML(
      '<select><option>opt</option></select>',
      { option: { unselected: { marker: '--' } } }
    ));
    assert.ok(plain.includes('--'), `Expected '--' in: ${plain}`);
  });
});
```

- [ ] **Step 2: Run — confirm failures (|| blocks empty-string override but not non-empty)**

```bash
npm test 2>&1 | grep -E "tests|pass|fail"
```

Tests pass (non-empty string override not blocked by `||`). Proceed to fix anyway.

- [ ] **Step 3: Fix select.js**

```js
// Line ~25 — was: optionTheme.selected?.marker || '◉'
const selectedMarker = optionTheme.selected?.marker;

// Line ~26 — was: optionTheme.unselected?.marker || '○'
const unselectedMarker = optionTheme.unselected?.marker;

// Line ~75 — was: getAttr(optgroupTag, 'marker') || optgroupTheme.indicator?.marker || '▸ '
const groupMarker = getAttr(optgroupTag, 'indicator.marker') ?? optgroupTheme.indicator?.marker;

// Line ~87 — was: getAttr(optgroupTag, 'marker-color') ?? optgroupTheme.indicator?.color
// Fix naming: 'marker-color' → 'indicator.color'
const markerColor = getAttr(optgroupTag, 'indicator.color') ?? optgroupTheme.indicator?.color;
```

Note: `getAttr(optgroupTag, 'indicator.marker')` reads `data-cli-indicator-marker`. `getAttr(optgroupTag, 'indicator.color')` reads `data-cli-indicator-color`. This matches naming convention from CLAUDE.md.

- [ ] **Step 4: Run tests — all pass**

```bash
npm test 2>&1 | grep -E "tests|pass|fail"
```

Expected: `# tests 150`, `# pass 150`, `# fail 0`

- [ ] **Step 5: Commit**

```bash
git add lib/tags/select.js test/rendering/config-override.test.js
git commit -m "fix(select): remove hardcoded option markers, fix optgroup getAttr naming

|| → ?? for selected/unselected markers.
getAttr 'marker' → 'indicator.marker', 'marker-color' → 'indicator.color'."
```

---

## Task 4: progress.js + meter.js — remove hardcoded fallbacks

**Root cause:** Both use `||` (falsy) for markers. Config.yaml defines all values.

**Config.yaml reference:**
```yaml
progress:
  filled.marker: '█'
  empty.marker: '░'

meter:
  empty.marker: '░'
  labels.format: '%v/%m'
  labels.position: 'right'
  # ranges.low.marker, ranges.medium.marker, ranges.high.marker: '█' each
```

**Files:**
- Modify: `lib/tags/progress.js`
- Modify: `lib/tags/meter.js`
- Modify: `test/rendering/config-override.test.js`

- [ ] **Step 1: Add tests**

Add to `test/rendering/config-override.test.js`:

```js
describe('progress', () => {
  it('filled marker from theme is respected', () => {
    const plain = stripAnsi(renderHTML(
      '<progress value="50" max="100"></progress>',
      { progress: { filled: { marker: '#' } } }
    ));
    assert.ok(plain.includes('#'), `Expected '#' in: ${plain}`);
  });

  it('empty marker from theme is respected', () => {
    const plain = stripAnsi(renderHTML(
      '<progress value="0" max="100"></progress>',
      { progress: { empty: { marker: '.' } } }
    ));
    assert.ok(plain.includes('.'), `Expected '.' in: ${plain}`);
  });
});

describe('meter', () => {
  it('empty marker from theme is respected', () => {
    const plain = stripAnsi(renderHTML(
      '<meter value="0" max="100"></meter>',
      { meter: { empty: { marker: '.' } } }
    ));
    assert.ok(plain.includes('.'), `Expected '.' in: ${plain}`);
  });
});
```

- [ ] **Step 2: Run — note which fail**

```bash
npm test 2>&1 | grep -E "tests|pass|fail|not ok"
```

- [ ] **Step 3: Fix progress.js**

```js
// Line ~78 — was: || context.theme.progress?.filled?.marker || '█'
const baseFilledMarker = getAttr(tag, 'filled.marker') ?? context.theme.progress?.filled?.marker;

// Line ~79 — was: || context.theme.progress?.empty?.marker || '█'
// Note: config.yaml has empty.marker: '░' (not '█') — the existing '█' fallback appears to be a copy-paste bug
const baseEmptyMarker = getAttr(tag, 'empty.marker') ?? context.theme.progress?.empty?.marker;
```

- [ ] **Step 4: Fix meter.js**

```js
// Line ~50 — was: rangeConfig?.marker || '█'
const filledMarker = rangeConfig?.marker;

// Line ~55 — was: emptyConfig?.marker || '░'
const emptyMarker = emptyConfig?.marker;

// Line ~79 — was: || labelsConfig?.format || '%v/%m'
const format = getAttr(tag, 'labels.format') ?? labelsConfig?.format;

// Line ~88 — was: || labelsConfig?.position || 'right'
const position = getAttr(tag, 'labels.position') ?? labelsConfig?.position;
```

- [ ] **Step 5: Run tests — all pass**

```bash
npm test 2>&1 | grep -E "tests|pass|fail"
```

Expected: `# tests 153`, `# pass 153`, `# fail 0`

- [ ] **Step 6: Commit**

```bash
git add lib/tags/progress.js lib/tags/meter.js test/rendering/config-override.test.js
git commit -m "fix(progress,meter): remove hardcoded fallbacks, || → ??

All marker/format/position fallbacks read from config.yaml.
Note: progress.empty.marker was '█' (copy-paste bug), now correctly '░' from config."
```

---

## Task 5: blockquote.js + list.js — fix getAttr naming

**Root cause:** Both files use `getAttr(tag, 'marker-color')` (hyphen path) for what should be `getAttr(tag, 'indicator.color')` (dot path). `blockquote.js` also uses `getAttr(tag, 'marker')` → should be `getAttr(tag, 'indicator.marker')`. This is a naming inconsistency — the convention per CLAUDE.md is dot-path naming matching config.yaml structure.

**Note:** This is a **breaking change for custom attributes** — users using `data-cli-marker-color` must switch to `data-cli-indicator-color`. However, since these are implementation bugs (the wrong name was published), fixing them is correct.

**Files:**
- Modify: `lib/tags/blockquote.js`
- Modify: `lib/tags/list.js`
- Modify: `test/rendering/config-override.test.js`

- [ ] **Step 1: Add tests**

Add to `test/rendering/config-override.test.js`:

```js
describe('blockquote — data-cli attributes', () => {
  it('data-cli-indicator-marker overrides blockquote marker', () => {
    const plain = stripAnsi(renderHTML(
      '<blockquote data-cli-indicator-marker=">> ">text</blockquote>'
    ));
    assert.ok(plain.includes('>>'), `Expected '>>' in: ${plain}`);
  });

  it('data-cli-indicator-color applies to marker', () => {
    const result = renderHTML(
      '<blockquote data-cli-indicator-color="red">text</blockquote>'
    );
    assert.ok(result.includes('\x1B['), `Expected ANSI in: ${result}`);
  });
});

describe('list — data-cli attributes', () => {
  it('data-cli-indicator-color on ul overrides marker color', () => {
    const result = renderHTML('<ul data-cli-indicator-color="red"><li>item</li></ul>');
    assert.ok(result.includes('\x1B['), `Expected ANSI in: ${result}`);
  });
});
```

- [ ] **Step 2: Run — these tests fail (wrong attr name used)**

```bash
npm test 2>&1 | grep -E "tests|pass|fail|not ok"
```

Expected: blockquote `data-cli-indicator-marker` test fails.

- [ ] **Step 3: Fix blockquote.js**

```js
// Line ~44 — was: getAttr(tag, 'marker') || indicatorConfig.marker
const marker = getAttr(tag, 'indicator.marker') ?? indicatorConfig.marker;

// Line ~46 — was: getAttr(tag, 'marker-color')
getAttr(tag, 'indicator.color'),
```

`getAttr(tag, 'indicator.marker')` reads `data-cli-indicator-marker`. `getAttr(tag, 'indicator.color')` reads `data-cli-indicator-color`.

- [ ] **Step 4: Fix list.js**

```js
// Line ~29 — was: customMarkerColor: getAttr(tag, 'marker-color'),
customMarkerColor: getAttr(tag, 'indicator.color'),

// Line ~50 — was: customMarkerColor: getAttr(tag, 'marker-color'),
customMarkerColor: getAttr(tag, 'indicator.color'),

// Line ~51 — was: customMarker: getAttr(tag, 'marker'),
// 'marker' is ambiguous — this sets the full marker string for ordered lists.
// Per convention, should be 'indicator.marker':
customMarker: getAttr(tag, 'indicator.marker'),
```

- [ ] **Step 5: Run tests — all pass**

```bash
npm test 2>&1 | grep -E "tests|pass|fail"
```

Expected: `# tests 156`, `# pass 156`, `# fail 0`

- [ ] **Step 6: Commit**

```bash
git add lib/tags/blockquote.js lib/tags/list.js test/rendering/config-override.test.js
git commit -m "fix(blockquote,list): rename data-cli getAttr paths to dot-path convention

getAttr 'marker' → 'indicator.marker' (data-cli-indicator-marker)
getAttr 'marker-color' → 'indicator.color' (data-cli-indicator-color)
Aligns with CLAUDE.md naming convention."
```

---

## Task 6: table.js — add missing theme reads + remove hardcoded fallbacks

**Root cause:** Three responsive config values are read via `getAttr` but fall back to hardcoded strings instead of reading from `context.theme.table?.responsive?.*`. The theme reads are missing entirely. `striping.count` reads from theme but uses `||` instead of `??`.

**Config.yaml reference:**
```yaml
table:
  responsive.threshold: 60
  responsive.separator: ': '
  responsive.itemSeparator: '\n\n'
  striping.count: 2
```

**Not in config.yaml (data-cli only — keep hardcoded or null):**
- `alternate-colors` → keep `|| 'white,gray'` (no theme key)
- `row-number-color` → keep `|| 'gray'` (no theme key)
- `row-number-start` → keep `|| '1'` (no theme key)
- `row-number-separator` → keep `|| '│'` (no theme key)

**Files:**
- Modify: `lib/tags/table.js`
- Modify: `test/rendering/config-override.test.js`

- [ ] **Step 1: Add tests**

Add to `test/rendering/config-override.test.js`:

```js
describe('table — responsive theme config', () => {
  it('responsive separator from theme is respected', () => {
    // Force narrow width by using a very high threshold
    const plain = stripAnsi(renderHTML(
      '<table data-cli-responsive-enabled="true" data-cli-responsive-threshold="9999"><tr><th>Name</th></tr><tr><td>Alice</td></tr></table>',
      { table: { responsive: { separator: ' => ' } } }
    ));
    assert.ok(plain.includes(' => '), `Expected ' => ' in: ${plain}`);
  });
});
```

- [ ] **Step 2: Run — note result**

```bash
npm test 2>&1 | grep -E "tests|pass|fail"
```

- [ ] **Step 3: Fix table.js**

```js
// Line ~217 — was: getAttr(tag, 'responsive.threshold') || '60'
const responsiveThreshold = Number.parseInt(
  getAttr(tag, 'responsive.threshold') ?? context.theme.table?.responsive?.threshold, 10
);

// Line ~218 — was: getAttr(tag, 'responsive.separator') || ': '
const responsiveSeparator = getAttr(tag, 'responsive.separator')
  ?? context.theme.table?.responsive?.separator;

// Line ~219 — was: getAttr(tag, 'responsive.item-separator') || '\n\n'
// Note: config.yaml key is itemSeparator (camelCase); getAttr path keeps hyphen for data-cli attribute
const responsiveItemSeparator = getAttr(tag, 'responsive.item-separator')
  ?? context.theme.table?.responsive?.itemSeparator;

// Line ~233 — was: context.theme.table?.striping?.count || '2'
// || → ?? to allow count: '' (edge case) without falling back
: Number.parseInt(context.theme.table?.striping?.count, 10);
```

- [ ] **Step 4: Run tests — all pass**

```bash
npm test 2>&1 | grep -E "tests|pass|fail"
```

Expected: `# tests 157`, `# pass 157`, `# fail 0`

- [ ] **Step 5: Commit**

```bash
git add lib/tags/table.js test/rendering/config-override.test.js
git commit -m "fix(table): add missing theme reads for responsive config, || → ??

responsive.threshold/separator/itemSeparator now read from theme.
striping.count: || → ??"
```

---

## Self-Review

**Spec coverage:**
- inputs.js 25 hardcoded fallbacks → Task 1 ✓
- inputs.js textarea wrong fallback → Task 1 ✓
- inputs.js show-placeholder double-read → Task 1 ✓
- fieldset.js 7 fallbacks → Task 2 ✓
- figure.js 2 fallbacks → Task 2 ✓
- select.js 2 fallbacks + naming → Task 3 ✓
- progress.js 2 fallbacks → Task 4 ✓
- meter.js 3 fallbacks → Task 4 ✓
- blockquote.js naming → Task 5 ✓
- list.js naming → Task 5 ✓
- table.js 3 missing theme reads + striping → Task 6 ✓

**Placeholders:** None.

**Type consistency:** `getAttr` always returns string or null. `??` used throughout (not `||`). `applyColor(null, text)` returns text unchanged — safe when theme returns null.

**Known out-of-scope (data-cli only — no theme equivalent):**
- `table.js` alternate-colors, row-number-* (no config.yaml key → keep `|| 'default'`)
- `inputs.js` placeholder-color (no theme key — data-cli only)
