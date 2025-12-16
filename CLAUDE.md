# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`cli-html` is a terminal renderer for HTML and Markdown with GitHub Flavored Markdown support, syntax highlighting, and extensive theming. It can be used both as a CLI tool (`html`, `markdown`, `md` commands) and as a Node.js library (`renderHTML()`, `renderMarkdown()`).

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

2. **Tag System** (`lib/tags.js` + `lib/tags/*`):
   - Every HTML tag maps to a handler function
   - Handlers receive `(tag, context)` where context includes theme, line width, depth
   - Two main helpers: `blockTag()` for block elements, `inlineTag()` for inline elements
   - Tag functions return objects with `{ type, value, pre, post }` structure

3. **Theme Configuration** (`lib/utils/get-theme.js`):
   - Loads base theme from `config.yaml`
   - Merges user overrides from platform-specific config directory
   - Parses theme entries into chalk-string color functions
   - Handles type checking (functions vs strings) for color values

4. **Rendering Engine** (`lib/utils/render-tag.js`):
   - Recursive renderer with WeakMap caching for performance
   - Context-based cache keys prevent memory bloat
   - MAX_DEPTH protection (100 levels) prevents infinite recursion
   - Automatically garbage-collects unused cached nodes

### Critical Files

- **`config.yaml`**: Single source of truth for all theme defaults. Always read this file before making theme-related changes.
- **`lib/utilities.js`**: `getCustomAttributes()` function extracts all `data-cli-*` attributes. Add new custom attributes here.
- **`lib/utils/get-theme.js`**: Theme parser. When adding new themed elements, add parsing logic here.
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
   - Parsed by `getCustomAttributes()` in `lib/utilities.js`
   - Always takes precedence over global theme

### Theme Structure

Theme values are chalk-string compatible (e.g., `"red bold"`, `"bgBlue white underline"`).

#### Standard Configuration Types

The following standard structures are used throughout the configuration for consistency. These patterns are automatically handled by `parseStyleEntry()` which flattens nested structures (e.g., `prefix: {marker, color}` → `prefix` + `prefixColor`).

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
- `parseStyleEntry()` automatically flattens `{marker, color}` structures - don't add them to `extraKeys` unless you want to preserve the object
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
import { getCustomAttributes } from '../utilities.js';

