#!/usr/bin/env node

/**
 * File reading example
 *
 * This example demonstrates how to read HTML and Markdown files
 * from disk and render them in the terminal.
 */

import { renderHTML, renderMarkdown } from '../../index.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Example 1: Read and render HTML file
console.log('=== Example 1: Rendering HTML from file ===\n');

try {
  const htmlPath = join(__dirname, '../html/tags/table.html');
  const htmlContent = readFileSync(htmlPath, 'utf8');
  console.log(`Reading from: ${htmlPath}\n`);
  console.log(renderHTML(htmlContent));
} catch (error) {
  console.error('Error reading HTML file:', error.message);
  console.log('\nCreating sample HTML content instead:\n');

  const sampleHTML = `
<h1>Sample HTML Document</h1>
<p>This is a sample HTML document that demonstrates file reading.</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
`;
  console.log(renderHTML(sampleHTML));
}

// Example 2: Read and render Markdown file
console.log('\n=== Example 2: Rendering Markdown from file ===\n');

try {
  const mdPath = join(__dirname, '../../README.md');
  const mdContent = readFileSync(mdPath, 'utf8');
  console.log(`Reading from: ${mdPath}\n`);

  // Render only the first part of README (first 2000 characters for demo)
  const preview = mdContent.substring(0, 2000);
  console.log(renderMarkdown(preview));
  console.log('\n[...truncated for demo...]');
} catch (error) {
  console.error('Error reading Markdown file:', error.message);
  console.log('\nCreating sample Markdown content instead:\n');

  const sampleMarkdown = `
# Sample Markdown Document

This is a sample Markdown document that demonstrates file reading.

## Features

- Easy to use
- Supports GFM
- Beautiful output

## Code Example

\`\`\`javascript
import { renderMarkdown } from 'cli-html';
import { readFileSync } from 'fs';

const content = readFileSync('file.md', 'utf8');
console.log(renderMarkdown(content));
\`\`\`
`;
  console.log(renderMarkdown(sampleMarkdown));
}

// Example 3: Process multiple files
console.log('\n=== Example 3: Processing multiple files ===\n');

const filesToRender = [
  { path: '../html/tags/table.html', type: 'html', title: 'Table Example' },
  { path: '../markdown/features/alerts.md', type: 'markdown', title: 'GFM Alerts' }
];

for (const file of filesToRender) {
  const fullPath = join(__dirname, file.path);

  try {
    const content = readFileSync(fullPath, 'utf8');
    console.log(`\n--- ${file.title} ---`);
    console.log(`File: ${fullPath}\n`);

    if (file.type === 'html') {
      console.log(renderHTML(content));
    } else {
      console.log(renderMarkdown(content));
    }
  } catch (error) {
    console.log(`⚠ Could not read ${file.path}: ${error.message}`);
  }
}

// Example 4: Read with custom theme
console.log('\n=== Example 4: Custom theme from file ===\n');

const customTheme = {
  h1: 'cyanBright bold',
  h2: 'greenBright bold',
  code: {
    color: 'yellowBright',
    inline: 'bgBlack yellow'
  },
  ul: {
    color: 'magenta',
    markers: ['→', '•', '◦']
  }
};

const themedMarkdown = `
# Themed Document

## Features

- Custom colors
- Custom bullet points
- Beautiful output

This shows \`inline code\` with custom styling.
`;

console.log(renderMarkdown(themedMarkdown, customTheme));
