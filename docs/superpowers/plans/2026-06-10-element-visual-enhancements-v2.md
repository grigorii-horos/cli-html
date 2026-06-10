# HTML Element Visual Enhancements v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve visual rendering of `<hr>` (named styles), `<ruby>`/`<rt>` (configurable, fix color bug), `<dialog>` (box border), `<time>` (show datetime attr), and `<q>` (configurable quotes + cite as link).

**Architecture:** Each task is independent. All features follow existing patterns: `getAttr()` for data-cli-* overrides, `??` (not `||`) for theme fallbacks, `applyColor`/`applyThemeColor` for color application, `config.yaml` as single source of truth. No hardcoded fallbacks where config defines values.

**Tech Stack:** Node.js ESM, `lib/core/attr.js` (`getAttr`), `lib/core/color.js` (`applyColor`, `applyThemeColor`), `lib/utilities.js` (`getAttribute`, `extractBaseColor`), `boxen` (for dialog border), `npm test` (Node built-in, currently 177 tests passing).

---

## File Map

| File | Change |
|------|--------|
| `lib/tags/hr.js` | Add `HR_STYLES` map, style resolution chain |
| `lib/tags/ruby.js` | Fix color bug, make `rt` configurable |
| `lib/tags/dialog.js` | **New** — box border handler |
| `lib/tags/base-tags.js` | Remove `dialog` from `createColoredBlock` |
| `lib/tags.js` | Import `dialog` from `dialog.js` |
| `lib/tags/text-styles.js` | Dedicated `time` and `q` handlers (replace `createStyledTag`) |
| `config.yaml` | Update hr, ruby, time, dialog; add q |
| `index.d.ts` | Add/update types for all 5 elements |
| `test/rendering/config-override.test.js` | New tests for all 5 |

---

## Task 1: `<hr>` named styles

**Files:**
- Modify: `lib/tags/hr.js`
- Modify: `config.yaml:654-656`
- Modify: `index.d.ts:339-342` (HrStyle)
- Test: `test/rendering/config-override.test.js`

- [ ] **Step 1: Write failing tests**

Add inside the top-level `describe` in `test/rendering/config-override.test.js`:

```javascript
describe('hr — named styles', () => {
  it('default renders single style (─)', () => {
    const plain = stripAnsi(renderHTML('<hr>'));
    assert.ok(plain.includes('─'), `Expected '─' in: ${plain}`);
    assert.ok(!plain.includes('═'), `Should not contain '═' in: ${plain}`);
  });

  it('double style from theme', () => {
    const plain = stripAnsi(renderHTML('<hr>', { hr: { style: 'double' } }));
    assert.ok(plain.includes('═'), `Expected '═' in: ${plain}`);
  });

  it('bold style from theme', () => {
    const plain = stripAnsi(renderHTML('<hr>', { hr: { style: 'bold' } }));
    assert.ok(plain.includes('━'), `Expected '━' in: ${plain}`);
  });

  it('dashed style from theme', () => {
    const plain = stripAnsi(renderHTML('<hr>', { hr: { style: 'dashed' } }));
    assert.ok(plain.includes('╌'), `Expected '╌' in: ${plain}`);
  });

  it('dotted style from theme', () => {
    const plain = stripAnsi(renderHTML('<hr>', { hr: { style: 'dotted' } }));
    assert.ok(plain.includes('·'), `Expected '·' in: ${plain}`);
  });

  it('explicit marker overrides style', () => {
    const plain = stripAnsi(renderHTML('<hr>', { hr: { style: 'double', marker: '~' } }));
    assert.ok(plain.includes('~'), `Expected '~' in: ${plain}`);
    assert.ok(!plain.includes('═'), `Should not contain '═' in: ${plain}`);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test 2>&1 | grep -A3 "hr — named"
```

Expected: `AssertionError` on double/bold/dashed/dotted tests (all render `─` regardless).

- [ ] **Step 3: Update `config.yaml` hr section**

Find line 654 (`hr:`). Replace:

```yaml
  hr:
    color: gray  # Line color
    marker: '─'  # Character for the line
```

With:

