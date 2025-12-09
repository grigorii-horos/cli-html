# Theme Configuration Guide

Complete guide to customizing the default theme via `config.yaml`.

## Table of Contents

- [Overview](#overview)
- [Configuration File](#configuration-file)
- [Theme Structure](#theme-structure)
- [Elements Reference](#elements-reference)
- [Color Format](#color-format)
- [Complete Example](#complete-example)

## Overview

Themes control the default appearance of all HTML and Markdown elements. You can customize colors, markers, borders, and other visual properties.

**Two ways to customize appearance:**

1. **Theme (config.yaml)** - Sets defaults for all documents
2. **data-cli-* attributes** - Override theme on specific elements

## Configuration File

Create or edit `config.yaml` in your project root:

```yaml
theme:
  h1:
    color: red bold
    marker: "#"
  h2:
    color: blue bold
    marker: "##"
  # ... more elements
```

## Theme Structure

### Basic Elements

#### Headers (h1-h6)

```yaml
theme:
  h1:
    color: red bold          # Color for entire header (marker + space + text)
    marker: "#"              # Marker character(s)
  h2:
    color: blue bold
    marker: "##"
  h3:
    color: blue bold
    marker: "###"
  h4:
    color: cyan bold
    marker: "####"
  h5:
    color: cyan
    marker: "#####"
  h6:
    color: cyan
    marker: "######"
```

**Properties:**
- `color` - Applied to entire header for continuous styling (underlines, backgrounds)
- `marker` - Prefix character(s) (e.g., "#", "##", "►", "")

#### Paragraphs and Text

```yaml
theme:
  p:
    color: white            # Default paragraph color

  strong:
    color: bold             # Bold text

  em:
    color: italic           # Italic text

  u:
    color: underline        # Underlined text

  s:
    color: strikethrough    # Strikethrough text

  mark:
    color: bgYellow black   # Highlighted text
```

#### Links

```yaml
theme:
  a:
    color: blue underline   # Link text color
```

### Lists

#### Unordered Lists (ul)

```yaml
theme:
  ul:
    color: white            # List item text color
    markers:                # Marker configuration by type
      disc:
        color: cyan         # Marker color
        marker: "•"         # Marker symbol
      square:
        color: yellow
        marker: "▪"
      circle:
        color: magenta
        marker: "⚬"
    indent: "  "            # Indentation for nested items
```

**Properties:**
- `color` - Color for list item text
- `markers` - Object with marker configurations by type (disc, square, circle)
  - `disc.color` - Color for disc marker
  - `disc.marker` - Marker symbol for disc (default: "•")
  - `square.color` - Color for square marker
  - `square.marker` - Marker symbol for square (default: "▪")
  - `circle.color` - Color for circle marker
  - `circle.marker` - Marker symbol for circle (default: "⚬")
- `indent` - Indentation string for nested items

**HTML Attribute Support:**

Lists also support the standard HTML `type` attribute:

```html
<ul type="disc">
  <li>Disc marker (uses theme.ul.markers.disc)</li>
</ul>

<ul type="square">
  <li>Square marker (uses theme.ul.markers.square)</li>
</ul>

<ul type="circle">
  <li>Circle marker (uses theme.ul.markers.circle)</li>
</ul>
```

#### Ordered Lists (ol)

```yaml
theme:
  ol:
    color: white            # List item text color
    markers:                # Marker configuration by type
      "1":
        color: cyan         # Marker color
        marker: "1"         # Marker type
        decimal: "."        # Decimal separator
      I:
        color: blue
        marker: "I"
        decimal: "."
      A:
        color: magenta
        marker: "A"
        decimal: "."
      i:
        color: cyan
        marker: "i"
        decimal: "."
      a:
        color: blue
        marker: "a"
        decimal: "."
    indent: "   "           # Indentation for nested items
```

**Properties:**
- `color` - Color for list item text
- `markers` - Object with marker configurations by type (1, A, a, I, i)
  - `"1".color` - Color for decimal marker
  - `"1".marker` - Marker type "1" (decimal numbers)
  - `"1".decimal` - Separator after number (default: ".")
  - `A.color` - Color for uppercase alphabetic marker
  - `A.marker` - Marker type "A" (uppercase letters)
  - `A.decimal` - Separator after letter
  - `a.color` - Color for lowercase alphabetic marker
  - `a.marker` - Marker type "a" (lowercase letters)
  - `a.decimal` - Separator after letter
  - `I.color` - Color for uppercase Roman marker
  - `I.marker` - Marker type "I" (uppercase Roman)
  - `I.decimal` - Separator after numeral
  - `i.color` - Color for lowercase Roman marker
  - `i.marker` - Marker type "i" (lowercase Roman)
  - `i.decimal` - Separator after numeral
- `indent` - Indentation string for nested items

**HTML Attribute Support:**

Lists also support the standard HTML `type` attribute:

```html
<ol type="1">
  <li>Decimal: 1, 2, 3... (uses theme.ol.markers["1"])</li>
</ol>

<ol type="A">
  <li>Uppercase: A, B, C... (uses theme.ol.markers.A)</li>
</ol>

<ol type="a">
  <li>Lowercase: a, b, c... (uses theme.ol.markers.a)</li>
</ol>

<ol type="I">
  <li>Roman uppercase: I, II, III... (uses theme.ol.markers.I)</li>
</ol>

<ol type="i">
  <li>Roman lowercase: i, ii, iii... (uses theme.ol.markers.i)</li>
</ol>
```

### Code

#### Inline Code

```yaml
theme:
  code:
    color: yellowBright     # Inline code color
```

#### Code Blocks (pre)

```yaml
theme:
  pre:
    color: yellowBright     # Code text color
    numbersEnabled: false   # Show line numbers
    numbersColor: gray dim  # Line number color
```

**Properties:**
- `color` - Color for code text
- `numbersEnabled` - true/false to show line numbers
- `numbersColor` - Color for line numbers

### Containers with Borders

#### Blockquote

```yaml
theme:
  blockquote:
    color: yellow           # Quote text color
    marker: "│ "            # Left border marker
```

**Properties:**
- `color` - Text color
- `marker` - Left border character(s)

#### Horizontal Rule (hr)

```yaml
theme:
  hr:
    color: gray             # Line color
    marker: "─"             # Line character
```

**Properties:**
- `color` - Line color
- `marker` - Character to repeat for line

#### Figure

```yaml
theme:
  figure:
    border: blue            # Border color
    borderStyle: round      # Border style: single, double, round, bold
    color: white            # Content color

  figcaption:
    color: gray             # Caption text color
```

**Border styles:** `single`, `double`, `round`, `bold`, `singleDouble`, `doubleSingle`, `classic`

#### Fieldset

```yaml
theme:
  fieldset:
    border: green           # Border color
    borderStyle: double     # Border style
    borderDim: false        # Dim border (true/false)
    titleColor: yellow      # Legend text color
```

#### Details

```yaml
theme:
  details:
    border: cyan            # Border color
    borderStyle: round      # Border style
    borderDim: false        # Dim border
    marker: "> "            # Summary marker
```

### Form Elements

#### Input - Checkbox

```yaml
theme:
  checkbox:
    checkedMarker: "✓"              # Marker when checked
    checkedColor: green bold        # Checked marker color
    uncheckedMarker: " "            # Marker when unchecked
    uncheckedColor: gray            # Unchecked marker color
    openMarker: "["                 # Opening bracket
    openColor: blue                 # Opening bracket color
    closeMarker: "]"                # Closing bracket
    closeColor: blue                # Closing bracket color
```

#### Input - Radio

```yaml
theme:
  radio:
    checkedMarker: "•"              # Marker when checked
    checkedColor: red bold          # Checked marker color
    uncheckedMarker: " "            # Marker when unchecked
    uncheckedColor: gray            # Unchecked marker color
    openMarker: "("                 # Opening parenthesis
    openColor: yellow               # Opening parenthesis color
    closeMarker: ")"                # Closing parenthesis
    closeColor: yellow              # Closing parenthesis color
```

#### Input - Button

```yaml
theme:
  button:
    openMarker: "[ "                # Opening marker
    openColor: green                # Opening marker color
    closeMarker: " ]"               # Closing marker
    closeColor: green               # Closing marker color
    textColor: green bold           # Button text color
```

#### Input - Text Inputs

```yaml
theme:
  textInput:
    color: cyan                     # Input value color
```

Applies to: text, email, password, search, url, tel, number, date, time, etc.

#### Textarea

```yaml
theme:
  textarea:
    color: yellowBright             # Textarea content color
```

#### Progress & Meter

```yaml
theme:
  progress:
    filledMarker: "█"               # Character for filled portion
    filledColor: green              # Filled portion color
    emptyMarker: "█"                # Character for empty portion
    emptyColor: gray                # Empty portion color

  meter:
    filledMarker: "█"
    filledColor: bgGreen white
    emptyMarker: "█"
    emptyColor: bgBlack gray
```

### Tables

```yaml
theme:
  table:
    color: white            # Default cell color

  th:
    color: cyan bold        # Header cell color

  td:
    color: white            # Data cell color

  caption:
    color: yellow           # Table caption color
```

### Definitions

```yaml
theme:
  dt:
    color: cyan bold        # Definition term color

  dd:
    color: white            # Definition description color
```

### Special Elements

#### Abbreviations (abbr)

```yaml
theme:
  abbr:
    color: cyan underline           # Abbreviation text color
    titleColor: yellow              # Title (expansion) color
    titlePrefixMarker: "("          # Opening character
    titlePrefixColor: gray          # Opening character color
    titleSuffixMarker: ")"          # Closing character
    titleSuffixColor: gray          # Closing character color
```

#### Images (img)

```yaml
theme:
  img:
    prefixMarker: "!"               # Prefix character
    prefixColor: cyan               # Prefix color
    openMarker: "["                 # Opening bracket
    openColor: gray                 # Opening bracket color
    closeMarker: "]"                # Closing bracket
    closeColor: gray                # Closing bracket color
    textColor: blue                 # Alt text color
```

#### Sample Output (samp)

```yaml
theme:
  samp:
    color: green                    # Sample output color
```

#### Variable (var)

```yaml
theme:
  var:
    color: cyan italic              # Variable name color
```

#### Address

```yaml
theme:
  address:
    color: gray italic              # Address text color
```

#### Del/Ins

```yaml
theme:
  del:
    color: red strikethrough        # Deleted text

  ins:
    color: green underline          # Inserted text
```

## Color Format

All `color` properties use **chalk-string** format.

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

Example `config.yaml` with full theme customization:

```yaml
theme:
  # Headers
  h1:
    color: red bold underline
    marker: "█"
  h2:
    color: blue bold
    marker: "▓"
  h3:
    color: cyan bold
    marker: "▒"
  h4:
    color: green
    marker: "░"
  h5:
    color: yellow
    marker: "▪"
  h6:
    color: magenta
    marker: "▫"

  # Text
  p:
    color: white
  strong:
    color: bold
  em:
    color: italic
  mark:
    color: bgYellow black bold

  # Links
  a:
    color: cyan underline

  # Lists
  ul:
    color: white
    markers:
      disc:
        color: green
        marker: "•"
      square:
        color: yellow
        marker: "▪"
      circle:
        color: magenta
        marker: "⚬"
    indent: "  "
  ol:
    color: white
    markers:
      "1":
        color: blue
        marker: "1"
        decimal: ")"
      I:
        color: cyan
        marker: "I"
        decimal: "."
      A:
        color: magenta
        marker: "A"
        decimal: "."
      i:
        color: blue
        marker: "i"
        decimal: "."
      a:
        color: cyan
        marker: "a"
        decimal: "."
    indent: "   "

  # Code
  code:
    color: yellowBright
  pre:
    color: yellowBright
    numbersEnabled: true
    numbersColor: gray dim

  # Quotes
  blockquote:
    color: yellow italic
    marker: "▌ "

  # Horizontal rule
  hr:
    color: cyan
    marker: "═"

  # Containers
  figure:
    border: blue
    borderStyle: round
    color: white
  figcaption:
    color: cyan bold

  fieldset:
    border: green
    borderStyle: double
    borderDim: false
    titleColor: yellow bold

  details:
    border: magenta
    borderStyle: round
    marker: "► "

  # Inputs
  checkbox:
    checkedMarker: "✓"
    checkedColor: green bold
    uncheckedMarker: "✗"
    uncheckedColor: red
    openMarker: "【"
    openColor: cyan
    closeMarker: "】"
    closeColor: cyan

  radio:
    checkedMarker: "●"
    checkedColor: blue bold
    uncheckedMarker: "○"
    uncheckedColor: gray
    openMarker: "〔"
    openColor: yellow
    closeMarker: "〕"
    closeColor: yellow

  button:
    openMarker: "『 "
    openColor: green bold
    closeMarker: " 』"
    closeColor: green bold
    textColor: green bold

  textInput:
    color: cyan

  textarea:
    color: yellowBright

  # Progress
  progress:
    filledMarker: "█"
    filledColor: green
    emptyMarker: "░"
    emptyColor: gray

  meter:
    filledMarker: "●"
    filledColor: bgGreen white
    emptyMarker: "○"
    emptyColor: bgBlack gray

  # Tables
  th:
    color: cyan bold
  td:
    color: white
  caption:
    color: yellow bold

  # Definitions
  dt:
    color: cyan bold
  dd:
    color: white

  # Special
  abbr:
    color: cyan underline
    titleColor: yellow
    titlePrefixMarker: "〔"
    titlePrefixColor: gray
    titleSuffixMarker: "〕"
    titleSuffixColor: gray

  img:
    prefixMarker: "📷"
    prefixColor: cyan
    openMarker: "「"
    openColor: gray
    closeMarker: "」"
    closeColor: gray
    textColor: blue

  samp:
    color: green

  var:
    color: cyan italic

  address:
    color: gray italic

  del:
    color: red strikethrough

  ins:
    color: green underline
```

## See Also

- [Customization Guide](./CUSTOMIZATION.md) - data-cli-* attributes
- [HTML Examples](./html/README.md)
- [Markdown Examples](./markdown/README.md)
- [Main README](../README.md)
