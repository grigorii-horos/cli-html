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

# Input elements with prefix/suffix
samp:
  color: "yellowBright"
  prefix:
    marker: "$ "
    color: "green dim"
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

1. **`config.yaml` is the single source of truth** - Always read it before making theme changes
2. **All custom attributes go in `lib/utilities.js`** - Never extract attributes elsewhere
3. **Use WeakMap for DOM node caching** - Prevents memory leaks
4. **Type-check color functions** - Theme values can be strings or functions
5. **Never hardcode fallbacks** - Use theme values from `config.yaml`
6. **Use chalk-string syntax** - e.g., `"red bold"`, `"bgBlue white underline"`
7. **ESM modules only** - This project uses ES modules (`import`/`export`)

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
