# Examples for CLI-HTML

This directory contains examples demonstrating HTML and Markdown rendering in the terminal.

## Directory Structure

```
examples/
├── html/
│   ├── tags/          # Individual HTML tag examples
│   └── full/          # Complete HTML documents
└── markdown/
    ├── features/      # Individual Markdown features
    └── full/          # Complete Markdown documents
```

## HTML Examples

### Individual Tags (`html/tags/`)

Examples demonstrating individual HTML elements:

#### Text Formatting
- **abbr.html** - Abbreviations with title attributes
- **samp.html** - Sample output text
- **var.html** - Variables and code references
- **del-ins.html** - Deleted and inserted text
- **text-styles.html** - All text formatting elements (bold, italic, code, kbd, etc.)

#### Block Elements
- **block.html** - Basic block-level elements (div, section, article, etc.)
- **blockquote.html** - Quotations with multiple nesting levels
- **headers.html** - All heading levels (h1-h6)
- **pre.html** - Preformatted text blocks
- **hr.html** - Horizontal rules

#### Lists
- **lists.html** - Complete list examples (ul, ol, menu) with nesting
- **defs.html** - Definition lists (dl, dt, dd)

#### Links and Media
- **links.html** - Hyperlinks and anchors

#### Tables
- **table.html** - Comprehensive table examples with headers, footers, captions

#### Forms and Input
- **input.html** - All form input elements (checkboxes, radio, buttons, text, textarea)
- **fieldset.html** - Form field grouping with legends

#### Widgets
- **progress.html** - Progress bars and meter elements

#### Code
- **code.html** - Inline and block code with syntax highlighting

#### Containers
- **figure.html** - Figure with figcaption
- **ruby.html** - Ruby annotations for Asian languages

### Full Documents (`html/full/`)

Complete HTML documents showcasing multiple elements:

- **demo.html** - General demonstration of various elements
- **blog.html** - Full blog post with rich content
- **dashboard.html** - System monitoring dashboard
- **documentation.html** - Complete technical API documentation
- **tutorial.html** - Step-by-step programming tutorial
- **report.html** - Executive business report
- **embedded.html** - Embedded content (iframe, object, canvas, SVG)

## Markdown Examples

### Features (`markdown/features/`)

Examples demonstrating specific Markdown features:

#### Text and Formatting
- **emphasis.md** - Bold, italic, strikethrough, marked, inserted text
- **headings.md** - All heading levels (H1-H6) with various styles
- **links.md** - Inline, reference, automatic links and various link styles
- **horizontal-rules.md** - Dividers using different syntaxes

#### Structure
- **lists.md** - Unordered, ordered, nested lists with rich content
- **task-lists.md** - Checkboxes and todo items with nesting
- **blockquotes.md** - Simple and nested quotations
- **tables.md** - Tables with alignment, formatting, and complex data

#### Code
- **code-blocks.md** - Syntax highlighting for multiple languages (JS, Python, SQL, etc.)

#### Advanced Features
- **alerts.md** - GFM alerts (NOTE, TIP, IMPORTANT, WARNING, CAUTION) with colors
- **footnotes.md** - Inline and reference-style footnotes
- **definitions.md** - Definition lists and glossaries
- **abbreviations.md** - Acronym expansions

### Full Documents (`markdown/full/`)

Complete, real-world Markdown documents:

- **gfm-features.md** - Comprehensive showcase of all GitHub Flavored Markdown features
- **blog-post.md** - Technical blog post about React and TypeScript
- **api-documentation.md** - Complete REST API documentation with examples
- **tutorial.md** - Step-by-step tutorial for building a Todo app
- **readme-example.md** - Professional README with badges, examples, and documentation
- **changelog.md** - Project changelog following Keep a Changelog format

## Testing Examples

### HTML Rendering

```bash
# Render individual tag example
node bin/html.js examples/html/tags/blockquote.html

# Render full document
node bin/html.js examples/html/full/blog.html
```

### Markdown Rendering

```bash
# Render markdown features
markdown examples/markdown/features/alerts.md

# Render full markdown document
md examples/markdown/full/gfm-features.md
```

## Usage as Module

### HTML

```javascript
import cliHtml from 'cli-html';
import fs from 'fs';

const html = fs.readFileSync('examples/html/tags/table.html', 'utf8');
console.log(cliHtml(html));
```

### Markdown

```javascript
import { renderMarkdown } from 'cli-html';
import fs from 'fs';

const markdown = fs.readFileSync('examples/markdown/full/gfm-features.md', 'utf8');
console.log(renderMarkdown(markdown));
```

## Configuration

All examples support theme customization through `config.yaml`. See the main README for configuration options including:

- Colors and styles for all elements
- Markers and symbols (lists, headers, blockquote, etc.)
- Borders (figure, fieldset, details)
- Line width settings

To use custom theme:

```bash
# Create config in ~/.config/cli-html/config.yaml
node bin/html.js examples/html/full/documentation.html
```

## Example Use Cases

### For Documentation
**HTML:**
- `html/full/documentation.html` - Complete API documentation
- `html/tags/code.html` - Code snippets with syntax highlighting
- `html/tags/blockquote.html` - Quotes and citations

**Markdown:**
- `markdown/full/api-documentation.md` - REST API docs with examples
- `markdown/full/readme-example.md` - Professional project README
- `markdown/features/code-blocks.md` - Code examples in multiple languages
- `markdown/features/definitions.md` - Glossaries and terms

### For Tutorials and Guides
**HTML:**
- `html/full/tutorial.html` - Programming guides

**Markdown:**
- `markdown/full/tutorial.md` - Step-by-step React tutorial
- `markdown/full/blog-post.md` - Technical blog post
- `markdown/features/task-lists.md` - Progress tracking

### For Data Display
**HTML:**
- `html/full/dashboard.html` - Real-time monitoring
- `html/full/report.html` - Business reports
- `html/tags/table.html` - Structured data
- `html/tags/progress.html` - Metrics and progress

**Markdown:**
- `markdown/features/tables.md` - Various table formats
- `markdown/full/changelog.md` - Version history

### For User Interfaces
**HTML:**
- `html/tags/input.html` - Form controls
- `html/tags/lists.html` - Navigation menus
- `html/tags/fieldset.html` - Form organization

**Markdown:**
- `markdown/features/task-lists.md` - Checkboxes and todos
- `markdown/features/lists.md` - Hierarchical lists

### For Content Writing
**HTML:**
- `html/full/blog.html` - Blog articles

**Markdown:**
- `markdown/full/blog-post.md` - Blog post with code examples
- `markdown/features/emphasis.md` - Text formatting
- `markdown/features/blockquotes.md` - Quotations
- `markdown/features/links.md` - Various link styles
- `markdown/features/footnotes.md` - References and notes

## Notes

- Void tags (meta, link, script, etc.) are not rendered in CLI output
- Visual elements depend on terminal ANSI code support
- Custom themes can significantly change appearance
- All examples demonstrate semantic HTML best practices
- GitHub Flavored Markdown is fully supported
