# Customization Guide

Complete guide to customizing HTML rendering with `data-cli-*` attributes.

## Table of Contents

- [Universal Attributes](#universal-attributes)
- [Headers (h1-h6)](#headers-h1-h6)
- [Lists (ul, ol)](#lists-ul-ol)
- [Input Elements](#input-elements)
- [Progress & Meter](#progress--meter)
- [Code & Pre](#code--pre)
- [Containers with Borders](#containers-with-borders)
- [Abbreviations](#abbreviations)
- [Images](#images)
- [Other Elements](#other-elements)
- [Color Format](#color-format)

## Universal Attributes

These attributes work on most HTML elements:

### `data-cli-color`

Sets the text color using chalk-string format.

```html
<!-- Basic colors -->
<p data-cli-color="red">Red text</p>
<p data-cli-color="green">Green text</p>
<p data-cli-color="blue">Blue text</p>

<!-- With modifiers -->
<p data-cli-color="red bold">Bold red</p>
<p data-cli-color="green underline">Underlined green</p>
<p data-cli-color="blue italic">Italic blue</p>

<!-- Background colors -->
<p data-cli-color="bgRed white">White on red</p>
<p data-cli-color="bgBlue yellow bold">Bold yellow on blue</p>

<!-- Combinations -->
<p data-cli-color="cyan bold underline">Cyan bold underlined</p>
```

**Supported elements:** Almost all text elements (p, div, span, h1-h6, li, td, th, blockquote, code, etc.)

### `data-cli-marker`

Customizes markers for elements that have them.

```html
<!-- Headers -->
<h1 data-cli-marker="►">Custom marker</h1>
<h2 data-cli-marker="★">Star marker</h2>

<!-- Lists -->
<ul data-cli-marker="→">
  <li>Arrow marker</li>
</ul>

<!-- Horizontal rule -->
<hr data-cli-marker="═" />

<!-- Blockquote -->
<blockquote data-cli-marker="▶ ">Custom quote marker</blockquote>
```

**Supported elements:** h1-h6, ul, ol, hr, blockquote, details

## Headers (h1-h6)

Headers support color and marker customization. The color is applied to the entire header (marker + space + text) for continuous styling like underlines.

```html
<!-- Color applies to entire header -->
<h1 data-cli-color="underline">Continuous underline</h1>
<h2 data-cli-color="red bold underline">Red bold underlined</h2>
<h3 data-cli-color="bgBlue white">White on blue background</h3>

<!-- Custom markers -->
<h2 data-cli-marker="►">Arrow instead of ##</h2>
<h3 data-cli-marker="★">Star instead of ###</h3>
<h4 data-cli-marker="">No marker (just text)</h4>

<!-- Combinations -->
<h2 data-cli-marker="▶" data-cli-color="cyan bold">Cyan arrow header</h2>
```

**Attributes:**
- `data-cli-color` - Color for entire header (marker + space + text)
- `data-cli-marker` - Custom marker (replaces #, ##, etc.)

## Lists (ul, ol)

Lists support separate customization of list items and markers.

### Unordered Lists (ul)

```html
<!-- Using standard HTML type attribute -->
<ul type="disc">
  <li>Disc marker (•) - default</li>
</ul>

<ul type="square">
  <li>Square marker (▪)</li>
</ul>

<ul type="circle">
  <li>Circle marker (⚬)</li>
</ul>

<!-- Custom marker with data-cli-* -->
<ul data-cli-marker="→">
  <li>Item with arrow</li>
</ul>

<!-- Custom marker color -->
<ul data-cli-marker-color="green">
  <li>Green bullets</li>
</ul>

<!-- Custom text color -->
<ul data-cli-color="blue">
  <li>Blue text</li>
</ul>

<!-- All combined -->
<ul data-cli-marker="▸" data-cli-marker-color="red" data-cli-color="cyan">
  <li>Red markers, cyan text</li>
</ul>
```

### Ordered Lists (ol)

```html
<!-- Custom marker color -->
<ol data-cli-marker-color="green">
  <li>Green numbers</li>
</ol>

<!-- Custom decimal separator -->
<ol data-cli-decimal=")">
  <li>Uses ) instead of .</li>
</ol>

<!-- Custom text color -->
<ol data-cli-color="blue">
  <li>Blue text</li>
</ol>

<!-- All combined -->
<ol data-cli-marker-color="red" data-cli-decimal=")" data-cli-color="cyan">
  <li>Red numbers with ), cyan text</li>
</ol>
```

**HTML Attributes:**
- `type` - Standard HTML attribute for list marker type
  - For `ul`: `disc` (•), `square` (▪), `circle` (⚬)
  - For `ol`: `1`, `A`, `a`, `I`, `i`

**Custom Attributes:**
- `data-cli-color` - Color for list item text
- `data-cli-marker` - Custom bullet marker (ul only)
- `data-cli-marker-color` - Color for markers/numbers
- `data-cli-decimal` - Decimal separator (ol only, default: ".")

## Input Elements

### Checkbox

```html
<input type="checkbox" checked
       data-cli-checked-color="green bold"
       data-cli-checked-marker="✓"
       data-cli-unchecked-color="gray"
       data-cli-unchecked-marker=" "
       data-cli-checkbox-open-marker="["
       data-cli-checkbox-close-marker="]"
       data-cli-checkbox-open-color="blue"
       data-cli-checkbox-close-color="blue" />
```

**Attributes:**
- `data-cli-checked-color` - Color for checked marker
- `data-cli-checked-marker` - Marker when checked (default: "✓")
- `data-cli-unchecked-color` - Color for unchecked marker
- `data-cli-unchecked-marker` - Marker when unchecked (default: " ")
- `data-cli-checkbox-open-marker` - Opening bracket (default: "[")
- `data-cli-checkbox-close-marker` - Closing bracket (default: "]")
- `data-cli-checkbox-open-color` - Opening bracket color
- `data-cli-checkbox-close-color` - Closing bracket color

### Radio Button

```html
<input type="radio" checked
       data-cli-radio-checked-color="red bold"
       data-cli-radio-checked-marker="●"
       data-cli-radio-unchecked-color="gray"
       data-cli-radio-unchecked-marker=" "
       data-cli-radio-open-marker="("
       data-cli-radio-close-marker=")"
       data-cli-radio-open-color="yellow"
       data-cli-radio-close-color="yellow" />
```

**Attributes:**
- `data-cli-radio-checked-color` - Color for checked marker
- `data-cli-radio-checked-marker` - Marker when checked (default: "•")
- `data-cli-radio-unchecked-color` - Color for unchecked marker
- `data-cli-radio-unchecked-marker` - Marker when unchecked (default: " ")
- `data-cli-radio-open-marker` - Opening parenthesis (default: "(")
- `data-cli-radio-close-marker` - Closing parenthesis (default: ")")
- `data-cli-radio-open-color` - Opening parenthesis color
- `data-cli-radio-close-color` - Closing parenthesis color

### Button

```html
<button data-cli-button-text-color="green bold"
        data-cli-button-open-marker="〔 "
        data-cli-button-close-marker=" 〕"
        data-cli-button-open-color="green"
        data-cli-button-close-color="green">
  Click Me
</button>
```

**Attributes:**
- `data-cli-button-text-color` - Color for button text
- `data-cli-button-open-marker` - Opening marker (default: "[ ")
- `data-cli-button-close-marker` - Closing marker (default: " ]")
- `data-cli-button-open-color` - Opening marker color
- `data-cli-button-close-color` - Closing marker color

### Text Inputs

```html
<input type="text" value="Success" data-cli-text-input-color="green bold" />
<input type="email" value="user@example.com" data-cli-text-input-color="cyan" />
<input type="password" value="****" data-cli-text-input-color="red" />
```

**Attributes:**
- `data-cli-text-input-color` - Color for input value

**Supported types:** text, email, password, search, url, tel, number, date, time, etc.

### Textarea

```html
<textarea data-cli-textarea-color="yellowBright bgBlack">
  Multi-line content
</textarea>

<textarea data-cli-textarea-color="green">
  Success message
</textarea>
```

**Attributes:**
- `data-cli-textarea-color` - Color for textarea content

## Progress & Meter

```html
<!-- Progress bar -->
<progress value="70" max="100"
          data-cli-filled-color="green"
          data-cli-filled-marker="█"
          data-cli-empty-color="gray"
          data-cli-empty-marker="░"></progress>

<!-- Meter -->
<meter value="0.7"
       data-cli-filled-color="bgGreen white"
       data-cli-empty-color="bgBlack gray"
       data-cli-filled-marker="●"
       data-cli-empty-marker="○"></meter>
```

**Attributes:**
- `data-cli-filled-color` - Color for filled portion
- `data-cli-filled-marker` - Character for filled portion (default: "█")
- `data-cli-empty-color` - Color for empty portion
- `data-cli-empty-marker` - Character for empty portion (default: "█")

## Code & Pre

### Inline Code

```html
<code data-cli-color="magenta bgBlack">inline code</code>
<code data-cli-color="yellowBright">highlighted</code>
```

**Attributes:**
- `data-cli-color` - Color for inline code

### Pre Blocks

```html
<pre data-cli-color="yellowBright"
     data-cli-numbers-enabled="true"
     data-cli-numbers-color="gray dim">
  <code>function hello() {
    console.log('Hello, World!');
  }</code>
</pre>
```

**Attributes:**
- `data-cli-color` - Color for code text
- `data-cli-numbers-enabled` - Show line numbers (true/false)
- `data-cli-numbers-color` - Color for line numbers
- `data-cli-highlight-lines` - Highlight specific lines. Format: `"2-5,7,10-18"` (ranges and individual lines separated by commas)
- `data-cli-highlight-color` - Color for highlighted lines (default: "bgYellowBright black")
- `data-cli-gutter-separator` - Custom separator between line numbers and code

**Note:** These attributes can be placed on either `<pre>` or `<code>` tags. If present on both, `<pre>` attributes take precedence.

#### Highlight Lines

Highlight specific lines with customizable background:

```html
<!-- Single line -->
<pre data-cli-highlight-lines="2">
<code>Line 1
Line 2 - highlighted
Line 3
</code>
</pre>

<!-- Multiple lines -->
<pre data-cli-highlight-lines="1,3,5">
<code>Line 1 - highlighted
Line 2
Line 3 - highlighted
Line 4
Line 5 - highlighted
</code>
</pre>

<!-- Range of lines -->
<pre data-cli-highlight-lines="2-4">
<code>Line 1
Line 2 - highlighted
Line 3 - highlighted
Line 4 - highlighted
Line 5
</code>
</pre>

<!-- Mixed ranges and single lines -->
<pre data-cli-highlight-lines="1,3-5,7">
<code>Line 1 - highlighted
Line 2
Line 3 - highlighted
Line 4 - highlighted
Line 5 - highlighted
Line 6
Line 7 - highlighted
</code>
</pre>

<!-- Complex example: 2-5,7,10-18 -->
<pre data-cli-highlight-lines="2-5,7,10-18">
<code>Line 1
Line 2 - highlighted (range 2-5)
Line 3 - highlighted (range 2-5)
Line 4 - highlighted (range 2-5)
Line 5 - highlighted (range 2-5)
Line 6
Line 7 - highlighted (single)
Line 8
Line 9
Line 10 - highlighted (range 10-18)
Line 11 - highlighted
Line 12 - highlighted
Line 13 - highlighted
Line 14 - highlighted
Line 15 - highlighted
Line 16 - highlighted
Line 17 - highlighted
Line 18 - highlighted
Line 19
Line 20
</code>
</pre>

<!-- Custom highlight color -->
<pre data-cli-highlight-lines="2,4" data-cli-highlight-color="bgRed white bold">
<code>Line 1
Line 2 - highlighted in red
Line 3
Line 4 - highlighted in red
Line 5
</code>
</pre>

<!-- Green highlight -->
<pre data-cli-highlight-lines="1,3" data-cli-highlight-color="bgGreen black">
<code>Line 1 - green highlight
Line 2
Line 3 - green highlight
</code>
</pre>
```

#### Custom Gutter Separator

Customize the separator between line numbers and code:

```html
<!-- Arrow separator -->
<pre data-cli-gutter-separator-marker=" → ">
<code>First line
Second line
</code>
</pre>

<!-- Pipe separator with color -->
<pre data-cli-gutter-separator-marker=" | " data-cli-gutter-separator-color="blue bold">
<code>First line
Second line
</code>
</pre>

<!-- Unicode separator with custom color -->
<pre data-cli-gutter-separator-marker=" ▸ " data-cli-gutter-separator-color="magenta">
<code>First line
Second line
</code>
</pre>
```

#### Combined Features

All features can be combined:

```html
<!-- Highlight + Custom Colors + Separator -->
<pre data-cli-highlight-lines="2,4"
     data-cli-color="cyan"
     data-cli-numbers-color="magenta bold"
     data-cli-gutter-separator=" • ">
<code>const x = 1;
const y = 2;
const z = 3;
const sum = x + y + z;
</code>
</pre>

<!-- All features with syntax highlighting -->
<pre data-cli-highlight-lines="2,4,6"
     data-cli-gutter-separator=" ▶ "
     data-cli-color="yellow"
     data-cli-numbers-color="blue bold">
<code class="language-javascript">function calculate(a, b) {
  const sum = a + b;
  const product = a * b;
  const difference = a - b;
  const quotient = a / b;
  return { sum, product, difference, quotient };
}
</code>
</pre>
```

#### Language Labels

Display a language label for code blocks based on the `class="lang-*"` or `class="language-*"` attribute:

```html
<!-- Basic language label -->
<pre data-cli-lang-label-enabled="true">
<code class="language-javascript">function hello() {
  console.log("Hello World");
}
</code>
</pre>

<!-- Bottom position -->
<pre data-cli-lang-label-enabled="true"
     data-cli-lang-label-position="bottom">
<code class="lang-python">def greet(name):
    print(f"Hello {name}")
</code>
</pre>

<!-- With prefix and suffix markers -->
<pre data-cli-lang-label-enabled="true"
     data-cli-lang-label-prefix-marker="[ "
     data-cli-lang-label-suffix-marker=" ]">
<code class="lang-html">&lt;div&gt;Content&lt;/div&gt;
</code>
</pre>

<!-- Custom language label color -->
<pre data-cli-lang-label-enabled="true"
     data-cli-lang-label-color="magenta bold">
<code class="lang-rust">fn main() {
    println!("Hello!");
}
</code>
</pre>

<!-- Custom prefix/suffix colors -->
<pre data-cli-lang-label-enabled="true"
     data-cli-lang-label-color="yellowBright"
     data-cli-lang-label-prefix-marker="→ "
     data-cli-lang-label-prefix-color="cyan bold"
     data-cli-lang-label-suffix-marker=" ←"
     data-cli-lang-label-suffix-color="cyan bold">
<code class="lang-css">.button { color: blue; }
</code>
</pre>

<!-- Combined with custom gutter -->
<pre data-cli-lang-label-enabled="true"
     data-cli-lang-label-color="cyanBright bold"
     data-cli-lang-label-prefix-marker="「"
     data-cli-lang-label-suffix-marker="」"
     data-cli-gutter-separator-marker=" | "
     data-cli-gutter-separator-color="magenta">
<code class="language-go">package main

func main() {
    // code here
}
</code>
</pre>
```

**Language Label Attributes:**
- `data-cli-lang-label-enabled` - Show/hide language label (true/false)
- `data-cli-lang-label-position` - Position of label: `top` (default) or `bottom`
- `data-cli-lang-label-color` - Color for the language name text
- `data-cli-lang-label-prefix-marker` - Marker before language name (e.g., "[ ")
- `data-cli-lang-label-prefix-color` - Color for prefix marker
- `data-cli-lang-label-suffix-marker` - Marker after language name (e.g., " ]")
- `data-cli-lang-label-suffix-color` - Color for suffix marker

**Gutter Separator Attributes:**
- `data-cli-gutter-separator-marker` - Custom separator between line numbers and code (default: " ")
- `data-cli-gutter-separator-color` - Color for the gutter separator

**Note:** The language is automatically detected from `class="lang-*"` or `class="language-*"` attributes. Over 1100 languages are supported through the built-in language mapping.

## Containers with Borders

### Figure

```html
<figure data-cli-color="gray"
        data-cli-border="blue"
        data-cli-border-style="round">
  <img src="image.png" alt="Description" />
  <figcaption data-cli-color="green bold">
    Caption text
  </figcaption>
</figure>
```

**Attributes (figure):**
- `data-cli-color` - Text color
- `data-cli-border` - Border color
- `data-cli-border-style` - Border style: single, double, round, bold, etc.

**Attributes (figcaption):**
- `data-cli-color` - Caption text color

### Fieldset

```html
<fieldset data-cli-border="green"
          data-cli-border-style="double"
          data-cli-title-color="yellow">
  <legend>Form Section</legend>
  <p>Content here</p>
</fieldset>
```

**Attributes:**
- `data-cli-border` - Border color
- `data-cli-border-style` - Border style: single, double, round, bold
- `data-cli-border-dim` - Dim border (true/false)
- `data-cli-title-color` - Color for legend text

### Details

```html
<details data-cli-border="cyan"
         data-cli-border-style="round"
         data-cli-marker="▶ ">
  <summary>Click to expand</summary>
  <p>Hidden content</p>
</details>
```

**Attributes:**
- `data-cli-border` - Border color
- `data-cli-border-style` - Border style: single, double, round, bold
- `data-cli-border-dim` - Dim border (true/false)
- `data-cli-marker` - Marker for summary (default: "> ")

## Abbreviations

```html
<abbr data-cli-color="cyan underline"
      data-cli-title-color="yellow"
      data-cli-title-prefix-marker="["
      data-cli-title-prefix-color="gray"
      data-cli-title-suffix-marker="]"
      data-cli-title-suffix-color="gray"
      title="HyperText Markup Language">
  HTML
</abbr>
```

**Attributes:**
- `data-cli-color` - Color for abbreviation text
- `data-cli-title-color` - Color for title (expansion) text
- `data-cli-title-prefix-marker` - Opening character (default: "(")
- `data-cli-title-prefix-color` - Color for opening character
- `data-cli-title-suffix-marker` - Closing character (default: ")")
- `data-cli-title-suffix-color` - Color for closing character

## Images

```html
<img src="image.png" alt="Description"
     data-cli-prefix-marker="!"
     data-cli-prefix-color="cyan"
     data-cli-open-marker="["
     data-cli-close-marker="]"
     data-cli-open-color="gray"
     data-cli-close-color="gray"
     data-cli-text-color="blue" />
```

**Attributes:**
- `data-cli-prefix-marker` - Prefix character (default: "!")
- `data-cli-prefix-color` - Color for prefix
- `data-cli-open-marker` - Opening bracket (default: "[")
- `data-cli-close-marker` - Closing bracket (default: "]")
- `data-cli-open-color` - Color for opening bracket
- `data-cli-close-color` - Color for closing bracket
- `data-cli-text-color` - Color for alt text

## Other Elements

### Blockquote

```html
<blockquote data-cli-color="yellow" data-cli-marker="▶ ">
  Quote text
</blockquote>
```

**Attributes:**
- `data-cli-color` - Text color
- `data-cli-marker` - Quote marker (default: "│ ")

### Horizontal Rule

```html
<hr data-cli-color="red" data-cli-marker="═" />
```

**Attributes:**
- `data-cli-color` - Line color
- `data-cli-marker` - Character to use for line (default: "─")

### Tables

```html
<table>
  <caption data-cli-color="yellow bold">Table Title</caption>
  <tr>
    <th data-cli-color="green">Header</th>
    <td data-cli-color="cyan">Cell</td>
  </tr>
</table>
```

**Attributes:**
- `data-cli-color` - Text color (works on th, td, caption)

### Definitions

```html
<dl>
  <dt data-cli-color="red bold">Term</dt>
  <dd data-cli-color="blue">Definition</dd>
</dl>
```

**Attributes:**
- `data-cli-color` - Text color (works on dt, dd)

## Color Format

All `*-color` attributes use **chalk-string** format.

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

```html
<!-- Foreground + modifier -->
<p data-cli-color="red bold">Red bold</p>
<p data-cli-color="green underline">Green underline</p>

<!-- Background + foreground -->
<p data-cli-color="bgBlue white">White on blue</p>

<!-- Background + foreground + modifiers -->
<p data-cli-color="bgRed white bold underline">White bold underlined on red</p>

<!-- Multiple modifiers -->
<p data-cli-color="cyan bold italic underline">Cyan bold italic underlined</p>
```

## Examples

See the complete examples in:

- [examples/html/tags-custom/](./html/tags-custom/) - All tags with extensive customization
- [examples/html/tags-custom/custom-styles-demo.html](./html/tags-custom/custom-styles-demo.html) - Comprehensive demo

## See Also

- [HTML Examples](./html/README.md)
- [Theme Configuration](./THEMES.md)
- [Main README](../README.md)
