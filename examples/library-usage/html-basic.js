#!/usr/bin/env node

/**
 * Basic HTML rendering example
 *
 * This example demonstrates how to use cli-html as a library
 * to render HTML content in the terminal.
 */

import { renderHTML } from '../../index.js';

// Example 1: Simple HTML with headings and paragraphs
console.log('=== Example 1: Basic HTML ===\n');
const basicHTML = `
<h1>Welcome to cli-html</h1>
<p>This is a <strong>powerful</strong> library for rendering HTML in the terminal.</p>
<p>It supports <em>italic</em>, <strong>bold</strong>, <code>inline code</code>, and much more!</p>
`;
console.log(renderHTML(basicHTML));

// Example 2: Lists
console.log('\n=== Example 2: Lists ===\n');
const listsHTML = `
<h2>Shopping List</h2>
<ul>
  <li>Milk</li>
  <li>Eggs</li>
  <li>Bread</li>
</ul>

<h2>Todo List</h2>
<ol>
  <li>Wake up</li>
  <li>Write code</li>
  <li>Deploy to production</li>
</ol>
`;
console.log(renderHTML(listsHTML));

// Example 3: Code blocks with syntax highlighting
console.log('\n=== Example 3: Code Blocks ===\n');
const codeHTML = `
<h2>JavaScript Example</h2>
<pre><code class="language-javascript">
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}

greet('World');
</code></pre>

<h2>Python Example</h2>
<pre><code class="language-python">
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
</code></pre>
`;
console.log(renderHTML(codeHTML));

// Example 4: Tables
console.log('\n=== Example 4: Tables ===\n');
const tableHTML = `
<h2>User Information</h2>
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>john@example.com</td>
      <td>Admin</td>
    </tr>
    <tr>
      <td>Jane Smith</td>
      <td>jane@example.com</td>
      <td>User</td>
    </tr>
    <tr>
      <td>Bob Johnson</td>
      <td>bob@example.com</td>
      <td>Moderator</td>
    </tr>
  </tbody>
</table>
`;
console.log(renderHTML(tableHTML));

// Example 5: Blockquotes
console.log('\n=== Example 5: Blockquotes ===\n');
const blockquoteHTML = `
<h2>Quote of the Day</h2>
<blockquote>
  <p>"The only way to do great work is to love what you do."</p>
  <p>— Steve Jobs</p>
</blockquote>
`;
console.log(renderHTML(blockquoteHTML));

// Example 6: Links
console.log('\n=== Example 6: Links ===\n');
const linksHTML = `
<h2>Useful Resources</h2>
<ul>
  <li><a href="https://nodejs.org">Node.js Official Site</a></li>
  <li><a href="https://github.com">GitHub</a></li>
  <li><a href="https://www.npmjs.com">NPM Registry</a></li>
</ul>
`;
console.log(renderHTML(linksHTML));

// Example 7: Custom Inline Styles with data-cli-* attributes
console.log('\n=== Example 7: Custom Inline Styles ===\n');
const customStylesHTML = `
<h2>Custom Colors and Styles</h2>
<p>
  This paragraph demonstrates <span data-cli-color="red">red text</span>,
  <span data-cli-color="blue bold">blue bold text</span>,
  and <span data-cli-color="green italic">green italic text</span>.
</p>

<h1 data-cli-color="magenta bold" data-cli-marker="►">Magenta Bold Header with Triangle</h1>
<h2 data-cli-color="cyan" data-cli-marker="•••">Cyan Header with Dots</h2>

<blockquote data-cli-color="yellow" data-cli-marker="▌ ">
  This is a yellow blockquote with custom marker.
</blockquote>

<p>
  Text styles: <strong data-cli-color="red">red bold</strong>,
  <em data-cli-color="blue italic">blue italic</em>,
  <mark data-cli-color="yellowBright">bright yellow mark</mark>
</p>
`;
console.log(renderHTML(customStylesHTML));
