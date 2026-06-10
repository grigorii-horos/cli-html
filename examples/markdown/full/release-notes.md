# Release Notes

Release history for cli-html. For upgrade instructions, see [Migration Guide](migration-guide.md).

---

## v6.0.0

> [!IMPORTANT]
> Breaking changes. See [migration guide](migration-guide.md) before upgrading.

**Released:** <time datetime="2026-06-10">June 10, 2026</time>

### New Features

- **`<hr>` named styles** — `single`, `double`, `bold`, `dashed`, `dotted` via `hr.style` config or `data-cli-style` attribute
- **`<ruby>`/`<rt>` configurable** — custom prefix/suffix markers for annotations; fixed color inheritance bug
- **`<dialog>` box border** — configurable box border using boxen (same system as `<figure>` and `<fieldset>`)
- **`<time>` datetime display** — opt-in display of `datetime` attribute value after text
- **`<q>` cite as link** — opt-in rendering of `cite` attribute as external link using `a.external` marker config
- **`<video>`/`<audio>` inline** — inline title placeholder instead of empty void element
- **`<dt>` suffix** — configurable suffix marker after term text (default `::`)

### Breaking Changes

- Theme color values must be chalk-strings (functions no longer accepted)
- `hr.marker: '─'` replaced by `hr.style: single`
- `getCustomAttributes()` removed (internal API) — use `getAttr()` from `lib/core/attr.js`
- `parseStyleEntry()` removed — theme is now plain deepMerged strings

### Internal

- Core rewrite: `getTheme()` is now a 15-line deepMerge (was 1064 lines)
- `lib/core/` directory added: `attr.js`, `color.js`, `disabled.js`, `merge.js`

---

## v5.3.0

**Released:** <time datetime="2026-05-15">May 15, 2026</time>

### New Features

- Enhanced input types: color picker, password strength indicator, email prefix, date formatting
- Configurable button element (`<button>` separate from `<input type="button">`)
- `<select>` with selected option indicator

### Fixed

- Table responsive mode threshold calculation off by one
- `<meter>` high/low boundary markers not rendering at exact boundary values
- `<progress>` percentage label alignment with wide terminals

---

## v5.2.0

**Released:** <time datetime="2026-04-01">April 1, 2026</time>

### New Features

- **`<details>`/`<summary>`** with configurable open/closed indicator and box border
- **`<fieldset>`** with legend title and border

### Changed

- Minimum Node.js version raised to 20.0.0
- `config.yaml` table sub-elements moved to top-level keys

---

## v5.0.0

**Released:** <time datetime="2026-01-10">January 10, 2026</time>

> [!WARNING]
> Breaking: table and button configuration moved. See v5 migration notes.

### New Features

- Full GFM support for markdown rendering (tables, task lists, footnotes, alerts)
- `<figure>` with configurable box border
- Complete input type coverage: checkbox, radio, range, file, color, date, email

### Breaking Changes

- Table elements now top-level theme keys (`td`, `th`, `tr` — not `table.td`)
- `<button>` uses `button.*` theme (not `input.button.*`)

---

## Earlier Versions

See [GitHub releases](https://github.com/example/cli-html/releases) for release notes
prior to v5.0.0.
