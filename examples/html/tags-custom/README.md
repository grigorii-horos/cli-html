# Custom Styles Examples

This directory contains HTML examples demonstrating inline customization using `data-cli-*` attributes.

## What are data-cli-* Attributes?

The `data-cli-*` attributes allow you to override default theme settings for individual HTML elements without modifying the global theme configuration.

### Available Attributes

- **`data-cli-color`**: Full chalk-string color/style specification (e.g., `"red bold"`, `"bgBlue white italic"`)
- **`data-cli-marker`**: Custom marker for headers and blockquotes (e.g., `"►"`, `"•••"`)
- **`data-cli-border`**: Custom border style (for future use with bordered elements)

All attributes can be combined on the same element.

## Usage

### Basic Color Customization

```html
<!-- Simple color -->
<h1 data-cli-color="magenta">Magenta Header</h1>

<!-- Color with style modifiers -->
<h2 data-cli-color="cyan bold underline">Cyan Bold Underlined Header</h2>

<!-- Background color -->
<span data-cli-color="bgRed white">White text on red background</span>
```

### Custom Markers

```html
<!-- Custom header marker -->
<h1 data-cli-marker="►">Triangle Marker</h1>
<h2 data-cli-marker="•••">Triple Dot Marker</h2>

<!-- Custom blockquote marker -->
<blockquote data-cli-marker="▌ ">Block marker</blockquote>
<blockquote data-cli-marker="» ">Double angle marker</blockquote>
```

### Combined Attributes

```html
<!-- All attributes together -->
<h1 data-cli-color="red bold"
    data-cli-marker="⚠">
  Warning Header
</h1>

<!-- Styled blockquote with custom marker -->
<blockquote data-cli-color="yellow" data-cli-marker="▌ ">
  Custom styled quote
</blockquote>
```

## data-cli-color Syntax

