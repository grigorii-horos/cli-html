# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`cli-html` is a terminal renderer for HTML and Markdown with GitHub Flavored Markdown support, syntax highlighting, and extensive theming. It can be used both as a CLI tool (`html`, `markdown`, `md`, `jsx` commands) and as a Node.js library (`renderHTML()`, `renderMarkdown()`, `renderJSX()`).

## Common Commands

### Testing
```bash
npm test                    # Run all tests using Node's built-in test runner
FORCE_COLOR=1 node --test   # Test with forced color output
```

### Development
```bash
npm run fix                 # Run ESLint with auto-fix
node bin/html.js examples/html/full/demo.html      # Test HTML rendering
node bin/markdown.js examples/markdown/full/gfm-features.md  # Test Markdown rendering
```

### Library Usage Examples
```bash
node examples/library-usage/html-basic.js       # Basic HTML rendering example
node examples/library-usage/custom-theme.js     # Custom theming example
node examples/library-usage/markdown-basic.js   # Markdown rendering example
```

## Architecture

### Core Rendering Flow

1. **Entry Point** (`index.js`):
   - `renderHTML(html, theme)` - Parses HTML with parse5, applies theme, renders to terminal
   - `renderMarkdown(markdown, theme)` - Converts Markdown to HTML via markdown-it, then renders
   - `renderJSX(jsx, theme)` - Renders a React element/component to HTML via react-dom, then renders (async; react/react-dom loaded lazily)

2. **Tag System** (`lib/tags.js` + `lib/tags/*`):
   - Every HTML tag maps to a handler function
   - Handlers receive `(tag, context)` where context includes theme, line width, depth
   - Two main helpers: `blockTag()` for block elements, `inlineTag()` for inline elements
   - Tag functions return objects with `{ type, value, pre, post }` structure

3. **Theme Configuration** (`lib/utils/get-theme.js`):
   - Loads base theme from `config.yaml`
   - Deep-merges user overrides (from the CLI config file or the library `theme` argument) onto it
   - Expands color shorthands: `h1: "red"` becomes `h1: { color: "red" }` wherever the base entry has a `color` key
   - Colors stay as given (chalk-string or function); tags apply them with `applyColor()` / `applyThemeColor()` from `lib/core/color.js`

4. **Rendering Engine** (`lib/utils/render-tag.js`):
   - Recursive renderer with WeakMap caching for performance
   - Context-based cache keys prevent memory bloat
   - MAX_DEPTH protection (100 levels) prevents infinite recursion
   - Automatically garbage-collects unused cached nodes

### Critical Files

- **`config.yaml`**: Single source of truth for all theme defaults. Always read this file before making theme-related changes.
- **`lib/core/attr.js`**: `getAttr(tag, 'dot.path')` reads a `data-cli-*` attribute (`'prefix.marker'` → `data-cli-prefix-marker`).
- **`lib/utils/get-theme.js`**: Merges `config.yaml` with user overrides. New theme keys need no parser changes.
- **`lib/tag-helpers/box.js`**: Shared border/padding settings and box drawing for boxed elements (figure, dialog, details, fieldset).
- **`lib/cli.js`**: Argument parsing, config loading and output handling shared by the `html`, `markdown` and `jsx` commands.
- **`lib/tags.js`**: Tag registry. Import and register all tag handlers here.
- **`lib/markdown.js`**: Markdown-it configuration with all GFM plugins.

## Configuration System

### Two-Level Configuration

1. **Global Theme** (`config.yaml`):
   - Base defaults in repository root
   - User overrides in:
     - Linux: `~/.config/cli-html/config.yaml` (html command) or `~/.config/cli-markdown/config.yaml` (markdown/md commands)
     - macOS: `~/Library/Preferences/cli-html/config.yaml` or `~/Library/Preferences/cli-markdown/config.yaml`
     - Windows: `%LOCALAPPDATA%\cli-html\Config\config.yaml` or `%LOCALAPPDATA%\cli-markdown\Config\config.yaml`

2. **Inline Customization** (`data-cli-*` attributes):
   - Per-element overrides via HTML attributes
   - Read with `getAttr()` from `lib/core/attr.js`
   - Always takes precedence over global theme

### Theme Structure

Theme values are chalk-string compatible (e.g., `"red bold"`, `"bgBlue white underline"`).

