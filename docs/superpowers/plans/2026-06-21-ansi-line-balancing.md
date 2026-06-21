# ANSI Line Balancing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fragile regex background-bleed hack in `lib/wrap-line-width.js` with a proper, fully-tested SGR state-machine module that closes/reopens all stateful ANSI attributes at line boundaries.

**Architecture:** A pure SGR state machine (`lib/ansi/sgr-state.js`) tracks which stateful attributes are open. A `balanceLines()` function (`lib/ansi/balance-lines.js`) uses it to make each line of a multi-line ANSI string self-balanced: carry open attributes onto the next line, close them with a single reset before each newline. `wrap-line-width.js` becomes a thin wrapper: `balanceLines(wrapAnsi(...))`. No span rewrite; the strings-with-ANSI architecture stays.

**Tech Stack:** Node.js ESM, `wrap-ansi`, Node built-in test runner (`node:test` + `node:assert`).

## Global Constraints

- ESM modules only (`import`/`export`). Node `>=18.0.0`.
- ESC must be written as `'\u001B'` — never an invisible literal control char.
- Tests use Node's built-in runner: `import { describe, it } from 'node:test';` + `import assert from 'node:assert';`. Run with `FORCE_COLOR=1 node --test`.
- Test files mirror lib paths: `lib/ansi/x.js` → `test/ansi/x.test.js`, importing from `../../lib/...`.
- Only *stateful* SGR attributes are tracked: intensity (1/2/22), italic (3/23), underline (4/24), inverse (7/27), strike (9/29), foreground (30–37/90–97/38;5/38;2/39), background (40–47/100–107/48;5/48;2/49), and reset (0 / empty params). Unknown codes pass through untracked.
- No theme defaults, tag handler, or public API may change.
- Do NOT run `git` commands without explicit user permission; the commit steps below are written for the executor to run only when the user has authorized commits.

---

### Task 1: SGR state machine

**Files:**
- Create: `lib/ansi/sgr-state.js`
- Test: `test/ansi/sgr-state.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `createSgrState()` → `{ apply(params: string): void, openCodes(): string, hasOpen(): boolean }`.
  - `apply(params)` — feed the parameter substring of one SGR sequence (e.g. `'1;48;5;200'`, or `''` for a bare reset). Mutates internal state.
  - `openCodes()` — returns an ANSI string (e.g. `'\u001B[1;48;5;200m'`) that re-establishes every currently-open attribute, or `''` if none.
  - `hasOpen()` — `true` if any stateful attribute is currently open.

- [ ] **Step 1: Write the failing test**

Create `test/ansi/sgr-state.test.js`:

```js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createSgrState } from '../../lib/ansi/sgr-state.js';

