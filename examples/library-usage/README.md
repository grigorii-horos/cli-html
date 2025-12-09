# Library Usage Examples

This directory contains practical examples of using `cli-html` and `cli-markdown` as libraries in your Node.js projects.

## Getting Started

All examples can be run directly with Node.js:

```bash
node examples/library-usage/<example-name>.js
```

## Examples Overview

### 1. HTML Basic (`html-basic.js`)

Demonstrates basic HTML rendering capabilities:

- Headings and paragraphs
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Tables
- Blockquotes
- Links
- **Custom inline styles** with `data-cli-color` and `data-cli-style` attributes

**Run it:**
```bash
node examples/library-usage/html-basic.js
```

### 2. Markdown Basic (`markdown-basic.js`)

Shows GitHub Flavored Markdown features:

- Basic formatting (bold, italic, code)
- GFM Alerts (NOTE, TIP, IMPORTANT, WARNING, CAUTION)
- Task lists with checkboxes
- Tables
- Code blocks with syntax highlighting
- Nested lists
- Strikethrough and links
- Blockquotes

**Run it:**
```bash
node examples/library-usage/markdown-basic.js
```

### 3. Custom Theme (`custom-theme.js`)

Demonstrates how to apply custom themes:

- Dark theme example
- Light theme example
- Vibrant theme example
- Custom colors for all elements
- Custom list markers
- Theming both HTML and Markdown

**Run it:**
```bash
node examples/library-usage/custom-theme.js
```

### 4. Dynamic Content (`dynamic-content.js`)

Shows how to generate content dynamically from data:

- User report generation from array data
- Task list from objects
- API documentation from endpoint metadata
- Changelog from version data
- Statistics dashboard

**Run it:**
```bash
node examples/library-usage/dynamic-content.js
```

**Use cases:**
- Generating reports from database queries
- Creating dynamic documentation
- Building CLI dashboards
- Formatting log output

### 5. File Reader (`file-reader.js`)

Demonstrates reading files and rendering them:

- Reading HTML files from disk
- Reading Markdown files from disk
- Processing multiple files
- Applying custom themes to file content

**Run it:**
```bash
node examples/library-usage/file-reader.js
```

## Common Patterns

### Basic Usage

```javascript
import { renderHTML, renderMarkdown } from 'cli-html';

// HTML
const html = '<h1>Hello</h1><p>World</p>';
console.log(renderHTML(html));

// Markdown
const markdown = '# Hello\n\nWorld';
console.log(renderMarkdown(markdown));
```

### Inline Custom Styles with data-cli-* Attributes

```javascript
import { renderHTML } from 'cli-html';

const html = `
<h1 data-cli-color="magenta bold" data-cli-marker="►">Custom Styled Header</h1>
<h2 data-cli-color="cyan" data-cli-marker="•••">Header with Dots</h2>

<p>
  This paragraph has <span data-cli-color="red">red text</span>,
  <span data-cli-color="blue bold">blue bold text</span>,
  and <span data-cli-color="green italic">green italic text</span>.
</p>

<blockquote data-cli-color="yellow" data-cli-marker="▌ ">
  Yellow blockquote with custom marker
</blockquote>
`;

console.log(renderHTML(html));
```

**Available Attributes:**
- **`data-cli-color`**: Color + styles in one string (e.g., `"red bold italic"`)
- **`data-cli-marker`**: Custom marker for headers/blockquotes (e.g., `"►"`, `"•••"`)

**Available Colors:**
- Basic: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`
- Bright: `redBright`, `greenBright`, `yellowBright`, `blueBright`, etc.
- Background: `bgRed`, `bgGreen`, `bgBlue`, etc.
- Combined: `bgRed white` (white text on red background)

**Available Styles:**
- `bold`, `italic`, `underline`, `dim`, `inverse`, `strikethrough`
- Combine in data-cli-color: `"red bold italic"`, `"bgBlue white underline"`

### With Custom Theme

```javascript
import { renderHTML } from 'cli-html';

const theme = {
  h1: 'magenta bold',
  code: {
    color: 'yellowBright',
    inline: 'bgBlack yellow'
  }
};

const html = '<h1>Title</h1><code>code</code>';
console.log(renderHTML(html, theme));
```

### Reading from Files

```javascript
import { renderMarkdown } from 'cli-html';
import { readFileSync } from 'fs';

const content = readFileSync('README.md', 'utf8');
console.log(renderMarkdown(content));
```

### Dynamic Content

```javascript
import { renderHTML } from 'cli-html';

const users = [
  { name: 'Alice', role: 'Admin' },
  { name: 'Bob', role: 'User' }
];

const html = `
<h1>Users</h1>
<ul>
  ${users.map(u => `<li>${u.name} - ${u.role}</li>`).join('')}
</ul>
`;

console.log(renderHTML(html));
```

## Theme Options

You can customize these style keys:

- **Headings:** `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- **Text:** `bold`, `italic`, `underline`, `strikethrough`, `mark`
- **Links:** `a`
- **Code:** `code` (object with `color`, `inline`, `numbers`)
- **Lists:** `ul`, `ol` (with `color` and `markers`)
- **Tables:** `table` (object with `header`, `caption`, `cell`)
- **Blocks:** `blockquote`, `hr`

Values use [chalk-string](https://www.npmjs.com/package/chalk-string) format:
- Colors: `red`, `green`, `blue`, `yellow`, `magenta`, `cyan`, `white`, `black`, `gray`
- Bright colors: `redBright`, `greenBright`, etc.
- Backgrounds: `bgRed`, `bgGreen`, etc.
- Modifiers: `bold`, `dim`, `italic`, `underline`

Combine them with spaces: `"magenta bold"`, `"bgBlue white underline"`

## Integration Examples

### CLI Tool

```javascript
#!/usr/bin/env node
import { renderMarkdown } from 'cli-html';
import { readFileSync } from 'fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: my-tool <file.md>');
  process.exit(1);
}

const content = readFileSync(file, 'utf8');
console.log(renderMarkdown(content));
```

### Express Server (API Response Formatting)

```javascript
import express from 'express';
import { renderHTML } from 'cli-html';

const app = express();

app.get('/api/docs', (req, res) => {
  const html = '<h1>API Documentation</h1><p>Welcome</p>';
  res.type('text/plain').send(renderHTML(html));
});
```

### Testing Output

```javascript
import { renderMarkdown } from 'cli-html';
import assert from 'assert';

const testResults = [
  { name: 'Test 1', passed: true },
  { name: 'Test 2', passed: false }
];

const report = `
# Test Results

${testResults.map(t =>
  `- [${t.passed ? 'x' : ' '}] ${t.name}`
).join('\n')}
`;

console.log(renderMarkdown(report));
```

## Tips

1. **Performance**: For large files, consider processing in chunks
2. **Caching**: Cache rendered output if content doesn't change
3. **Error Handling**: Always wrap file reads in try-catch
4. **Themes**: Define theme objects once and reuse them
5. **Validation**: Sanitize user input before rendering HTML

## More Information

- Main README: [../../README.md](../../README.md)
- HTML Examples: [../html/](../html/)
- Markdown Examples: [../markdown/](../markdown/)
- npm Package: https://www.npmjs.com/package/cli-html
- GitHub: https://github.com/grigorii-horos/cli-html
