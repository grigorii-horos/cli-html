# ANSI Line Balancing — Design

**Date:** 2026-06-21
**Status:** Approved (design), pending implementation plan
**Topic:** Replace the regex background-bleed hack in `lib/wrap-line-width.js` with a proper, tested SGR state-machine module.

## Problem

`wrap-ansi` resets the foreground (SGR `39`) at every wrap point but leaves the
background open until the end of the string. A newline emitted while a background
is active makes the terminal paint the background to the right edge of the line,
and any indentation/marker added afterward inherits it. This is "background bleed".

The current fix (`fixBackgroundBleed` in `lib/wrap-line-width.js`) is an inline
regex that:

1. Parses ANSI SGR codes with a regular expression.
2. Tracks only the **background** state (ignores bold/dim/italic/underline/inverse/strike).
3. Re-closes (`49`) before each `\n` and reopens the background at the start of the next line.
4. Uses an unprintable literal `ESC` char (`const ESC = ''`) that is invisible in
   the source and easy to break on copy/paste.

It works for the common case but is fragile and single-purpose.

### Audit findings (2026-06-21)

- **Bleed surface is small but duplicated.** ~7 handlers apply a `bg*` spec to
  inline content that can soft-wrap (code-inline, mark, del, ins, button,
  text-input, textarea); a few more apply decoration (bold/underline/italic).
- **The same bug class also lives in `indentify`** (`lib/utilities.js`): prepending
  a colored marker (blockquote `│ `, list markers, code gutter) in front of a line
  whose background is still open. The wrap-line hack only addresses half of this;
  the other half is held together by operation order.
- **The span-model rewrite is disproportionate.** Representing inline content as
  structured `{text, style}` spans (layout on plain text, styles applied last) is
  architecturally cleaner but touches 55–70 files / ~2500–3000 lines. Out of scope.
- **Adjacent but separate bugs** share the same root ("layout math on ANSI strings")
  but are NOT bleed and are out of scope here: `truncate()`/`chunk()` use `.length`
  instead of visual width (`lib/utils/string.js`); `padStart` on colored line numbers
  (`lib/tags/code.js`); cli-table3 is not ANSI-aware (`lib/tags/table.js`).

## Goals

1. Remove the regex hack; replace with a correct, isolated, tested SGR state machine.
2. Support all **stateful** SGR attributes, not just background: bold(1), dim(2),
   italic(3), underline(4), inverse(7), strikethrough(9), foreground & background
   incl. 256-color (`38;5`/`48;5`) and truecolor (`38;2`/`48;2`).
3. Keep the existing strings-with-ANSI architecture (no span rewrite).
4. Fix bleed everywhere wrapping produces multi-line content — including the
   `indentify` marker case — by having the wrap producer emit **self-balanced lines**.

## Non-Goals

- The span/content-style separation rewrite.
- Visual-width correctness for `truncate`, `chunk`, `padStart`, cli-table3 (separate work).
- Changing any theme defaults, tag handler, or public API.

## The Invariant

Background bleed is one terminal fact: **a stateful SGR attribute must be closed
before every `\n` and reopened at the start of the next line's content.**

If `wrapLineWidth` returns lines that are each self-balanced (every open attribute
closed at end-of-line, reopened at column 0 of the next line), then:

- The right-edge bleed disappears (attribute closed before `\n`).
- `indentify` naturally prepends its marker **before** the reopened attribute,
  so the marker sits outside the background — the indent-bleed half is fixed for
  free, with no change to `indentify` itself.

This is why the fix belongs in the wrap producer, not duplicated at each consumer.

## Architecture

New directory `lib/ansi/`:

### `lib/ansi/sgr-state.js`

A small SGR state machine. Pure, no I/O.

- `ESC` constant defined as `''` (readable, copy-safe).
- A regex/scanner that finds SGR sequences `ESC[ ... m`.
- `createSgrState()` → an object tracking the currently-open attributes:
  - intensity (bold/dim/normal via 1/2/22),
  - italic (3/23), underline (4/24), inverse (7/27), strike (9/29),
  - foreground (30–37, 90–97, 38;5;n, 38;2;r;g;b, 39),
  - background (40–47, 100–107, 48;5;n, 48;2;r;g;b, 49),
  - reset (0 / empty params → clear all).
