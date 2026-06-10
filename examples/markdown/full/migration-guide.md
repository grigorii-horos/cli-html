# Migration Guide: v5 → v6

This guide covers breaking changes and migration steps when upgrading from cli-html v5.x to v6.0.

> [!WARNING]
> v6.0 contains breaking changes to theme configuration. Read this guide carefully before upgrading.

---

## Quick Summary

| What changed | v5 behavior | v6 behavior |
|---|---|---|
| Theme color values | Functions or strings | Strings only |
| `hr` config | `hr.marker: '─'` | `hr.style: single` |
| `getCustomAttributes()` | Used in tag handlers | Removed — use `getAttr()` |
| `parseStyleEntry()` | Used in get-theme.js | Removed |
| `dialog` rendering | Plain colored block | Box border |
| `<video>` / `<audio>` | Empty (void element) | Inline placeholder |

---

## Breaking Change 1: Theme Color Format

### Before (v5)

```javascript
// Custom theme using function values — NO LONGER WORKS
renderHTML(html, {
  h1: (text) => chalk.bold.red(text),  // functions not accepted
  code: { color: chalk.yellow }         // chalk object not accepted
});
```

### After (v6)

```javascript
// Use chalk-string format
renderHTML(html, {
  h1: 'bold red',                       // chalk-string
  code: { color: 'yellow' }             // chalk-string in object
});
```

**How to migrate:**

- [ ] Search your config for any function values
- [ ] Replace `chalk.red` → `'red'`
- [ ] Replace `chalk.bold.red` → `'bold red'`
- [ ] Replace `chalk.bgBlue.white` → `'bgBlue white'`

Run `cli-html --validate-config` to check your config file for invalid values.

---

## Breaking Change 2: HR Configuration

### Before (v5)

```yaml
# config.yaml
theme:
  hr:
    marker: '─'   # Character to repeat
    color: gray
```

### After (v6)

```yaml
# config.yaml
theme:
  hr:
    style: single   # single | double | bold | dashed | dotted
    marker: ''      # explicit override (empty = use style)
    color: gray
```

**How to migrate:**

- [ ] If you had `hr.marker: '─'` → change to `hr.style: single` (or leave unset — `single` is default)
- [ ] If you had a custom marker like `hr.marker: '='` → keep it as `hr.marker: '='` (still supported)
- [ ] Update any `data-cli-marker` attributes to `data-cli-style="double"` etc. where applicable

---

## Breaking Change 3: `getCustomAttributes()` Removed

This is an **internal API change** — only affects custom tag handlers.

### Before (v5)

```javascript
import { getCustomAttributes } from '../utilities.js';

export const myTag = (tag, context) => {
  const custom = getCustomAttributes(tag);
  const color = custom.myColor || context.theme.myTag?.color;
  // ...
};
```

### After (v6)

```javascript
import { getAttr } from '../core/attr.js';

export const myTag = (tag, context) => {
  const color = getAttr(tag, 'color') ?? context.theme.myTag?.color;
  // ...
};
```

**How to migrate:**

- [ ] Replace `getCustomAttributes(tag).someAttr` with `getAttr(tag, 'dot.path')`
- [ ] Change `||` to `??` for theme fallbacks

---

## New in v6: Non-Breaking

These features are **additive** — existing code continues to work.

### `<dialog>` Box Border

~~Previously rendered as plain colored block.~~

Now renders with a configurable box border. To opt out or customize:

```yaml
theme:
  dialog:
    border:
      style: single  # round | single | double | bold | classic
      color: gray    # change from default cyan
```

### `<video>` / `<audio>` Inline Placeholders

~~Previously: void elements, rendered nothing.~~

Now: render as inline title with indicator. Existing HTML that uses these elements
will now show placeholders. If you want to suppress:

```yaml
theme:
  video:
    indicator:
      marker: ''
    prefix:
      marker: ''
    suffix:
      marker: ''
```

### `<time>` Datetime Display

Opt-in: `time.datetime.enabled: false` by default. No change to existing output.

To enable:

```yaml
theme:
  time:
    datetime:
      enabled: true
```

---

## Upgrade Steps

- [ ] `npm install cli-html@6` to upgrade
- [ ] Run `cli-html --validate-config` to check config
- [ ] Fix any theme color function values (see Breaking Change 1)
- [ ] Update `hr` config if you customized it (see Breaking Change 2)
- [ ] Update any custom tag handlers (see Breaking Change 3)
- [ ] Run `npm test` in your project to verify nothing broke
- [ ] Check rendered output visually with your common HTML/markdown files

---

## Getting Help

- Open an issue: [github.com/example/cli-html/issues](https://github.com/example/cli-html/issues)
- Check the [CHANGELOG](../../html/full/changelog-full.html) for the full list of changes