#### Standard Configuration Types

The following standard structures are used throughout the configuration for consistency. Tags read them directly from `context.theme` (e.g. `context.theme.samp.prefix.marker`).

**1. Prefix/Suffix/Indicator Pattern** - For markers that wrap or precede content:
```yaml
prefix:
  marker: <string>  # The text/symbol to display
  color: <chalk color>  # Color for the marker

suffix:
  marker: <string>
  color: <chalk color>

indicator:
  marker: <string>
  color: <chalk color>
```
Used in: headers, blockquote, input elements (checkbox, radio, button, email, date, file), img, abbr, dfn, samp, kbd, sub, sup, code labels, links, select

**2. State Pattern** - For elements with binary or multiple states:
```yaml
checked:
  marker: <string>
  color: <chalk color>
unchecked:
  marker: <string>
  color: <chalk color>

# Or for other states:
selected/unselected, filled/empty, open/closed
```
Used in: checkbox, radio, option (select), progress, range, details

**3. Border Pattern** - For container elements with borders:
```yaml
border:
  color: <chalk color>  # Border color
  style: <string>  # Border style: round, single, double, bold, classic
  dim: <boolean>  # Whether to dim the border
```
Used in: figure, fieldset, details

**4. Padding Pattern** - For spacing inside containers:
```yaml
padding:
  top: <number>  # Padding lines at top
  bottom: <number>  # Padding lines at bottom
  left: <number>  # Padding spaces on left
  right: <number>  # Padding spaces on right
```
Used in: figure, fieldset, details, code blocks

**5. Feature Toggle Pattern** - For optional features:
```yaml
featureName:
  enabled: <boolean>  # Whether to show this feature
  # ... feature-specific config when enabled
```
Used in: link href/title/externalIndicator, code numbers/gutter/label/highlight/overflowIndicator, kbd key, del/ins diff, table responsive

**6. Diff Pattern** - For showing changes (git-style):
```yaml
diff:
  enabled: <boolean>
  style: <string>  # simple | git
  marker: <string>  # e.g., '+' or '-'
  color: <chalk color>
```
Used in: del, ins

**7. Key Pattern** - For keyboard shortcuts with special styling:
```yaml
key:
  enabled: <boolean>
  style: <string>  # simple | box
  separator: <string>  # e.g., '+'
```
Used in: kbd

**8. Title Pattern** - For showing tooltips or definitions:
```yaml
title:
  color: <chalk color>
  prefix: { marker, color }
  suffix: { marker, color }
```
Used in: abbr, dfn, fieldset (legend), links

**9. Responsive Pattern** - For adaptive layouts:
```yaml
responsive:
  enabled: <boolean>
  threshold: <number>  # Width threshold
  separator: <string>
  itemSeparator: <string>
```
Used in: table

**10. Indicators Pattern** - For list markers with types:
```yaml
indicators:
  disc:  # Or '1', 'I', 'A', etc.
    marker: <string>
    color: <chalk color>
    decimal: <string>  # For ordered lists only
```
Used in: ul, ol

**Important Rules:**
- Always use `prefix/suffix` structure instead of `open/close` for wrapping elements
- Use `indicator` for single leading markers (not wrapping)
- All color values can be chalk-string format or color functions
- For simple elements, use `color` directly for the main text color (not `text.color`):
  - ✅ Correct: `button.color` (button text color), `input.file.color` (filename color), `img.alt.color` (alt text color)
  - ❌ Wrong: `button.text.color`, `input.file.text.color`, `img.text.color`
  - Use semantic names: `img.alt` instead of `img.text` because it's the alt attribute value