- `apply(params)` — feed the numeric params of one SGR sequence; update state.
- `openCodes()` — return the ANSI string that re-establishes all currently-open
  attributes (e.g. `ESC[1mESC[48;5;200m` or a single combined `ESC[...m`).
- `closeCodes()` — return the ANSI string that closes all currently-open
  attributes (e.g. `ESC[22mESC[49m...` or `ESC[0m` when simplest/correct).

Multi-parameter sequences (`ESC[1;48;5;200m`) are consumed left-to-right, honoring
the variable-length `38;5`/`48;5` (3 params) and `38;2`/`48;2` (5 params) forms.

### `lib/ansi/balance-lines.js`

- `balanceLines(text)`:
  - Fast path: if `text` has no `\n` or no `ESC`, return unchanged.
  - Split on `\n`. Maintain one `SgrState` across lines.
  - For each line: prepend the carried `openCodes()` (the state open at the end of
    the previous line), scan the line feeding every SGR sequence into the state,
    then append `closeCodes()` if anything is still open.
  - Join with `\n`.
- This is the single home for the close-before-newline / reopen-after-newline logic.

### `lib/wrap-line-width.js` (thin)

```js
import wrapAnsi from 'wrap-ansi';
import { balanceLines } from './ansi/balance-lines.js';

const wrapLineWidth = (text, context) =>
  balanceLines(wrapAnsi(text, context.lineWidth, { trim: !context.pre }));

export default wrapLineWidth;
```

The `fixBackgroundBleed` function and the invisible-`ESC` regex are deleted.

## Data Flow

```
inline handlers apply chalk (bg/bold/…) ──► concat ──► wrapAnsi (soft wrap)
   ──► balanceLines  (close@EOL / reopen@SOL, full SGR)
   ──► inlineToBlock ──► indentify marker (lands OUTSIDE reopened attr) ──► output
```

## Error Handling / Edge Cases (must be covered by tests)

- No-ANSI text (fast path returns input).
- Single-line ANSI (no `\n` → unchanged).
- Background that wraps across 2+ lines (the original bug).
- Truecolor (`48;2;r;g;b`) and 256-color (`48;5;n`) backgrounds.
- Foreground-only (must NOT regress wrap-ansi's existing fg handling).
- Combined sequence in one SGR: `ESC[1;4;48;5;200m`.
- Bold/underline/italic spanning a wrap (decoration bleed).
- Explicit reset `ESC[0m` / empty-param `ESC[m` mid-line clears state.
- Selective closers (`22`,`24`,`27`,`29`,`39`,`49`) update state correctly.
- Empty lines between content lines.
- Blockquote integration: colored marker stays outside the reopened background.

## Testing Strategy

- New unit tests in `lib/ansi/*.test.js` (or `test/` per repo convention) using
  Node's built-in test runner, asserting on exact ANSI byte sequences for the cases above.
- Run with `FORCE_COLOR=1 node --test`.
- Regression: existing 129 tests must stay green.
- Visual smoke check:
  `node bin/html.js examples/html/...` with a wrapped `<mark>`/`<code>`/blockquote
  to confirm no background bleed to the right edge.

## Risks & Mitigations

- **Risk:** state machine mis-models a rare SGR code → wrong reopen.
  **Mitigation:** only *stateful* attributes are tracked; unknown codes pass through
  untracked (no close/reopen) so they cannot corrupt balanced lines.
- **Risk:** double-wrapping/perf on large docs.
  **Mitigation:** fast path for no-`\n`/no-`ESC`; single split/scan per call — same
  order of work as the current hack.
- **Risk:** behavioral change vs current hack for foreground.
  **Mitigation:** tests pin existing foreground behavior; balanceLines reopens fg
  too, which is a superset of current behavior and matches wrap-ansi intent.

## Out-of-Scope Follow-ups (separate tickets)

1. Visual-width correctness for `truncate`/`chunk` (`lib/utils/string.js`).
2. ANSI-aware padding for code line numbers (`lib/tags/code.js`).
3. cli-table3 ANSI-aware column widths (`lib/tags/table.js`).
4. (Long-term) content/style span model — only if the above keep recurring.
