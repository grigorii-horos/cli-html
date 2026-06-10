# cli-html Architecture

This document describes the internal architecture of cli-html for contributors and maintainers.

---

## Overview

cli-html takes HTML (or Markdown → HTML) and renders it to styled terminal output using ANSI escape codes via [chalk](https://github.com/chalk/chalk).

The rendering pipeline:

```
Input (HTML string or file)
  │
  ▼
parse5 (HTML parser)
  │ AST
  ▼
render-tag.js (recursive renderer)
  │
  ├── tag registry (lib/tags.js)
  │     └── tag handlers (lib/tags/*.js)
  │
  ├── theme (lib/utils/get-theme.js)
  │     └── config.yaml (base) + user config (override)
  │
  └── output (ANSI-colored string)
```

For Markdown input, an additional step runs first:

```
Markdown string
  │
  ▼
markdown-it (+ plugins)
  │ HTML string
  ▼
(same pipeline as above)
```

---

## Core Modules

### `lib/utils/render-tag.js`

The heart of the renderer. Recursively walks the parse5 AST.

- Uses `WeakMap` for caching (auto-GC when nodes are no longer referenced)
- `MAX_DEPTH = 100` prevents infinite recursion on malformed HTML
- Context object flows through the tree: `{ theme, lineWidth, asciiMode, depth }`

```javascript
// Simplified render-tag logic
function renderNode(node, context) {
  if (context.depth > MAX_DEPTH) return null;

  const handler = tagRegistry[node.nodeName];
  if (!handler) return renderChildren(node, context);

  return handler(node, { ...context, depth: context.depth + 1 });
}
```

### `lib/utils/get-theme.js`

Merges base config (`config.yaml`) with user overrides.

```javascript
export function getTheme(customInput = {}) {
  return deepMerge(BASE_THEME, customInput);
}
```

Theme values are **plain strings** (`"red bold"`, `"bgBlue white"`). No chalk functions in the theme object.

### `lib/core/color.js`

Applies chalk-string colors to text.

```javascript
applyColor(spec, text)            // spec is a chalk-string or null
applyThemeColor(custom, theme, text) // custom attr override → theme → no color
```

### `lib/core/attr.js`

Reads `data-cli-*` attributes via dot-path notation.

```javascript
getAttr(tag, 'prefix.marker')  // reads data-cli-prefix-marker
getAttr(tag, 'border.color')   // reads data-cli-border-color
```

Returns `null` when attribute absent. Always returns strings (not booleans).
Boolean attributes: check `getAttr(tag, 'key') === 'true'`.

---

## Tag Handler Pattern

Every tag handler has the same signature:

```javascript
export const myTag = (tag, context) => {
  // Returns one of:
  // { type: 'inline', value, pre: null, post: null, nodeName }
  // { type: 'block', value, marginTop?, marginBottom? }
  // null (suppress output)
};
```

For block elements, use `blockTag()` from `lib/tag-helpers/block-tag.js`.
For inline elements, use `inlineTag()` from `lib/tag-helpers/inline-tag.js`.

```javascript
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

export const time = inlineTag((value, tag, context) => {
  const theme = context.theme.time ?? {};
  return applyThemeColor(getAttr(tag, 'color'), theme.color, value);
});
```

---

## Configuration System

### Two-level config

1. **Base config** (`config.yaml`) — default values for every theme property
2. **User config** — platform-specific file, merged over base at startup

User config locations:
- Linux: `~/.config/cli-html/config.yaml`
- macOS: `~/Library/Preferences/cli-html/config.yaml`
- Windows: `%LOCALAPPDATA%\cli-html\Config\config.yaml`

### Three-level override per element

Priority (high → low):
1. `data-cli-*` attribute on the HTML element
2. User config (`~/.config/cli-html/config.yaml`)
3. Base config (`config.yaml`)

In code:
```javascript
const color = getAttr(tag, 'color') ?? context.theme.myTag?.color;
```

---

## Adding a New Tag

1. Create `lib/tags/your-tag.js`
2. Import and register in `lib/tags.js`
3. Add defaults to `config.yaml`
4. Add TypeScript types to `index.d.ts`
5. Add example to `examples/html/tags/your-tag.html`
6. Add tests to `test/rendering/config-override.test.js`

See `CLAUDE.md` for the complete tag authoring guide.

---

## Performance

- `WeakMap` caching in `render-tag.js`: cached render results per node
- LRU eviction (max 1000 entries) for string length calculations
- Theme is computed once at startup, not per-render
- `registerCache()` system for coordinated cache management

---

## Testing

```bash
npm test                  # Run all tests
FORCE_COLOR=1 node --test # With forced color output
```

Tests use Node's built-in test runner. Test files in `test/`:

```
test/
├── rendering/
│   ├── config-override.test.js   # Theme + data-cli-* override tests
│   └── snapshot.test.js          # Visual snapshot tests
└── utils/
    └── *.test.js                 # Utility function tests
```
