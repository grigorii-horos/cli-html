# Welcome to cli-html

[![npm version](https://img.shields.io/npm/v/cli-html.svg)](https://www.npmjs.com/package/cli-html)
[![Downloads](https://img.shields.io/npm/dw/cli-html.svg)](https://www.npmjs.com/package/cli-html)
[![Node.js](https://img.shields.io/node/v/cli-html.svg)](https://nodejs.org)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/grigorii-horos/cli-html#readme)
[![Maintenance](https://img.shields.io/maintenance/yes/2026.svg)](https://github.com/grigorii-horos/cli-html/graphs/commit-activity)
[![License: GPL-3.0](https://img.shields.io/github/license/grigorii-horos/cli-html.svg)](https://github.com/grigorii-horos/cli-html/blob/master/LICENSE)

> Renderer HTML and Markdown in the Terminal.
> Supports pretty tables, syntax highlighting, and GitHub Flavored Markdown

## Features

- 🎨 **Full HTML rendering** — headings, lists, tables, forms, figures, and 80+ tags
- 📝 **GitHub Flavored Markdown** — alerts, task lists, tables, footnotes, strikethrough, and more
- ⚛️ **JSX / React** — render React elements straight to the terminal
- 🌈 **Syntax highlighting** — automatic, for dozens of languages
- 📐 **Pretty tables** — borders, alignment, zebra striping, responsive narrow-terminal mode
- 🎭 **Deep theming** — every element themeable via `config.yaml`, a theme object, or per-element `data-cli-*` attributes
- 🔌 **CLI + library** — use the `html` / `markdown` / `md` / `jsx` commands, or import `renderHTML` / `renderMarkdown` / `renderJSX`
- ⌨️ **Reads stdin** — pipe HTML or Markdown straight in (`echo '<h1>hi</h1>' | html`)

<details>
<summary><strong>Table of Contents</strong></summary>

- [Install](#install)
- [Example](#example)
  - [HTML Rendering](#html-rendering)
  - [Markdown Rendering](#markdown-rendering)
  - [JSX Rendering](#jsx-rendering)
- [Usage as module](#usage-as-module)
  - [Library Examples](#library-examples)
  - [API Reference](#api-reference)
  - [Common Use Cases](#common-use-cases)
- [Inline Style Customization](#inline-style-customization)
- [Documentation](#-documentation)
- [Customizing Styles](#customizing-styles)
- [Syntax Highlighting](#syntax-highlighting)
- [Author](#author)
- [Contributing](#contributing)
- [License](#license)

</details>

## Install

Requires **Node.js >= 18**.

```sh
npm i -g cli-html
```

## Example

### HTML Rendering

```sh
# Render a full HTML document
html examples/html/full/demo.html

# Render individual tag examples
html examples/html/tags/table.html

# Pipe HTML from stdin
echo '<h1>Hello</h1><p>from <code>stdin</code></p>' | html
curl -s https://example.com | html
```

This will produce the following:

![Screenshot of cli-html](https://raw.githubusercontent.com/grigorii-horos/cli-html/master/images/html.png)

### Markdown Rendering

Render Markdown files with full GitHub Flavored Markdown support:

```sh
# Render GFM alerts
markdown examples/markdown/features/alerts.md

# Render full GFM document
md examples/markdown/full/gfm-features.md

# Pipe Markdown from stdin
echo '# Title\n\n> [!NOTE]\n> Piped markdown' | md
cat CHANGELOG.md | md
```

**Supported GFM Features:**
- ✓ **Alerts** - `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]` with colors
- ✓ **Task Lists** - `- [x]` and `- [ ]` with checkboxes
- ✓ **Tables** - Full table support with borders
- ✓ **Strikethrough** - `~~text~~`
- ✓ **Autolinks** - Automatic URL linking
- ✓ **Footnotes** - `[^1]` references
- ✓ **Definition Lists** - Term and definition pairs
- ✓ **Subscript/Superscript** - `H~2~O` and `x^2^`
- ✓ **Insert/Mark** - `++inserted++` and `==marked==` text
- ✓ **Abbreviations** - `*[HTML]: Hyper Text Markup Language`

### JSX Rendering

Render React/JSX files straight to the terminal. JSX is transpiled, rendered to
HTML via `react-dom`, then drawn by the same renderer used for HTML and Markdown:

```sh
# Render a JSX file
jsx examples/jsx/full/demo.jsx

# With a custom theme config
jsx examples/jsx/full/demo.jsx --config ./theme.yaml
```

The file's `default` export may be a React element (`export default <App />`) or a
component (`export default App`). Neighbouring modules resolve relative to the
file; `react` / `react-dom` are provided by `cli-html` itself.

More examples (components, data-driven tables, dashboards, boxed layouts) live in
[examples/jsx](examples/jsx).

## Usage as module

```sh
npm i cli-html
```

### Library Examples

For practical, runnable examples of using `cli-html` and `cli-markdown` as libraries, check out the [examples/library-usage](examples/library-usage) directory:

- **[html-basic.js](examples/library-usage/html-basic.js)** - Basic HTML rendering (headings, lists, tables, code blocks)
- **[markdown-basic.js](examples/library-usage/markdown-basic.js)** - GitHub Flavored Markdown features (alerts, task lists, tables)
- **[custom-theme.js](examples/library-usage/custom-theme.js)** - Custom theming examples (dark, light, vibrant themes)
- **[dynamic-content.js](examples/library-usage/dynamic-content.js)** - Generating content from data (reports, dashboards, changelogs)
- **[file-reader.js](examples/library-usage/file-reader.js)** - Reading and rendering files from disk
- **[jsx-basic.js](examples/library-usage/jsx-basic.js)** - Rendering React/JSX with `renderJSX`

Run any example:
```bash
node examples/library-usage/<example-name>.js
```

See the [Library Examples README](examples/library-usage/README.md) for detailed documentation.

### API Reference

#### `renderHTML(html, theme?)`

Renders HTML content to formatted terminal output.

**Parameters:**
- `html` (string) - HTML content to render
- `theme` (object, optional) - Custom theme configuration (see [Customizing Styles](#customizing-styles))

**Returns:** `string` - Formatted terminal output

**Example:**

```js
import { renderHTML } from 'cli-html';

const html = `
<h1>Hello World</h1>
<p>This is a <strong>bold</strong> paragraph with <code>code</code>.</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
`;

console.log(renderHTML(html));
```

**With custom theme:**

```js
import { renderHTML } from 'cli-html';

const customTheme = {
  h1: "magenta bold",
  code: { inline: "bgBlack yellow" }
};

const html = '<h1>Styled Title</h1>';
console.log(renderHTML(html, customTheme));
```

#### `renderMarkdown(markdown, theme?)`

Renders Markdown content to formatted terminal output with full GitHub Flavored Markdown support.

**Parameters:**
- `markdown` (string) - Markdown content to render
- `theme` (object, optional) - Custom theme configuration (see [Customizing Styles](#customizing-styles))

**Returns:** `string` - Formatted terminal output

**Example:**

```js
import { renderMarkdown } from 'cli-html';

const markdown = `
# Hello World

> [!NOTE]
> This is a note with **bold** text

- [x] Task 1
- [ ] Task 2

## Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`
`;

console.log(renderMarkdown(markdown));
```

**With custom theme:**

```js
import { renderMarkdown } from 'cli-html';

const customTheme = {
  h1: "cyan bold",
  h2: "blue bold",
  code: {
    color: "yellowBright",
    inline: "bgBlack yellow"
  }
};

const markdown = '# Title\n\nParagraph with `code`.';
console.log(renderMarkdown(markdown, customTheme));
```

#### `renderJSX(jsx, theme?)`

Renders a React/JSX element or component to formatted terminal output.

`react` and `react-dom` are loaded lazily, so importing `cli-html` for plain
HTML/Markdown rendering never pays for them.

**Parameters:**
- `jsx` (React element | component) - e.g. `<App />` or `App`
- `theme` (object, optional) - Custom theme configuration (see [Customizing Styles](#customizing-styles))

**Returns:** `Promise<string>` - Formatted terminal output (async)

**Example:**

```jsx
import { renderJSX } from 'cli-html';

const App = () => (
  <>
    <h1>Hello from JSX</h1>
    <p>Rendered with <strong>cli-html</strong></p>
  </>
);

console.log(await renderJSX(<App />));
```

#### Default Export: `cliHtml(html, theme?)`

Alias for `renderHTML()`. Use this for backward compatibility or shorter imports.

```js
import cliHtml from 'cli-html';

const html = '<h1>Hello World</h1>';
console.log(cliHtml(html));
```

### Common Use Cases

**Reading HTML from file:**

```js
import { renderHTML } from 'cli-html';
import { readFileSync } from 'fs';

const html = readFileSync('document.html', 'utf8');
console.log(renderHTML(html));
```

**Reading Markdown from file:**

```js
import { renderMarkdown } from 'cli-html';
import { readFileSync } from 'fs';

const markdown = readFileSync('README.md', 'utf8');
console.log(renderMarkdown(markdown));
```

**Rendering dynamic content:**

```js
import { renderHTML } from 'cli-html';

const data = {
  title: 'User Report',
  items: ['Item 1', 'Item 2', 'Item 3']
};

const html = `
<h1>${data.title}</h1>
<ul>
  ${data.items.map(item => `<li>${item}</li>`).join('\n')}
</ul>
`;

console.log(renderHTML(html));
```

**Converting Markdown to HTML then to Terminal:**

```js
import { renderMarkdown } from 'cli-html';

// renderMarkdown handles the conversion internally
const markdown = '# Title\n\n**Bold** and *italic*';
console.log(renderMarkdown(markdown));
```

## Inline Style Customization

You can customize individual elements using `data-cli-*` attributes without modifying the global theme.

### Using data-cli-* Attributes

```html
<!-- Custom color and styles in a single attribute -->
<h1 data-cli-color="magenta bold">Magenta Bold Header</h1>
<h2 data-cli-color="cyan underline italic">Cyan Underlined Italic Header</h2>

<!-- Custom markers for headers -->
<h1 data-cli-marker="►">Triangle Marker</h1>
<h2 data-cli-marker="•••">Triple Dot Marker</h2>

<!-- Combined attributes -->
<h1 data-cli-color="red bold"
    data-cli-marker="⚠">
  Warning Header
</h1>

<!-- Background colors -->
<span data-cli-color="bgRed white bold">White bold on red</span>

<!-- Lists customization -->
<ol data-cli-color="green" data-cli-marker-color="red bold" data-cli-decimal=")">
  <li>Item with green text and red bold marker with ) separator</li>
  <li>Another item</li>
</ol>

<ul data-cli-color="yellow" data-cli-marker="★" data-cli-marker-color="cyan">
  <li>Item with yellow text and cyan star marker</li>
  <li>Another item</li>
</ul>
```

**Available Attributes:**
- **`data-cli-color`**: Full chalk-string specification (color + styles), e.g., `"red bold italic"`, `"bgBlue white"`
  - For `ol`/`ul`: applies to list item text
- **`data-cli-marker`**: Custom marker symbol
  - For headers/blockquotes: e.g., `"►"`, `"▌ "`, `"•••"`
  - For `ul`: custom bullet marker, e.g., `"★"`, `"►"`, `"•"`
- **`data-cli-marker-color`**: Marker color (for `ol`/`ul`), e.g., `"red bold"`, `"cyan"`
- **`data-cli-decimal`**: Decimal separator for `ol`, e.g., `")"`, `":"`, `"-"`
- **`data-cli-title-*`** (abbr/dfn):
  - `data-cli-title-color`: Title color
  - `data-cli-title-prefix-marker` / `data-cli-title-prefix-color`: Opening marker + color
  - `data-cli-title-suffix-marker` / `data-cli-title-suffix-color`: Closing marker + color

**Available Colors:**
- Basic: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`
- Bright: `redBright`, `greenBright`, `yellowBright`, `blueBright`, `magentaBright`, `cyanBright`, `whiteBright`
- Background: `bgRed`, `bgGreen`, `bgBlue`, `bgYellow`, `bgMagenta`, `bgCyan`, `bgWhite`, etc.

**Available Styles:**
- `bold`, `italic`, `underline`, `dim`, `inverse`, `strikethrough`

**Examples:**
- Color only: `data-cli-color="red"`
- Color + style: `data-cli-color="blue bold"`
- Multiple styles: `data-cli-color="green bold italic underline"`
- Background: `data-cli-color="bgYellow black"`
- Background + styles: `data-cli-color="bgMagenta white bold"`

**Supported Tags:**
- Headers (color, marker): `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- Block (color, marker): `blockquote`
- Lists (color for text, marker-color, marker, decimal): `ol`, `ul`
- Inline (color): `span`, `strong`, `b`, `em`, `i`, `u`, `del`, `ins`, `mark`, `code`, `kbd`, `samp`, `var`, `cite`, `time`

See [examples/html/tags-custom/](examples/html/tags-custom/) for complete examples with `data-cli-*` attributes.

## 📚 Documentation

Comprehensive documentation is available in the `examples/` directory:

- **[Examples Overview](examples/README.md)** - Main documentation hub
- **[HTML Examples](examples/html/README.md)** - Complete HTML rendering guide with examples
- **[Markdown Examples](examples/markdown/README.md)** - Markdown rendering guide
- **[Data Attributes](DATA_ATTRIBUTES.md)** - Complete reference for all `data-cli-*` attributes
- **[Theme Configuration](examples/THEMES.md)** - Guide to customizing the default theme via `config.yaml`
- **[Library Usage](examples/library-usage/README.md)** - Programmatic API examples and patterns

## Customizing Styles

Every element's default style lives in [`config.yaml`](config.yaml) — the single source of truth. Override it three ways, in increasing precedence:

1. **Globally** — a `config.yaml` in the config directory, or an explicit file via [`--config`](#--config-path) (CLI)
2. **Per render** — a theme object passed to `renderHTML()` / `renderMarkdown()` / `renderJSX()` (library)
3. **Per element** — `data-cli-*` attributes on individual tags (see [Inline Style Customization](#inline-style-customization))

Full reference:

- **[Theme Configuration](examples/THEMES.md)** — every theme key with examples
- **[Data Attributes](DATA_ATTRIBUTES.md)** — every `data-cli-*` attribute

### For CLI Usage

Each command loads [`config.yaml`](config.yaml) defaults, then merges your overrides from a per-command config directory:

| Command | Linux | macOS | Windows |
|---------|-------|-------|---------|
| `html` | `~/.config/cli-html/config.yaml` | `~/Library/Preferences/cli-html/config.yaml` | `%LOCALAPPDATA%\cli-html\Config\config.yaml` |
| `markdown` / `md` | `~/.config/cli-markdown/config.yaml` | `~/Library/Preferences/cli-markdown/config.yaml` | `%LOCALAPPDATA%\cli-markdown\Config\config.yaml` |

Print the exact path for a command:

```sh
# html
node -e "import('env-paths').then(({default:e})=>console.log(e('cli-html',{suffix:''}).config))"
# markdown / md
node -e "import('env-paths').then(({default:e})=>console.log(e('cli-markdown',{suffix:''}).config))"
```

#### `--config <path>`

To load a specific config file instead of the one in the config directory, pass `--config`. Supported by every command (`html`, `markdown`, `md`, `jsx`) and works with stdin too:

```sh
html demo.html --config ./theme.yaml
md README.md --config ./theme.yaml
jsx demo.jsx --config ./theme.yaml

# with stdin
cat page.html | html --config ./theme.yaml
```

#### `--streaming`

Process files sequentially in chunks. This reduces memory usage when rendering very large HTML or Markdown files, allowing you to view results instantly before the entire document finishes processing. Auto-enabled for large files (>100MB).

```sh
html --streaming large-file.html
md --streaming big-document.md
```

#### `--verbose`

Prints detailed analysis, processing information, and memory usage statistics.

```sh
html --verbose document.html
```

#### `--help`

Show usage information and available options for the command.

```sh
html --help
```

Values are [chalk-string](https://www.npmjs.com/package/chalk-string) compatible (`"red bold"`, `"bgBlue white underline"`). Example `config.yaml`:

```yml
theme:
  h1: "magenta bold"
  a: "cyan underline"
  blockquote: "gray italic"
  code:
    color: "yellowBright bgBlack"   # inline code
    block:
      numbers:
        color: "blackBright dim"    # line numbers in code blocks
  th: "red bold"                    # table header cells
  td: ""                            # table data cells
  caption: "blue bold"              # table caption
  var: "blue italic"
  mark: "bgYellow black"
  hr: "gray"
  progress:
    filled: { color: "bgWhite cyan", marker: "█" }
    empty:  { color: "bgBlack gray", marker: "░" }
```

See [THEMES.md](examples/THEMES.md) for the complete key list (headings, lists, borders, forms, and more).

### For Library Usage

Pass a theme object as the second argument to any renderer. It uses the same keys as `config.yaml`:

```js
import { renderHTML, renderMarkdown } from 'cli-html';

const theme = {
  h1: "magenta bold",
  a: "blue underline",
  blockquote: "gray italic",
  code: { color: "yellowBright bgBlack" },
  th: "red bold",
  td: "",
  caption: "blue bold",
  ul: {
    indicators: {
      disc:   { color: "green",  marker: "•" },
      square: { color: "yellow", marker: "▪" },
      circle: { color: "cyan",   marker: "◦" },
    },
  },
  progress: {
    filled: { color: "bgWhite cyan", marker: "█" },
    empty:  { color: "bgBlack gray", marker: "░" },
  },
};

console.log(renderHTML('<h1>Hello</h1><p>This is <code>inline code</code></p>', theme));
console.log(renderMarkdown('# Hello\n\nThis is `inline code`', theme));
```

Omit the theme argument to use the defaults from `config.yaml`. For the full set of keys, see [THEMES.md](examples/THEMES.md).


## Syntax Highlighting

Code blocks support automatic syntax highlighting using [cli-highlight](https://www.npmjs.com/package/cli-highlight). To enable syntax highlighting for a code block, add a `language-*` or `lang-*` class to the `<code>` element:

```html
<pre><code class="language-javascript">
function hello() {
  console.log("Hello, World!");
  return true;
}
</code></pre>
```

Supported languages include: `javascript`, `typescript`, `python`, `java`, `sql`, `bash`, `json`, `yaml`, `nginx`, `go`, `rust`, and many more.

**Example:**

```html
<!-- JavaScript -->
<pre><code class="language-javascript">
const user = await User.findById(id);
</code></pre>

<!-- Python -->
<pre><code class="language-python">
def hello():
    print("Hello, World!")
</code></pre>

<!-- SQL -->
<pre><code class="language-sql">
SELECT * FROM users WHERE email = 'user@example.com';
</code></pre>

<!-- Bash -->
<pre><code class="language-bash">
npm install express
</code></pre>
```

Code blocks without a language class will still be displayed but without syntax highlighting.

See the comprehensive examples in `examples/html/full/documentation.html`, `examples/html/full/blog.html`, and `examples/html/full/tutorial.html` for more syntax highlighting examples.

## Author

👤**Grigorii Horos**

* Github: [@grigorii-horos](https://github.com/grigorii-horos)

## Contributing

Contributions, issues and feature requests are welcome!

Feel free to check the [issues page](https://github.com/grigorii-horos/cli-html/issues). Run the test suite with:

```sh
npm test
```

## Show your support

Give a ⭐️ if this project helped you!

## License

Copyright © 2019–2026 [Grigorii Horos](https://github.com/grigorii-horos).

This project is [GPL-3.0-or-later](https://github.com/grigorii-horos/cli-html/blob/master/LICENSE) licensed.
