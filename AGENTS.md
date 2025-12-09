# CLI-HTML Agent Documentation

This document provides comprehensive information about the cli-html project structure, configuration system, and customization capabilities for AI agents working with this codebase.

## ⚠️ CRITICAL: config.yaml as Single Source of Truth

**IMPORTANT:** The `config.yaml` file is the **single source of truth** for all theme configuration.

Before making any changes:
1. **Always read `config.yaml` first** to understand the current structure
2. **All defaults must be defined in `config.yaml`** - never use hardcoded fallbacks in JavaScript
3. **All documentation must match `config.yaml`** - when config changes, update AGENTS.md immediately
4. **Never guess the structure** - always verify against the actual config.yaml file

**When you need to:**
- Add a new theme property → Update `config.yaml` first, then sync all docs
- Show an example → Use exact values from `config.yaml`
- Document the structure → Copy directly from `config.yaml`
- Make code changes → Read `config.yaml` to get correct default values

See [Important Architecture Principles](#important-architecture-principles) for details.

## Project Overview

`cli-html` is a terminal renderer for HTML and Markdown with full GitHub Flavored Markdown support, syntax highlighting, and extensive customization options.

**Key Features:**
- Renders HTML and Markdown to formatted terminal output
- Supports all major HTML elements with terminal styling
- GitHub Flavored Markdown (GFM) support: alerts, task lists, tables, footnotes, etc.
- Dual configuration system: global theme + inline customization
- Syntax highlighting for code blocks
- Customizable colors, markers, borders, and styles

## Architecture

### Directory Structure

```
cli-html/
├── bin/                    # CLI executables
│   ├── html.js            # HTML renderer CLI
│   └── markdown.js        # Markdown renderer CLI
├── lib/                   # Core library
│   ├── tags/             # HTML tag implementations
│   │   ├── headers.js    # h1-h6 tags
│   │   ├── list.js       # ol, ul, li tags
│   │   ├── code.js       # code, pre tags
│   │   ├── table.js      # table, tr, td, th tags
│   │   ├── figure.js     # figure tag
│   │   ├── fieldset.js   # fieldset tag
│   │   ├── details.js    # details tag
│   │   ├── progress.js   # progress, meter tags
│   │   ├── select.js     # select, option, optgroup tags
│   │   └── ...           # other tag implementations
│   ├── tag-helpers/      # Helper functions for tags
│   │   ├── block-tag.js  # Block element helper
│   │   └── inline-tag.js # Inline element helper
│   ├── data/             # Static data
│   │   └── languages.js  # Language code to display name mapping (1100+ languages)
│   ├── utils/            # Utility functions
│   │   ├── list.js       # List-specific utilities
│   │   └── get-theme.js  # Theme configuration parser
│   ├── utilities.js      # Common utilities
│   ├── markdown.js       # Markdown renderer
│   └── html.js           # HTML renderer
├── config.yaml           # Default theme configuration
├── examples/             # Example HTML/Markdown files
│   ├── html/
│   │   ├── tags/         # Standard HTML examples
│   │   └── tags-custom/  # Custom attribute examples
│   ├── markdown/
│   └── library-usage/    # JS library usage examples
└── README.md
```

### Core Components

#### 1. Tag Rendering System

Each HTML tag has a corresponding implementation in `lib/tags/`:
- Tags use either `blockTag()` or `inlineTag()` helpers
- Each tag function receives `(tag, context)` parameters
- Context contains theme, line width, and other rendering settings
- Tags support custom attributes via `getCustomAttributes(tag)`

#### 2. Configuration System

**Two-level configuration:**

1. **Global Theme** (`config.yaml`):
   - Default styling for all elements
   - User overrides in platform-specific config directory
   - Linux: `~/.config/cli-html/config.yaml`
   - macOS: `~/Library/Preferences/cli-html/config.yaml`
   - Windows: `%LOCALAPPDATA%\cli-html\Config\config.yaml`

2. **Inline Customization** (data-cli-* attributes):
   - Per-element customization via HTML attributes
   - Overrides global theme settings
   - Supports all major visual parameters

#### 3. Utilities

**`lib/utilities.js`:**
- `getAttribute(tag, name, default)` - Get HTML attribute value
- `getCustomAttributes(tag)` - Extract all data-cli-* attributes
- `applyCustomColor(custom, theme, value, chalkString)` - Apply color with fallback
- `indentify(indent, skipFirst)` - Add indentation to text

**`lib/utils/list.js`:**
- `getListType(tagType, contextType)` - Determine list type with rotation
- `getOrderedListType(tagType, contextType, markers)` - Get ordered list type
- `getListMarker(markerType, markers, depth)` - Get marker for list depth
- `getListColor(listType, depth, markers)` - Get color for list depth
- `getListDecimal(depth, markers)` - Get decimal separator for list depth
- `getListItemNumber(number, type)` - Convert number to list format (1, A, I, etc.)

## Configuration Reference

### Theme Structure (config.yaml)

**IMPORTANT:** The `config.yaml` file is the **single source of truth** for all theme configuration. All examples and documentation must reflect the exact structure defined in this file.

```yaml
lineWidth:
  max: 120
  # value: 80  # Uncomment to set fixed line width

theme:
  # Headers
  h1:
    color: red bold
    marker: '#'
  h2:
    color: blue bold
    marker: '##'
  h3:
    color: blue bold
    marker: '###'
  h4:
    color: cyan bold
    marker: '####'
  h5:
    color: cyan
    marker: '#####'
  h6:
    color: cyan
    marker: '######'

  # Inline elements
  span:
    color: ''
  a:
    color: blue underline
    href:
      enabled: false
      color: gray
    title:
      enabled: false
      color: yellow
      prefix:
        marker: ' ('
        color: yellow
      suffix:
        marker: ')'
        color: yellow

  # Text styles
  del:
    color: bgRed black
    diff:
      enabled: false  # Enable diff-style markers
      style: git  # simple | git (git shows marker before text)
      marker: '-'  # Marker character
      color: red bold  # Marker color
  ins:
    color: bgGreen black
    diff:
      enabled: false  # Enable diff-style markers
      style: git  # simple | git (git shows marker before text)
      marker: '+'  # Marker character
      color: green bold  # Marker color
  strikethrough:
    color: strikethrough
  underline:
    color: underline
  bold:
    color: bold
  italic:
    color: italic
  i:
    color: italic
  em:
    color: italic
  cite:
    color: italic

  # Semantic elements
  samp:
    color: yellowBright
    prefix:
      marker: '$ '
      color: green dim
    suffix:
      marker: ''
      color: ''
  kbd:
    color: cyan
    prefix:
      marker: '['
      color: gray
    suffix:
      marker: ']'
      color: gray
    key:
      enabled: false  # Enable key-by-key styling
      style: simple  # simple | box (box wraps each key separately)
      separator: '+'  # Separator between keys (e.g., Ctrl+S)
  variableTag:
    color: blue italic
  mark:
    color: bgYellow black
  time:
    color: cyan
  abbr:
    color: underline
    title:
      color: cyan
      prefix:
        marker: '('
        color: gray
      suffix:
        marker: ')'
        color: gray
  dfn:
    color: underline italic
  sub:
    color: ''
    prefix:
      marker: '₍'
      color: gray dim
    suffix:
      marker: '₎'
      color: gray dim
  sup:
    color: ''
    prefix:
      marker: '⁽'
      color: gray dim
    suffix:
      marker: '⁾'
      color: gray dim

  # Block elements
  p:
    color: ''
  blockquote:
    color: black
    marker: '│ '
  address:
    color: italic
  hr:
    color: gray
    marker: '─'

  # Code blocks
  code:
    inline:
      color: yellowBright bgBlack
    block:
      color: yellowBright
      numbers:
        color: blackBright dim
        enabled: true
      gutter:
        enabled: false
        marker: ' │ '
        color: blackBright dim
      label:
        enabled: false
        position: top
        color: cyanBright bold
        prefix:
          marker: '「'
          color: gray
        suffix:
          marker: '」'
          color: gray
      highlight:
        color: bgYellow black
      padding:
        left: 1

  # Lists
  li:
    color: ''
  ol:
    color: ''
    indicators:
      '1':
        color: blueBright
        marker: '1'
        decimal: '.'
      I:
        color: cyanBright
        marker: I
        decimal: '.'
      A:
        color: magentaBright
        marker: A
        decimal: '.'
      i:
        color: blueBright
        marker: i
        decimal: '.'
      a:
        color: cyanBright
        marker: a
        decimal: '.'
    indent: '   '
  ul:
    color: ''
    indicators:
      disc:
        color: redBright
        marker: '•'
      square:
        color: yellowBright
        marker: '▪'
      circle:
        color: cyanBright
        marker: '⚬'
    indent: '  '

  # Tables
  table:
    header:
      color: bold red
    caption:
      color: bold blue
    cell:
      color: ''
    td:
      color: ''
    th:
      color: ''
    tr:
      color: ''
    thead:
      color: ''
    tbody:
      color: ''
    tfoot:
      color: ''
  dt:
    color: blue bold
  dd:
    color: cyan
  dl:
    color: ''

  # Containers with borders
  figure:
    color: gray
    border:
      color: gray
      style: round
      dim: false
    padding:
      top: 0
      bottom: 0
      left: 1
      right: 1
  figcaption:
    color: bgGreen bold
    prefix: ' '
    suffix: ' '
  fieldset:
    color: gray
    border:
      color: gray
      style: single
      dim: false
    title:
      color: yellow
    padding:
      top: 0
      bottom: 0
      left: 1
      right: 1
  details:
    color: gray
    indicator:
      open:
        marker: '▼ '
        color: gray
      closed:
        marker: '▶ '
        color: gray
    border:
      color: gray
      style: single
      dim: false
    padding:
      top: 0
      bottom: 0
      left: 1
      right: 1

  # Progress & input
  progress:
    filled:
      color: bgWhite green
      marker: '█'
    empty:
      color: bgBlack gray
      marker: '█'
  input:
    checkbox:
      checked:
        color: green bold
        marker: '✓'
      unchecked:
        color: gray
        marker: ' '
      open:
        color: gray
        marker: '['
      close:
        color: gray
        marker: ']'
    radio:
      checked:
        color: red bold
        marker: '•'
      unchecked:
        color: red bold
        marker: ' '
      open:
        color: gray
        marker: (
      close:
        color: gray
        marker: )
    button:
      open:
        color: bgBlack gray
        marker: '[ '
      close:
        color: bgBlack gray
        marker: ' ]'
      text:
        color: bgBlack bold
    textInput:
      color: cyanBright bgBlack
    textarea:
      color: cyanBright bgBlack
    range:
      filled:
        color: green
        marker: '█'
      empty:
        color: gray
        marker: '░'
      thumb:
        color: green bold
        marker: '●'
    color:
      prefix: '#'
    file:
      prefix:
        marker: '@'
        color: gray
      text:
        color: cyan
      placeholder: No file chosen

  # Images & media
  img:
    prefix:
      color: cyan
      marker: '!'
    open:
      color: gray
      marker: '['
    close:
      color: gray
      marker: ']'
    text:
      color: cyan

  # Select elements
  select:
    color: cyan bold
    prefix:
      marker: ''
      color: ''
    suffix:
      marker: ':'
      color: cyan bold
  option:
    color: ''
    selected:
      marker: '◉'
      color: green bold
    unselected:
      marker: '○'
      color: gray
  optgroup:
    indicator:
      marker: '▸ '
      color: cyan bold
    label:
      color: cyan bold
```

### Color Syntax (chalk-string)

**Basic colors:**
- `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`

**Bright colors:**
- `redBright`, `greenBright`, `yellowBright`, `blueBright`, `magentaBright`, `cyanBright`, `whiteBright`

**Background colors:**
- `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`

**Modifiers:**
- `bold`, `italic`, `underline`, `dim`, `inverse`, `strikethrough`

**Combining:**
- Separate with spaces: `"red bold"`, `"bgBlue white underline"`, `"green bold italic"`

## Inline Customization (data-cli-* attributes)

All data-cli-* attributes override global theme settings for specific elements.

### Universal Attributes

**`data-cli-color`** - Color and styles (chalk-string format)
- Applies to: All text elements
- Example: `<h1 data-cli-color="magenta bold">Title</h1>`
- Special cases:
  - For `ol`/`ul`: applies to list item text
  - For `pre`: applies to code text

### Lists (ol, ul)

**Attributes:**
- `data-cli-color` - Text color for list items
- `data-cli-marker-color` - Marker color
- `data-cli-marker` - Marker symbol (ul only)
- `data-cli-decimal` - Decimal separator (ol only)

**Examples:**
```html
<ol data-cli-color="green" data-cli-marker-color="red bold" data-cli-decimal=")">
  <li>Green text with red bold marker and ) separator</li>
</ol>

<ul data-cli-color="yellow" data-cli-marker="★" data-cli-marker-color="cyan">
  <li>Yellow text with cyan star marker</li>
</ul>
```

### Code Blocks (pre, code)

**Attributes:**
- `data-cli-color` - Code text color
- `data-cli-numbers-enabled` - Show line numbers (true/false)
- `data-cli-numbers-color` - Line numbers color
- `data-cli-highlight-lines` - Highlight specific lines. Format: `"2-5,7,10-18"` (ranges and individual lines)
- `data-cli-gutter-enabled` - Show/hide gutter separator (true/false)
- `data-cli-gutter-separator-marker` - Custom separator between line numbers and code
- `data-cli-gutter-separator-color` - Color for the gutter separator
- `data-cli-lang-label-enabled` - Show/hide language label (true/false)
- `data-cli-lang-label-position` - Position of label: "top" or "bottom"
- `data-cli-lang-label-color` - Color for the language name text
- `data-cli-lang-label-prefix-marker` - Marker before language name (e.g., "[ ")
- `data-cli-lang-label-prefix-color` - Color for prefix marker
- `data-cli-lang-label-suffix-marker` - Marker after language name (e.g., " ]")
- `data-cli-lang-label-suffix-color` - Color for suffix marker
- `data-cli-highlight-color` - Color for highlighted lines (default: "bgYellowBright black")

**Examples:**
```html
<!-- Basic code block -->
<pre data-cli-color="green" data-cli-numbers-color="yellow bold">
  <code>function example() { }</code>
</pre>

<!-- Disable line numbers -->
<pre data-cli-numbers-enabled="false">
  <code>// No line numbers</code>
</pre>

<!-- Highlight specific lines -->
<pre data-cli-highlight-lines="2,4-6">
  <code>Line 1
Line 2 - highlighted
Line 3
Line 4 - highlighted
Line 5 - highlighted
Line 6 - highlighted
Line 7
</code>
</pre>

<!-- Custom highlight color -->
<pre data-cli-highlight-lines="2" data-cli-highlight-color="bgRed white bold">
  <code>Line 1
Line 2 - red highlight
Line 3
</code>
</pre>

<!-- Complex ranges: 2-5,7,10-18 -->
<pre data-cli-highlight-lines="2-5,7,10-18" data-cli-highlight-color="bgGreen black">
  <code>Line 1
Line 2 - highlighted (range 2-5)
Line 3 - highlighted
Line 4 - highlighted
Line 5 - highlighted
Line 6
Line 7 - highlighted (single)
Line 8
Line 9
Line 10 - highlighted (range 10-18)
Line 11 - highlighted
...
Line 18 - highlighted
Line 19
</code>
</pre>

<!-- Custom gutter separator -->
<pre data-cli-gutter-separator-marker=" → " data-cli-gutter-separator-color="blue bold">
  <code class="lang-js">const x = 42;</code>
</pre>

<!-- Language label with prefix/suffix -->
<pre data-cli-lang-label-enabled="true"
     data-cli-lang-label-prefix-marker="[ "
     data-cli-lang-label-suffix-marker=" ]"
     data-cli-lang-label-position="top">
  <code class="language-python">def hello(): pass</code>
</pre>
```

### Borders (figure, fieldset, details)

**Attributes:**
- `data-cli-border` - Border color
- `data-cli-border-style` - Border style (round, single, double, classic, etc.)
- `data-cli-border-dim` - Dim border (true/false)
- `data-cli-title-color` - Title color (fieldset only)
- `data-cli-marker` - Marker (details only)

**Border styles:**
- `round` - ╭─╮│╰─╯
- `single` - ┌─┐││└─┘
- `double` - ╔═╗║╚═╝
- `classic` - +-+|+-+
- `bold` - ┏━┓┃┗━┛
- `singleDouble` - ╓─╖║╙─╜
- `doubleSingle` - ╒═╕│╘═╛
- `arrow` - ↘↓↙→←↗↑↖

**Examples:**
```html
<figure data-cli-border="blue" data-cli-border-style="double">
  <figcaption>Custom Border</figcaption>
  <p>Content</p>
</figure>

<fieldset data-cli-border="green" data-cli-border-style="round"
          data-cli-title-color="red bold">
  <legend>Legend</legend>
  <p>Content</p>
</fieldset>

<details data-cli-border="magenta" data-cli-marker="> ">
  <summary>Summary</summary>
  <p>Content</p>
</details>
```

### Progress/Meter

**Attributes:**
- `data-cli-filled-color` - Filled portion color
- `data-cli-filled-marker` - Filled portion marker
- `data-cli-empty-color` - Empty portion color
- `data-cli-empty-marker` - Empty portion marker

**Examples:**
```html
<progress value="70" max="100"
          data-cli-filled-color="green bold"
          data-cli-filled-marker="▰"
          data-cli-empty-color="gray"
          data-cli-empty-marker="▱"></progress>
```

### Headers (h1-h6)

**Attributes:**
- `data-cli-color` - Text color
- `data-cli-marker` - Marker symbol

**Examples:**
```html
<h1 data-cli-color="magenta bold" data-cli-marker="►">Custom Header</h1>
```

### Tables (table, th, td, caption)

**Attributes:**
- `data-cli-color` - Cell/header/caption text color

**Examples:**
```html
<th data-cli-color="red bold">Header</th>
<td data-cli-color="green">Cell</td>
<caption data-cli-color="blue bold">Caption</caption>
```

### Text Styles (span, strong, em, etc.)

**Attributes:**
- `data-cli-color` - Text color

**Examples:**
```html
<span data-cli-color="bgRed white bold">Highlighted</span>
<strong data-cli-color="green">Strong text</strong>
```

### Abbreviations (abbr, dfn)

**Attributes:**
- `data-cli-color` - Abbreviation text color
- `data-cli-title-color` - Title (definition) color
- `data-cli-title-prefix-marker` - Opening marker for title
- `data-cli-title-prefix-color` - Color for opening marker
- `data-cli-title-suffix-marker` - Closing marker for title
- `data-cli-title-suffix-color` - Color for closing marker

**Examples:**
```html
<abbr title="HyperText Markup Language"
      data-cli-color="blue bold"
      data-cli-title-color="cyan">HTML</abbr>
```

### Blockquotes

**Attributes:**
- `data-cli-color` - Text color
- `data-cli-marker` - Marker symbol

**Examples:**
```html
<blockquote data-cli-color="gray italic" data-cli-marker="▌ ">
  Quote text
</blockquote>
```

## Important Architecture Principles

### 1. config.yaml as Single Source of Truth

**CRITICAL:** The `config.yaml` file is the **single source of truth** for all theme configuration.

- ✅ All default values must be defined in `config.yaml`
- ✅ All documentation examples must match `config.yaml` structure exactly
- ✅ All code examples in AGENTS.md must reflect current `config.yaml`
- ❌ Never add fallback values in JavaScript code
- ❌ Never use hardcoded defaults scattered across files

The `lib/utils/get-theme.js` file does NOT use fallback values - it reads directly from the config structure:

**❌ WRONG:**
```javascript
const codeColor = baseTheme.code?.block?.color ?? "yellowBright";
```

**✅ CORRECT:**
```javascript
const codeColor = baseTheme.code?.block?.color;
```

This ensures that the theme system is predictable and all defaults are defined in `config.yaml`, not scattered across JavaScript files.

### 2. Language Detection in Code Blocks

Language detection is automatic via the `class` attribute:
- `class="lang-javascript"` → JavaScript
- `class="language-python"` → Python

The library includes a mapping of 1100+ languages in `lib/data/languages.js`, converting short codes to display names (e.g., "js" → "JavaScript", "py" → "Python").

### 3. Prefix/Suffix Pattern

Many elements now use a consistent prefix/suffix pattern for wrapping markers:

```yaml
element:
  prefix:
    marker: "["
    color: "gray"
  suffix:
    marker: "]"
    color: "gray"
```

This applies to:
- Code block language labels
- Abbreviation titles
- Link titles
- Image alt text
- Keyboard shortcuts (kbd)
- Sample output (samp)
- Subscript/superscript

### 4. Special Display Features with enabled Flags

**CRITICAL PATTERN:** All special display features that can change the visual structure or add extra elements must be isolated in nested objects with an `enabled` flag.

**Examples of special display features:**
- Code block line numbers (`code.block.numbers.enabled`)
- Code block language labels (`code.block.label.enabled`)
- Link href display (`a.href.enabled`)
- Link title display (`a.title.enabled`)
- Diff-style markers for del/ins (`del.diff.enabled`, `ins.diff.enabled`)
- Key-by-key styling for kbd (`kbd.key.enabled`)

**Pattern structure:**
```yaml
element:
  color: "base color"
  specialFeature:
    enabled: false  # Must be false by default
    style: "variant"  # Style variant (e.g., simple, git, box)
    marker: "symbol"  # Display marker/symbol
    color: "feature color"  # Color for the special feature
```

**Why this pattern:**
- Ensures backward compatibility (features disabled by default)
- Makes features discoverable in configuration
- Provides clear on/off toggle without removing configuration
- Separates base styling from enhanced features
- All defaults centralized in config.yaml

**When to use this pattern:**
- ✅ Feature adds new visual elements (markers, labels, prefixes)
- ✅ Feature changes display structure (line numbers, boxes)
- ✅ Feature is optional enhancement (not core rendering)
- ❌ Feature is just a color/style change (use simple color property)
- ❌ Feature is core to element rendering (use direct property)

### 5. Attribute Inheritance (pre/code)

For code blocks, custom attributes can be placed on either `<pre>` or `<code>` tags:
- Attributes on `<pre>` take precedence
- Attributes on `<code>` are used as fallback
- This allows flexible customization at either level

## Implementation Guide for Agents

### Adding New Custom Attributes

1. **Update `lib/utilities.js`:**
```javascript
export const getCustomAttributes = (tag) => {
  return {
    // ... existing attributes
    newAttribute: getAttribute(tag, 'data-cli-new-attribute', null),
  };
};
```

2. **Update tag implementation:**
```javascript
import chalkString from 'chalk-string';

export const myTag = (tag, context) => {
  const custom = getCustomAttributes(tag);

  // ✅ CORRECT: Use theme value directly (no fallback)
  const value = custom.newAttribute || context.theme.myTag.defaultValue;

  // Apply color using chalkString
  const coloredValue = chalkString(value, { colors: true })('text content');

  // Use value in rendering
};
```

3. **Update config.yaml** (if needed):
```yaml
theme:
  myTag:
    defaultValue: "red bold"  # All defaults must be in config.yaml
```

**Important:** When using `chalkString`:
- Always pass `{ colors: true }` as the second parameter
- The first parameter is the color string (chalk-string format)
- The returned function is then called with the text to style

```javascript
// ✅ CORRECT
const styledText = chalkString('red bold', { colors: true })('Hello');

// ❌ WRONG
const styledText = chalkString('red bold')('Hello');  // Missing { colors: true }
```

4. **Add examples:**
- Create example in `examples/html/tags-custom/`
- Update README.md documentation

5. **Synchronize with config.yaml:**
- When adding new theme properties, ALWAYS update `config.yaml` first
- Then update AGENTS.md "Theme Structure" section to match exactly
- Verify all examples use the same default values as `config.yaml`
- Never create documentation examples with different defaults

### Adding Special Display Features with enabled Flags

When adding a new optional display feature that changes visual structure or adds extra elements:

**1. Update config.yaml first:**
```yaml
theme:
  myElement:
    color: "base color"
    specialFeature:
      enabled: false  # MUST be false by default
      style: "simple"  # Default style variant
      marker: "→"  # Default marker/symbol
      color: "cyan"  # Feature-specific color
```

**2. Update lib/utils/get-theme.js:**
Add the new element with its nested structure to extraKeys:
```javascript
myElement: parseStyleEntry(
  customTheme.myElement,
  baseTheme.myElement,
  ["specialFeature"]  // Include nested object in extraKeys
),
```

**3. Update tag implementation (lib/tags/my-element.js):**
```javascript
export const myElement = inlineTag((value, tag, context) => {
  const custom = getCustomAttributes(tag);
  const theme = context.theme.myElement || {};
  const specialFeature = theme.specialFeature || {};

  const styledValue = applyCustomColor(
    custom.color,
    theme.color,
    value,
    chalkString
  );

  // Check if special feature is enabled
  const isEnabled = specialFeature.enabled === true;
  if (!isEnabled) {
    return styledValue;
  }

  // Apply special feature
  const style = specialFeature.style || 'simple';
  const marker = specialFeature.marker || '→';
  const featureColor = specialFeature.color || '';

  const styledMarker = featureColor
    ? chalkString(featureColor, { colors: true })(marker)
    : marker;

  if (style === 'simple') {
    return `${styledMarker} ${styledValue}`;
  }

  // Add other style variants...
  return styledValue;
});
```

**4. Update TypeScript definitions (index.d.ts):**
```typescript
export interface MyElementFeatureStyle {
  enabled?: boolean;
  style?: 'simple' | 'advanced';
  marker?: string;
  color?: ChalkString;
}

export interface MyElementStyle {
  color?: ChalkString;
  specialFeature?: MyElementFeatureStyle;
}

export interface Theme {
  // ... other properties
  myElement?: ChalkString | MyElementStyle;
}
```

**5. Test the implementation:**
```bash
# Test with feature disabled (default)
echo '<myElement>Test</myElement>' | node bin/html.js

# Test with feature enabled
# Create test config with enabled: true
node bin/html.js --config /tmp/test-config.yaml test.html
```

**6. Update AGENTS.md:**
- Add to theme structure section
- Document inline customization attributes if applicable
- Add examples showing enabled: false and enabled: true

### Synchronizing Documentation with config.yaml

**When config.yaml changes:**

1. **Read the entire config.yaml** to get current structure
2. **Update AGENTS.md** "Theme Structure" section with exact YAML from config.yaml
3. **Update all code examples** in AGENTS.md to use correct default values
4. **Check CUSTOMIZATION.md** for consistency with new structure
5. **Verify examples/** files use correct defaults

**Example workflow:**
```bash
# 1. Make changes to config.yaml
vim config.yaml

# 2. Read and copy the entire theme structure
cat config.yaml

# 3. Update AGENTS.md with the exact YAML structure
# 4. Test all examples still work
node bin/html.js examples/html/tags-custom/*.html
```

### Modifying List Structure

**Current structure (from config.yaml):**
```yaml
ol:
  color: ''
  indicators:
    '1':
      color: blueBright
      marker: '1'
      decimal: '.'
    I:
      color: cyanBright
      marker: I
      decimal: '.'
    A:
      color: magentaBright
      marker: A
      decimal: '.'
    i:
      color: blueBright
      marker: i
      decimal: '.'
    a:
      color: cyanBright
      marker: a
      decimal: '.'
  indent: '   '

ul:
  color: ''
  indicators:
    disc:
      color: redBright
      marker: '•'
    square:
      color: yellowBright
      marker: '▪'
    circle:
      color: cyanBright
      marker: '⚬'
  indent: '  '
```

**Key functions in `lib/utils/list.js`:**
- `getListColor(listType, depth, customMarkers)` - Returns marker color for depth
- `getListMarker(markerType, customMarkers, depth)` - Returns marker symbol for depth
- `getListDecimal(depth, customMarkers)` - Returns decimal separator for depth (ordered lists only)
- `getOrderedListType(tagType, contextType, customMarkers)` - Determines list type with rotation

### Testing Changes

**Manual testing:**
```bash
# Test HTML rendering
node bin/html.js examples/html/tags-custom/lists.html

# Test Markdown rendering
node bin/markdown.js examples/markdown/full/gfm-features.md

# Test with custom config
node bin/html.js your-test-file.html
```

**Test file locations:**
- `examples/html/tags/` - Standard tag examples
- `examples/html/tags-custom/` - Custom attribute examples
- `/tmp/test-*.html` - Temporary test files

## Common Patterns

### Pattern 1: Simple Color Customization

```javascript
export const myTag = (tag, context) => {
  const custom = getCustomAttributes(tag);

  return blockTag(
    (value) => {
      const styledValue = applyCustomColor(
        custom.color,
        context.theme.myTag.color,
        value,
        chalkString
      );
      return styledValue;
    }
  )(tag, context);
};
```

### Pattern 2: Nested Configuration (like code blocks)

```javascript
export const pre = (tag, context) => {
  const custom = getCustomAttributes(tag);

  // Also check for attributes on child <code> tag
  const codeTag = tag.childNodes?.find(child => child.nodeName === 'code');
  const codeCustom = codeTag ? getCustomAttributes(codeTag) : {};

  const newContext = {
    ...context,
    customCodeColor: custom.color || codeCustom.color,
    customNumbersEnabled: custom.numbersEnabled ?? codeCustom.numbersEnabled,
    customNumbersColor: custom.numbersColor || codeCustom.numbersColor,
    customHighlightLines: custom.highlightLines || codeCustom.highlightLines,
    customHighlightColor: custom.highlightColor || codeCustom.highlightColor,
    customGutterEnabled: custom.gutterEnabled ?? codeCustom.gutterEnabled,
    customGutterSeparatorMarker: custom.gutterSeparatorMarker || codeCustom.gutterSeparatorMarker,
    customGutterSeparatorColor: custom.gutterSeparatorColor || codeCustom.gutterSeparatorColor,
    customLangLabelEnabled: custom.langLabelEnabled ?? codeCustom.langLabelEnabled,
    customLangLabelPosition: custom.langLabelPosition || codeCustom.langLabelPosition,
    customLangLabelColor: custom.langLabelColor || codeCustom.langLabelColor,
    customLangLabelPrefixMarker: custom.langLabelPrefixMarker || codeCustom.langLabelPrefixMarker,
    customLangLabelPrefixColor: custom.langLabelPrefixColor || codeCustom.langLabelPrefixColor,
    customLangLabelSuffixMarker: custom.langLabelSuffixMarker || codeCustom.langLabelSuffixMarker,
    customLangLabelSuffixColor: custom.langLabelSuffixColor || codeCustom.langLabelSuffixColor,
  };

  return blockTag(...)(tag, newContext);
};
```

### Pattern 3: Border Elements

```javascript
export const myBorderElement = (tag, context) => {
  const custom = getCustomAttributes(tag);

  const borderColor = custom.border || context.theme.myElement.border.color;
  const borderStyle = custom.borderStyle || context.theme.myElement.border.style;
  const dimBorder = custom.borderDim !== null
    ? custom.borderDim
    : context.theme.myElement.border.dim;

  // Use in boxen() or similar
};
```
