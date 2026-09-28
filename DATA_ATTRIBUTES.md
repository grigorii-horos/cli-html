# Data Attributes Reference

This document lists all available `data-cli-*` attributes for customizing HTML element rendering in the terminal. Every attribute listed here is read by the renderer; anything not listed is ignored.

## Naming Convention

All data attributes follow a consistent naming pattern that maps directly to `config.yaml` structure. Internally, `getAttr(tag, 'a.b.c')` reads `data-cli-a-b-c` (dots become dashes).

### Basic Mapping Rules

1. **Simple values**: `config.yaml: tag.property` → `data-cli-property=<value>`
   ```yaml
   # config.yaml
   h1:
     color: red bold
   ```
   ```html
   <!-- HTML -->
   <h1 data-cli-color="blue">Text</h1>
   ```

2. **Nested objects**: `config.yaml: tag.object.property` → `data-cli-object-property=<value>`
   ```yaml
   # config.yaml
   samp:
     prefix:
       marker: '$ '
       color: green
   ```
   ```html
   <!-- HTML -->
   <samp data-cli-prefix-marker=">" data-cli-prefix-color="cyan">output</samp>
   ```

3. **Arrays/Indicators**: `config.yaml: tag.indicators[].property` → `data-cli-indicator-property=<value>`
   ```yaml
   # config.yaml
   ul:
     indicators:
       disc:
         marker: '•'
         color: red
   ```
   ```html
   <!-- HTML -->
   <ul data-cli-indicator-marker="→" data-cli-indicator-color="blue">...</ul>
   ```
   `<ol>` accepts `data-cli-indicator-color` and `data-cli-decimal`; its marker is always the item number.

4. **Tag-specific prefixes**: When the element type is part of the attribute name
   ```yaml
   # config.yaml
   input:
     checkbox:
       prefix:
         marker: '['
         color: gray
   ```
   ```html
   <!-- HTML -->
   <input type="checkbox" data-cli-checkbox-prefix-marker="(" data-cli-checkbox-prefix-color="blue">
   ```

### Mapping Examples

| config.yaml path | data attribute | Example |
|-----------------|----------------|---------|
| `button.color` | `data-cli-color` | `data-cli-color="white bold"` |
| `button.prefix.marker` | `data-cli-prefix-marker` | `data-cli-prefix-marker="[ "` |
| `button.prefix.color` | `data-cli-prefix-color` | `data-cli-prefix-color="gray"` |
| `code.block.numbers.enabled` | `data-cli-block-numbers-enabled` | `data-cli-block-numbers-enabled="true"` |
| `code.block.numbers.color` | `data-cli-block-numbers-color` | `data-cli-block-numbers-color="gray dim"` |
| `code.block.label.prefix.marker` | `data-cli-block-label-prefix-marker` | `data-cli-block-label-prefix-marker="["` |
| `code.block.gutter.marker` | `data-cli-block-gutter-marker` | `data-cli-block-gutter-marker=" │ "` |
| `input.checkbox.checked.marker` | `data-cli-checkbox-checked-marker` | `data-cli-checkbox-checked-marker="✓"` |
| `input.checkbox.prefix.color` | `data-cli-checkbox-prefix-color` | `data-cli-checkbox-prefix-color="blue"` |
| `a.external.enabled` | `data-cli-external-enabled` | `data-cli-external-enabled="true"` |
| `a.external.marker` | `data-cli-external-marker` | `data-cli-external-marker="↗"` |
| `a.external.color` | `data-cli-external-color` | `data-cli-external-color="gray"` |
| `ul.indicators[].color` | `data-cli-indicator-color` | `data-cli-indicator-color="red"` |
| `table.responsive.enabled` | `data-cli-responsive-enabled` | `data-cli-responsive-enabled="false"` |

### Important Rules

- **No redundant prefixes**: Don't repeat the tag name in the attribute
  - ✅ Correct: `data-cli-prefix-marker` (on `<button>` element)
  - ❌ Wrong: `data-cli-button-prefix-marker` (redundant "button-" prefix)
  - The same applies to `<textarea>`, `<li>` and `<option>`: use plain `data-cli-color`, not `data-cli-textarea-color` / `data-cli-li-color` / `data-cli-option-color`.

- **Arrays become singular**: `indicators[]` becomes `indicator`
  - `ul.indicators[].marker` → `data-cli-indicator-marker`
  - `ol.indicators[].color` → `data-cli-indicator-color`

- **Keep all nested levels**: Include all intermediate object names for clarity
  - `code.block.numbers.color` → `data-cli-block-numbers-color` (keep "block")
  - `code.block.label.prefix.marker` → `data-cli-block-label-prefix-marker` (keep "block" and "label")

- **Boolean values**: Use `"true"` or `"false"`. Most switches treat anything other than `"true"` as off. (`data-cli-block-numbers-enabled`, `-gutter-enabled` and `-label-enabled` also accept `"1"`; `data-cli-responsive-enabled` treats anything other than `"false"` as on.)
  - `data-cli-block-numbers-enabled="true"`
  - `data-cli-href-enabled="false"`

- **Known exceptions**: a few older attributes use flat names that do not follow the `config.yaml` path exactly. They are documented in their sections: `<details>` (`data-cli-open-marker`, not `-indicator-open-marker`), `<input type="range">` (`data-cli-range-filled`, `data-cli-range-filled-color`), `<input type="color">` (`data-cli-color-indicator`), `<figcaption>` (`data-cli-prefix` / `data-cli-suffix`), and the table layout attributes (`data-cli-show-row-numbers`, `data-cli-col-colors`, ...).

### Visual Mapping Guide

