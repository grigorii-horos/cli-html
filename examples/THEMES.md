# Theme Configuration Guide

Complete guide to customizing the default theme via `config.yaml`.

## Table of Contents

- [Overview](#overview)
- [Configuration File](#configuration-file)
- [Theme Structure](#theme-structure)
- [Color Format](#color-format)
- [Complete Example](#complete-example)

## Overview

Themes control the default appearance of all HTML and Markdown elements. You can customize colors, markers, borders, and other visual properties.

**Two ways to customize appearance:**

1. **Theme (config.yaml)** - Sets defaults for all documents
2. **data-cli-* attributes** - Override theme on specific elements

The repository's [`config.yaml`](../config.yaml) holds every default and is the authoritative key list. Your overrides are deep-merged onto it, so you only need to write the keys you want to change.

## Configuration File

Create `config.yaml` in the per-command config directory (`~/.config/cli-html/` for `html`, `~/.config/cli-markdown/` for `markdown`/`md` on Linux; see the [main README](../README.md#for-cli-usage) for macOS/Windows), or pass one with `--config <path>`. In the library, pass the same `theme` keys as an object to `renderHTML()` / `renderMarkdown()` / `renderJSX()`.

```yaml
lineWidth:
  max: 120          # Maximum line width (defaults to terminal width, capped here)
  # value: 80       # Fixed line width
asciiMode: false    # true = ASCII characters instead of Unicode

theme:
  h1:
    color: red bold
    indicator:
      marker: "#"
      color: red bold
  h2: blue bold     # Shorthand for { color: blue bold }
  # ... more elements
```

**Shorthand:** any entry that is an object with a `color` key can be written as a plain string: `h1: "red bold"` is the same as `h1: { color: "red bold" }`.

**Inheritance:** an empty color (`''`) means "no own color" and inherits from the parent element (`li` → `ul`/`ol`; `td` → `tr` → `tbody`/`tfoot` → `table`; `th` → `tr` → `thead` → `table`).

## Theme Structure

### Basic Elements

#### Headers (h1-h6)

```yaml
theme:
  h1:
    color: red bold          # Header text color
    indicator:
      marker: "#"            # Marker before the text ("" to hide)
      color: red bold        # Marker color
  h2:
    color: blue bold
    indicator: { marker: "##", color: blue bold }
  h3:
    color: blue bold
    indicator: { marker: "###", color: blue bold }
  h4:
    color: cyan bold
    indicator: { marker: "####", color: cyan bold }
  h5:
    color: cyan
    indicator: { marker: "#####", color: cyan }
  h6:
    color: cyan
    indicator: { marker: "######", color: cyan }
```

#### Paragraphs and Text

```yaml
theme:
  p:
    color: ''               # Default paragraph color (empty = terminal default)

  bold:
    color: bold             # <b>, <strong>

  italic:
    color: italic           # <italic>
  i:
    color: italic
  em:
    color: italic
  cite:
    color: italic

  underline:
    color: underline        # <u>, <underline>

  strikethrough:
    color: strikethrough    # <s>, <strike>, <strikethrough>

  mark:
    color: bgYellow black   # Highlighted text

  span:
    color: ''
```

#### Links

```yaml
theme:
  a:
    color: blue underline   # Link text color
    href:
      enabled: auto         # true | false | auto (show URL only if terminal lacks hyperlinks)
      color: gray
    title:
      enabled: false
      color: yellow
      prefix: { marker: " (", color: yellow }
      suffix: { marker: ")", color: yellow }
    external:
      enabled: false        # Indicator for external links
      marker: "↗"
      color: gray
      position: after       # before | after
      spacing: " "

  q:
    color: ''
    prefix: { marker: '"', color: '' }
    suffix: { marker: '"', color: '' }
    cite:
      enabled: false        # Style as link when cite attribute present
      color: magenta
```

### Lists

#### Unordered Lists (ul)

```yaml
theme:
  ul:
    color: ''               # List text color
    indicators:             # Marker configuration by type
      disc:
        color: redBright    # Marker color
        marker: "•"         # Marker symbol
      square:
        color: yellowBright
        marker: "▪"
      circle:
        color: cyanBright
        marker: "◦"
    indent: "  "            # Indentation for nested items

  li:
    color: ''               # List item text color (empty = inherit from ul/ol)
```

**Properties:**
- `color` - Color for list text
- `indicators` - Object with marker configurations by type (disc, square, circle)
  - `disc.color` / `disc.marker` - Disc marker (default: "•")
  - `square.color` / `square.marker` - Square marker (default: "▪")
  - `circle.color` / `circle.marker` - Circle marker (default: "◦")
- `indent` - Indentation string for nested items

**HTML Attribute Support:**

Lists also support the standard HTML `type` attribute:

```html
<ul type="disc">
  <li>Disc marker (uses theme.ul.indicators.disc)</li>
</ul>

<ul type="square">
  <li>Square marker (uses theme.ul.indicators.square)</li>
</ul>

<ul type="circle">
  <li>Circle marker (uses theme.ul.indicators.circle)</li>
</ul>
```

#### Ordered Lists (ol)

```yaml
theme:
  ol:
    color: ''               # List text color
    indicators:             # Marker configuration by type
      "1":
        color: blueBright   # Marker color
        marker: "1"         # Marker type
        decimal: "."        # Separator after number
      I:
        color: cyanBright
        marker: "I"
        decimal: "."
      A:
        color: magentaBright
        marker: "A"
        decimal: "."
      i:
        color: blueBright
        marker: "i"
        decimal: "."
      a:
        color: cyanBright
        marker: "a"
        decimal: "."
    indent: "   "           # Indentation for nested items
```

**Properties:**
- `color` - Color for list text
- `indicators` - Object with marker configurations by type (`"1"`, `A`, `a`, `I`, `i`), each with:
  - `color` - Marker color
  - `marker` - Marker type (`1` decimal, `A`/`a` letters, `I`/`i` Roman numerals)
  - `decimal` - Separator after the number/letter (default: ".")
- `indent` - Indentation string for nested items

**HTML Attribute Support:**

Lists also support the standard HTML `type` attribute:

```html
<ol type="1">
  <li>Decimal: 1, 2, 3... (uses theme.ol.indicators["1"])</li>
</ol>

<ol type="A">
  <li>Uppercase: A, B, C... (uses theme.ol.indicators.A)</li>
</ol>

<ol type="a">
  <li>Lowercase: a, b, c... (uses theme.ol.indicators.a)</li>
</ol>

<ol type="I">
  <li>Roman uppercase: I, II, III... (uses theme.ol.indicators.I)</li>
</ol>

<ol type="i">
  <li>Roman lowercase: i, ii, iii... (uses theme.ol.indicators.i)</li>
</ol>
```

#### Definition Lists

```yaml
theme:
  dl:
    color: ''
  dt:
    color: blue bold        # Definition term color
    suffix: { marker: " ::", color: gray dim }
  dd:
    color: cyan             # Definition description color
```

### Code

#### Inline Code and Code Blocks

All code styling lives under `code`; `block` applies only to `<pre><code>`.

```yaml
theme:
  code:
    color: yellowBright bgBlack   # Inline code color
    highlight:
      color: bgYellowBright black # Highlighted lines
    block:
      enabled: true
      color: yellowBright         # Block code text color
      numbers:
        enabled: true             # Show line numbers
        color: blackBright dim
      gutter:
        enabled: false
        marker: " │ "
        color: blackBright dim
      label:
        enabled: false            # Language label
        position: top             # top | bottom
        color: bgBlack cyan
        prefix: { marker: "[", color: gray bgBlack }
        suffix: { marker: "]", color: gray bgBlack }
      overflowIndicator:
        enabled: true             # Marker for wrapped continuation lines
        marker: "↳"
        color: blackBright dim
      diff:
        enabled: false            # Git-style diff highlighting
        added:
          color: bgGreen black
          indicator: { marker: "+ ", color: green bold }
        removed:
          color: bgRed black
          indicator: { marker: "- ", color: red bold }
        modified:
          color: bgYellow black
          indicator: { marker: "~ ", color: yellow bold }
        unchanged:
          color: ''
          indicator: { marker: "  " }
```

#### Preformatted Text (pre)

```yaml
theme:
  pre:
    padding: { top: 0, bottom: 0, left: 1, right: 0 }
```

#### Keyboard, Sample, Variable

```yaml
theme:
  kbd:
    color: cyan
    prefix: { marker: "[", color: gray }
    suffix: { marker: "]", color: gray }
    key:
      enabled: false        # Per-key styling: [ Ctrl ] + [ S ]
      style: simple         # simple | box
      separator: "+"

  samp:
    color: yellowBright
    prefix: { marker: "", color: green dim }
    suffix: { marker: "", color: '' }

  var:
    color: blue italic
```

### Containers with Borders

#### Blockquote

```yaml
theme:
  blockquote:
    color: ''               # Quote text color
    indicators:             # Left border, rotating by nesting depth
      - marker: "│ "
        color: blue
      - marker: "┃ "
        color: cyan
      - marker: "┆ "
        color: magenta
```

#### Horizontal Rule (hr)

```yaml
theme:
  hr:
    color: gray             # Line color
    style: single           # single | double | bold | dashed | dotted
    marker: ''              # Explicit character (overrides style when non-empty)
```

#### Figure, Dialog, Details, Fieldset

Boxed elements share the `border` and `padding` structures:

```yaml
border:
  color: gray               # Border color
  style: round              # round | single | double | bold | classic
  dim: false                # Dim border
padding: { top: 0, bottom: 0, left: 1, right: 1 }
```

```yaml
theme:
  figure:
    color: gray             # Content color
    border: { color: gray, style: round, dim: false }
    padding: { top: 0, bottom: 0, left: 1, right: 1 }

  figcaption:
    color: bgGreen bold     # Caption text color
    prefix: " "             # Text before caption
    suffix: " "             # Text after caption

  dialog:
    color: ''
    border: { color: cyan, style: round, dim: false }
    padding: { top: 0, bottom: 0, left: 1, right: 1 }

  details:
    color: gray
    collapse: { enabled: false }   # true: closed <details> show only the summary
    indicator:
      open: { marker: "▼ ", color: gray }
      closed: { marker: "▶ ", color: gray }
    border: { color: gray, style: single, dim: false }
    padding: { top: 0, bottom: 0, left: 1, right: 1 }

  fieldset:
    color: gray
    disabled: { color: gray dim }
    border: { color: gray, style: single, dim: false }
    title:
      color: yellow         # Legend text color
    required:
      enabled: true         # Required indicator next to the legend
      indicator: { marker: "*", color: red, position: after }  # before | after
    padding: { top: 0, bottom: 0, left: 1, right: 1 }
```

#### Other Containers

`div`, `header`, `footer`, `article`, `section`, `main`, `nav`, `aside`, `form`, `picture`, `hgroup`, `address` (default `italic`), `label`, and `center` each take only `color`.

### Form Elements

All `<input>` types live under `input`. `<button>` has its own top-level `button` entry, separate from `input.button` (`<input type="button">`).

```yaml
theme:
  input:
    disabled:
      color: gray dim
    required:
      enabled: true
      indicator: { marker: "*", color: red, position: after }  # before | after

    checkbox:
      checked: { marker: "✓", color: green bold }
      unchecked: { marker: " ", color: gray }
      prefix: { marker: "[", color: gray }
      suffix: { marker: "]", color: gray }

    radio:
      checked: { marker: "•", color: red bold }
      unchecked: { marker: " ", color: gray }
      prefix: { marker: "(", color: gray }
      suffix: { marker: ")", color: gray }

    button:                 # <input type="button">
      color: bgBlack bold
      prefix: { marker: "[ ", color: bgBlack gray }
      suffix: { marker: " ]", color: bgBlack gray }

    textInput:
      color: cyanBright bgBlack   # text, search, url, tel, number, ...

    textarea:
      color: cyanBright bgBlack

    range:
      filled: { marker: "█", color: magenta bgMagenta }
      empty: { marker: "░", color: gray bgGray }
      thumb: { marker: "●", color: magenta bold bgGray }

    color:
      indicator: { marker: "■" }  # Colored with the actual value
      prefix: { marker: "(", color: gray }
      suffix: { marker: ")", color: gray }
      value: { color: '' }

    password:
      char: "*"             # Masking character
      count: 6              # Number of mask characters
      color: gray

    email:
      color: cyan
      prefix: { marker: "@ ", color: cyan }

    date:
      color: blue
      prefix: { marker: "# ", color: blue }

    file:
      color: cyan
      prefix: { marker: "@", color: gray }
      placeholder: No file chosen

  button:                   # <button>
    color: bgBlack bold
    disabled: { color: gray dim }
    prefix: { marker: "[ ", color: bgBlack gray }
    suffix: { marker: " ]", color: bgBlack gray }

  select:
    color: cyan bold        # Select label color
    disabled: { color: gray dim }
    prefix: { marker: "", color: '' }
    suffix: { marker: ":", color: cyan bold }

  option:
    color: ''
    disabled: { color: gray dim }
    selected: { marker: "◉", color: green bold }
    unselected: { marker: "○", color: gray }

  optgroup:
    disabled: { color: gray dim bold }
    indicator: { marker: "▸ ", color: cyan bold }
    label: { color: cyan bold }
```

#### Progress, Meter, Data

```yaml
theme:
  progress:
    # width: 30             # Optional fixed width (default: adaptive)
    filled: { marker: "█", color: bgWhite cyan }
    empty: { marker: "░", color: bgBlack gray }

  meter:
    width: 30
    ranges:
      low: { threshold: 0.33, marker: "█", color: red bgRed }
      medium: { threshold: 0.66, marker: "█", color: yellow bgYellow }
      high: { threshold: 1.0, marker: "█", color: green bgGreen }
    empty: { marker: "░", color: gray bgBlack }
    labels:
      enabled: true
      format: "%v/%m"       # %v value, %m max, %n min, %% percent
      color: gray
      position: right       # left | right

  data:
    color: ''
    value:
      enabled: false        # Show the value attribute
      color: cyan
      prefix: { marker: " [", color: gray }
      suffix: { marker: "]", color: gray }
```

### Tables

```yaml
theme:
  table:
    color: ''               # Default color (inherited by sections, rows, cells)
    padding: { left: 1, right: 1 }  # Spaces around the text of every cell
    responsive:
      enabled: true         # List view on narrow terminals
      threshold: 60         # Width below which list view is used
      separator: ": "
      itemSeparator: "\n\n"
    striping:
      enabled: false        # Zebra striping
      count: 2              # Number of row styles to cycle (2-5)
      rows:
        - color: white bgBlack
        - color: white bgBlackBright
        - color: white bgBlue
        - color: white bgGreen
        - color: white bgMagenta
    alignment:
      enabled: false        # Alignment indicators in cells
      left: { indicator: "", color: '' }
      center: { indicator: "≡ ", color: gray dim }
      right: { indicator: "» ", color: gray dim }

  caption:
    color: blue bold
  thead:
    color: red bold
  tbody:
    color: ''
  tfoot:
    color: ''
  tr:
    color: ''
  th:
    color: red bold         # Header cell color
  td:
    color: ''               # Data cell color
```

### Special Elements

#### Abbreviations and Definitions (abbr, dfn)

```yaml
theme:
  abbr:
    color: underline                # Abbreviation text color
    title:
      color: cyan                   # Title (expansion) color
      prefix: { marker: "(", color: gray }
      suffix: { marker: ")", color: gray }

  dfn:
    color: underline italic
    title:
      color: cyan
      prefix: { marker: "(", color: gray }
      suffix: { marker: ")", color: gray }
```

#### Ruby, Time, Sub/Sup

```yaml
theme:
  ruby:
    color: ''
    rt:
      color: gray dim
      prefix: { marker: " (", color: gray dim }
      suffix: { marker: ")", color: gray dim }

  time:
    color: cyan
    datetime:
      enabled: false        # Show datetime attribute after text
      color: gray dim
      prefix: { marker: " (", color: gray dim }
      suffix: { marker: ")", color: gray dim }

  sub:
    color: ''
    prefix: { marker: "₍", color: gray dim }
    suffix: { marker: "₎", color: gray dim }

  sup:
    color: ''
    prefix: { marker: "⁽", color: gray dim }
    suffix: { marker: "⁾", color: gray dim }
```

#### Media (img, video, audio)

```yaml
theme:
  img:
    indicator: { marker: "!", color: cyan }
    prefix: { marker: "[", color: gray }
    suffix: { marker: "]", color: gray }
    alt:
      color: cyan                   # Alt text color

  video:
    indicator: { marker: "▶", color: cyan }
    prefix: { marker: "[", color: gray }
    suffix: { marker: "]", color: gray }
    title: { color: cyan }

  audio:
    indicator: { marker: "♪", color: cyan }
    prefix: { marker: "[", color: gray }
    suffix: { marker: "]", color: gray }
    title: { color: cyan }
```

#### Del/Ins

```yaml
theme:
  del:
    color: bgRed black              # Deleted text
    diff:
      enabled: false
      style: git                    # simple | git
      marker: "-"
      color: red bold

  ins:
    color: bgGreen black            # Inserted text
    diff:
      enabled: false
      style: git
      marker: "+"
      color: green bold
```

#### Legacy (blink, marquee)

```yaml
theme:
  blink:
    color: ''
    animation:
      enabled: false
      indicator: { marker: "↯", color: yellow, position: both }  # before | after | both

  marquee:
    color: ''
    direction:
      enabled: true
      left: { indicator: { marker: "⟵", color: cyan } }
      right: { indicator: { marker: "⟶", color: cyan } }
      up: { indicator: { marker: "⟰", color: cyan } }
      down: { indicator: { marker: "⟱", color: cyan } }
      position: before              # before | after
```

## Color Format

All `color` properties use **chalk-string** format. In the library, a color can also be a function `(text) => string`.

### Basic Colors

`black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`

### Bright Colors

`blackBright`, `redBright`, `greenBright`, `yellowBright`, `blueBright`, `magentaBright`, `cyanBright`, `whiteBright`

### Background Colors

`bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`

`bgBlackBright`, `bgRedBright`, `bgGreenBright`, `bgYellowBright`, `bgBlueBright`, `bgMagentaBright`, `bgCyanBright`, `bgWhiteBright`

### Modifiers

- `bold` - Bold text
- `dim` - Dimmed text
- `italic` - Italic text
- `underline` - Underlined text
- `strikethrough` - Strikethrough text

### Combining Colors

Use space-separated values:

```yaml
# Foreground + modifier
color: red bold
color: green underline

# Background + foreground
color: bgBlue white

# Background + foreground + modifiers
color: bgRed white bold underline

# Multiple modifiers
color: cyan bold italic underline
```

## Complete Example

Example `config.yaml` with a customized theme (unlisted keys keep their defaults):

```yaml
lineWidth:
  max: 100

theme:
  # Headers
  h1:
    color: red bold underline
    indicator: { marker: "█", color: red bold }
  h2:
    color: blue bold
    indicator: { marker: "▓", color: blue bold }
  h3:
    color: cyan bold
    indicator: { marker: "▒", color: cyan bold }

  # Text
  bold: bold
  em: italic
  mark: bgYellow black bold

  # Links
  a:
    color: cyan underline
    external: { enabled: true }

  # Lists
  ul:
    indicators:
      disc: { color: green, marker: "•" }
      square: { color: yellow, marker: "▪" }
      circle: { color: magenta, marker: "◦" }
  ol:
    indicators:
      "1": { color: blue, marker: "1", decimal: ")" }

  # Code
  code:
    color: yellowBright bgBlack
    block:
      numbers: { enabled: true, color: gray dim }
      label: { enabled: true }

  # Quotes
  blockquote:
    color: yellow italic
    indicators:
      - { marker: "▌ ", color: yellow }

  # Horizontal rule
  hr:
    color: cyan
    style: double

  # Containers
  figure:
    color: white
    border: { color: blue, style: round }
  figcaption:
    color: cyan bold
  fieldset:
    border: { color: green, style: double }
    title: { color: yellow bold }
  details:
    border: { color: magenta, style: round }
    indicator:
      open: { marker: "▾ ", color: magenta }
      closed: { marker: "► ", color: magenta }

  # Inputs
  input:
    checkbox:
      checked: { marker: "✓", color: green bold }
      unchecked: { marker: "✗", color: red }
      prefix: { marker: "【", color: cyan }
      suffix: { marker: "】", color: cyan }
    radio:
      checked: { marker: "●", color: blue bold }
      unchecked: { marker: "○", color: gray }
    textInput: cyan
  button:
    color: green bold
    prefix: { marker: "『 ", color: green bold }
    suffix: { marker: " 』", color: green bold }

  # Progress
  progress:
    filled: { marker: "█", color: green }
    empty: { marker: "░", color: gray }

  # Tables
  th: cyan bold
  caption: yellow bold
  table:
    striping: { enabled: true }

  # Definitions
  dt:
    color: cyan bold
  dd:
    color: white

  # Special
  abbr:
    color: cyan underline
    title:
      color: yellow
      prefix: { marker: "〔" }
      suffix: { marker: "〕" }
  img:
    indicator: { marker: "📷" }
    prefix: { marker: "「" }
    suffix: { marker: "」" }
    alt: { color: blue }
  var: cyan italic
  address: gray italic
  del: red strikethrough
  ins: green underline
```

## See Also

- [Data Attributes](../DATA_ATTRIBUTES.md) - data-cli-* attributes
- [HTML Examples](./html/README.md)
- [Markdown Examples](./markdown/README.md)
- [Main README](../README.md)