describe('createSgrState', () => {
  it('starts with nothing open', () => {
    const s = createSgrState();
    assert.strictEqual(s.hasOpen(), false);
    assert.strictEqual(s.openCodes(), '');
  });

  it('tracks a basic background', () => {
    const s = createSgrState();
    s.apply('43');
    assert.strictEqual(s.hasOpen(), true);
    assert.strictEqual(s.openCodes(), '\u001B[43m');
  });

  it('tracks a 256-color background (48;5;n)', () => {
    const s = createSgrState();
    s.apply('48;5;200');
    assert.strictEqual(s.openCodes(), '\u001B[48;5;200m');
  });

  it('tracks a truecolor background (48;2;r;g;b)', () => {
    const s = createSgrState();
    s.apply('48;2;10;20;30');
    assert.strictEqual(s.openCodes(), '\u001B[48;2;10;20;30m');
  });

  it('combines multiple attributes in one openCodes call', () => {
    const s = createSgrState();
    s.apply('1;4;48;5;200');
    assert.strictEqual(s.openCodes(), '\u001B[1;4;48;5;200m');
  });

  it('clears everything on reset (0)', () => {
    const s = createSgrState();
    s.apply('1;43');
    s.apply('0');
    assert.strictEqual(s.hasOpen(), false);
    assert.strictEqual(s.openCodes(), '');
  });

  it('treats empty params as a reset', () => {
    const s = createSgrState();
    s.apply('43');
    s.apply('');
    assert.strictEqual(s.hasOpen(), false);
  });

  it('honors selective closers (49 closes bg, keeps bold)', () => {
    const s = createSgrState();
    s.apply('1;43');
    s.apply('49');
    assert.strictEqual(s.openCodes(), '\u001B[1m');
  });

  it('foreground 39 closes fg only', () => {
    const s = createSgrState();
    s.apply('31;43');
    s.apply('39');
    assert.strictEqual(s.openCodes(), '\u001B[43m');
  });

  it('ignores unknown codes without corrupting state', () => {
    const s = createSgrState();
    s.apply('43');
    s.apply('53'); // overline — not tracked
    assert.strictEqual(s.openCodes(), '\u001B[43m');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `FORCE_COLOR=1 node --test test/ansi/sgr-state.test.js`
Expected: FAIL — `Cannot find module '.../lib/ansi/sgr-state.js'`.

- [ ] **Step 3: Write minimal implementation**

Create `lib/ansi/sgr-state.js`:

```js
const ESC = '\u001B';

// A small state machine over "stateful" SGR attributes — the ones that persist
// across characters (and therefore across a newline) and must be reopened on the
// next line. Unknown codes are intentionally ignored so they cannot corrupt the
// balanced output.
export const createSgrState = () => {
  const state = {
    intensity: null, // '1' bold | '2' dim | null
    italic: false,
    underline: false,
    inverse: false,
    strike: false,
    fg: null, // e.g. '31' | '38;5;200' | '38;2;1;2;3'
    bg: null, // e.g. '43' | '48;5;200' | '48;2;1;2;3'
  };

  const clear = () => {
    state.intensity = null;
    state.italic = false;
    state.underline = false;
    state.inverse = false;
    state.strike = false;
    state.fg = null;
    state.bg = null;
  };

  const apply = (params) => {
    const codes = params === '' ? ['0'] : params.split(';');
    for (let index = 0; index < codes.length; index += 1) {
      const number = Number.parseInt(codes[index], 10);

      if (number === 0) {
        clear();
      } else if (number === 1 || number === 2) {
        state.intensity = String(number);
      } else if (number === 22) {
        state.intensity = null;
      } else if (number === 3) {
        state.italic = true;
      } else if (number === 23) {
        state.italic = false;
      } else if (number === 4) {
        state.underline = true;
      } else if (number === 24) {
        state.underline = false;
      } else if (number === 7) {
        state.inverse = true;
      } else if (number === 27) {
        state.inverse = false;
      } else if (number === 9) {
        state.strike = true;
      } else if (number === 29) {
        state.strike = false;
      } else if (number === 39) {
        state.fg = null;
      } else if (number === 49) {
        state.bg = null;
      } else if ((number >= 30 && number <= 37) || (number >= 90 && number <= 97)) {
        state.fg = String(number);
      } else if ((number >= 40 && number <= 47) || (number >= 100 && number <= 107)) {
        state.bg = String(number);
      } else if (number === 38 || number === 48) {
        const target = number === 38 ? 'fg' : 'bg';
        if (codes[index + 1] === '5') {
          state[target] = `${number};5;${codes[index + 2]}`;
          index += 2;
        } else if (codes[index + 1] === '2') {
          state[target] = `${number};2;${codes[index + 2]};${codes[index + 3]};${codes[index + 4]}`;
          index += 4;
        }
      }
      // unknown codes: ignored on purpose
    }
  };

  const hasOpen = () =>
    Boolean(
      state.intensity ||
        state.italic ||
        state.underline ||
        state.inverse ||
        state.strike ||
        state.fg ||
        state.bg,
    );

  const openCodes = () => {
    const parts = [];
    if (state.intensity) parts.push(state.intensity);
    if (state.italic) parts.push('3');
    if (state.underline) parts.push('4');
    if (state.inverse) parts.push('7');
    if (state.strike) parts.push('9');
    if (state.fg) parts.push(state.fg);
    if (state.bg) parts.push(state.bg);
    return parts.length === 0 ? '' : `${ESC}[${parts.join(';')}m`;
  };

  return { apply, openCodes, hasOpen };
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `FORCE_COLOR=1 node --test test/ansi/sgr-state.test.js`
Expected: PASS (all 10 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/ansi/sgr-state.js test/ansi/sgr-state.test.js
git commit -m "feat(ansi): add SGR state machine for stateful attributes"
```

---

### Task 2: balanceLines — close/reopen attributes at line boundaries

**Files:**
- Create: `lib/ansi/balance-lines.js`
- Test: `test/ansi/balance-lines.test.js`

**Interfaces:**
- Consumes: `createSgrState()` from `lib/ansi/sgr-state.js` (Task 1).
- Produces: `balanceLines(text: string): string` (default export). Returns the input unchanged when it has no newline or no ESC; otherwise returns a string where every line carries the previous line's open attributes at its start and closes any still-open attribute with `\u001B[0m` before each newline.

- [ ] **Step 1: Write the failing test**

Create `test/ansi/balance-lines.test.js`:

```js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import balanceLines from '../../lib/ansi/balance-lines.js';

describe('balanceLines', () => {
  it('returns plain text unchanged (no ESC)', () => {
    assert.strictEqual(balanceLines('a\nb'), 'a\nb');
  });

  it('returns single-line ANSI unchanged (no newline)', () => {
    const input = '\u001B[43myellow\u001B[0m';
    assert.strictEqual(balanceLines(input), input);
  });

  it('closes a background before a newline and reopens after', () => {
    // bg opened on line 1, never closed, content continues on line 2
    const input = '\u001B[43mline one\nline two';
    const output = balanceLines(input);
    // line one gets a reset before the newline
    assert.ok(output.split('\n')[0].endsWith('\u001B[0m'));
    // line two gets the background reopened at its start
    assert.ok(output.split('\n')[1].startsWith('\u001B[43m'));
  });

  it('does not append a reset when nothing is open at end of line', () => {
    const input = '\u001B[43mone\u001B[0m\ntwo';
    const output = balanceLines(input);
    assert.strictEqual(output, '\u001B[43mone\u001B[0m\ntwo');
  });

  it('reopens a truecolor background across a wrap', () => {
    const input = '\u001B[48;2;10;20;30mone\ntwo';
    const output = balanceLines(input);
    assert.ok(output.split('\n')[1].startsWith('\u001B[48;2;10;20;30m'));
  });

  it('handles an empty line between content lines', () => {
    const input = '\u001B[43mone\n\ntwo';
    const lines = balanceLines(input).split('\n');
    assert.ok(lines[0].endsWith('\u001B[0m'));
    assert.ok(lines[1].startsWith('\u001B[43m')); // reopened
    assert.ok(lines[1].endsWith('\u001B[0m'));     // still open -> closed again
    assert.ok(lines[2].startsWith('\u001B[43m'));
  });

  it('carries bold across a wrap (decoration bleed)', () => {
    const input = '\u001B[1mbold one\ntwo';
    const output = balanceLines(input);
    assert.ok(output.split('\n')[1].startsWith('\u001B[1m'));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `FORCE_COLOR=1 node --test test/ansi/balance-lines.test.js`
Expected: FAIL — `Cannot find module '.../lib/ansi/balance-lines.js'`.

- [ ] **Step 3: Write minimal implementation**

Create `lib/ansi/balance-lines.js`:

```js
import { createSgrState } from './sgr-state.js';

const ESC = '\u001B';
const RESET = `${ESC}[0m`;
// eslint-disable-next-line no-control-regex
const SGR = /\u001B\[([\d;]*)m/g;

// wrap-ansi resets the foreground at every wrap point but keeps the background
// (and other stateful attributes) open until the end of the string. A newline
// emitted while an attribute is active makes the terminal paint it to the right
// edge of the line, and any marker/indentation added afterward inherits it.
// balanceLines makes every line self-contained: it closes whatever is still open
// before each newline and reopens it at the start of the next line's content.
const balanceLines = (text) => {
  if (typeof text !== 'string' || !text.includes('\n') || !text.includes(ESC)) {
    return text;
  }

  const state = createSgrState();

  return text
    .split('\n')
    .map((line) => {
      const prefix = state.openCodes(); // attributes carried from the previous line

      SGR.lastIndex = 0;
      let match;
      while ((match = SGR.exec(line)) !== null) {
        state.apply(match[1]);
      }

      const suffix = state.hasOpen() ? RESET : '';
      return `${prefix}${line}${suffix}`;
    })
    .join('\n');
};

export default balanceLines;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `FORCE_COLOR=1 node --test test/ansi/balance-lines.test.js`
Expected: PASS (all 7 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/ansi/balance-lines.js test/ansi/balance-lines.test.js
git commit -m "feat(ansi): add balanceLines to close/reopen styles at line breaks"
```

---

### Task 3: Rewire wrap-line-width to use balanceLines; delete the hack

**Files:**
- Modify: `lib/wrap-line-width.js` (replace entire file)
- Test: `test/ansi/wrap-line-width.test.js` (create)

**Interfaces:**
- Consumes: `balanceLines` from `lib/ansi/balance-lines.js` (Task 2); `wrap-ansi`.
- Produces: default export `wrapLineWidth(text: string, context: { lineWidth: number, pre?: boolean }): string` — unchanged signature.

- [ ] **Step 1: Write the failing test**

Create `test/ansi/wrap-line-width.test.js`:

```js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import wrapLineWidth from '../../lib/wrap-line-width.js';

describe('wrapLineWidth', () => {
  it('wraps plain text to the given width', () => {
    const out = wrapLineWidth('one two three four five', { lineWidth: 8 });
    assert.ok(out.includes('\n'));
    for (const line of out.split('\n')) {
      assert.ok(line.length <= 8 || !line.includes(' '));
    }
  });

  it('closes a background before each wrap-induced newline', () => {
    // long backgrounded text forces a wrap; no reset present in the input
    const input = `\u001B[43m${'word '.repeat(8).trim()}`;
    const out = wrapLineWidth(input, { lineWidth: 12 });
    const lines = out.split('\n');
    assert.ok(lines.length > 1, 'expected the text to wrap');
    // every line except possibly the last closes the still-open background
    for (let i = 0; i < lines.length - 1; i += 1) {
      assert.ok(lines[i].endsWith('\u001B[0m'), `line ${i} should end with reset`);
    }
    // continuation lines reopen the background
    assert.ok(lines[1].startsWith('\u001B[43m'));
  });

  it('does not emit the invisible literal ESC source pattern', async () => {
    const { readFile } = await import('node:fs/promises');
    const { fileURLToPath } = await import('node:url');
    const src = await readFile(
      fileURLToPath(new URL('../../lib/wrap-line-width.js', import.meta.url)),
      'utf8',
    );
    // The old hack stored a raw control char in `const ESC = '<char>'`.
    // The refactor must not contain a literal ESC byte in source.
    assert.ok(!src.includes('\u001B'), 'source must not contain a literal ESC byte');
    assert.ok(src.includes('balance-lines'), 'should delegate to balanceLines');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `FORCE_COLOR=1 node --test test/ansi/wrap-line-width.test.js`
Expected: FAIL — the third assertion fails because the current `lib/wrap-line-width.js` contains a literal ESC byte and no `balance-lines` import.

- [ ] **Step 3: Write minimal implementation**

Replace the entire contents of `lib/wrap-line-width.js` with:

```js
import wrapAnsi from 'wrap-ansi';
import balanceLines from './ansi/balance-lines.js';

const wrapLineWidth = (text, context) =>
  balanceLines(wrapAnsi(text, context.lineWidth, { trim: !context.pre }));

export default wrapLineWidth;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `FORCE_COLOR=1 node --test test/ansi/wrap-line-width.test.js`
Expected: PASS (all 3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/wrap-line-width.js test/ansi/wrap-line-width.test.js
git commit -m "refactor(ansi): replace background-bleed regex hack with balanceLines"
```

---

### Task 4: Integration regression — no bleed in wrapped blockquote/mark, full suite green

**Files:**
- Test: `test/ansi/bleed-integration.test.js` (create)

**Interfaces:**
- Consumes: `renderHTML` from `index.js`.
- Produces: nothing (regression coverage only).

- [ ] **Step 1: Confirm renderHTML signature**

Run: `node -e "import('./index.js').then(m => console.log(Object.keys(m)))"`
Expected: output includes `renderHTML` (and `renderMarkdown`). If the export name differs, use the actual name in Step 2.

- [ ] **Step 2: Write the failing test**

Create `test/ansi/bleed-integration.test.js`:

```js
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { renderHTML } from '../../index.js';

// A line "bleeds" if a background is left open when the newline arrives.
// After balancing, every newline must be preceded by a reset whenever any
// background was opened on that line.
const hasBackgroundBleed = (output) => {
  const lines = output.split('\n');
  for (let i = 0; i < lines.length - 1; i += 1) {
    const line = lines[i];
    const lastBgOpen = Math.max(
      line.lastIndexOf('\u001B[4'),   // 40-47 / 48;...
      line.lastIndexOf('\u001B[10'),  // 100-107
    );
    if (lastBgOpen === -1) continue;
    const lastReset = Math.max(
      line.lastIndexOf('\u001B[0m'),
      line.lastIndexOf('\u001B[49m'),
    );
    if (lastReset < lastBgOpen) return true;
  }
  return false;
};

describe('background bleed regression', () => {
  it('wrapped <mark> does not bleed past the newline', () => {
    const long = 'highlight '.repeat(20).trim();
    const out = renderHTML(`<p><mark>${long}</mark></p>`);
    assert.strictEqual(hasBackgroundBleed(out), false);
  });

  it('wrapped backgrounded inline code does not bleed', () => {
    const long = 'codeword '.repeat(20).trim();
    const out = renderHTML(`<p><code>${long}</code></p>`);
    assert.strictEqual(hasBackgroundBleed(out), false);
  });

  it('blockquote marker stays outside a wrapped background', () => {
    const long = 'quoted '.repeat(20).trim();
    const out = renderHTML(`<blockquote><mark>${long}</mark></blockquote>`);
    assert.strictEqual(hasBackgroundBleed(out), false);
  });
});
```

- [ ] **Step 3: Run test to verify it passes (or fails meaningfully)**

Run: `FORCE_COLOR=1 node --test test/ansi/bleed-integration.test.js`
Expected: PASS. If any case FAILS, it reveals a bleed path the balancer does not yet cover (e.g. a handler that bypasses `wrapLineWidth`) — investigate that handler before proceeding; do not weaken `hasBackgroundBleed`.

- [ ] **Step 4: Run the FULL suite to confirm no regressions**

Run: `npm test`
Expected: PASS — the previously-passing 129 tests stay green, plus the new `test/ansi/*` tests.

- [ ] **Step 5: Visual smoke check**

Run: `printf '<blockquote><mark>%s</mark></blockquote>' "$(node -e "process.stdout.write('highlight '.repeat(20).trim())")" | FORCE_COLOR=1 node bin/html.js`
Expected: the yellow highlight covers only the words, not the right margin or the `│ ` markers, on every wrapped line.

- [ ] **Step 6: Commit**

```bash
git add test/ansi/bleed-integration.test.js
git commit -m "test(ansi): regression coverage for wrapped background bleed"
```

---

## Self-Review

**Spec coverage:**
- Goal 1 (remove hack, tested state machine) → Tasks 1–3.
- Goal 2 (all stateful SGR, 256/truecolor) → Task 1 tests + impl.
- Goal 3 (keep strings-with-ANSI arch) → Task 3 thin wrapper; no span work anywhere.
- Goal 4 (fix indentify/blockquote half via self-balanced lines) → Task 4 blockquote case.
- Edge cases listed in spec (no-ANSI, single-line, truecolor, 256, combined sequence, decoration, reset mid-line, selective closers, empty lines, blockquote) → covered across Task 1, 2, 4 tests.
- Non-goals (span rewrite; truncate/padStart/table visual-width) → not touched; recorded as out-of-scope follow-ups in the spec.

**Placeholder scan:** No TBD/TODO; every code step shows complete code; every command shows expected output.

**Type consistency:** `createSgrState` → `{ apply, openCodes, hasOpen }` used identically in Task 2. `balanceLines` default-exported in Task 2, default-imported in Tasks 2/3 tests and in `wrap-line-width.js`. `wrapLineWidth(text, context)` signature unchanged.
