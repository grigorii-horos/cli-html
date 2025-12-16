# Data Attributes Reference

This document lists all available `data-cli-*` attributes for customizing HTML element rendering in the terminal.

## Naming Convention

All data attributes follow a consistent naming pattern that maps directly to `config.yaml` structure:

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
   ol:
     indicators:
       '1':
         marker: '.'
         color: blue
   ```
   ```html
   <!-- HTML -->
   <ol data-cli-indicator-marker=")" data-cli-indicator-color="red">...</ol>
   ```

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
| `ol.indicators[].color` | `data-cli-indicator-color` | `data-cli-indicator-color="red"` |
| `table.responsive.enabled` | `data-cli-responsive-enabled` | `data-cli-responsive-enabled="false"` |

### Important Rules

- **No redundant prefixes**: Don't repeat the tag name in the attribute
  - ✅ Correct: `data-cli-prefix-marker` (on `<button>` element)
  - ❌ Wrong: `data-cli-button-prefix-marker` (redundant "button-" prefix)

- **Arrays become singular**: `indicators[]` becomes `indicator`
  - `ol.indicators[].marker` → `data-cli-indicator-marker`
  - `ul.indicators[].color` → `data-cli-indicator-color`

- **Keep all nested levels**: Include all intermediate object names for clarity
  - `code.block.numbers.color` → `data-cli-block-numbers-color` (keep "block")
  - `code.block.label.prefix.marker` → `data-cli-block-label-prefix-marker` (keep "block" and "label")

- **Boolean values**: Use `"true"`, `"false"`, `"1"`, or `"0"`
  - `data-cli-block-numbers-enabled="true"`
  - `data-cli-href-enabled="false"`

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
  ├─ ol.indicators[].marker            →    data-cli-indicator-marker
  └─ ol.indicators[].color             →    data-cli-indicator-color
         └─ (plural → singular)

tag.type.object.property               →    data-cli-type-object-property
  ├─ input.checkbox.checked.marker     →    data-cli-checkbox-checked-marker
  └─ input.checkbox.prefix.color       →    data-cli-checkbox-prefix-color
         └─ (keep 'checkbox' for input types)
```

## Table of Contents

