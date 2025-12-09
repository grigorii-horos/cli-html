# Markdown Examples

Complete examples of Markdown rendering in the terminal with customization.

## 📁 Structure

```
markdown/
├── features/       # Individual markdown features (headers, lists, links, etc.)
├── full/           # Complete markdown document examples
├── screenshots/    # Generated terminal screenshots
└── README.md       # This file
```

## 🎯 Quick Navigation

### Basic Elements

#### Text Formatting
- **Headers** - # h1 through ###### h6
- **Emphasis** - *italic*, **bold**, ***bold italic***
- **Strikethrough** - ~~deleted text~~
- **Code** - `inline code`
- **Links** - [text](url)
- **Images** - ![alt](src)

#### Lists
- **Unordered Lists** - Bullet points with -, *, or +
- **Ordered Lists** - Numbered lists with 1., 2., etc.
- **Nested Lists** - Indented sublists
- **Task Lists** - - [ ] unchecked, - [x] checked

#### Structure
- **Blockquotes** - > quoted text
- **Horizontal Rules** - ---, ***, or ___
- **Paragraphs** - Text separated by blank lines

### Advanced Elements

#### Code Blocks
- **Fenced Code Blocks** - ``` with optional language
- **Indented Code Blocks** - 4 spaces or 1 tab indentation

#### Tables
- **Basic Tables** - Pipe-delimited with headers
- **Aligned Tables** - Left, center, right alignment
- **Complex Tables** - Multiple columns and rows

#### HTML in Markdown
- **Inline HTML** - HTML tags within markdown
- **data-cli-* Attributes** - Custom styling via HTML attributes

## 🎨 Customization

Markdown can be customized in two ways:

### 1. Theme Configuration

Configure default styles in `config.yaml`:

```yaml
theme:
  h1:
    color: red bold
    marker: "#"
  h2:
    color: blue bold
    marker: "##"
  list:
    marker: "•"
    markerColor: cyan
  code:
    color: yellowBright
```

### 2. Inline HTML with data-cli-* Attributes

Embed HTML tags with custom attributes:

```markdown
# Normal Markdown Header

<h1 data-cli-color="green bold underline">Customized Header</h1>

Normal list:
- Item 1
- Item 2

<ul data-cli-marker="→" data-cli-marker-color="red" data-cli-color="cyan">
  <li>Custom list item</li>
  <li>With colored markers</li>
</ul>
```

## 📖 Common Examples

### Headers

```markdown
# H1 Header
## H2 Header
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header
```

### Text Styles

```markdown
This is **bold text**

This is *italic text*

This is ***bold and italic***

This is ~~strikethrough~~

This is `inline code`
```

### Lists

```markdown
Unordered list:
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

Ordered list:
1. First item
2. Second item
   1. Nested item
   2. Another nested item
3. Third item

Task list:
- [x] Completed task
- [ ] Pending task
- [ ] Another pending task
```

### Links and Images

```markdown
[Link text](https://example.com)

[Link with title](https://example.com "Title")

![Image alt text](path/to/image.png)

![Image with title](path/to/image.png "Image title")
```

### Blockquotes

```markdown
> This is a blockquote
> It can span multiple lines

> Nested blockquote:
>> Level 2
>>> Level 3
```

### Code Blocks

```markdown
Fenced code block with language:

```javascript
function hello() {
  console.log("Hello, World!");
}
```

Fenced code block without language:

```
Plain text code block
```

Indented code block:

    function hello() {
      console.log("Hello, World!");
    }
```

### Tables

```markdown
Basic table:

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

Aligned table:

| Left | Center | Right |
|:-----|:------:|------:|
| L1   |   C1   |    R1 |
| L2   |   C2   |    R2 |
```

### Horizontal Rules

```markdown
Three or more hyphens:

---

Three or more asterisks:

***

Three or more underscores:

___
```

## 🎨 Mixing Markdown and HTML

You can mix markdown syntax with HTML for maximum customization:

```markdown
# Regular Markdown Header

<h2 data-cli-color="cyan bold">Customized HTML Header</h2>

Regular markdown list:
- Item 1
- Item 2

<ul data-cli-marker="▸" data-cli-marker-color="green">
  <li>Custom HTML list</li>
  <li>With green markers</li>
</ul>

Regular **bold** and *italic*

<p data-cli-color="red bold">Custom colored paragraph</p>

```javascript
// Regular code block
function test() {}
```

<pre data-cli-color="yellowBright" data-cli-numbers-enabled="true" data-cli-numbers-color="gray">
<code>// Code block with line numbers
function test() {
  return true;
}</code>
</pre>
```

## 🚀 Running Examples

```bash
# Render markdown file
node bin/markdown.js examples/markdown/basic/headers.md

# Render from stdin
echo "# Hello World" | node bin/markdown.js

# With custom theme
node bin/markdown.js examples/markdown/advanced/tables.md
```

## 📸 Screenshots

For visual examples of rendered markdown, see:

- [Features Screenshots](features/README.md#screenshots) - Individual markdown features
- [Full Examples Screenshots](full/README.md#screenshots) - Complete markdown documents

## 📖 See Also

- [HTML Examples](../html/README.md)
- [Customization Guide](../CUSTOMIZATION.md)
- [Library Usage](../library-usage/README.md)
- [Main Examples README](../README.md)