```
config.yaml Structure                  →    data-cli-* Attribute
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

tag.property                           →    data-cli-property
  └─ button.color                      →    data-cli-color

tag.object.property                    →    data-cli-object-property
  ├─ button.prefix.marker              →    data-cli-prefix-marker
  ├─ button.prefix.color               →    data-cli-prefix-color
  └─ a.external.enabled                →    data-cli-external-enabled

tag.feature.nested.property            →    data-cli-feature-nested-property
  ├─ code.block.numbers.enabled        →    data-cli-block-numbers-enabled
  ├─ code.block.numbers.color          →    data-cli-block-numbers-color
  ├─ code.block.label.prefix.marker    →    data-cli-block-label-prefix-marker
  └─ code.block.gutter.marker          →    data-cli-block-gutter-marker
         └─ (keep ALL levels: 'block', 'numbers', 'label', etc.)

tag.indicators[].property              →    data-cli-indicator-property
  ├─ ul.indicators[].marker            →    data-cli-indicator-marker
  └─ ul.indicators[].color             →    data-cli-indicator-color
         └─ (plural → singular)

tag.type.object.property               →    data-cli-type-object-property
  ├─ input.checkbox.checked.marker     →    data-cli-checkbox-checked-marker
  └─ input.checkbox.prefix.color       →    data-cli-checkbox-prefix-color
         └─ (keep 'checkbox' for input types)
```

## Table of Contents