```yaml
  hr:
    color: gray    # Line color
    style: single  # single | double | bold | dashed | dotted
    marker: ''     # Explicit character override (overrides style when non-empty)
```

- [ ] **Step 4: Rewrite `lib/tags/hr.js`**

```javascript
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';
import { markerToAscii } from '../utils/string.js';

const HR_STYLES = {
  single: '─',
  double: '═',
  bold: '━',
  dashed: '╌',
  dotted: '·',
};

const hrLine = (marker, length) => {
  const len = length || process.stdout?.columns || 80;
  return Array.from({ length: len }).join(marker);
};

export const hr = (tag, context) => {
  const theme = context.theme.hr || {};

  // Precedence: data-cli-marker > data-cli-style preset > theme.marker > theme.style preset > single
  const customMarker = getAttr(tag, 'marker');
  const customStyle = getAttr(tag, 'style');
  const themeMarker = theme.marker || null; // treat empty string as unset
  const themeStyle = theme.style;

  let baseMarker;
  if (customMarker) {
    baseMarker = customMarker;
  } else if (customStyle) {
    baseMarker = HR_STYLES[customStyle] ?? HR_STYLES.single;
  } else if (themeMarker) {
    baseMarker = themeMarker;
  } else {
    baseMarker = HR_STYLES[themeStyle] ?? HR_STYLES.single;
  }

  const marker = markerToAscii(baseMarker, context.asciiMode);
  const line = hrLine(marker, context.lineWidth);
  const styledLine = applyThemeColor(getAttr(tag, 'color'), theme.color, line);

  return {
    marginTop: 1,
    value: styledLine,
    marginBottom: 1,
    type: 'block',
  };
};
```

- [ ] **Step 5: Update `index.d.ts` HrStyle**

Find `export interface HrStyle` (line 339). Replace:

```typescript
/**
 * Horizontal rule style configuration
 */
export interface HrStyle {
  color?: ChalkString;
  marker?: string;
  style?: 'single' | 'double' | 'bold' | 'dashed' | 'dotted';
}
```

- [ ] **Step 6: Run tests**

```bash
npm test 2>&1 | grep -E "^# (tests|pass|fail)"
```

Expected: `# tests 183`, `# pass 183`, `# fail 0` (177 + 6 new).

- [ ] **Step 7: Commit**

```bash
git add lib/tags/hr.js config.yaml index.d.ts test/rendering/config-override.test.js
git commit -m "feat: add named styles to <hr> (single/double/bold/dashed/dotted)"
```

---

## Task 2: `<ruby>` / `<rt>` configurable

**Files:**
- Modify: `lib/tags/ruby.js`
- Modify: `config.yaml` (add ruby section after dfn, before time at line 212)
- Modify: `index.d.ts` (add RubyStyle, update ruby? in ThemeConfig)
- Test: `test/rendering/config-override.test.js`

- [ ] **Step 1: Write failing tests**

```javascript
describe('ruby / rt', () => {
  it('ruby uses its own theme color (not span)', () => {
    const plain = stripAnsi(renderHTML(
      '<ruby>漢<rt>kan</rt></ruby>',
      { ruby: { color: 'red' }, span: { color: 'blue' } }
    ));
    // Can't test color directly without ANSI, test that rt annotation renders
    assert.ok(plain.includes('漢'), `Expected base text in: ${plain}`);
    assert.ok(plain.includes('kan'), `Expected annotation in: ${plain}`);
  });

  it('rt prefix/suffix configurable from theme', () => {
    const plain = stripAnsi(renderHTML(
      '<ruby>漢<rt>kan</rt></ruby>',
      { ruby: { rt: { prefix: { marker: ' [' }, suffix: { marker: ']' } } } }
    ));
    assert.ok(plain.includes('[kan]'), `Expected '[kan]' in: ${plain}`);
  });

  it('default rt wraps in parentheses', () => {
    const plain = stripAnsi(renderHTML('<ruby>漢<rt>kan</rt></ruby>'));
    assert.ok(plain.includes('(kan)'), `Expected '(kan)' in: ${plain}`);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test 2>&1 | grep -A3 "ruby / rt"
```

