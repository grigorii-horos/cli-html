#!/usr/bin/env node

/**
 * Custom theming example
 *
 * This example demonstrates how to use custom themes with cli-html
 * to control the appearance of rendered HTML and Markdown.
 */

import { renderHTML, renderMarkdown } from '../../index.js';

// Define custom themes
const darkTheme = {
  h1: 'magenta bold',
  h2: 'cyan bold',
  h3: 'blue bold',
  a: 'cyan underline',
  blockquote: 'gray italic',
  code: {
    color: 'yellowBright',
    inline: 'bgBlack yellow',
    numbers: 'blackBright dim'
  },
  table: {
    header: 'magenta bold',
    caption: 'bold cyan',
    cell: 'white'
  },
  ul: {
    color: 'green',
    markers: [
      { marker: '◆', color: 'green' },
      { marker: '■', color: 'greenBright' },
      { marker: '▸', color: 'cyan' }
    ]
  },
  ol: {
    color: 'blueBright',
    markers: [
      { marker: '1', color: 'blueBright' },
      { marker: 'A', color: 'cyanBright' },
      { marker: 'a', color: 'magentaBright' },
      { marker: 'I', color: 'greenBright' },
      { marker: 'i', color: 'yellowBright' }
    ]
  }
};

const lightTheme = {
  h1: 'blue bold',
  h2: 'green bold',
  h3: 'yellow bold',
  a: 'blue underline',
  blockquote: 'blackBright italic',
  code: {
    color: 'blue',
    inline: 'bgWhite black',
    numbers: 'gray dim'
  },
  table: {
    header: 'blue bold',
    caption: 'bold green',
    cell: 'black'
  }
};

const vibrantTheme = {
  h1: 'redBright bold',
  h2: 'yellowBright bold',
  h3: 'greenBright bold',
  a: 'cyanBright underline',
  blockquote: 'magentaBright italic',
  code: {
    color: 'greenBright',
    inline: 'bgBlack greenBright',
    numbers: 'gray'
  },
  table: {
    header: 'redBright bold',
    caption: 'bold yellowBright',
    cell: 'whiteBright'
  },
  ul: {
    color: 'cyanBright',
    markers: [
      { marker: '★', color: 'yellowBright' },
      { marker: '✦', color: 'cyanBright' },
      { marker: '✧', color: 'magentaBright' }
    ]
  }
};

// Example content
const htmlContent = `
<h1>Custom Theme Demo</h1>
<p>This is a paragraph with <strong>bold text</strong> and <code>inline code</code>.</p>

<h2>Features</h2>
<ul>
  <li>Custom colors</li>
  <li>Custom markers</li>
  <li>Flexible styling</li>
</ul>

<h2>Code Example</h2>
<pre><code class="language-javascript">
const theme = {
  h1: "magenta bold",
  code: { color: "yellowBright" }
};
</code></pre>

<h3>Data Table</h3>
<table>
  <thead>
    <tr><th>Feature</th><th>Status</th></tr>
  </thead>
  <tbody>
    <tr><td>Theming</td><td>✓ Supported</td></tr>
    <tr><td>Colors</td><td>✓ Full support</td></tr>
  </tbody>
</table>
`;

const markdownContent = `
# Custom Theme Demo

This is a paragraph with **bold text** and \`inline code\`.

## Features

- Custom colors
- Custom markers
- Flexible styling

## Code Example

\`\`\`javascript
const theme = {
  h1: "magenta bold",
  code: { color: "yellowBright" }
};
\`\`\`

### Data Table

| Feature  | Status         |
|----------|----------------|
| Theming  | ✓ Supported    |
| Colors   | ✓ Full support |

> [!TIP]
> You can customize every aspect of the theme!
`;

// Render with different themes
console.log('='.repeat(60));
console.log('DARK THEME (HTML)');
console.log('='.repeat(60));
console.log(renderHTML(htmlContent, darkTheme));

console.log('\n' + '='.repeat(60));
console.log('LIGHT THEME (HTML)');
console.log('='.repeat(60));
console.log(renderHTML(htmlContent, lightTheme));

console.log('\n' + '='.repeat(60));
console.log('VIBRANT THEME (HTML)');
console.log('='.repeat(60));
console.log(renderHTML(htmlContent, vibrantTheme));

console.log('\n' + '='.repeat(60));
console.log('DARK THEME (Markdown)');
console.log('='.repeat(60));
console.log(renderMarkdown(markdownContent, darkTheme));

console.log('\n' + '='.repeat(60));
console.log('VIBRANT THEME (Markdown)');
console.log('='.repeat(60));
console.log(renderMarkdown(markdownContent, vibrantTheme));