Common theme patterns:
```yaml
# Simple color
h1: "red bold"

# Nested object with multiple properties
code:
  color: "yellowBright"
  inline: "bgBlack yellow"
  numbers: "blackBright dim"

# Border configurations
figure:
  border:
    color: "gray"
    style: "round"  # round, single, double, bold, classic
  padding:
    top: 0
    left: 1

# Button element (separate from input type="button")
button:
  color: bgBlack bold  # Button text color (NOT button.text.color)
  disabled:
    color: gray dim
  prefix:
    marker: '[ '
    color: bgBlack gray
  suffix:
    marker: ' ]'
    color: bgBlack gray

# Input type="button" (different from <button> tag)
input:
  button:
    color: bgBlack bold  # Button text color (NOT input.button.text.color)
    prefix:
      marker: '[ '
      color: bgBlack gray
    suffix:
      marker: ' ]'
      color: bgBlack gray

  file:
    color: cyan  # Filename color (NOT file.text.color)
    prefix:
      marker: '@'
      color: gray

# Table structure - now top-level tags instead of nested
table:
  color: ''  # Default table color (inherited by tr and td)
  responsive:
    enabled: true
    threshold: 60

caption:
  color: bold blue  # Top-level tag

td:
  color: ''  # Inherits from tr, then table

th:
  color: 'bold red'  # Inherits from thead, then table

tr:
  color: ''  # Inherits from table

thead:
  color: 'bold red'

tbody:
  color: ''

tfoot:
  color: ''

# Headers with indicator
h1:
  color: red bold  # Text color
  indicator:
    marker: '#'  # Marker before header text
    color: red bold
```

## Adding New Features

### Adding a New HTML Tag

1. **Create tag implementation** in `lib/tags/your-tag.js`:
```javascript
import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttr } from '../core/attr.js';

export const yourTag = (tag, context) => {
  return blockTag(
    tag,
    context,
    getAttr(tag, 'color') || context.theme.yourTag?.color,
    getAttr(tag, 'marker') || context.theme.yourTag?.marker || '> '
  );
};
```

2. **Register in `lib/tags.js`**:
```javascript
import { yourTag } from './tags/your-tag.js';

export default {
  // ... existing tags
  yourtag: yourTag,
};
```

3. **Add theme configuration** in `config.yaml`:
```yaml
theme:
  yourTag:
    color: "cyan"
    marker: "> "
```

4. **No theme parser changes are needed**: `lib/utils/get-theme.js` deep-merges `config.yaml` with user overrides, so new keys are available as `context.theme.yourTag.*`.

5. **Update TypeScript types** in `index.d.ts`:
```typescript
export interface YourTagStyle {
  color?: Color;
  marker?: string;
}

export interface Theme {
  // ... existing tags
  yourTag?: Styled<YourTagStyle>;  // also accepts the color shorthand
}
```

6. **Add example** in `examples/html/tags/your-tag.html`:
```html
<!DOCTYPE html>
<html>
<body>
  <h1>YourTag Examples</h1>
  <yourtag>Example content</yourtag>
  <yourtag data-cli-color="red">Custom colored example</yourtag>
</body>
</html>
```

7. **Generate screenshot** (if applicable):
```bash
node scripts/generate-screenshots.js
```

### Adding Custom data-cli-* Attributes

You do not need to register custom attributes anymore! Use `getAttr(tag, 'dot.path')` from `lib/core/attr.js` inside your tag implementation. It automatically translates the dot path to the `data-cli-` prefix and reads it from the tag.

Example for input elements:
```javascript
import { getAttr } from '../core/attr.js';

// For input color
const colorIndicator = getAttr(tag, 'color.indicator');
const colorOpenBracket = getAttr(tag, 'color.open.bracket');
```

### Applying Colors

Theme values and `data-cli-*` values can be chalk-strings or (from the library API) functions. Never call them directly; use the helpers from `lib/core/color.js`, which handle both, empty values and `NO_COLOR`:

```javascript
import { applyColor, applyThemeColor } from '../core/color.js';

// data-cli-* attribute first, then the theme
const styledText = applyThemeColor(getAttr(tag, 'color'), context.theme.button.color, text);
const styledPrefix = applyColor(getAttr(tag, 'prefix.color') ?? context.theme.button.prefix?.color, prefixMarker);
```

Empty strings in `config.yaml` mean "not set / inherit". When a value falls back to another element's color (e.g. `td` → `tr` → `table`), chain the theme values with `||`, not `??`.

## Important Patterns

### WeakMap Caching

The rendering system uses WeakMaps for automatic garbage collection:
```javascript
const renderCache = new WeakMap();  // Auto-GC when nodes are no longer referenced
```

Never use regular Maps for caching DOM nodes - they prevent garbage collection.

### LRU Cache Pattern