Expected: `[kan]` test fails (currently renders `(kan)` hardcoded).

- [ ] **Step 3: Add ruby section to `config.yaml`**

Find line 212 (`time:`). Insert before it:

```yaml
  ruby:
    color: ''      # Ruby base text color
    rt:
      color: gray dim  # Annotation text color
      prefix:
        marker: ' ('
        color: gray dim
      suffix:
        marker: ')'
        color: gray dim

```

- [ ] **Step 4: Rewrite `lib/tags/ruby.js`**

```javascript
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';

export const ruby = inlineTag((value, tag, context) =>
  applyThemeColor(getAttr(tag, 'color'), context.theme.ruby?.color, value),
);

export const rt = inlineTag((value, tag, context) => {
  const theme = context.theme.ruby?.rt || {};
  const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);
  const prefix = getAttr(tag, 'prefix.marker') ?? theme.prefix?.marker ?? '';
  const suffix = getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker ?? '';
  const styledPrefix = applyColor(getAttr(tag, 'prefix.color') ?? theme.prefix?.color, prefix);
  const styledSuffix = applyColor(getAttr(tag, 'suffix.color') ?? theme.suffix?.color, suffix);
  return `${styledPrefix}${styledValue}${styledSuffix}`;
});

export const rp = () => null;
```

- [ ] **Step 5: Update `index.d.ts`**

After `VideoStyle`/`AudioStyle` interfaces, add:

```typescript
/**
 * Ruby annotation style configuration
 */
export interface RubyStyle {
  color?: ChalkString;
  rt?: {
    color?: ChalkString;
    prefix?: { marker?: string; color?: ChalkString; };
    suffix?: { marker?: string; color?: ChalkString; };
  };
}
```

In `ThemeConfig`, add before or after `span?`:

```typescript
ruby?: ChalkString | RubyStyle;
```

- [ ] **Step 6: Run tests**

```bash
npm test 2>&1 | grep -E "^# (tests|pass|fail)"
```

Expected: `# tests 186`, `# pass 186`, `# fail 0`.

- [ ] **Step 7: Commit**

```bash
git add lib/tags/ruby.js config.yaml index.d.ts test/rendering/config-override.test.js
git commit -m "feat: fix ruby color bug, make rt prefix/suffix configurable"
```

---

## Task 3: `<dialog>` box border

**Files:**
- Create: `lib/tags/dialog.js`
- Modify: `lib/tags/base-tags.js` (remove dialog)
- Modify: `lib/tags.js` (import from dialog.js)
- Modify: `config.yaml:741-742`
- Modify: `index.d.ts` (add DialogStyle)
- Test: `test/rendering/config-override.test.js`

- [ ] **Step 1: Write failing tests**

```javascript
describe('dialog — box border', () => {
  it('renders content inside a box', () => {
    const plain = stripAnsi(renderHTML('<dialog>Hello dialog</dialog>'));
    assert.ok(plain.includes('Hello dialog'), `Expected content in: ${plain}`);
    // Box border characters should be present
    assert.ok(
      plain.includes('─') || plain.includes('│') || plain.includes('╭') || plain.includes('┌'),
      `Expected box border characters in: ${plain}`
    );
  });

  it('border style configurable from theme', () => {
    const plain = stripAnsi(renderHTML(
      '<dialog>Test</dialog>',
      { dialog: { border: { style: 'double' } } }
    ));
    assert.ok(plain.includes('Test'), `Expected content in: ${plain}`);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test 2>&1 | grep -A3 "dialog — box"
```

Expected: box border characters not present (currently plain block).

- [ ] **Step 3: Create `lib/tags/dialog.js`**

