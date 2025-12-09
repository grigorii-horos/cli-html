# HTML Examples

Complete examples of HTML rendering in the terminal with customization.

## 📁 Structure

```
html/
├── tags/           # Individual tag examples (abbr, code, input, etc.)
├── tags-custom/    # Tags with extensive customization examples
├── full/           # Complete HTML documents
├── screenshots/    # Generated terminal screenshots
└── README.md       # This file
```

## 🎯 Quick Navigation

### By Category

#### Text & Formatting
- [Headers](./tags-custom/headers.html) - h1-h6 with colors and custom markers
- [Text Styles](./tags-custom/text-styles.html) - bold, italic, underline, strike, mark, code
- [Abbreviations](./tags-custom/abbr.html) - <abbr> with custom title styles
- [Variables](./tags-custom/var.html) - <var> for programming variables
- [Sample Output](./tags-custom/samp.html) - <samp> for terminal/program output
- [Code](./tags-custom/code.html) - Inline <code> with colors
- [Preformatted](./tags-custom/pre.html) - <pre> blocks with syntax highlighting

#### Structure
- [Lists](./tags-custom/lists.html) - ul, ol with custom markers and colors
- [Definitions](./tags-custom/defs.html) - dl, dt, dd for glossaries
- [Tables](./tags-custom/table.html) - Tables with headers, captions, styling
- [Blockquotes](./tags-custom/blockquote.html) - Quotes with custom markers
- [Horizontal Rules](./tags-custom/hr.html) - Dividers with custom symbols

#### Forms
- [Inputs](./tags-custom/input.html) - All input types (checkbox, radio, text, button, textarea)
- [Fieldset](./tags-custom/fieldset.html) - Form grouping with legends and borders
- [Progress](./tags-custom/progress.html) - Progress bars and meters

#### Containers
- [Figure](./tags-custom/figure.html) - Images with captions and borders
- [Details](./tags-custom/details.html) - Collapsible sections with custom styling
- [Address](./tags-custom/address.html) - Contact information
- [Block Elements](./tags-custom/block.html) - div, section, article

#### Special
- [Links](./tags-custom/links.html) - Hyperlinks with custom colors
- [Del/Ins](./tags-custom/del-ins.html) - Deleted and inserted text
- [Ruby](./tags-custom/ruby.html) - Asian language annotations

#### Complete Examples
- [Blog Post](./full/blog.html) - Full blog article with rich content
- [Documentation](./full/demo.html) - API documentation style page

## 🎨 Customization

All examples in `tags-custom/` demonstrate the full customization API using `data-cli-*` attributes.

### Universal Attributes

```html
<!-- Color -->
<p data-cli-color="red bold">Red bold text</p>
<p data-cli-color="bgBlue white">White on blue background</p>

<!-- Marker (for elements that have markers) -->
<h2 data-cli-marker="►">Custom marker</h2>
<hr data-cli-marker="═" />
```

### Element-Specific Attributes

#### Headers (h1-h6)
```html
<h1 data-cli-color="red bold underline">Underlined header</h1>
<h2 data-cli-marker="▶" data-cli-color="cyan">Custom marker</h2>
```

#### Lists (ul, ol)
```html
<!-- Using HTML type attribute (disc, square, circle) -->
<ul type="disc">
  <li>Disc marker (•)</li>
</ul>

<ul type="square">
  <li>Square marker (▪)</li>
</ul>

<ul type="circle">
  <li>Circle marker (⚬)</li>
</ul>

<!-- Custom markers with data-cli-* attributes -->
<ul data-cli-marker="→" data-cli-marker-color="green" data-cli-color="blue">
  <li>Colored text with custom markers</li>
</ul>

<ol data-cli-marker-color="red" data-cli-decimal=")">
  <li>Custom decimal separator</li>
</ol>
```

#### Input Elements
```html
<!-- Checkbox -->
<input type="checkbox" checked
       data-cli-checked-color="green bold"
       data-cli-checked-marker="✓"
       data-cli-unchecked-color="gray"
       data-cli-unchecked-marker=" " />

<!-- Radio -->
<input type="radio" checked
       data-cli-radio-checked-color="red bold"
       data-cli-radio-checked-marker="●" />

<!-- Button -->
<button data-cli-button-text-color="green bold"
        data-cli-button-open-marker="〔 "
        data-cli-button-close-marker=" 〕">Click</button>

<!-- Text inputs -->
<input type="text" value="Success" data-cli-text-input-color="green bold" />

<!-- Textarea -->
<textarea data-cli-textarea-color="cyan">Content</textarea>
```