The `data-cli-color` attribute accepts [chalk-string](https://www.npmjs.com/package/chalk-string) syntax - colors and styles separated by spaces:

```html
<!-- Color only -->
<span data-cli-color="red">red text</span>

<!-- Color + style -->
<span data-cli-color="blue bold">blue bold text</span>

<!-- Multiple styles -->
<span data-cli-color="green bold italic underline">green bold italic underlined</span>

<!-- Background + foreground -->
<span data-cli-color="bgYellow black">black on yellow</span>

<!-- Background + foreground + styles -->
<span data-cli-color="bgMagenta white bold">white bold on magenta</span>
```

## Available Colors

### Basic Colors
`black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`

### Bright Colors
`blackBright`, `redBright`, `greenBright`, `yellowBright`, `blueBright`, `magentaBright`, `cyanBright`, `whiteBright`

### Background Colors
`bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`

Bright backgrounds: `bgBlackBright`, `bgRedBright`, etc.

## Available Style Modifiers

- `bold` - Bold text
- `italic` - Italic text
- `underline` - Underlined text
- `dim` - Dimmed/faint text
- `inverse` - Inverted foreground/background colors
- `strikethrough` - Strikethrough text

Multiple styles can be combined: `bold italic`, `underline dim`, etc.

## Supported Tags

### Headers (support: color, marker)
- `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`

### Block Elements (support: color, marker)
- `<blockquote>`

### Inline Elements (support: color)
- `<span>` - Generic inline container
- `<strong>`, `<b>` - Bold text
- `<em>`, `<i>` - Italic text
- `<u>` - Underlined text
- `<del>`, `<s>`, `<strike>` - Deleted/strikethrough text
- `<ins>` - Inserted text
- `<mark>` - Highlighted text
- `<code>` - Inline code
- `<kbd>` - Keyboard input
- `<samp>` - Sample output
- `<var>` - Variables
- `<cite>` - Citations
- `<time>` - Time elements

## Examples in This Directory

### [custom-styles-demo.html](custom-styles-demo.html)
Comprehensive demonstration including:
- Headers with custom colors and styles
- Custom markers for headers and blockquotes
- Prefix and suffix usage
- Combined attributes
- All available colors and styles
- Background colors

### [headers.html](headers.html)
Examples of header tags with:
- Various colors and styles
- Custom markers (►, •••, etc.)
- Prefix and suffix decorations

### [var.html](var.html)
Examples of `<var>` tag customization for variables:
- Default blue italic style
- Custom colors (red, green, yellow, cyan, magenta)
- Bold and dim styles
- Background colors for emphasis
- Usage in mathematical formulas and equations
- Mixed styles in code context

## Running the Examples

```bash
# View a specific example
html examples/html/tags-custom/custom-styles-demo.html

# Or run from the project root
node bin/html.js examples/html/tags-custom/custom-styles-demo.html
```

## Tips

1. **Color Syntax**: The `data-cli-color` value is a single string containing both colors and styles separated by spaces (e.g., `"red bold italic"`).

2. **Marker Symbols**: Use Unicode symbols for markers: `►`, `▌`, `»`, `•••`, `⚡`, `⚠`, etc.

3. **Override Selectively**: `data-cli-*` attributes override theme settings only for that specific element. Child elements still use the theme unless they have their own `data-cli-*` attributes.

4. **Terminal Support**: Not all terminals support all styles. Stick to basic colors and styles (bold, italic, underline) for maximum compatibility.

5. **Combining Attributes**: You can use multiple `data-cli-*` attributes on the same element for complete customization.

## Screenshots

### Custom Styles Demo
![custom-styles-demo](../screenshots/tags-custom/custom-styles-demo.png)

### Headers
![headers](../screenshots/tags-custom/headers.png)

### Headers Indicators
![headers-indicators](../screenshots/tags-custom/headers-indicators.png)

### Text Styles
![text-styles](../screenshots/tags-custom/text-styles.png)

### Code
![code](../screenshots/tags-custom/code.png)

### Blockquote
![blockquote](../screenshots/tags-custom/blockquote.png)

### Lists
![lists](../screenshots/tags-custom/lists.png)

### Lists Types
![lists-types](../screenshots/tags-custom/lists-types.png)

### Lists Object Format
![lists-object-format](../screenshots/tags-custom/lists-object-format.png)

### Table
![table](../screenshots/tags-custom/table.png)

### Table Advanced
![table-advanced](../screenshots/tags-custom/table-advanced.png)

### Links
![links](../screenshots/tags-custom/links.png)

### Abbr
![abbr](../screenshots/tags-custom/abbr.png)

### Address
![address](../screenshots/tags-custom/address.png)

### Block
![block](../screenshots/tags-custom/block.png)

### Pre
![pre](../screenshots/tags-custom/pre.png)

### Samp
![samp](../screenshots/tags-custom/samp.png)

### Var
![var](../screenshots/tags-custom/var.png)

### Definitions
![definitions](../screenshots/tags-custom/definitions.png)

### Defs
![defs](../screenshots/tags-custom/defs.png)

### Del-Ins
![del-ins](../screenshots/tags-custom/del-ins.png)

### Details
![details](../screenshots/tags-custom/details.png)

### Fieldset
![fieldset](../screenshots/tags-custom/fieldset.png)

### Fieldset Required
![fieldset-required](../screenshots/tags-custom/fieldset-required.png)

### Figure
![figure](../screenshots/tags-custom/figure.png)

### HR
![hr](../screenshots/tags-custom/hr.png)

### Input
![input](../screenshots/tags-custom/input.png)

### Input Enhancements
![input-enhancements](../screenshots/tags-custom/input-enhancements.png)

### KBD Diff Styles
![kbd-diff-styles](../screenshots/tags-custom/kbd-diff-styles.png)

### Progress
![progress](../screenshots/tags-custom/progress.png)

### Ruby
![ruby](../screenshots/tags-custom/ruby.png)

### Select
![select](../screenshots/tags-custom/select.png)

### Select Demo
![select-demo](../screenshots/tags-custom/select-demo.png)

## See Also

- [Main README](../../../README.md) - Full documentation
- [../tags/](../tags/) - Standard tag examples without custom styles
- [Customizing Styles](../../../README.md#customizing-styles) - Global theme customization