For value-based caching (e.g., string length calculations), use LRU eviction:
```javascript
const cache = new Map();
const MAX_SIZE = 1000;

function cachedFunction(value) {
  if (cache.has(value)) return cache.get(value);

  const result = expensiveCalculation(value);
  cache.set(value, result);

  // LRU eviction
  if (cache.size > MAX_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }

  return result;
}
```

### Custom Attribute Access

Always use the pattern: `getAttr(tag, 'path') ?? context.theme.element?.property`
```javascript
const prefix = getAttr(tag, 'email.prefix.marker') ?? context.theme.input?.email?.prefix?.marker;
```

This ensures: custom attributes → theme → hardcoded fallback (in that order).

### Input Type Rendering

Input types use early returns with full inline tag objects:
```javascript
if (getAttribute(tag, 'type', 'text') === 'email') {
  // ... render email input
  return {
    pre: null,
    value: styledText,
    post: null,
    type: 'inline',
    nodeName: tag.nodeName,
  };
}
```

## Critical Rules

1. **`config.yaml` is the single source of truth** - Always read it before making theme changes. Use `config.yaml` as the definitive source for all default values. Do not create unnecessary fallbacks in code - if a value exists in config.yaml, trust it.

2. **Each tag uses ONLY its own configuration options** - Never use configuration from other tags. For example:
   - `<pre>` tag must use ONLY `context.theme.pre.*` options
   - `<code>` tag must use ONLY `context.theme.code.*` options
   - `<button>` tag uses `context.theme.button.*` (separate from `context.theme.input.button.*` which is for `<input type="button">`)
   - Table elements now use top-level themes: `context.theme.td`, `context.theme.th`, `context.theme.tr`, `context.theme.thead`, `context.theme.tbody`, `context.theme.tfoot`, `context.theme.caption` (not nested under `context.theme.table.*`)
   - Never mix options like using `pre` options inside `code` handler or vice versa
   - This ensures clear separation of concerns and maintainability

3. **Read custom attributes only through `getAttr()`** (`lib/core/attr.js`) - never read `data-cli-*` attributes with `getAttribute()` directly, so naming stays consistent with rule 13.

4. **Use WeakMap for DOM node caching** - Prevents memory leaks by allowing garbage collection

5. **Type-check color functions** - Theme values can be strings (from custom attributes) or functions (from parsed theme). Handle both cases appropriately.

6. **Never hardcode fallbacks** - Use theme values from `config.yaml`. If a value is missing from config, add it there instead of hardcoding it in the implementation. When accessing theme values, avoid redundant fallback chains:
   ```javascript
   // ❌ WRONG: Redundant fallbacks when value exists in config.yaml
   const marker = getAttr(tag, 'external.marker') || theme.external?.marker || '↗';

   // ✅ CORRECT: Trust config.yaml defaults
   const marker = getAttr(tag, 'external.marker') || theme.external?.marker;
   ```
   Only use hardcoded fallbacks for truly dynamic or computed values that cannot be in config.yaml.

7. **Use chalk-string syntax** - e.g., `"red bold"`, `"bgBlue white underline"` for all color definitions

8. **ESM modules only** - This project uses ES modules (`import`/`export`)

9. **Do not execute git commands** - Never run git operations (commit, push, add, etc.) without explicit user permission

10. **Use standard configuration structures** - Always use `prefix/suffix` (not `open/close`), `indicator`, `border`, and `padding` patterns as defined in the Theme Structure section. This ensures consistency across all configuration

11. **Keep disabled states separate for each element** - Even if disabled state values are identical across elements (e.g., `gray dim`), maintain separate configurations for each element type. This allows flexibility for future customization:
    - `input.disabled.color: gray dim`
    - `button.disabled.color: gray dim`
    - `fieldset.disabled.color: gray dim`
    - `select.disabled.color: gray dim`
    - `option.disabled.color: gray dim`

    DO NOT consolidate into a global `disabled.color` configuration. Each element should have its own disabled state, even if values are currently the same. This redundancy is intentional and allows independent styling.

12. **Feature-based configuration for complex elements** - Complex elements like `code` should organize features as nested objects with `enabled` flags. Features can contain sub-features:
    ```yaml
    code:
      color: yellowBright bgBlack  # Default color (used for inline code)
      highlight:  # Feature that can be used with any code
        color: bgYellowBright black
      block:  # Feature for block code (applies only to <pre><code>)
        enabled: true
        color: yellowBright
        numbers:  # Sub-feature inside block
          enabled: true
          color: blackBright dim
        gutter:  # Another sub-feature inside block
          enabled: false
          marker: ' │ '
          color: blackBright dim
    ```