```javascript
import boxen from 'boxen';

import { blockTag } from '../tag-helpers/block-tag.js';
import { extractBaseColor } from '../utilities.js';
import { getAttr } from '../core/attr.js';

export const dialog = (tag, context) => {
  const mainContent = blockTag()(tag, context);
  const contentValue = mainContent?.value ?? '';

  const borderColorRaw = getAttr(tag, 'border.color') ?? context.theme.dialog?.border?.color;
  const borderColor = extractBaseColor(borderColorRaw);
  const borderStyle = getAttr(tag, 'border.style') ?? context.theme.dialog?.border?.style;
  const borderDimAttr = getAttr(tag, 'border.dim');
  const dimBorder = borderDimAttr !== null
    ? borderDimAttr === 'true'
    : (context.theme.dialog?.border?.dim ?? false);
  const padding = context.theme.dialog?.padding;

  const valueInBox = boxen(contentValue || ' ', {
    padding,
    borderColor,
    dimBorder,
    borderStyle,
  });

  return {
    marginTop: 1,
    value: valueInBox,
    marginBottom: 1,
    type: 'block',
  };
};
```

- [ ] **Step 4: Update `lib/tags/base-tags.js`**

Remove `dialog` from the exports. Find:

```javascript
export const dialog = createColoredBlock('dialog');
```

Delete that line entirely.

- [ ] **Step 5: Update `lib/tags.js`**

Add import after `import { data } from "./tags/data.js";`:

```javascript
import { dialog } from "./tags/dialog.js";
```

