# HTML Element Visual Enhancements v2

**Goal:** Improve visual rendering of `<hr>`, `<ruby>`/`<rt>`, `<dialog>`, `<time>`, and `<q>` — all standard HTML elements, all config-driven, no hardcoded fallbacks.

**Philosophy:** Every marker, color, and format is configurable via `config.yaml` and overridable via `data-cli-*` attributes. Reuse existing patterns and code where possible.

---

## Feature 1: `<hr>` named styles

### Current state

`<hr>` repeats a single character (`─` by default). No style selection.

### Design

Add `hr.style` config key selecting a named preset. Each preset defines a `marker` character. The `hr.style` config maps to a predefined marker — `hr.marker` still works as a custom override (takes precedence over style).

### Style presets

| style | marker | example |
|-------|--------|---------|
| `single` | `─` | `──────────────────────` |
| `double` | `═` | `══════════════════════` |
| `bold`   | `━` | `━━━━━━━━━━━━━━━━━━━━━━` |
| `dashed` | `╌` | `╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌` |
| `dotted` | `·` | `······················` |

### Precedence

1. `data-cli-marker` (explicit marker override)
2. `data-cli-style` → lookup preset marker
3. `theme.hr.marker` (explicit marker in config)
4. `theme.hr.style` → lookup preset marker
5. Default: `single` → `─`

### config.yaml changes

```yaml
hr:
  color: gray
  marker: ''      # explicit marker (empty = use style)
  style: single   # single | double | bold | dashed | dotted
```

### Implementation

`lib/tags/hr.js` — add `HR_STYLES` map, resolve marker via precedence chain.

### data-cli-* attributes

- `data-cli-style` — named style
- `data-cli-marker` — explicit character override (already exists)
- `data-cli-color` — already exists

---

## Feature 2: `<ruby>` / `<rt>` configurable

### Current state

- `ruby` uses `context.theme.span?.color` — bug, should use `ruby` theme
- `rt` hardcodes ` (${styled})` — not configurable

### Design

- `ruby` uses `theme.ruby.color`
- `rt` uses `theme.ruby.rt.prefix.marker` + `theme.ruby.rt.suffix.marker` + `theme.ruby.rt.color`

### config.yaml changes

```yaml
ruby:
  color: ''         # Base text color
  rt:
    color: gray dim  # Annotation text color
    prefix:
      marker: ' ('
      color: gray dim
    suffix:
      marker: ')'
      color: gray dim
```

### Implementation

`lib/tags/ruby.js` — both `ruby` and `rt` use `getAttr()` + theme, no hardcoded strings.

### data-cli-* attributes

On `<ruby>`: `data-cli-color`
On `<rt>`: `data-cli-color`, `data-cli-prefix-marker`, `data-cli-prefix-color`, `data-cli-suffix-marker`, `data-cli-suffix-color`

---

## Feature 3: `<dialog>` box border

### Current state

`dialog` is `createColoredBlock('dialog')` — plain colored block, no border.

### Design

Full box border like `<figure>` and `<fieldset>`: uses `boxen` via `blockTag` border option. Configurable border style, color, dim, and padding.

### config.yaml changes

```yaml
dialog:
  color: ''
  border:
    color: cyan
    style: round     # round | single | double | bold | classic
    dim: false
  padding:
    top: 0
    bottom: 0
    left: 1
    right: 1
```

### Implementation

`lib/tags/base-tags.js` — remove `dialog` from `createColoredBlock`. Create dedicated handler in `lib/tags/dialog.js` mirroring `lib/tags/figure.js` structure.

Register in `lib/tags.js`.

### data-cli-* attributes

`data-cli-color`, `data-cli-border-color`, `data-cli-border-style`, `data-cli-padding-left`, `data-cli-padding-right`

---

## Feature 4: `<time>` datetime display

### Current state

`time` is `createStyledTag('time')` — just applies color to text content. `datetime` attribute is ignored.

### Design

When `datetime.enabled: true`, append the `datetime` attribute value after the text, wrapped in configurable prefix/suffix.

Example: `<time datetime="2026-06-10">Today</time>` → `Today (2026-06-10)`

Only appends if both `datetime.enabled` is true AND the `datetime` HTML attribute is present.

### config.yaml changes

```yaml
time:
  color: cyan
  datetime:
    enabled: false
    color: gray dim
    prefix:
      marker: ' ('
      color: gray dim
    suffix:
      marker: ')'
      color: gray dim
```

### Implementation

`lib/tags/text-styles.js` — replace `createStyledTag('time')` with dedicated `time` handler reading `getAttribute(tag, 'datetime')`.

### data-cli-* attributes

`data-cli-color`, `data-cli-datetime-enabled`, `data-cli-datetime-color`, `data-cli-datetime-prefix-marker`, `data-cli-datetime-suffix-marker`

---

## Feature 5: `<q>` cite as link

### Current state

`q` hardcodes `"${value}"` — no config, ignores `cite` attribute.

### Design

1. Opening/closing quotes are configurable via `prefix`/`suffix` (currently hardcoded `"`).
2. When `cite.enabled: true` and `cite` HTML attribute present, append the cite URL styled like an `<a>` external link — reuses `a.external.marker` symbol and logic, but with `q.cite.color` for color.

### config.yaml changes

```yaml
q:
  color: ''
  prefix:
    marker: '"'
    color: ''
  suffix:
    marker: '"'
    color: ''
  cite:
    enabled: false
    color: magenta    # Own color (not a.color)
    # Reuses a.external.marker symbol from theme.a.external.marker
```

### Implementation

`lib/tags/text-styles.js` — replace `q` with dedicated handler. When cite is active, read `theme.a?.external?.marker` for the indicator symbol, apply `q.cite.color` for color.

### data-cli-* attributes

`data-cli-color`, `data-cli-prefix-marker`, `data-cli-suffix-marker`, `data-cli-cite-enabled`, `data-cli-cite-color`

---

## Files changed

| File | Change |
|------|--------|
| `lib/tags/hr.js` | Add `HR_STYLES` map, style resolution |
| `lib/tags/ruby.js` | Fix color, make rt configurable |
| `lib/tags/dialog.js` | **New** — box border handler |
| `lib/tags/base-tags.js` | Remove `dialog` from `createColoredBlock` |
| `lib/tags.js` | Import dialog from `dialog.js` |
| `lib/tags/text-styles.js` | Dedicated `time` and `q` handlers |
| `config.yaml` | All sections updated |
| `index.d.ts` | Updated types for all 5 |
| `test/rendering/config-override.test.js` | New tests |

## Out of scope

- `<rp>` changes (currently correct — returns null to hide browser fallback parens)
- Locale-aware quote characters for `<q>` (e.g., « » for French)
- `<dialog>` open/close state (HTML `open` attribute)
- Parsing/formatting `datetime` values (show raw attribute value as-is)