#### Progress & Meter
```html
<progress value="70" max="100"
          data-cli-filled-color="green"
          data-cli-filled-marker="█"
          data-cli-empty-color="gray"
          data-cli-empty-marker="░"></progress>
```

#### Code Blocks
```html
<pre data-cli-color="yellowBright"
     data-cli-numbers-enabled="true"
     data-cli-numbers-color="gray dim">
  <code>code with line numbers</code>
</pre>
```

#### Containers with Borders
```html
<!-- Figure -->
<figure data-cli-border="blue"
        data-cli-border-style="round">
  <figcaption data-cli-color="green bold">Caption</figcaption>
</figure>

<!-- Fieldset -->
<fieldset data-cli-border="green"
          data-cli-border-style="double"
          data-cli-title-color="yellow">
  <legend>Title</legend>
</fieldset>

<!-- Details -->
<details data-cli-border="cyan"
         data-cli-marker="▶ "
         data-cli-border-style="round">
  <summary>Summary</summary>
</details>
```

#### Abbreviations
```html
<abbr data-cli-color="cyan underline"
      data-cli-title-color="yellow"
      data-cli-title-prefix-marker="["
      data-cli-title-prefix-color="gray"
      data-cli-title-suffix-marker="]"
      data-cli-title-suffix-color="gray"
      title="HyperText Markup Language">HTML</abbr>
```

#### Images
```html
<img src="path.png" alt="Description"
     data-cli-prefix-marker="!"
     data-cli-prefix-color="cyan"
     data-cli-open-marker="["
     data-cli-close-marker="]"
     data-cli-text-color="blue" />
```

## 📊 Examples by Use Case

### Documentation & Technical Writing
- `tags-custom/code.html` - Code snippets
- `tags-custom/pre.html` - Code blocks with line numbers
- `tags-custom/samp.html` - Terminal output
- `tags-custom/var.html` - Programming variables
- `tags-custom/defs.html` - Glossaries
- `tags-custom/abbr.html` - Technical abbreviations
- `tags-custom/table.html` - Data tables
- `full/blog.html` - Complete article

### User Interfaces & Forms
- `tags-custom/input.html` - All form controls
- `tags-custom/fieldset.html` - Form organization
- `tags-custom/progress.html` - Progress indicators
- `tags-custom/lists.html` - Menus and navigation

### Content Organization
- `tags-custom/headers.html` - Document structure
- `tags-custom/lists.html` - Hierarchical content
- `tags-custom/blockquote.html` - Quotations
- `tags-custom/figure.html` - Images with captions
- `tags-custom/details.html` - Collapsible sections

## 🎨 Color Format

All `*-color` attributes use chalk-string format:

**Basic Colors:** `red`, `green`, `blue`, `yellow`, `magenta`, `cyan`, `white`, `black`, `gray`

**Bright Colors:** `redBright`, `greenBright`, `blueBright`, `yellowBright`, `magentaBright`, `cyanBright`

**Background:** `bgRed`, `bgGreen`, `bgBlue`, `bgYellow`, `bgMagenta`, `bgCyan`, `bgWhite`, `bgBlack`

**Modifiers:** `bold`, `dim`, `italic`, `underline`, `strikethrough`

**Combinations:** `"red bold"`, `"bgBlue white bold"`, `"yellow underline"`

## 🚀 Running Examples

```bash
# Basic tag example
node bin/html.js examples/html/tags-custom/headers.html

# Full document
node bin/html.js examples/html/full/blog.html

# With custom theme
node bin/html.js examples/html/tags-custom/input.html
```

## 📸 Screenshots

For visual examples of rendered HTML, see:

- [Tags Screenshots](tags/README.md#screenshots) - Individual HTML tags
- [Tags Custom Screenshots](tags-custom/README.md#screenshots) - Custom styled tags
- [Full Examples Screenshots](full/README.md#screenshots) - Complete HTML documents

## 📖 See Also

- [Markdown Examples](../markdown/README.md)
- [Library Usage](../library-usage/README.md)
- [Main Examples README](../README.md)