export const yourTag = (tag, context) => {
  const custom = getCustomAttributes(tag);

  return blockTag(
    tag,
    context,
    custom.yourTagColor || context.theme.yourTag?.color,
    custom.yourTagMarker || context.theme.yourTag?.marker || '> '
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

4. **Update theme parser** in `lib/utils/get-theme.js`:
```javascript
const yourTagStyle = parseStyleEntry(
  customTheme.yourTag,
  baseTheme.yourTag,
  ["marker"]  // non-color fields
);
```

5. **Add custom attributes** in `lib/utilities.js` (if needed):
```javascript
export const getCustomAttributes = (tag) => {
  return {
    // ... existing attributes
    yourTagColor: getAttribute(tag, 'data-cli-your-tag-color', null),
    yourTagMarker: getAttribute(tag, 'data-cli-your-tag-marker', null),
  };
};
```

6. **Update TypeScript types** in `index.d.ts`:
```typescript
export interface YourTagStyle {
  color?: ChalkString;
  marker?: string;
}

export interface ThemeConfig {
  // ... existing tags
  yourTag?: ChalkString | YourTagStyle;
}
```

7. **Add example** in `examples/html/tags/your-tag.html`:
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

8. **Generate screenshot** (if applicable):
```bash
node scripts/generate-screenshots.js
```

### Adding Custom data-cli-* Attributes

All custom attributes must be registered in `lib/utilities.js` in the `getCustomAttributes()` function. This is the single location where ALL `data-cli-*` attributes are extracted.

Example for input elements:
```javascript
// For input color
colorIndicator: getAttribute(tag, 'data-cli-color-indicator', null),
colorOpenBracket: getAttribute(tag, 'data-cli-color-open-bracket', null),
colorCloseBracket: getAttribute(tag, 'data-cli-color-close-bracket', null),
```

### Theme Color Function Pattern

When adding new themed elements that need color functions:

1. **Parse style entry** (extracts color and non-color fields):
```javascript
const emailStyle = parseStyleEntry(
  customTheme.input?.email,
  baseTheme.input?.email,
  ["prefix"]  // Non-color fields - everything else becomes color functions
);
```

2. **Extract raw values**:
```javascript
const emailPrefix = emailStyle.prefix;
const emailPrefixColorValue = emailStyle.prefixColor;
const emailColorValue = emailStyle.color;
```

3. **Create color functions with type checking**:
```javascript
const emailPrefixColorFn = emailPrefixColorValue
  ? (typeof emailPrefixColorValue === 'function'
      ? emailPrefixColorValue
      : (text) => chalkString(emailPrefixColorValue, forceColor ? { colors: true } : undefined)(text))
  : null;
```

This pattern handles both string color values and already-processed color functions.

**IMPORTANT: When prefix/suffix are in extraKeys, colors must be converted to functions:**

When you use `parseStyleEntry()` with prefix/suffix in `extraKeys`, they remain as objects `{marker, color}` but the color values are strings, not functions. You MUST convert them:

```javascript
// 1. Parse with prefix/suffix in extraKeys
const buttonStyle = parseStyleEntry(
  customTheme.button,
  baseTheme.button,
  ["prefix", "suffix", "disabled"],  // Keep these as objects
);

// 2. Convert prefix/suffix colors to functions
const buttonPrefixColorFn = buttonStyle.prefix?.color
  ? (typeof buttonStyle.prefix.color === 'function'
      ? buttonStyle.prefix.color
      : (text) => chalkString(buttonStyle.prefix.color, forceColor ? { colors: true } : undefined)(text))
  : null;

const buttonSuffixColorFn = buttonStyle.suffix?.color
  ? (typeof buttonStyle.suffix.color === 'function'
      ? buttonStyle.suffix.color
      : (text) => chalkString(buttonStyle.suffix.color, forceColor ? { colors: true } : undefined)(text))
  : null;

// 3. Return with converted functions
return {
  button: {
    color: buttonStyle.color,  // Already a function
    prefix: {
      marker: buttonStyle.prefix?.marker,
      color: buttonPrefixColorFn,  // Now a function
    },
    suffix: {
      marker: buttonStyle.suffix?.marker,
      color: buttonSuffixColorFn,  // Now a function
    },
    disabled: buttonStyle.disabled,
  },
};
```

Without this conversion, calling `context.theme.button.prefix.color(text)` will fail because it's a string, not a function.

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

Always use the pattern: `custom.attribute || context.theme.element?.property || fallback`
```javascript
const prefix = custom.emailPrefix || context.theme.input?.email?.prefix || '✉ ';
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

3. **All custom attributes go in `lib/utilities.js`** - Never extract attributes elsewhere. The `getCustomAttributes()` function is the single point for all `data-cli-*` attribute extraction.

4. **Use WeakMap for DOM node caching** - Prevents memory leaks by allowing garbage collection

5. **Type-check color functions** - Theme values can be strings (from custom attributes) or functions (from parsed theme). Handle both cases appropriately.

6. **Never hardcode fallbacks** - Use theme values from `config.yaml`. If a value is missing from config, add it there instead of hardcoding it in the implementation. When accessing theme values, avoid redundant fallback chains:
   ```javascript
   // ❌ WRONG: Redundant fallbacks when value exists in config.yaml
   const marker = custom.external.marker || theme.external?.marker || '↗';

   // ✅ CORRECT: Trust config.yaml defaults
   const marker = custom.external.marker || theme.external?.marker;
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
    - All attribute extraction happens in `lib/utilities.js` via `getCustomAttributes()`

14. **Custom attributes structure is nested** - The `custom` object returned by `getCustomAttributes()` uses nested structure for related attributes:
    - **Flat attributes** for simple values: `custom.color`, `custom.marker`, `custom.border`
    - **Nested objects** for grouped attributes:
      ```javascript
      // OLD (flat):
      custom.numbersEnabled
      custom.numbersColor
      custom.gutterEnabled
      custom.gutterMarker
      custom.gutterColor

      // NEW (nested):
      custom.numbers.enabled
      custom.numbers.color
      custom.gutter.enabled
      custom.gutter.marker
      custom.gutter.color
      ```
    - **Examples of nested structures**:
      - Title: `custom.title.enabled`, `custom.title.color`, `custom.title.prefix.marker`, `custom.title.prefix.color`
      - External links: `custom.external.enabled`, `custom.external.marker`, `custom.external.color`
      - Numbers: `custom.numbers.enabled`, `custom.numbers.color`
      - Radio buttons: `custom.radio.checked.marker`, `custom.radio.prefix.color`
      - Range input: `custom.range.filled`, `custom.range.filledColor`, `custom.range.thumb`
    - This structure mirrors the YAML config structure and makes the code more maintainable

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

For debugging, use `DEBUG=1` or `DEBUG_INPUT=1` environment variables.

## Performance Optimizations

The codebase includes several memory and performance optimizations:

- **WeakMap caching** in `render-tag.js` for automatic garbage collection
- **LRU eviction** for bounded caches (max 1000 entries for visual length, max 10 per node for render cache)
- **Context-based cache keys** to prevent over-caching
- **Depth limiting** (MAX_DEPTH = 100) to prevent stack overflow
- **registerCache()** system for coordinated cache management

When adding new features, maintain these patterns to avoid memory bloat.
