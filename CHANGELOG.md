# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [7.0.0] - Unreleased

### Breaking changes

- **Node.js 20 or newer is required** (`string-width` and `supports-hyperlinks` already needed it).
- **JSX support is optional.** `react`, `react-dom`, `@babel/core`, `@babel/preset-env` and
  `@babel/preset-react` are now optional peer dependencies. Install them to use `renderJSX()` or the
  `jsx` command:
  `npm install @babel/core @babel/preset-env @babel/preset-react react react-dom`.
  Both report what to install when they are missing.
- **Package `exports`.** Only `cli-html`, `cli-html/config.yaml` and `cli-html/package.json` can be
  imported; deep imports such as `cli-html/lib/...` are no longer allowed.
- **Removed internal modules** that were never used by the renderer: `lib/utils/streaming.js`,
  `validate-theme.js`, `debug.js`, `performance.js`, `errors.js` and ~30 unused helpers.
  `index.d.ts` no longer declares functions that `index.js` never exported.
- **CLI:** invalid arguments exit with code 2; unknown options are rejected instead of being treated
  as a file name. `--streaming` and `--verbose` (documented but never implemented) are accepted
  with a warning.
- **Visible output changes:**
  - content of `figure`, `details` and `fieldset` now uses the `color` from `config.yaml` (gray);
  - numbers of long ordered lists are right-aligned (` 9.` / `10.`);
  - alerts and `:::` containers color the quote bar instead of the body text;
  - footnote references render as `⁽1⁾` instead of `⁽[1]⁾`.

### Added

- `--width <n>` option for `html`, `markdown`/`md` and `jsx`; `-h`/`--help`; `-` reads stdin.
- CSS `text-align` (`left`/`center`/`right`/`start`/`end`) and the `align` attribute on block elements.
- Markdown `::: name [title]` containers.
- `<ol reversed>` and `<li value>`.
- Table cell padding: `table.padding` / `data-cli-padding-left` / `-right`.
- `details.collapse.enabled` / `data-cli-collapse-enabled` to show only the summary of a closed `<details>`.
- `kbd` key styling (`data-cli-key-*`) and `del`/`ins` diff markers (`data-cli-diff-*`) as data attributes.
- `data-cli-*` names that follow the config path (`data-cli-block-numbers-*`, `data-cli-checkbox-checked-*`,
  `data-cli-border-color`, `data-cli-color-indicator-marker`, `data-cli-animation-indicator-*`, ...);
  the older short names keep working as aliases.
- `fieldset.required` and `optgroup.disabled` theme settings.
- A warning (`CliHtmlRenderWarning`) when a tag fails to render or content is nested too deeply,
  instead of silently dropping it.

### Fixed

- ```` ```diff ```` code blocks and code blocks with an unknown language rendered empty.
- HTML entities were decoded twice (`&amp;lt;` showed as `<`).
- Theme shorthand `h1: "red"` wiped out markers and other settings instead of setting the color;
  themes with color functions were mixed up by the theme cache.
- `checked="checked"` / `checked="true"` checkboxes and radios rendered unchecked.
- `<meta name="cli-render-*">` could overwrite any setting with a boolean; only `line-width` and
  `ascii-mode` are accepted now.
- CLI config files with a `theme:` key lost `lineWidth` and `asciiMode`; `| head` crashed with EPIPE.
- Output wider than the line width: headings, `dialog`, `figure`, `details`, `fieldset` (content,
  titles, and boxes re-wrapped at the terminal width), wide tables, numbered code blocks.
- `<center>` did not center against the line width.
- Tables: `table.responsive.enabled` from the theme was ignored, responsive mode printed literal `\n`,
  only the first `<thead>` row was shown, row numbers skipped the first row of header-less tables,
  `round`/`classic` border styles were not recognized, the border color recolored box characters
  inside cells, and empty `td`/`tr` colors did not inherit from `tbody`/`tfoot`/`table`.
- Lists: `start="abc"` printed `NaN`, invalid `type` printed `undefined`, roman numerals for 0,
  misaligned continuation lines after item 10, `ul`/`ol` colors were ignored.
- `meter`: `NaN` and empty bars for `min == max` or invalid values, thresholds from `config.yaml`
  and `optimum` ignored, only the first `%v` in a label was replaced.
- `progress` with `max <= 0`, disabled `<select>`, `<option label>`, media titles from `<source>` or
  URLs with a query string, negative password counts, the color input indicator marker.
- Blockquote, figure, details and fieldset content color; fieldset legend color and `required-enabled`.

### Internal

- CI: `package-lock.json` is committed (every job failed at `npm ci`), lint is enforced with zero
  warnings, the Node matrix is 20/22/24, and every example is rendered and checked for warnings.
- Snapshot tests for all examples (`UPDATE_SNAPSHOTS=1 npm test` to refresh); coverage went from
  87% to 97% of lines.
- Documentation, types (`index.d.ts`), `DATA_ATTRIBUTES.md`, `examples/THEMES.md` and the examples
  now match what the code reads.