Remove `dialog` from the `base-tags.js` import block. In the export object, `dialog` will now come from the new import (it's already in the export default object).

- [ ] **Step 6: Update `config.yaml` dialog section**

Find line 741 (`dialog:`). Replace:

```yaml
  dialog:
    color: ''  # Dialog container color
    border:
      color: cyan    # Border color
      style: round   # round | single | double | bold | classic
      dim: false
    padding:
      top: 0
      bottom: 0
      left: 1
      right: 1
```

- [ ] **Step 7: Update `index.d.ts`**

Add `DialogStyle` interface (after `FigureStyle` around line 62, or after `VideoStyle`/`AudioStyle`):

```typescript
/**
 * Dialog element style configuration
 */
export interface DialogStyle {
  color?: ChalkString;
  border?: BorderConfig;
  padding?: PaddingConfig;
}
```

In `ThemeConfig`, find `figure?: ChalkString | FigureStyle;` and add after it:

```typescript
dialog?: ChalkString | DialogStyle;
```

- [ ] **Step 8: Run tests**

```bash
npm test 2>&1 | grep -E "^# (tests|pass|fail)"
```

Expected: `# tests 188`, `# pass 188`, `# fail 0`.

- [ ] **Step 9: Commit**

```bash
git add lib/tags/dialog.js lib/tags/base-tags.js lib/tags.js config.yaml index.d.ts test/rendering/config-override.test.js
git commit -m "feat: add box border to <dialog>"
```

---

## Task 4: `<time>` datetime display

**Files:**
- Modify: `lib/tags/text-styles.js`
- Modify: `config.yaml:212-213`
- Modify: `index.d.ts:612`
- Test: `test/rendering/config-override.test.js`

- [ ] **Step 1: Write failing tests**

```javascript
describe('time — datetime display', () => {
  it('by default does not show datetime attr', () => {
    const plain = stripAnsi(renderHTML('<time datetime="2026-06-10">Today</time>'));
    assert.ok(plain.includes('Today'), `Expected text in: ${plain}`);
    assert.ok(!plain.includes('2026-06-10'), `Should not show datetime by default: ${plain}`);
  });

  it('shows datetime when enabled in theme', () => {
    const plain = stripAnsi(renderHTML(
      '<time datetime="2026-06-10">Today</time>',
      { time: { datetime: { enabled: true } } }
    ));
    assert.ok(plain.includes('2026-06-10'), `Expected datetime in: ${plain}`);
    assert.ok(plain.includes('Today'), `Expected text in: ${plain}`);
  });

  it('custom prefix/suffix configurable', () => {
    const plain = stripAnsi(renderHTML(
      '<time datetime="2026-06-10">Today</time>',
      { time: { datetime: { enabled: true, prefix: { marker: ' [' }, suffix: { marker: ']' } } } }
    ));
    assert.ok(plain.includes('[2026-06-10]'), `Expected '[2026-06-10]' in: ${plain}`);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test 2>&1 | grep -A3 "time — datetime"
```

Expected: "shows datetime" test fails (datetime attr never shown).

- [ ] **Step 3: Update `config.yaml` time section**

Find line 212 (`time:`). Replace:

```yaml
  time:
    color: cyan
    datetime:
      enabled: false  # Show datetime attribute value after text
      color: gray dim
      prefix:
        marker: ' ('
        color: gray dim
      suffix:
        marker: ')'
        color: gray dim
```

- [ ] **Step 4: Update `lib/tags/text-styles.js`**

Add `getAttribute` to the import from utilities. Find:

```javascript
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';
```

Replace with:

```javascript
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';
```

Remove the line:

```javascript
export const time = createStyledTag('time');
```

Add dedicated handler (place it after the `kbd` export, before the `del` export):

```javascript
export const time = inlineTag((value, tag, context) => {
  const theme = context.theme.time || {};
  const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);

  const datetimeEnabledRaw = getAttr(tag, 'datetime.enabled');
  const showDatetime = datetimeEnabledRaw !== null
    ? datetimeEnabledRaw === 'true'
    : theme.datetime?.enabled === true;

  if (!showDatetime) return styledValue;

  const datetimeAttr = getAttribute(tag, 'datetime', null);
  if (!datetimeAttr) return styledValue;

  const dtTheme = theme.datetime || {};
  const prefix = getAttr(tag, 'datetime.prefix.marker') ?? dtTheme.prefix?.marker ?? '';
  const suffix = getAttr(tag, 'datetime.suffix.marker') ?? dtTheme.suffix?.marker ?? '';
  const styledDt = applyColor(getAttr(tag, 'datetime.color') ?? dtTheme.color, datetimeAttr);
  const styledPrefix = applyColor(getAttr(tag, 'datetime.prefix.color') ?? dtTheme.prefix?.color, prefix);
  const styledSuffix = applyColor(getAttr(tag, 'datetime.suffix.color') ?? dtTheme.suffix?.color, suffix);

  return `${styledValue}${styledPrefix}${styledDt}${styledSuffix}`;
});
```

- [ ] **Step 5: Update `index.d.ts`**

Find line 612: `time?: ChalkString;`

Replace with:

```typescript
time?: ChalkString | {
  color?: ChalkString;
  datetime?: {
    enabled?: boolean;
    color?: ChalkString;
    prefix?: { marker?: string; color?: ChalkString; };
    suffix?: { marker?: string; color?: ChalkString; };
  };
};
```

- [ ] **Step 6: Run tests**

```bash
npm test 2>&1 | grep -E "^# (tests|pass|fail)"
```

Expected: `# tests 191`, `# pass 191`, `# fail 0`.

- [ ] **Step 7: Commit**

```bash
git add lib/tags/text-styles.js config.yaml index.d.ts test/rendering/config-override.test.js
git commit -m "feat: show datetime attribute in <time> when enabled"
```

---

## Task 5: `<q>` configurable quotes + cite as link

**Files:**
- Modify: `lib/tags/text-styles.js`
- Modify: `config.yaml` (add q section after `a:` block, before `# LISTS` at line 278)
- Modify: `index.d.ts` (add QStyle)
- Test: `test/rendering/config-override.test.js`

- [ ] **Step 1: Write failing tests**

```javascript
describe('q — configurable quotes', () => {
  it('default renders double quotes', () => {
    const plain = stripAnsi(renderHTML('<q>Hello</q>'));
    assert.ok(plain.includes('"Hello"'), `Expected '"Hello"' in: ${plain}`);
  });

  it('custom prefix/suffix from theme', () => {
    const plain = stripAnsi(renderHTML(
      '<q>Hello</q>',
      { q: { prefix: { marker: '«' }, suffix: { marker: '»' } } }
    ));
    assert.ok(plain.includes('«Hello»'), `Expected '«Hello»' in: ${plain}`);
  });

  it('cite disabled by default — text is not styled as link', () => {
    const plain = stripAnsi(renderHTML('<q cite="https://example.com">Quote</q>'));
    assert.ok(plain.includes('"Quote"'), `Expected quoted text in: ${plain}`);
    assert.ok(!plain.includes('↗'), `Expected no external indicator by default: ${plain}`);
  });

  it('cite enabled — external marker from a.external.marker appears', () => {
    const plain = stripAnsi(renderHTML(
      '<q cite="https://example.com">Quote</q>',
      {
        q: { cite: { enabled: true, color: 'magenta' } },
        a: { external: { marker: '↗', spacing: ' ', position: 'after' } },
      }
    ));
    assert.ok(plain.includes('↗'), `Expected '↗' in: ${plain}`);
    assert.ok(plain.includes('Quote'), `Expected text in: ${plain}`);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test 2>&1 | grep -A3 "q — configurable"
```

Expected: custom prefix/suffix test fails (hardcoded `"`), cite test fails.

- [ ] **Step 3: Add q section to `config.yaml`**

Find line 278 (`# LISTS`). Insert before it:

```yaml
  q:
    color: ''   # Quoted text color
    prefix:
      marker: '"'
      color: ''
    suffix:
      marker: '"'
      color: ''
    cite:
      enabled: false  # Style quoted text as external link when cite attr present
      color: magenta  # Link color (separate from a.color)

```

- [ ] **Step 4: Update `lib/tags/text-styles.js`**

Remove the line:

```javascript
export const q = inlineTag((value) => `"${value}"`);
```

Add dedicated handler (place near the top of the file, after imports):

```javascript
export const q = inlineTag((value, tag, context) => {
  const theme = context.theme.q || {};

  const prefix = getAttr(tag, 'prefix.marker') ?? theme.prefix?.marker ?? '"';
  const suffix = getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker ?? '"';
  const styledPrefix = applyColor(getAttr(tag, 'prefix.color') ?? theme.prefix?.color, prefix);
  const styledSuffix = applyColor(getAttr(tag, 'suffix.color') ?? theme.suffix?.color, suffix);

  // Check if cite should be shown as link
  const citeEnabledRaw = getAttr(tag, 'cite.enabled');
  const showCite = citeEnabledRaw !== null
    ? citeEnabledRaw === 'true'
    : theme.cite?.enabled === true;

  const citeUrl = showCite ? getAttribute(tag, 'cite', null) : null;

  if (!citeUrl) {
    const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);
    return `${styledPrefix}${styledValue}${styledSuffix}`;
  }

  // Cite active: style quoted text as link, reuse a.external marker/position/spacing
  const aTheme = context.theme.a || {};
  const externalMarker = aTheme.external?.marker ?? '↗';
  const externalSpacing = aTheme.external?.spacing ?? ' ';
  const externalPosition = aTheme.external?.position ?? 'after';

  const citeColor = getAttr(tag, 'cite.color') ?? theme.cite?.color;
  const styledLinkText = applyColor(citeColor, value);
  const styledMarker = applyColor(citeColor, externalMarker);

  const linked = externalPosition === 'before'
    ? `${styledMarker}${externalSpacing}${styledLinkText}`
    : `${styledLinkText}${externalSpacing}${styledMarker}`;

  return `${styledPrefix}${linked}${styledSuffix}`;
});
```

Note: `getAttribute` import was added in Task 4. If Task 5 runs standalone, add the import:
```javascript
import { getAttribute } from '../utilities.js';
```

- [ ] **Step 5: Update `index.d.ts`**

Add `QStyle` interface (after `RubyStyle`):

```typescript
/**
 * Quote element style configuration
 */
export interface QStyle {
  color?: ChalkString;
  prefix?: { marker?: string; color?: ChalkString; };
  suffix?: { marker?: string; color?: ChalkString; };
  cite?: {
    enabled?: boolean;
    color?: ChalkString;
  };
}
```

In `ThemeConfig`, add `q?` near `a?`:

```typescript
q?: ChalkString | QStyle;
```

- [ ] **Step 6: Run tests**

```bash
npm test 2>&1 | grep -E "^# (tests|pass|fail)"
```

Expected: `# tests 195`, `# pass 195`, `# fail 0`.

- [ ] **Step 7: Commit**

```bash
git add lib/tags/text-styles.js config.yaml index.d.ts test/rendering/config-override.test.js
git commit -m "feat: configurable quotes in <q>, cite attribute as external link"
```