- [Common Attributes](#common-attributes)
- [Text Elements](#text-elements)
- [Links (`<a>`)](#links-a)
- [Images (`<img>`)](#images-img)
- [Lists (`<ul>`, `<ol>`, `<li>`)](#lists-ul-ol-li)
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

These attributes work on most elements:

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Text color (chalk-string format) | `data-cli-color="red bold"` |
| `data-cli-disabled-color` | string | Color when element is disabled | `data-cli-disabled-color="gray dim"` |

---

## Text Elements

For inline text elements like `<kbd>`, `<samp>`, `<sub>`, `<sup>`:

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-prefix` | string | Prefix marker text | `data-cli-prefix="$ "` |
| `data-cli-prefix-color` | string | Prefix color | `data-cli-prefix-color="green"` |
| `data-cli-suffix` | string | Suffix marker text | `data-cli-suffix=" >"` |
| `data-cli-suffix-color` | string | Suffix color | `data-cli-suffix-color="gray"` |

---

## Links (`<a>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-href-enabled` | boolean | Show URL after link text | `data-cli-href-enabled="true"` |
| `data-cli-href-color` | string | URL color | `data-cli-href-color="gray"` |
| `data-cli-title-enabled` | boolean | Show title attribute | `data-cli-title-enabled="true"` |
| `data-cli-title-color` | string | Title text color | `data-cli-title-color="yellow"` |
| `data-cli-title-prefix` | string | Title prefix marker | `data-cli-title-prefix=" ("` |
| `data-cli-title-prefix-color` | string | Title prefix color | `data-cli-title-prefix-color="gray"` |
| `data-cli-title-suffix` | string | Title suffix marker | `data-cli-title-suffix=")"` |
| `data-cli-title-suffix-color` | string | Title suffix color | `data-cli-title-suffix-color="gray"` |
| `data-cli-external-enabled` | boolean | Show external link indicator | `data-cli-external-enabled="true"` |
| `data-cli-external-marker` | string | External indicator symbol | `data-cli-external-marker="↗"` |
| `data-cli-external-color` | string | Indicator color | `data-cli-external-color="gray"` |
| `data-cli-external-position` | string | Position: `before` or `after` | `data-cli-external-position="after"` |
| `data-cli-external-spacing` | string | Space between link and indicator | `data-cli-external-spacing=" "` |

---

## Images (`<img>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-indicator-marker` | string | Indicator marker (like `!`) | `data-cli-indicator-marker="!"` |
| `data-cli-indicator-color` | string | Indicator color | `data-cli-indicator-color="cyan"` |
| `data-cli-prefix-marker` | string | Opening bracket marker | `data-cli-prefix-marker="["` |
| `data-cli-prefix-color` | string | Opening bracket color | `data-cli-prefix-color="gray"` |
| `data-cli-suffix-marker` | string | Closing bracket marker | `data-cli-suffix-marker="]"` |
| `data-cli-suffix-color` | string | Closing bracket color | `data-cli-suffix-color="gray"` |
| `data-cli-alt-color` | string | Alt text color | `data-cli-alt-color="cyan"` |

---

## Lists (`<ul>`, `<ol>`, `<li>`)

### List Items (`<li>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-li-color` | string | List item text color | `data-cli-li-color="white"` |

### Ordered/Unordered Lists

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-marker` | string | List marker symbol | `data-cli-marker="•"` |
| `data-cli-marker-color` | string | Marker color | `data-cli-marker-color="red"` |
| `data-cli-decimal` | string | Decimal separator (ol only) | `data-cli-decimal="."` |

---

## Code Blocks (`<code>`, `<pre>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-numbers-enabled` | boolean | Show line numbers | `data-cli-numbers-enabled="true"` |
| `data-cli-numbers-color` | string | Line numbers color | `data-cli-numbers-color="gray dim"` |
| `data-cli-highlight-lines` | string | Lines to highlight (comma-separated) | `data-cli-highlight-lines="1,3,5-7"` |
| `data-cli-highlight-color` | string | Highlight background color | `data-cli-highlight-color="bgYellow"` |
| `data-cli-gutter-enabled` | boolean | Show gutter separator | `data-cli-gutter-enabled="true"` |
| `data-cli-gutter-marker` | string | Gutter separator character | `data-cli-gutter-marker=" │ "` |
| `data-cli-gutter-color` | string | Gutter separator color | `data-cli-gutter-color="gray"` |
| `data-cli-label-enabled` | boolean | Show language label | `data-cli-label-enabled="true"` |
| `data-cli-label-position` | string | Label position: `top` or `bottom` | `data-cli-label-position="top"` |
| `data-cli-label-color` | string | Language label color | `data-cli-label-color="cyan"` |
| `data-cli-label-prefix-marker` | string | Label prefix marker | `data-cli-label-prefix-marker="["` |
| `data-cli-label-prefix-color` | string | Label prefix color | `data-cli-label-prefix-color="gray"` |
| `data-cli-label-suffix-marker` | string | Label suffix marker | `data-cli-label-suffix-marker="]"` |
| `data-cli-label-suffix-color` | string | Label suffix color | `data-cli-label-suffix-color="gray"` |
| `data-cli-overflow-enabled` | boolean | Show overflow indicator | `data-cli-overflow-enabled="true"` |
| `data-cli-overflow-marker` | string | Overflow indicator symbol | `data-cli-overflow-marker="↳"` |
| `data-cli-overflow-color` | string | Overflow indicator color | `data-cli-overflow-color="gray"` |

---

## Input Elements

### Checkbox (`<input type="checkbox">`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-checked-marker` | string | Checked state marker | `data-cli-checked-marker="✓"` |
| `data-cli-checked-color` | string | Checked state color | `data-cli-checked-color="green bold"` |
| `data-cli-unchecked-marker` | string | Unchecked state marker | `data-cli-unchecked-marker=" "` |
| `data-cli-unchecked-color` | string | Unchecked state color | `data-cli-unchecked-color="gray"` |
| `data-cli-checkbox-prefix-marker` | string | Opening bracket | `data-cli-checkbox-prefix-marker="["` |
| `data-cli-checkbox-prefix-color` | string | Opening bracket color | `data-cli-checkbox-prefix-color="gray"` |
| `data-cli-checkbox-suffix-marker` | string | Closing bracket | `data-cli-checkbox-suffix-marker="]"` |
| `data-cli-checkbox-suffix-color` | string | Closing bracket color | `data-cli-checkbox-suffix-color="gray"` |

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

### Text Input (`<input type="text">`, etc.)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-text-input-color` | string | Text input color | `data-cli-text-input-color="cyan"` |

### Textarea (`<textarea>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-textarea-color` | string | Textarea text color | `data-cli-textarea-color="cyan"` |

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
| `data-cli-color-indicator` | string | Color indicator marker | `data-cli-color-indicator="■"` |
| `data-cli-color-prefix-marker` | string | Opening bracket | `data-cli-color-prefix-marker="("` |
| `data-cli-color-prefix-color` | string | Opening bracket color | `data-cli-color-prefix-color="gray"` |
| `data-cli-color-suffix-marker` | string | Closing bracket | `data-cli-color-suffix-marker=")"` |
| `data-cli-color-suffix-color` | string | Closing bracket color | `data-cli-color-suffix-color="gray"` |
| `data-cli-color-value-color` | string | Hex value color | `data-cli-color-value-color="white"` |
| `data-cli-hex-enabled` | boolean | Show hex value | `data-cli-hex-enabled="true"` |

### Password (`<input type="password">`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-password-char` | string | Masking character | `data-cli-password-char="*"` |
| `data-cli-password-count` | number | Number of characters to show | `data-cli-password-count="6"` |
| `data-cli-password-color` | string | Password mask color | `data-cli-password-color="gray"` |

### Email (`<input type="email">`)

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
| `data-cli-file-placeholder` | string | Placeholder text | `data-cli-file-placeholder="No file chosen"` |

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

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-select-label` | string | Override select name | `data-cli-select-label="Choose:"` |
| `data-cli-prefix` | string | Prefix marker | `data-cli-prefix=""` |
| `data-cli-prefix-color` | string | Prefix color | `data-cli-prefix-color="cyan"` |
| `data-cli-suffix` | string | Suffix marker | `data-cli-suffix=":"` |
| `data-cli-suffix-color` | string | Suffix color | `data-cli-suffix-color="cyan"` |

### Option (`<option>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-option-color` | string | Option text color | `data-cli-option-color="white"` |
| `data-cli-selected-marker` | string | Selected state marker | `data-cli-selected-marker="◉"` |
| `data-cli-selected-color` | string | Selected state color | `data-cli-selected-color="green bold"` |
| `data-cli-unselected-marker` | string | Unselected state marker | `data-cli-unselected-marker="○"` |
| `data-cli-unselected-color` | string | Unselected state color | `data-cli-unselected-color="gray"` |

### Optgroup (`<optgroup>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-marker` | string | Group marker | `data-cli-marker="▸ "` |
| `data-cli-marker-color` | string | Marker color | `data-cli-marker-color="cyan bold"` |

---

## Table Elements

### Table (`<table>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Default table color (inherited by rows and cells) | `data-cli-color="white"` |
| `data-cli-responsive-enabled` | boolean | Enable responsive list view on narrow terminals | `data-cli-responsive-enabled="true"` |
| `data-cli-responsive-threshold` | number | Terminal width to switch to list view | `data-cli-responsive-threshold="60"` |
| `data-cli-striping-enabled` | boolean | Enable zebra striping (alternating row colors) | `data-cli-striping-enabled="true"` |
| `data-cli-striping-count` | number | Number of different colors to cycle through (2-5) | `data-cli-striping-count="3"` |
| `data-cli-striping-row-0-color` | string | First stripe color (chalk-string format) | `data-cli-striping-row-0-color="white bgBlue"` |
| `data-cli-striping-row-1-color` | string | Second stripe color | `data-cli-striping-row-1-color="white bgCyan"` |
| `data-cli-striping-row-2-color` | string | Third stripe color (used if count >= 3) | `data-cli-striping-row-2-color="white bgGreen"` |
| `data-cli-striping-row-3-color` | string | Fourth stripe color (used if count >= 4) | `data-cli-striping-row-3-color="white bgMagenta"` |
| `data-cli-striping-row-4-color` | string | Fifth stripe color (used if count = 5) | `data-cli-striping-row-4-color="white bgYellow"` |

### Table Sections (`<caption>`, `<tr>`, `<td>`, `<th>`, `<thead>`, `<tbody>`, `<tfoot>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-color` | string | Element color (inherits from parent if not set) | `data-cli-color="white"` |

**Color Inheritance**:
- `<td>` inherits from: custom td → custom tr → custom section (thead/tbody/tfoot) → theme.td → theme.tr → theme.table
- `<th>` inherits from: custom th → custom tr → custom section → theme.th → theme.thead → theme.table

### Table Styling

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-border` | string | Border style | `data-cli-border="single"` |
| `data-cli-border-style` | string | Border style variant | `data-cli-border-style="round"` |
| `data-cli-padding-left` | number | Left padding spaces | `data-cli-padding-left="2"` |
| `data-cli-padding-right` | number | Right padding spaces | `data-cli-padding-right="2"` |
| `data-cli-padding-top` | number | Top padding lines | `data-cli-padding-top="1"` |
| `data-cli-padding-bottom` | number | Bottom padding lines | `data-cli-padding-bottom="1"` |

---

## Container Elements

For `<figure>`, `<fieldset>`, `<details>`:

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-border-style` | string | Border style: `round`, `single`, `double`, `bold`, `classic` | `data-cli-border-style="round"` |
| `data-cli-border-dim` | boolean | Dim border (less bright) | `data-cli-border-dim="true"` |
| `data-cli-padding-left` | number | Left padding spaces | `data-cli-padding-left="2"` |
| `data-cli-padding-right` | number | Right padding spaces | `data-cli-padding-right="2"` |
| `data-cli-padding-top` | number | Top padding lines | `data-cli-padding-top="1"` |
| `data-cli-padding-bottom` | number | Bottom padding lines | `data-cli-padding-bottom="1"` |

### Fieldset-specific

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-title-color` | string | Legend (title) color | `data-cli-title-color="yellow"` |

---

## Definition Elements (`<abbr>`, `<dfn>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-title-color` | string | Definition text color | `data-cli-title-color="cyan"` |
| `data-cli-title-prefix-marker` | string | Definition prefix | `data-cli-title-prefix-marker="("` |
| `data-cli-title-prefix-color` | string | Prefix color | `data-cli-title-prefix-color="gray"` |
| `data-cli-title-suffix-marker` | string | Definition suffix | `data-cli-title-suffix-marker=")"` |
| `data-cli-title-suffix-color` | string | Suffix color | `data-cli-title-suffix-color="gray"` |

---

## Interactive Elements (`<details>`, `<summary>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-open-marker` | string | Marker when open | `data-cli-open-marker="▼ "` |
| `data-cli-closed-marker` | string | Marker when closed | `data-cli-closed-marker="▶ "` |

---

## Progress Elements (`<progress>`, `<meter>`)

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `data-cli-width` | number | Bar width in characters | `data-cli-width="30"` |
| `data-cli-filled-marker` | string | Filled portion character | `data-cli-filled-marker="█"` |
| `data-cli-filled-color` | string | Filled portion color | `data-cli-filled-color="cyan"` |
| `data-cli-empty-marker` | string | Empty portion character | `data-cli-empty-marker="█"` |
| `data-cli-empty-color` | string | Empty portion color | `data-cli-empty-color="gray"` |

---

## Notes

- **Boolean attributes**: Use `"true"`, `"1"`, `"false"`, or `"0"` as values
- **Color format**: Use chalk-string format (e.g., `"red bold"`, `"bgBlue white underline"`)
- **Numbers**: Provide as string values (e.g., `"10"`, `"2"`)
- **Null/default**: Omit the attribute to use theme defaults

## Examples

### Custom Checkbox
```html
<input
  type="checkbox"
  checked
  data-cli-checked-marker="✓"
  data-cli-checked-color="green bold"
  data-cli-checkbox-prefix-marker="["
  data-cli-checkbox-suffix-marker="]"
>
```

### Custom Code Block
```html
<pre data-cli-numbers-enabled="true" data-cli-numbers-color="gray dim">
  <code class="language-javascript">console.log('Hello');</code>
</pre>
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
  data-cli-striping-row-0-color="white bgBlue"
  data-cli-striping-row-1-color="white bgCyan">
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
  data-cli-striping-row-0-color="white bgRed"
  data-cli-striping-row-1-color="white bgGreen"
  data-cli-striping-row-2-color="white bgBlue">
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
- With `count=2`: Rows alternate between `rows[0]` and `rows[1]` (classic zebra)
- With `count=3`: Rows cycle through `rows[0]`, `rows[1]`, `rows[2]`
- With `count=4`: Rows cycle through `rows[0]` to `rows[3]`
- With `count=5`: Rows cycle through all 5 colors
- After the last color, it cycles back to the first
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