- [Common Attributes](#common-attributes)
- [Headings (`<h1>`–`<h6>`)](#headings-h1h6)
- [Text Elements](#text-elements)
- [Block Elements](#block-elements)
- [Links (`<a>`)](#links-a)
- [Images and Media (`<img>`, `<audio>`, `<video>`)](#images-and-media-img-audio-video)
- [Lists (`<ul>`, `<ol>`, `<li>`)](#lists-ul-ol-li)
- [Definition Lists (`<dl>`, `<dt>`, `<dd>`)](#definition-lists-dl-dt-dd)
- [Code Blocks (`<code>`, `<pre>`)](#code-blocks-code-pre)
- [Input Elements](#input-elements)
- [Button Element (`<button>`)](#button-element-button)
- [Select Elements (`<select>`, `<option>`, `<optgroup>`)](#select-elements-select-option-optgroup)
- [Table Elements](#table-elements)
- [Container Elements](#container-elements)
- [Definition Elements (`<abbr>`, `<dfn>`)](#definition-elements-abbr-dfn)
- [Interactive Elements (`<details>`, `<summary>`)](#interactive-elements-details-summary)
- [Progress Elements (`<progress>`, `<meter>`)](#progress-elements-progress-meter)

---

## Common Attributes

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Text color (chalk-string format). Read by almost every element; the exceptions are noted in their sections (`<pre>`, `<progress>`, `<meter>`, `<img>`, `<audio>`, `<video>`, most `<input>` types) | `data-cli-color="red bold"` |
| `data-cli-disabled-color` | string | Color when the element has the `disabled` attribute. Read by `<input>` (all types), `<textarea>`, `<button>`, `<select>`, `<option>`, `<optgroup>`, `<fieldset>` | `data-cli-disabled-color="gray dim"` |

Setting any attribute to the string `"null"` is the same as omitting it (the theme value is used).

---

## Headings (`<h1>`–`<h6>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Heading text color | `data-cli-color="magenta bold"` |
| `data-cli-indicator-marker` | string | Marker before the heading (default `#`, `##`, ...) | `data-cli-indicator-marker="▶"` |
| `data-cli-indicator-color` | string | Marker color | `data-cli-indicator-color="gray"` |

---

## Text Elements

### Color-only inline elements

`<b>`, `<strong>`, `<i>`, `<em>`, `<u>`, `<s>`, `<strike>`, `<cite>`, `<mark>`, `<var>`, `<small>`, `<big>`, `<tt>`, `<nobr>`, `<wbr>`, `<font>`, `<bdi>`, `<bdo>`, `<label>`, `<span>`, `<ruby>`:

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Text color | `data-cli-color="yellow"` |

### Kbd (`<kbd>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Key text color | `data-cli-color="cyan"` |
| `data-cli-prefix-marker` / `data-cli-prefix-color` | string | Text before each key (`kbd.prefix`) | `data-cli-prefix-marker="〈 "` |
| `data-cli-suffix-marker` / `data-cli-suffix-color` | string | Text after each key (`kbd.suffix`) | `data-cli-suffix-marker=" 〉"` |
| `data-cli-key-enabled` | boolean | Key-by-key styling (`kbd.key.enabled`) | `data-cli-key-enabled="true"` |
| `data-cli-key-style` | `simple` \| `box` | `box` wraps each key: `[Ctrl] + [S]`. Setting it also enables key styling | `data-cli-key-style="box"` |
| `data-cli-key-separator` | string | Separator that splits the keys (`kbd.key.separator`) | `data-cli-key-separator="-"` |

### Del / Ins (`<del>`, `<ins>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Text color | `data-cli-color="red"` |
| `data-cli-diff-enabled` | boolean | Show the diff marker (`del.diff.enabled` / `ins.diff.enabled`) | `data-cli-diff-enabled="true"` |
| `data-cli-diff-style` | `simple` \| `git` | `git` shows the marker before the text. Setting it also enables the diff marker | `data-cli-diff-style="git"` |
| `data-cli-diff-marker` / `data-cli-diff-color` | string | Marker text and color | `data-cli-diff-marker="✗"` |

### Samp, Sub, Sup, Rt

For `<samp>`, `<sub>`, `<sup>` and `<rt>`:

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Text color | `data-cli-color="green"` |
| `data-cli-prefix-marker` | string | Prefix marker text | `data-cli-prefix-marker="$ "` |
| `data-cli-prefix-color` | string | Prefix color | `data-cli-prefix-color="green"` |
| `data-cli-suffix-marker` | string | Suffix marker text | `data-cli-suffix-marker=" >"` |
| `data-cli-suffix-color` | string | Suffix color | `data-cli-suffix-color="gray"` |

### Quote (`<q>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Quoted text color | `data-cli-color="cyan"` |
| `data-cli-prefix-marker` | string | Opening quote character | `data-cli-prefix-marker="«"` |
| `data-cli-prefix-color` | string | Opening quote color | `data-cli-prefix-color="gray"` |
| `data-cli-suffix-marker` | string | Closing quote character | `data-cli-suffix-marker="»"` |
| `data-cli-suffix-color` | string | Closing quote color | `data-cli-suffix-color="gray"` |
| `data-cli-cite-enabled` | boolean | Style text as a link when the `cite` attribute is present (uses `a.external` marker/position/spacing from the theme) | `data-cli-cite-enabled="true"` |
| `data-cli-cite-color` | string | Link color when cite is enabled | `data-cli-cite-color="magenta"` |

### Time (`<time>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Text color | `data-cli-color="cyan"` |
| `data-cli-datetime-enabled` | boolean | Show the `datetime` attribute after the text | `data-cli-datetime-enabled="true"` |
| `data-cli-datetime-color` | string | Datetime value color | `data-cli-datetime-color="gray"` |
| `data-cli-datetime-prefix-marker` | string | Text before the datetime | `data-cli-datetime-prefix-marker=" ("` |
| `data-cli-datetime-prefix-color` | string | Prefix color | `data-cli-datetime-prefix-color="gray"` |
| `data-cli-datetime-suffix-marker` | string | Text after the datetime | `data-cli-datetime-suffix-marker=")"` |
| `data-cli-datetime-suffix-color` | string | Suffix color | `data-cli-datetime-suffix-color="gray"` |

### Data (`<data>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Text color | `data-cli-color="white"` |
| `data-cli-value-enabled` | boolean | Show the `value` attribute after the text | `data-cli-value-enabled="true"` |
| `data-cli-value-color` | string | Value color | `data-cli-value-color="cyan"` |
| `data-cli-value-prefix-marker` | string | Text before the value | `data-cli-value-prefix-marker=" ["` |
| `data-cli-value-prefix-color` | string | Prefix color | `data-cli-value-prefix-color="gray"` |
| `data-cli-value-suffix-marker` | string | Text after the value | `data-cli-value-suffix-marker="]"` |
| `data-cli-value-suffix-color` | string | Suffix color | `data-cli-value-suffix-color="gray"` |

### Blink (`<blink>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Text color | `data-cli-color="yellow"` |
| `data-cli-animation-enabled` | boolean | Show the animation indicator | `data-cli-animation-enabled="true"` |
| `data-cli-animation-marker` | string | Indicator marker | `data-cli-animation-marker="*"` |
| `data-cli-animation-color` | string | Indicator color | `data-cli-animation-color="red"` |
| `data-cli-animation-position` | string | `before`, `after` or `both` | `data-cli-animation-position="before"` |

### Marquee (`<marquee>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Text color | `data-cli-color="cyan"` |
| `data-cli-direction-enabled` | boolean | Show the scroll direction indicator | `data-cli-direction-enabled="false"` |
| `data-cli-direction-marker` | string | Indicator marker (overrides the per-direction marker) | `data-cli-direction-marker="<<"` |
| `data-cli-direction-color` | string | Indicator color | `data-cli-direction-color="gray"` |
| `data-cli-direction-position` | string | `before` or `after` | `data-cli-direction-position="after"` |

---

## Block Elements

### Color-only block elements

`<p>`, `<div>`, `<header>`, `<footer>`, `<article>`, `<section>`, `<main>`, `<nav>`, `<aside>`, `<form>`, `<picture>`, `<hgroup>`, `<address>`, `<center>`:

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Text color | `data-cli-color="gray"` |

### Blockquote (`<blockquote>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Content color | `data-cli-color="italic"` |
| `data-cli-indicator-marker` | string | Marker at the start of each line (overrides the per-depth marker) | `data-cli-indicator-marker="┃ "` |
| `data-cli-indicator-color` | string | Marker color | `data-cli-indicator-color="blue"` |

### Horizontal Rule (`<hr>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Line color | `data-cli-color="blue"` |
| `data-cli-style` | string | Preset: `single`, `double`, `bold`, `dashed`, `dotted` | `data-cli-style="double"` |
| `data-cli-marker` | string | Explicit line character (overrides `data-cli-style`) | `data-cli-marker="~"` |

---

## Links (`<a>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Link text color | `data-cli-color="blue underline"` |
| `data-cli-href-enabled` | string | Show URL after link text: `true`, `false` or `auto` (only when the terminal has no hyperlink support) | `data-cli-href-enabled="true"` |
| `data-cli-href-color` | string | URL color | `data-cli-href-color="gray"` |
| `data-cli-title-enabled` | boolean | Show the `title` attribute | `data-cli-title-enabled="true"` |
| `data-cli-title-color` | string | Title text color | `data-cli-title-color="yellow"` |
| `data-cli-title-prefix-marker` | string | Text before the title | `data-cli-title-prefix-marker=" ("` |
| `data-cli-title-prefix-color` | string | Title prefix color (defaults to title color) | `data-cli-title-prefix-color="gray"` |
| `data-cli-title-suffix-marker` | string | Text after the title | `data-cli-title-suffix-marker=")"` |
| `data-cli-title-suffix-color` | string | Title suffix color (defaults to title color) | `data-cli-title-suffix-color="gray"` |
| `data-cli-external-enabled` | boolean | Show external link indicator (only for `http://` / `https://` links) | `data-cli-external-enabled="true"` |
| `data-cli-external-marker` | string | External indicator symbol | `data-cli-external-marker="↗"` |
| `data-cli-external-color` | string | Indicator color | `data-cli-external-color="gray"` |
| `data-cli-external-position` | string | Position: `before` or `after` | `data-cli-external-position="after"` |
| `data-cli-external-spacing` | string | Space between link and indicator | `data-cli-external-spacing=" "` |

---

## Images and Media (`<img>`, `<audio>`, `<video>`)

### Images (`<img>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-indicator-marker` | string | Indicator marker (like `!`) | `data-cli-indicator-marker="!"` |
| `data-cli-indicator-color` | string | Indicator color | `data-cli-indicator-color="cyan"` |
| `data-cli-prefix-marker` | string | Opening bracket marker | `data-cli-prefix-marker="["` |
| `data-cli-prefix-color` | string | Opening bracket color | `data-cli-prefix-color="gray"` |
| `data-cli-suffix-marker` | string | Closing bracket marker | `data-cli-suffix-marker="]"` |
| `data-cli-suffix-color` | string | Closing bracket color | `data-cli-suffix-color="gray"` |
| `data-cli-alt-color` | string | Alt text color | `data-cli-alt-color="cyan"` |

### Audio and Video (`<audio>`, `<video>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-indicator-marker` | string | Indicator marker (`♪` / `▶` by default) | `data-cli-indicator-marker="♫"` |
| `data-cli-indicator-color` | string | Indicator color | `data-cli-indicator-color="cyan"` |
| `data-cli-prefix-marker` | string | Opening bracket marker | `data-cli-prefix-marker="["` |
| `data-cli-prefix-color` | string | Opening bracket color | `data-cli-prefix-color="gray"` |
| `data-cli-suffix-marker` | string | Closing bracket marker | `data-cli-suffix-marker="]"` |
| `data-cli-suffix-color` | string | Closing bracket color | `data-cli-suffix-color="gray"` |
| `data-cli-title-color` | string | Title (or file name) color | `data-cli-title-color="white"` |

---

## Lists (`<ul>`, `<ol>`, `<li>`)

### List Items (`<li>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | List item text color | `data-cli-color="white"` |

### Unordered Lists (`<ul>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Text color of all items | `data-cli-color="gray"` |
| `data-cli-indicator-marker` | string | Bullet symbol | `data-cli-indicator-marker="→"` |
| `data-cli-indicator-color` | string | Bullet color | `data-cli-indicator-color="red"` |

### Ordered Lists (`<ol>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Text color of all items | `data-cli-color="gray"` |
| `data-cli-indicator-color` | string | Number color | `data-cli-indicator-color="red"` |
| `data-cli-decimal` | string | Text after the number | `data-cli-decimal=")"` |

---

## Definition Lists (`<dl>`, `<dt>`, `<dd>`)

| Element | Attribute | Type | Description | Example |
|---------|-----------|------|-------------|---------|
| `<dl>`, `<dd>` | `data-cli-color` | string | Text color | `data-cli-color="cyan"` |
| `<dt>` | `data-cli-color` | string | Term color | `data-cli-color="blue bold"` |
| `<dt>` | `data-cli-suffix-marker` | string | Text after the term | `data-cli-suffix-marker=":"` |
| `<dt>` | `data-cli-suffix-color` | string | Suffix color | `data-cli-suffix-color="gray"` |

---

## Code Blocks (`<code>`, `<pre>`)

All code attributes go on the **`<code>`** element (`<pre>` has no data attributes). Block features (`data-cli-block-*`) apply to `<pre><code>` only. The short name without `block-` is still accepted as an alias.

Gutter, highlighted lines, overflow indicator, diff and language label are drawn only when line numbers are shown (`code.block.numbers.enabled`, on by default).

| Attribute | Alias | Type | Description | Example |
|-----------|-------|------|-------------|---------|
| `data-cli-color` | | string | Code color (inline code, or block code without syntax highlighting) | `data-cli-color="green"` |
| `data-cli-block-numbers-enabled` | `data-cli-numbers-enabled` | boolean | Show line numbers | `data-cli-block-numbers-enabled="true"` |
| `data-cli-block-numbers-color` | `data-cli-numbers-color` | string | Line numbers color | `data-cli-block-numbers-color="gray dim"` |
| `data-cli-block-gutter-enabled` | `data-cli-gutter-enabled` | boolean | Show gutter separator | `data-cli-block-gutter-enabled="true"` |
| `data-cli-block-gutter-marker` | `data-cli-gutter-marker` | string | Gutter separator character | `data-cli-block-gutter-marker=" │ "` |
| `data-cli-block-gutter-color` | `data-cli-gutter-color` | string | Gutter separator color | `data-cli-block-gutter-color="gray"` |
| `data-cli-block-label-enabled` | `data-cli-label-enabled` | boolean | Show language label (needs a `language-*` / `lang-*` class) | `data-cli-block-label-enabled="true"` |
| `data-cli-block-label-position` | `data-cli-label-position` | string | Label position: `top` or `bottom` | `data-cli-block-label-position="bottom"` |
| `data-cli-block-label-color` | `data-cli-label-color` | string | Language label color | `data-cli-block-label-color="cyan"` |
| `data-cli-block-label-prefix-marker` | `data-cli-label-prefix-marker` | string | Label prefix marker | `data-cli-block-label-prefix-marker="["` |
| `data-cli-block-label-prefix-color` | `data-cli-label-prefix-color` | string | Label prefix color | `data-cli-block-label-prefix-color="gray"` |
| `data-cli-block-label-suffix-marker` | `data-cli-label-suffix-marker` | string | Label suffix marker | `data-cli-block-label-suffix-marker="]"` |
| `data-cli-block-label-suffix-color` | `data-cli-label-suffix-color` | string | Label suffix color | `data-cli-block-label-suffix-color="gray"` |
| `data-cli-block-overflow-indicator-enabled` | `data-cli-overflow-enabled` | boolean | Mark wrapped continuation lines | `data-cli-block-overflow-indicator-enabled="true"` |
| `data-cli-block-overflow-indicator-marker` | `data-cli-overflow-marker` | string | Overflow indicator symbol | `data-cli-block-overflow-indicator-marker="↳"` |
| `data-cli-block-overflow-indicator-color` | `data-cli-overflow-color` | string | Overflow indicator color | `data-cli-block-overflow-indicator-color="gray"` |
| `data-cli-block-diff-enabled` | `data-cli-diff-enabled` | boolean | Git-style diff highlighting (on automatically for `language-diff`) | `data-cli-block-diff-enabled="true"` |
| `data-cli-highlight-lines` | | string | Lines to highlight (comma-separated, ranges allowed) | `data-cli-highlight-lines="1,3,5-7"` |
| `data-cli-highlight-color` | | string | Highlight color (`code.highlight.color`) | `data-cli-highlight-color="bgYellow black"` |

---

## Input Elements

### Common to inputs

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-disabled-color` | string | Color when `disabled` (all input types and `<textarea>`) | `data-cli-disabled-color="gray dim"` |
| `data-cli-required-enabled` | boolean | Show the required indicator when `required` is set | `data-cli-required-enabled="false"` |
| `data-cli-required-marker` | string | Required indicator marker | `data-cli-required-marker="(required)"` |
| `data-cli-required-color` | string | Required indicator color | `data-cli-required-color="red bold"` |
| `data-cli-required-position` | string | `before` or `after` the input | `data-cli-required-position="before"` |

The required indicator is shown for text-like inputs, `checkbox`, `radio`, `email` and `date`.

### Checkbox (`<input type="checkbox">`)

| Attribute | Alias | Type | Description | Example |
|-----------|-------|------|-------------|---------|
| `data-cli-checkbox-checked-marker` | `data-cli-checked-marker` | string | Checked state marker | `data-cli-checkbox-checked-marker="✓"` |
| `data-cli-checkbox-checked-color` | `data-cli-checked-color` | string | Checked state color | `data-cli-checkbox-checked-color="green bold"` |
| `data-cli-checkbox-unchecked-marker` | `data-cli-unchecked-marker` | string | Unchecked state marker | `data-cli-checkbox-unchecked-marker=" "` |
| `data-cli-checkbox-unchecked-color` | `data-cli-unchecked-color` | string | Unchecked state color | `data-cli-checkbox-unchecked-color="gray"` |
| `data-cli-checkbox-prefix-marker` | | string | Opening bracket | `data-cli-checkbox-prefix-marker="["` |
| `data-cli-checkbox-prefix-color` | | string | Opening bracket color | `data-cli-checkbox-prefix-color="gray"` |
| `data-cli-checkbox-suffix-marker` | | string | Closing bracket | `data-cli-checkbox-suffix-marker="]"` |
| `data-cli-checkbox-suffix-color` | | string | Closing bracket color | `data-cli-checkbox-suffix-color="gray"` |

### Radio (`<input type="radio">`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-radio-checked-marker` | string | Checked state marker | `data-cli-radio-checked-marker="•"` |
| `data-cli-radio-checked-color` | string | Checked state color | `data-cli-radio-checked-color="red bold"` |
| `data-cli-radio-unchecked-marker` | string | Unchecked state marker | `data-cli-radio-unchecked-marker=" "` |
| `data-cli-radio-unchecked-color` | string | Unchecked state color | `data-cli-radio-unchecked-color="gray"` |
| `data-cli-radio-prefix-marker` | string | Opening parenthesis | `data-cli-radio-prefix-marker="("` |
| `data-cli-radio-prefix-color` | string | Opening parenthesis color | `data-cli-radio-prefix-color="gray"` |
| `data-cli-radio-suffix-marker` | string | Closing parenthesis | `data-cli-radio-suffix-marker=")"` |
| `data-cli-radio-suffix-color` | string | Closing parenthesis color | `data-cli-radio-suffix-color="gray"` |

### Button (`<input type="button">`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-button-color` | string | Button text color | `data-cli-button-color="white bold"` |
| `data-cli-button-prefix-marker` | string | Opening marker | `data-cli-button-prefix-marker="[ "` |
| `data-cli-button-prefix-color` | string | Opening marker color | `data-cli-button-prefix-color="gray"` |
| `data-cli-button-suffix-marker` | string | Closing marker | `data-cli-button-suffix-marker=" ]"` |
| `data-cli-button-suffix-color` | string | Closing marker color | `data-cli-button-suffix-color="gray"` |

### Text Input (`<input type="text">`, `search`, `url`, `tel`, `number`, ...)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-text-input-color` | string | Value color | `data-cli-text-input-color="cyan"` |
| `data-cli-show-placeholder` | boolean | Show the `placeholder` when there is no value | `data-cli-show-placeholder="true"` |
| `data-cli-placeholder-color` | string | Placeholder color (no theme setting) | `data-cli-placeholder-color="gray italic"` |

### Textarea (`<textarea>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Textarea text color | `data-cli-color="cyan"` |

### Range (`<input type="range">`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-range-filled` | string | Filled portion marker | `data-cli-range-filled="█"` |
| `data-cli-range-filled-color` | string | Filled portion color | `data-cli-range-filled-color="magenta"` |
| `data-cli-range-empty` | string | Empty portion marker | `data-cli-range-empty="░"` |
| `data-cli-range-empty-color` | string | Empty portion color | `data-cli-range-empty-color="gray"` |
| `data-cli-range-thumb` | string | Thumb marker | `data-cli-range-thumb="●"` |
| `data-cli-range-thumb-color` | string | Thumb color | `data-cli-range-thumb-color="magenta bold"` |

### Color (`<input type="color">`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color-prefix-marker` | string | Opening bracket | `data-cli-color-prefix-marker="("` |
| `data-cli-color-prefix-color` | string | Opening bracket color | `data-cli-color-prefix-color="gray"` |
| `data-cli-color-suffix-marker` | string | Closing bracket | `data-cli-color-suffix-marker=")"` |
| `data-cli-color-suffix-color` | string | Closing bracket color | `data-cli-color-suffix-color="gray"` |
| `data-cli-color-value-color` | string | Hex value color | `data-cli-color-value-color="white"` |
| `data-cli-hex-enabled` | boolean | Show hex value (default `true`) | `data-cli-hex-enabled="false"` |
| `data-cli-color-indicator` | string | Fallback swatch marker. Currently has no visible effect: the swatch is always drawn as two spaces in the input's color | `data-cli-color-indicator="■"` |

### Password (`<input type="password">`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-password-char` | string | Masking character | `data-cli-password-char="*"` |
| `data-cli-password-count` | number | Number of mask characters (independent of the value) | `data-cli-password-count="6"` |
| `data-cli-password-color` | string | Password mask color | `data-cli-password-color="gray"` |

### Email (`<input type="email">`)

Shows the `value`, or the `placeholder` when empty.

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-email-prefix-marker` | string | Email prefix marker | `data-cli-email-prefix-marker="@ "` |
| `data-cli-email-prefix-color` | string | Prefix color | `data-cli-email-prefix-color="cyan"` |
| `data-cli-email-color` | string | Email text color | `data-cli-email-color="cyan"` |

### Date (`<input type="date">`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-date-prefix-marker` | string | Date prefix marker | `data-cli-date-prefix-marker="# "` |
| `data-cli-date-prefix-color` | string | Prefix color | `data-cli-date-prefix-color="blue"` |
| `data-cli-date-color` | string | Date value color | `data-cli-date-color="blue"` |

### File (`<input type="file">`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-file-color` | string | Filename color | `data-cli-file-color="cyan"` |
| `data-cli-file-prefix-marker` | string | File prefix marker | `data-cli-file-prefix-marker="@"` |
| `data-cli-file-prefix-color` | string | Prefix color | `data-cli-file-prefix-color="gray"` |
| `data-cli-file-placeholder` | string | Text shown when there is no value | `data-cli-file-placeholder="No file chosen"` |

`<input type="hidden">` renders nothing and `<output>` has no data attributes.

---

## Button Element (`<button>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Button text color | `data-cli-color="white bold"` |
| `data-cli-prefix-marker` | string | Opening marker | `data-cli-prefix-marker="[ "` |
| `data-cli-prefix-color` | string | Opening marker color | `data-cli-prefix-color="gray"` |
| `data-cli-suffix-marker` | string | Closing marker | `data-cli-suffix-marker=" ]"` |
| `data-cli-suffix-color` | string | Closing marker color | `data-cli-suffix-color="gray"` |
| `data-cli-disabled-color` | string | Color when button is disabled | `data-cli-disabled-color="gray dim"` |

**Note**: The `<button>` tag is separate from `<input type="button">` and uses `data-cli-prefix-*` instead of `data-cli-button-prefix-*`.

---

## Select Elements (`<select>`, `<option>`, `<optgroup>`)

### Select (`<select>`)

The label line is shown only when the select has a `name` attribute.

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-label` | string | Label text (replaces the `name`) | `data-cli-label="Choose"` |
| `data-cli-color` | string | Label color | `data-cli-color="cyan bold"` |
| `data-cli-prefix-marker` | string | Text before the label | `data-cli-prefix-marker="» "` |
| `data-cli-prefix-color` | string | Prefix color | `data-cli-prefix-color="cyan"` |
| `data-cli-suffix-marker` | string | Text after the label | `data-cli-suffix-marker=":"` |
| `data-cli-suffix-color` | string | Suffix color | `data-cli-suffix-color="cyan"` |
| `data-cli-disabled-color` | string | Label color when the select is disabled | `data-cli-disabled-color="gray dim"` |

### Option (`<option>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Option text color | `data-cli-color="white"` |
| `data-cli-selected-marker` | string | Selected state marker | `data-cli-selected-marker="◉"` |
| `data-cli-selected-color` | string | Selected marker color | `data-cli-selected-color="green bold"` |
| `data-cli-unselected-marker` | string | Unselected state marker | `data-cli-unselected-marker="○"` |
| `data-cli-unselected-color` | string | Unselected marker color | `data-cli-unselected-color="gray"` |
| `data-cli-disabled-color` | string | Text color when the option (or its select/optgroup) is disabled | `data-cli-disabled-color="gray dim"` |

### Optgroup (`<optgroup>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-indicator-marker` | string | Group marker | `data-cli-indicator-marker="▸ "` |
| `data-cli-indicator-color` | string | Marker color | `data-cli-indicator-color="cyan bold"` |
| `data-cli-label-color` | string | Group label color | `data-cli-label-color="yellow"` |
| `data-cli-disabled-color` | string | Label and marker color when disabled | `data-cli-disabled-color="gray dim"` |

---

## Table Elements

### Table (`<table>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Default table color (inherited by rows and cells) | `data-cli-color="white"` |
| `data-cli-border-style` | string | `single` (default), `double`, `round` (alias `rounded`), `bold`, `classic` (alias `ascii`) | `data-cli-border-style="double"` |
| `data-cli-border-color` | string | Border color | `data-cli-border-color="blue"` |
| `data-cli-responsive-enabled` | boolean | Enable responsive list view on narrow terminals | `data-cli-responsive-enabled="false"` |
| `data-cli-responsive-threshold` | number | Line width below which the list view is used | `data-cli-responsive-threshold="80"` |
| `data-cli-responsive-separator` | string | Separator between header and value in list view | `data-cli-responsive-separator=" = "` |
| `data-cli-responsive-item-separator` | string | Separator between rows in list view | `data-cli-responsive-item-separator="---"` |

In ASCII mode the border is always `classic`.

#### Striping

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-striping-enabled` | boolean | Enable zebra striping (body rows only) | `data-cli-striping-enabled="true"` |
| `data-cli-striping-count` | number | Number of colors to cycle through (2-5) | `data-cli-striping-count="3"` |
| `data-cli-striping-row-1-color` | string | First stripe color | `data-cli-striping-row-1-color="white bgBlue"` |
| `data-cli-striping-row-2-color` | string | Second stripe color | `data-cli-striping-row-2-color="white bgCyan"` |
| `data-cli-striping-row-3-color` | string | Third stripe color (used if count >= 3) | `data-cli-striping-row-3-color="white bgGreen"` |
| `data-cli-striping-row-4-color` | string | Fourth stripe color (used if count >= 4) | `data-cli-striping-row-4-color="white bgMagenta"` |
| `data-cli-striping-row-5-color` | string | Fifth stripe color (used if count = 5) | `data-cli-striping-row-5-color="white bgYellow"` |

Stripe numbers are 1-based. Stripes you do not set keep the theme's `table.striping.rows` colors.

#### Rows and columns

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-show-row-numbers` | boolean | Add a row-number column (`#` in the header) | `data-cli-show-row-numbers="true"` |
| `data-cli-row-number-start` | number | First row number (default `1`) | `data-cli-row-number-start="0"` |
| `data-cli-row-number-color` | string | Row number color (default `gray`) | `data-cli-row-number-color="yellow"` |
| `data-cli-row-number-separator` | string | Text after the row number (default `│`) | `data-cli-row-number-separator=":"` |
| `data-cli-highlight-rows` | string | Body rows to highlight, 1-based, ranges allowed | `data-cli-highlight-rows="1,3-4"` |
| `data-cli-highlight-color` | string | Highlight color (required for `highlight-rows`) | `data-cli-highlight-color="bgYellow black"` |
| `data-cli-alternate-rows` | boolean | Legacy two-color alternation (ignored when striping is enabled) | `data-cli-alternate-rows="true"` |
| `data-cli-alternate-colors` | string | Two comma-separated colors for alternation (default `white,gray`) | `data-cli-alternate-colors="white,cyan"` |
| `data-cli-col-colors` | string | Comma-separated color per column | `data-cli-col-colors="green,,yellow"` |
| `data-cli-col-align` | string | Comma-separated alignment per column: `left`, `center`, `right` | `data-cli-col-align="left,right"` |

Highlighted rows are not striped or alternated.

### Table Sections (`<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<td>`, `<th>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Element color (inherits from parent if not set) | `data-cli-color="white"` |

**Color Inheritance**:
- `<td>` / `<th>`: custom cell → custom `<tr>` → custom section (`<thead>`/`<tbody>`/`<tfoot>`) → custom `<table>` → theme `td`/`th` → theme `tr` → theme section → theme `table`
- `<caption>`: custom caption → theme `caption`

Tables have no padding attributes.

---

## Container Elements

For `<figure>`, `<dialog>`, `<details>` and `<fieldset>`:

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Content color | `data-cli-color="white"` |
| `data-cli-border-color` | string | Border color (legacy alias: `data-cli-border`) | `data-cli-border-color="cyan"` |
| `data-cli-border-style` | string | Border style: `round`, `single`, `double`, `bold`, `classic` | `data-cli-border-style="round"` |
| `data-cli-border-dim` | boolean | Dim border (less bright) | `data-cli-border-dim="true"` |
| `data-cli-padding-left` | number | Left padding spaces | `data-cli-padding-left="2"` |
| `data-cli-padding-right` | number | Right padding spaces | `data-cli-padding-right="2"` |
| `data-cli-padding-top` | number | Top padding lines | `data-cli-padding-top="1"` |
| `data-cli-padding-bottom` | number | Bottom padding lines | `data-cli-padding-bottom="1"` |

### Figcaption (`<figcaption>` inside `<figure>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Caption color | `data-cli-color="bgBlue white"` |
| `data-cli-prefix` | string | Text before the caption | `data-cli-prefix="— "` |
| `data-cli-suffix` | string | Text after the caption | `data-cli-suffix=" —"` |

### Fieldset-specific

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-title-color` | string | Legend (title) color | `data-cli-title-color="yellow"` |
| `data-cli-disabled-color` | string | Color of the whole box when `disabled` | `data-cli-disabled-color="gray dim"` |
| `data-cli-required-enabled` | boolean | Show the required marker next to the legend when `required` is set | `data-cli-required-enabled="false"` |
| `data-cli-required-marker` | string | Required marker | `data-cli-required-marker="*"` |
| `data-cli-required-color` | string | Required marker color | `data-cli-required-color="red"` |
| `data-cli-required-position` | string | `before` or `after` the legend | `data-cli-required-position="before"` |

---

## Definition Elements (`<abbr>`, `<acronym>`, `<dfn>`)

The title part is shown when the element has a `title` attribute.

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Term color | `data-cli-color="underline"` |
| `data-cli-title-color` | string | Definition text color | `data-cli-title-color="cyan"` |
| `data-cli-title-prefix-marker` | string | Definition prefix | `data-cli-title-prefix-marker="("` |
| `data-cli-title-prefix-color` | string | Prefix color | `data-cli-title-prefix-color="gray"` |
| `data-cli-title-suffix-marker` | string | Definition suffix | `data-cli-title-suffix-marker=")"` |
| `data-cli-title-suffix-color` | string | Suffix color | `data-cli-title-suffix-color="gray"` |

---

## Interactive Elements (`<details>`, `<summary>`)

Set these on `<details>` (together with the [container attributes](#container-elements)); `<summary>` has no data attributes.

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-open-marker` | string | Marker when open | `data-cli-open-marker="▼ "` |
| `data-cli-open-color` | string | Marker color when open | `data-cli-open-color="green"` |
| `data-cli-closed-marker` | string | Marker when closed | `data-cli-closed-marker="▶ "` |
| `data-cli-closed-color` | string | Marker color when closed | `data-cli-closed-color="gray"` |

---

## Progress Elements (`<progress>`, `<meter>`)

### Progress (`<progress>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-width` | number | Bar width in characters | `data-cli-width="30"` |
| `data-cli-filled-marker` | string | Filled portion character | `data-cli-filled-marker="█"` |
| `data-cli-filled-color` | string | Filled portion color | `data-cli-filled-color="cyan"` |
| `data-cli-empty-marker` | string | Empty portion character | `data-cli-empty-marker="░"` |
| `data-cli-empty-color` | string | Empty portion color | `data-cli-empty-color="gray"` |

### Meter (`<meter>`)

Bar markers and colors come from the theme (`meter.ranges`, `meter.empty`).

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-width` | number | Bar width in characters (10-60) | `data-cli-width="20"` |
| `data-cli-labels-enabled` | boolean | Show the value label | `data-cli-labels-enabled="false"` |
| `data-cli-labels-format` | string | Label format: `%v` value, `%m` max, `%n` min, `%%` percent | `data-cli-labels-format="%%%"` |
| `data-cli-labels-color` | string | Label color | `data-cli-labels-color="white"` |
| `data-cli-labels-position` | string | `left` or `right` of the bar | `data-cli-labels-position="left"` |

---

## Notes

- **Boolean attributes**: Use `"true"` or `"false"` (see [Important Rules](#important-rules) for the few that also accept `"1"`)
- **Color format**: Use chalk-string format (e.g., `"red bold"`, `"bgBlue white underline"`)
- **Numbers**: Provide as string values (e.g., `"10"`, `"2"`)
- **Null/default**: Omit the attribute (or set it to `"null"`) to use theme defaults

## Examples

### Custom Checkbox
```html
<input
  type="checkbox"
  checked
  data-cli-checkbox-checked-marker="✓"
  data-cli-checkbox-checked-color="green bold"
  data-cli-checkbox-prefix-marker="["
  data-cli-checkbox-suffix-marker="]"
>
```

### Custom Code Block
```html
<pre><code class="language-javascript"
  data-cli-block-numbers-enabled="true"
  data-cli-block-numbers-color="gray dim"
  data-cli-block-label-enabled="true">console.log('Hello');</code></pre>
```

### Custom Link
```html
<a
  href="https://example.com"
  data-cli-href-enabled="true"
  data-cli-href-color="blue dim"
  data-cli-external-enabled="true"
>
  Example
</a>
```

### Custom Table with Striping

#### Example 1: Using data attributes (2-color striping)
```html
<table
  data-cli-striping-enabled="true"
  data-cli-striping-count="2"
  data-cli-striping-row-1-color="white bgBlue"
  data-cli-striping-row-2-color="white bgCyan">
  <thead>
    <tr><th>Product</th><th>Price</th></tr>
  </thead>
  <tbody>
    <tr><td>Laptop</td><td>$999</td></tr>
    <tr><td>Mouse</td><td>$25</td></tr>
    <tr><td>Keyboard</td><td>$75</td></tr>
    <tr><td>Monitor</td><td>$350</td></tr>
  </tbody>
</table>
```

#### Example 2: Using data attributes (3-color rainbow)
```html
<table
  data-cli-striping-enabled="true"
  data-cli-striping-count="3"
  data-cli-striping-row-1-color="white bgRed"
  data-cli-striping-row-2-color="white bgGreen"
  data-cli-striping-row-3-color="white bgBlue">
  <thead>
    <tr><th>Name</th><th>Age</th></tr>
  </thead>
  <tbody>
    <tr><td>Alice</td><td>25</td></tr>
    <tr><td>Bob</td><td>30</td></tr>
    <tr><td>Charlie</td><td>35</td></tr>
  </tbody>
</table>
```

#### Example 3: Using config.yaml (global theme)
```yaml
# config.yaml
theme:
  table:
    striping:
      enabled: true
      count: 3
      rows:
        - color: 'white bgBlack'
        - color: 'white bgBlackBright'
        - color: 'white bgBlue'
```

Then use simple HTML:
```html
<table>
  <thead>
    <tr><th>Product</th><th>Price</th></tr>
  </thead>
  <tbody>
    <tr><td>Laptop</td><td>$999</td></tr>
    <tr><td>Mouse</td><td>$25</td></tr>
  </tbody>
</table>
```

#### How striping works:
- With `count=2`: Rows alternate between stripe 1 and stripe 2 (classic zebra)
- With `count=3`: Rows cycle through stripes 1, 2, 3
- With `count=4`: Rows cycle through stripes 1 to 4
- With `count=5`: Rows cycle through all 5 colors
- After the last color, it cycles back to the first
- Stripe N in `data-cli-striping-row-N-color` is `rows[N-1]` in `config.yaml`

### Table with Row Numbers and Column Styling
```html
<table
  data-cli-border-style="round"
  data-cli-border-color="cyan"
  data-cli-show-row-numbers="true"
  data-cli-col-colors="green,yellow"
  data-cli-col-align="left,right">
  <tr><th>Item</th><th>Qty</th></tr>
  <tr><td>Apples</td><td>3</td></tr>
  <tr><td>Pears</td><td>12</td></tr>
</table>
```

### Custom Email Input
```html
<input
  type="email"
  value="test@example.com"
  data-cli-email-prefix-marker="✉ "
  data-cli-email-prefix-color="cyan"
  data-cli-email-color="cyan bold"
>
```