13. **Data attribute naming convention** - All `data-cli-*` attributes map directly to `config.yaml` structure:
    - **Simple values**: `config.yaml: tag.property` → `data-cli-property=<value>`
      - `button.color` → `data-cli-color="white bold"`
    - **Nested objects**: `config.yaml: tag.object.property` → `data-cli-object-property=<value>`
      - `samp.prefix.marker` → `data-cli-prefix-marker="$ "`
      - `samp.prefix.color` → `data-cli-prefix-color="green"`
    - **Feature-based nesting**: `config.yaml: tag.feature.nested.property` → `data-cli-feature-nested-property=<value>`
      - `code.block.numbers.color` → `data-cli-block-numbers-color` (keep ALL levels)
      - `code.block.label.prefix.marker` → `data-cli-block-label-prefix-marker` (keep "block" and "label")
      - `code.block.gutter.marker` → `data-cli-block-gutter-marker`
    - **Arrays/Indicators**: `config.yaml: tag.indicators[].property` → `data-cli-indicator-property=<value>`
      - `ol.indicators[].marker` → `data-cli-indicator-marker=")"`
      - `ol.indicators[].color` → `data-cli-indicator-color="red"`
    - **Input types**: `config.yaml: input.type.object.property` → `data-cli-type-object-property=<value>`
      - `input.checkbox.checked.marker` → `data-cli-checkbox-checked-marker`
      - `input.checkbox.prefix.color` → `data-cli-checkbox-prefix-color`
    - **No redundant prefixes**: Don't repeat the tag name
      - ✅ Correct: `data-cli-prefix-marker` (on `<button>` element)
      - ❌ Wrong: `data-cli-button-prefix-marker` (redundant "button-" prefix)
    - **Keep ALL intermediate levels**: For clarity and consistency, include all nested object names
      - This makes mapping straightforward and predictable

14. **Custom attributes access via getAttr()** - Use `getAttr(tag, 'path.to.prop')` from `lib/core/attr.js`:
    - This automatically maps `getAttr(tag, 'numbers.enabled')` to reading `data-cli-numbers-enabled`.
    - Allows accessing nested attributes cleanly in code.

15. **Update types, documentation, and examples in proper locations** - When adding or modifying features, ALWAYS update all related files:
    - **TypeScript types**: Update `index.d.ts` for all public API changes (theme configuration, render options, etc.)
    - **Documentation**: Update `README.md` for user-facing features, never add documentation to random files
    - **Examples**: Add/update examples in `examples/html/tags/` or `examples/markdown/features/` directories
    - **Tests**: Add tests in `test/` directory using Node's built-in test runner
    - **Data attributes documentation**: Update `DATA_ATTRIBUTES.md` when adding new `data-cli-*` attributes
    - Never scatter documentation across multiple files - keep it organized in the designated locations

## Testing Strategy

Tests use Node's built-in test runner. When testing rendering:

```bash
# Test with actual files
node bin/html.js examples/html/tags/table.html

# Test with inline HTML
echo '<h1>Test</h1>' | node bin/html.js

# Test Markdown
node bin/markdown.js examples/markdown/features/alerts.md
```

`test/rendering/examples-snapshot.test.js` renders every file in `examples/html` and `examples/markdown` at 80 columns and compares the plain text with `test/snapshots/`. It also fails if any line is wider than 80 columns. After an intended output change, review the diff and update the snapshots:

```bash
UPDATE_SNAPSHOTS=1 npm test
git diff test/snapshots
```

For debugging, use `DEBUG=1` to print the stack trace of any tag that fails to render.

## Performance Optimizations

The codebase includes several memory and performance optimizations:

- **WeakMap caching** in `render-tag.js` for automatic garbage collection
- **Bounded caches** (max 10 entries per node for the render cache; theme cache cleared with the others every 10,000 render operations)
- **Context-based cache keys** to prevent over-caching
- **Depth limiting** (MAX_DEPTH = 100) to prevent stack overflow
- **registerCache()** system for coordinated cache management

When adding new features, maintain these patterns to avoid memory bloat.
