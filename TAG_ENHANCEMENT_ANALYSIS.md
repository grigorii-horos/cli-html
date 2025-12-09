# CLI-HTML Tag Enhancement Analysis

Comprehensive analysis of all tag implementations in `/lib/tags/` with suggestions for new styling features and improvements inspired by modern terminal UIs and the advanced features in `code.js`.

---

## Table of Contents

1. [Blockquote](#blockquote)
2. [Table](#table)
3. [List (ul/ol/li)](#list-ulol)
4. [Details](#details)
5. [Figure](#figure)
6. [Fieldset](#fieldset)
7. [Headers (h1-h6)](#headers-h1-h6)
8. [HR (Horizontal Rule)](#hr-horizontal-rule)
9. [Abbr/Dfn](#abbrdfn)
10. [Link (a)](#link-a)
11. [Text Styles](#text-styles)
12. [Inputs](#inputs)
13. [Select](#select)
14. [Progress/Meter](#progressmeter)
15. [Address](#address)
16. [Definitions (dl/dt/dd)](#definitions-dldtdd)
17. [Image](#image)
18. [Ruby](#ruby)
19. [Span/Center](#spancenter)

---

## 1. Blockquote

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/blockquote.js`

### Current Features
- Custom marker support (default: `│ `)
- Color customization via `data-cli-color`
- Left margin indentation
- Width reduction for nested appearance

### Suggested New Features

#### 1.1 Citation/Attribution Support
**Priority:** HIGH

Add support for displaying citation or author information like modern quote blocks.

**New Attributes:**
- `data-cli-cite` - Citation text to display
- `data-cli-cite-position` - Position: `top`, `bottom`, `both` (default: `bottom`)
- `data-cli-cite-marker` - Marker before citation (default: `— `)
- `data-cli-cite-color` - Citation text color
- `data-cli-cite-marker-color` - Citation marker color

**Example Usage:**
```html
<blockquote
  data-cli-cite="Winston Churchill"
  data-cli-cite-position="bottom"
  data-cli-cite-marker="— "
  data-cli-cite-color="gray">
  Success is not final, failure is not fatal.
</blockquote>
```

**Output:**
```
│ Success is not final, failure is not fatal.
│ — Winston Churchill
```

#### 1.2 Multi-Line Marker Styles
**Priority:** MEDIUM

Support for different marker styles on first line vs. continuation lines (like git diff).

**New Attributes:**
- `data-cli-first-marker` - Marker for first line (default: same as marker)
- `data-cli-continue-marker` - Marker for continuation lines (default: same as marker)
- `data-cli-first-marker-color` - Color for first line marker
- `data-cli-continue-marker-color` - Color for continuation markers

**Example Usage:**
```html
<blockquote
  data-cli-first-marker="┏ "
  data-cli-continue-marker="┃ "
  data-cli-marker-color="blue">
  Multi-line quote
  with multiple lines
</blockquote>
```

#### 1.3 Quote Level Indicators
**Priority:** MEDIUM

Visual indicators for nested quote depth (like email replies).

**New Attributes:**
- `data-cli-level` - Quote nesting level (1-5)
- `data-cli-level-colors` - Comma-separated colors for each level
- `data-cli-level-markers` - Different markers per level

**Example Usage:**
```html
<blockquote data-cli-level="2" data-cli-level-colors="blue,cyan,gray">
  Level 2 nested quote
</blockquote>
```

#### 1.4 Border/Frame Styles
**Priority:** LOW

Add optional border around blockquote (similar to `details` and `figure`).

**New Attributes:**
- `data-cli-border` - Enable border: `true`/`false`
- `data-cli-border-style` - Border style: `single`, `double`, `round`, `bold`
- `data-cli-border-color` - Border color

---

## 2. Table

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/table.js`

### Current Features
- Caption support with custom colors
- Header (th) and cell (td) color customization
- Section-level colors (thead, tbody, tfoot)
- Row-level colors (tr)
- Alignment support (hAlign, vAlign)
- Colspan and rowspan support

### Suggested New Features

#### 2.1 Row Highlighting (Similar to Code)
**Priority:** HIGH

Add ability to highlight specific rows (like code line highlighting).

**New Attributes:**
- `data-cli-highlight-rows` - Row indices to highlight (e.g., "1,3,5-7")
- `data-cli-highlight-color` - Background color for highlighted rows
- `data-cli-alternate-rows` - Enable zebra striping: `true`/`false`
- `data-cli-alternate-colors` - Two colors for alternating rows (e.g., "white,gray")

**Example Usage:**
```html
<table data-cli-highlight-rows="1,3" data-cli-highlight-color="bg-blue">
  <tr><td>Row 1</td></tr>
  <tr><td>Row 2</td></tr>
  <tr><td>Row 3</td></tr>
</table>
```

#### 2.2 Column Styling
**Priority:** HIGH

Enhanced column-specific styling (beyond just th).

**New Attributes:**
- `data-cli-col-colors` - Comma-separated colors for each column
- `data-cli-col-widths` - Fixed widths for columns
- `data-cli-col-align` - Alignment for each column

**Example Usage:**
```html
<table data-cli-col-colors="red,green,blue" data-cli-col-align="left,center,right">
  ...
</table>
```

#### 2.3 Border Customization
**Priority:** MEDIUM

Allow customization of table border characters and styles.

**New Attributes:**
- `data-cli-border-style` - Border style: `single`, `double`, `rounded`, `bold`, `ascii`, `none`
- `data-cli-border-color` - Border color
- `data-cli-header-separator` - Custom separator between header and body
- `data-cli-header-separator-color` - Separator color

**Example Usage:**
```html
<table
  data-cli-border-style="double"
  data-cli-border-color="cyan"
  data-cli-header-separator="═">
  ...
</table>
```

#### 2.4 Row Numbering
**Priority:** MEDIUM

Add optional row numbers (like code line numbers).

**New Attributes:**
- `data-cli-show-row-numbers` - Enable row numbering: `true`/`false`
- `data-cli-row-number-color` - Color for row numbers
- `data-cli-row-number-start` - Starting number (default: 1)
- `data-cli-row-number-separator` - Separator after number (default: `│`)

**Example Usage:**
```html
<table data-cli-show-row-numbers="true" data-cli-row-number-color="gray">
  ...
</table>
```

#### 2.5 Sortable Indicator
**Priority:** LOW

Visual indicators for sortable columns (static, for display purposes).

**New Attributes:**
- `data-cli-sorted-col` - Column index that appears sorted
- `data-cli-sort-direction` - Direction: `asc`, `desc`
- `data-cli-sort-indicator` - Custom sort indicator (default: `↑`/`↓`)
- `data-cli-sort-indicator-color` - Indicator color

---

## 3. List (ul/ol)

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/list.js`

### Current Features
- Ordered and unordered list support
- Custom markers per list
- Marker color customization
- List item text color
- Type rotation for nested lists
- Decimal separator customization

### Suggested New Features

#### 3.1 Checkbox/Task Lists
**Priority:** HIGH

GitHub-style task list support.

**New Attributes:**
- `data-cli-task-list` - Enable task list mode: `true`/`false`
- `data-cli-checked-marker` - Marker for completed tasks (default: `☑`)
- `data-cli-unchecked-marker` - Marker for incomplete tasks (default: `☐`)
- `data-cli-checked-color` - Color for checked items
- `data-cli-unchecked-color` - Color for unchecked items

**Example Usage:**
```html
<ul data-cli-task-list="true">
  <li data-cli-checked="true">Completed task</li>
  <li data-cli-checked="false">Pending task</li>
</ul>
```

**Output:**
```
☑ Completed task
☐ Pending task
```

#### 3.2 List Item Status/Priority Indicators
**Priority:** MEDIUM

Visual indicators for item status or priority.

**New Attributes:**
- `data-cli-status` - Status for li: `success`, `warning`, `error`, `info`
- `data-cli-status-marker` - Custom marker for status
- `data-cli-status-color` - Auto-color based on status
- `data-cli-priority` - Priority level: `high`, `medium`, `low`
- `data-cli-priority-marker` - Marker prefix for priority

**Example Usage:**
```html
<ul>
  <li data-cli-status="error">Critical bug</li>
  <li data-cli-status="warning">Needs review</li>
  <li data-cli-status="success">Fixed</li>
</ul>
```

**Output:**
```
✗ Critical bug
⚠ Needs review
✓ Fixed
```

#### 3.3 Numbered Progress Lists
**Priority:** MEDIUM

Show progress within ordered lists (inspired by code's progress bar).

**New Attributes:**
- `data-cli-progress` - Enable progress display: `true`/`false`
- `data-cli-completed` - Number of completed items
- `data-cli-progress-position` - Position: `top`, `bottom`, `both`
- `data-cli-progress-style` - Style: `bar`, `percentage`, `fraction`

**Example Usage:**
```html
<ol data-cli-progress="true" data-cli-completed="2" data-cli-progress-style="bar">
  <li>Step 1</li>
  <li>Step 2</li>
  <li>Step 3</li>
  <li>Step 4</li>
</ol>
```

**Output:**
```
Progress: ████████░░░░░░░░░░░░ 50%

1. Step 1
2. Step 2
3. Step 3
4. Step 4
```

#### 3.4 Collapsible List Sections
**Priority:** LOW

Add section headers within lists with expand/collapse indicators.

**New Attributes:**
- `data-cli-section` - Mark li as section header
- `data-cli-collapsed` - Show as collapsed: `true`/`false`
- `data-cli-expand-marker` - Expanded indicator (default: `▼`)
- `data-cli-collapse-marker` - Collapsed indicator (default: `▶`)

#### 3.5 List Item Highlighting
**Priority:** MEDIUM

Highlight specific list items (like code line highlighting).

**New Attributes:**
- `data-cli-highlight` - Highlight this list item: `true`/`false`
- `data-cli-highlight-color` - Highlight color

**Example Usage:**
```html
<ul>
  <li>Normal item</li>
  <li data-cli-highlight="true" data-cli-highlight-color="bg-yellow">Important item</li>
  <li>Normal item</li>
</ul>
```

---

## 4. Details

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/details.js`

### Current Features
- Border with customizable color, style, and dim
- Open/closed state indicators
- Custom markers for open/closed states
- Marker colors
- Summary title customization
- Padding control

### Suggested New Features

#### 4.1 Nested Level Indicators
**Priority:** MEDIUM

Visual differentiation for nested details elements.

**New Attributes:**
- `data-cli-level` - Nesting level (1-5)
- `data-cli-level-colors` - Different border colors per level
- `data-cli-level-indent` - Additional indent per level

**Example Usage:**
```html
<details data-cli-level="2" data-cli-level-colors="blue,cyan,gray">
  <summary>Nested Section</summary>
  ...
</details>
```

#### 4.2 Title Badges/Labels
**Priority:** MEDIUM

Add status badges or labels to summary (like GitHub).

**New Attributes:**
- `data-cli-badge` - Badge text to display
- `data-cli-badge-color` - Badge color
- `data-cli-badge-position` - Position: `before`, `after` (default: `after`)
- `data-cli-badge-prefix` - Prefix character (default: `[`)
- `data-cli-badge-suffix` - Suffix character (default: `]`)

**Example Usage:**
```html
<details
  data-cli-badge="3 items"
  data-cli-badge-color="cyan"
  data-cli-badge-position="after">
  <summary>Configuration</summary>
  ...
</details>
```

**Output:**
```
┌─ ▼ Configuration [3 items] ──────┐
│ ...                               │
└───────────────────────────────────┘
```

#### 4.3 Animated State Transition
**Priority:** LOW

Show animation-like indicators when state changes (useful for dynamic content).

**New Attributes:**
- `data-cli-transition-indicator` - Show transition state: `true`/`false`
- `data-cli-opening-marker` - Marker during open transition (default: `⟳`)
- `data-cli-closing-marker` - Marker during close transition

#### 4.4 Icon/Emoji Support
**Priority:** LOW

Allow custom icons in summary title.

**New Attributes:**
- `data-cli-icon` - Icon/emoji to display before summary
- `data-cli-icon-color` - Icon color

**Example Usage:**
```html
<details data-cli-icon="🔧" data-cli-icon-color="yellow">
  <summary>Settings</summary>
  ...
</details>
```

---

## 5. Figure

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/figure.js`

### Current Features
- Border with customizable color, style, and dim
- Centered figcaption with prefix/suffix
- Custom figcaption colors
- Padding control
- Caption alignment within content width

### Suggested New Features

#### 5.1 Image Placeholders/ASCII Art Support
**Priority:** MEDIUM

Better handling for representing images in terminal.

**New Attributes:**
- `data-cli-placeholder` - Placeholder type: `box`, `ascii`, `description`
- `data-cli-placeholder-char` - Character for box placeholder (default: `█`)
- `data-cli-placeholder-width` - Width of placeholder
- `data-cli-placeholder-height` - Height of placeholder
- `data-cli-show-dimensions` - Show image dimensions: `true`/`false`

**Example Usage:**
```html
<figure
  data-cli-placeholder="box"
  data-cli-placeholder-width="40"
  data-cli-placeholder-height="10"
  data-cli-show-dimensions="true">
  <img src="photo.jpg" alt="Sample Photo">
  <figcaption>Sample Photo (1920x1080)</figcaption>
</figure>
```

#### 5.2 Multiple Caption Positions
**Priority:** LOW

Allow captions at both top and bottom.

**New Attributes:**
- `data-cli-caption-position` - Position: `top`, `bottom`, `both`
- `data-cli-top-caption` - Text for top caption
- `data-cli-bottom-caption` - Text for bottom caption

#### 5.3 Figure Numbering
**Priority:** LOW

Auto-numbering for figures (like academic papers).

**New Attributes:**
- `data-cli-figure-number` - Figure number to display
- `data-cli-figure-prefix` - Prefix (default: "Figure ")
- `data-cli-figure-number-color` - Number color

**Example Usage:**
```html
<figure data-cli-figure-number="1" data-cli-figure-prefix="Fig. ">
  ...
  <figcaption>Architecture Diagram</figcaption>
</figure>
```

**Output:**
```
┌─────────────────────────────┐
│ [Content]                   │
│    Fig. 1: Architecture     │
└─────────────────────────────┘
```

#### 5.4 Grid Layout for Multiple Images
**Priority:** LOW

Support for displaying multiple items in a grid within figure.

**New Attributes:**
- `data-cli-layout` - Layout: `single`, `grid`, `horizontal`, `vertical`
- `data-cli-columns` - Number of columns for grid layout
- `data-cli-spacing` - Spacing between items

---

## 6. Fieldset

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/fieldset.js`

### Current Features
- Border with customizable color, style, and dim
- Legend (title) support with color
- Disabled state with dimming
- Padding control

### Suggested New Features

#### 6.1 Required Field Indicator
**Priority:** HIGH

Visual indicator for required fieldsets/forms.

**New Attributes:**
- `data-cli-required` - Mark as required: `true`/`false`
- `data-cli-required-marker` - Required indicator (default: `*`)
- `data-cli-required-color` - Required marker color (default: `red`)
- `data-cli-required-position` - Position: `before`, `after` legend

**Example Usage:**
```html
<fieldset data-cli-required="true" data-cli-required-marker="*" data-cli-required-color="red">
  <legend>Personal Information</legend>
  ...
</fieldset>
```

**Output:**
```
┌─ *Personal Information ───┐
│ ...                        │
└────────────────────────────┘
```

#### 6.2 Validation State
**Priority:** HIGH

Visual indicators for form validation state.

**New Attributes:**
- `data-cli-state` - State: `valid`, `invalid`, `pending`
- `data-cli-state-indicator` - Indicator position: `corner`, `title`, `border`
- `data-cli-valid-color` - Color for valid state (default: `green`)
- `data-cli-invalid-color` - Color for invalid state (default: `red`)
- `data-cli-valid-marker` - Valid indicator (default: `✓`)
- `data-cli-invalid-marker` - Invalid indicator (default: `✗`)

**Example Usage:**
```html
<fieldset
  data-cli-state="invalid"
  data-cli-state-indicator="title"
  data-cli-invalid-color="red">
  <legend>Payment Details</legend>
  ...
</fieldset>
```

#### 6.3 Collapsible Fieldset
**Priority:** MEDIUM

Make fieldsets collapsible (like details element).

**New Attributes:**
- `data-cli-collapsible` - Enable collapse: `true`/`false`
- `data-cli-collapsed` - Initial state: `true`/`false`
- `data-cli-collapse-marker` - Collapsed indicator (default: `▶`)
- `data-cli-expand-marker` - Expanded indicator (default: `▼`)

#### 6.4 Progress/Step Indicator
**Priority:** MEDIUM

Show progress through multi-step forms.

**New Attributes:**
- `data-cli-step` - Current step number
- `data-cli-total-steps` - Total number of steps
- `data-cli-step-position` - Position: `title`, `corner`, `bottom`
- `data-cli-step-format` - Format: `fraction`, `percentage`, `dots`

**Example Usage:**
```html
<fieldset
  data-cli-step="2"
  data-cli-total-steps="4"
  data-cli-step-position="title"
  data-cli-step-format="fraction">
  <legend>Shipping Address</legend>
  ...
</fieldset>
```

**Output:**
```
┌─ Shipping Address (2/4) ──┐
│ ...                        │
└────────────────────────────┘
```

---

## 7. Headers (h1-h6)

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/headers.js`

### Current Features
- Custom marker per header level (e.g., `#`, `##`, etc.)
- Color customization per level
- Margin control

### Suggested New Features

#### 7.1 Underline/Overline Styles
**Priority:** HIGH

Add optional underlines or frames for headers (like Markdown alternatives).

**New Attributes:**
- `data-cli-underline` - Enable underline: `true`/`false`
- `data-cli-underline-char` - Character for underline (default: `─`)
- `data-cli-underline-color` - Underline color
- `data-cli-overline` - Enable overline: `true`/`false`
- `data-cli-overline-char` - Character for overline
- `data-cli-frame` - Frame style: `none`, `underline`, `box`, `double`

**Example Usage:**
```html
<h1
  data-cli-underline="true"
  data-cli-underline-char="═"
  data-cli-underline-color="blue">
  Main Title
</h1>
```

**Output:**
```
# Main Title
═══════════
```

#### 7.2 Header Numbering
**Priority:** HIGH

Automatic hierarchical numbering (1, 1.1, 1.1.1, etc.).

**New Attributes:**
- `data-cli-numbered` - Enable numbering: `true`/`false`
- `data-cli-number` - Manual number override
- `data-cli-number-format` - Format: `decimal`, `roman`, `alpha`
- `data-cli-number-separator` - Separator after number (default: `.`)
- `data-cli-number-color` - Number color

**Example Usage:**
```html
<h1 data-cli-numbered="true" data-cli-number="1">Introduction</h1>
<h2 data-cli-numbered="true" data-cli-number="1.1">Background</h2>
<h2 data-cli-numbered="true" data-cli-number="1.2">Objectives</h2>
```

**Output:**
```
# 1. Introduction

## 1.1 Background

## 1.2 Objectives
```

#### 7.3 Icon/Emoji Prefix
**Priority:** MEDIUM

Add icons or emojis before headers.

**New Attributes:**
- `data-cli-icon` - Icon/emoji to display
- `data-cli-icon-color` - Icon color
- `data-cli-icon-position` - Position: `before-marker`, `after-marker`, `replace-marker`

**Example Usage:**
```html
<h1 data-cli-icon="📚" data-cli-icon-position="after-marker">Documentation</h1>
```

**Output:**
```
# 📚 Documentation
```

#### 7.4 Anchor/ID Display
**Priority:** LOW

Show anchor links or IDs for headers (useful for TOC).

**New Attributes:**
- `data-cli-show-id` - Show ID: `true`/`false`
- `data-cli-id-format` - Format: `prefix`, `suffix`, `brackets`
- `data-cli-id-color` - ID text color

**Example Usage:**
```html
<h2 id="installation" data-cli-show-id="true" data-cli-id-format="brackets">
  Installation
</h2>
```

**Output:**
```
## Installation [#installation]
```

#### 7.5 Status/Tag Badges
**Priority:** LOW

Add status badges to headers.

**New Attributes:**
- `data-cli-badge` - Badge text
- `data-cli-badge-color` - Badge color
- `data-cli-badge-style` - Style: `plain`, `brackets`, `box`

**Example Usage:**
```html
<h3 data-cli-badge="BETA" data-cli-badge-color="yellow">New Feature</h3>
```

**Output:**
```
### New Feature [BETA]
```

---

## 8. HR (Horizontal Rule)

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/hr.js`

### Current Features
- Custom marker character (default: `─`)
- Color customization
- Full width rendering

### Suggested New Features

#### 8.1 Text/Label in HR
**Priority:** HIGH

Add text labels within horizontal rules (like section separators).

**New Attributes:**
- `data-cli-text` - Text to display in HR
- `data-cli-text-color` - Text color
- `data-cli-text-position` - Position: `left`, `center`, `right`
- `data-cli-text-padding` - Padding around text (default: 1)
- `data-cli-text-prefix` - Prefix before text (default: ` `)
- `data-cli-text-suffix` - Suffix after text (default: ` `)

**Example Usage:**
```html
<hr
  data-cli-text="Section 2"
  data-cli-text-position="center"
  data-cli-text-color="cyan"
  data-cli-marker="─">
```

**Output:**
```
────────────── Section 2 ──────────────
```

#### 8.2 Gradient/Pattern Styles
**Priority:** MEDIUM

Support for patterns or gradients in HR.

**New Attributes:**
- `data-cli-pattern` - Pattern style: `solid`, `dashed`, `dotted`, `double`, `wavy`, `gradient`
- `data-cli-pattern-colors` - Colors for gradient (comma-separated)
- `data-cli-dash-length` - Length of dashes for dashed style

**Example Usage:**
```html
<hr data-cli-pattern="dashed" data-cli-dash-length="3">
<hr data-cli-pattern="double" data-cli-marker="═">
<hr data-cli-pattern="dotted" data-cli-marker="·">
```

**Output:**
```
─── ─── ─── ─── ─── ─── ───
═══════════════════════════
·  ·  ·  ·  ·  ·  ·  ·  ·
```

#### 8.3 Partial Width
**Priority:** MEDIUM

Allow HR to be less than full width.

**New Attributes:**
- `data-cli-width` - Width: percentage or absolute (e.g., `50%`, `40`)
- `data-cli-align` - Alignment: `left`, `center`, `right`

**Example Usage:**
```html
<hr data-cli-width="50%" data-cli-align="center">
```

#### 8.4 Decorative Ends
**Priority:** LOW

Add decorative characters at the ends.

**New Attributes:**
- `data-cli-start-char` - Character at start
- `data-cli-end-char` - Character at end
- `data-cli-start-color` - Start character color
- `data-cli-end-color` - End character color

**Example Usage:**
```html
<hr
  data-cli-start-char="◀"
  data-cli-end-char="▶"
  data-cli-marker="─">
```

**Output:**
```
◀─────────────────────────▶
```

---

## 9. Abbr/Dfn

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/abbr.js`

### Current Features
- Title attribute display with customizable prefix/suffix
- Color customization for abbreviation and title
- Prefix/suffix marker customization
- Prefix/suffix color customization

### Suggested New Features

#### 9.1 Tooltip-Style Display
**Priority:** MEDIUM

Alternative display formats for definitions.

**New Attributes:**
- `data-cli-display-mode` - Mode: `inline`, `below`, `tooltip-style`
- `data-cli-definition-indent` - Indentation for below mode

**Example Usage:**
```html
<abbr title="HyperText Markup Language" data-cli-display-mode="below">HTML</abbr>
```

**Output:**
```
HTML
  └─ HyperText Markup Language
```

#### 9.2 First-Use Indicator
**Priority:** LOW

Mark first usage of abbreviation (for documentation).

**New Attributes:**
- `data-cli-first-use` - Mark as first use: `true`/`false`
- `data-cli-first-use-marker` - Marker for first use (default: `*`)
- `data-cli-first-use-color` - Color for first use

**Example Usage:**
```html
<abbr title="Application Programming Interface" data-cli-first-use="true">API</abbr>
```

**Output:**
```
API* (Application Programming Interface)
```

#### 9.3 Category/Type Indicators
**Priority:** LOW

Add type labels for abbreviations.

**New Attributes:**
- `data-cli-category` - Category: `technical`, `business`, `medical`, etc.
- `data-cli-category-color` - Color based on category

---

## 10. Link (a)

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/a.js`

### Current Features
- Hyperlink support with ansi-escapes
- Optional href display
- Optional title display
- Title prefix/suffix customization
- Separate colors for link, href, title
- Multiple URL scheme support

### Suggested New Features

#### 10.1 Link Type Icons
**Priority:** MEDIUM

Visual indicators for link types (external, download, email, etc.).

**New Attributes:**
- `data-cli-show-icon` - Show type icon: `true`/`false`
- `data-cli-icon` - Custom icon
- `data-cli-icon-position` - Position: `before`, `after`
- `data-cli-external-icon` - Icon for external links (default: `↗`)
- `data-cli-download-icon` - Icon for downloads (default: `⬇`)
- `data-cli-email-icon` - Icon for mailto (default: `✉`)

**Example Usage:**
```html
<a href="https://example.com" data-cli-show-icon="true" data-cli-external-icon="↗">
  External Link
</a>
```

**Output:**
```
External Link ↗
```

#### 10.2 URL Shortening
**Priority:** MEDIUM

Smart URL display with shortening for long URLs.

**New Attributes:**
- `data-cli-shorten-url` - Enable URL shortening: `true`/`false`
- `data-cli-max-url-length` - Maximum length before shortening
- `data-cli-shorten-method` - Method: `middle`, `end`, `domain`

**Example Usage:**
```html
<a href="https://example.com/very/long/path/to/resource"
   data-cli-show-href="true"
   data-cli-shorten-url="true"
   data-cli-max-url-length="30">
  Link
</a>
```

**Output:**
```
Link [example.com/.../resource]
```

#### 10.3 Link Status Indicator
**Priority:** LOW

Show link status (visited, active, broken).

**New Attributes:**
- `data-cli-status` - Status: `active`, `visited`, `broken`
- `data-cli-status-marker` - Marker for status
- `data-cli-status-color` - Color based on status

**Example Usage:**
```html
<a href="#section" data-cli-status="visited">Previously Viewed</a>
```

#### 10.4 QR Code Placeholder
**Priority:** LOW

Indicate that a QR code could be generated (for terminal that support images).

**New Attributes:**
- `data-cli-show-qr-hint` - Show QR hint: `true`/`false`
- `data-cli-qr-marker` - QR indicator (default: `[QR]`)

---

## 11. Text Styles

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/text-styles.js`

### Current Features
- Color customization for multiple text styles (bold, italic, underline, etc.)
- Prefix/suffix support for `kbd`, `samp`, `sub`, `sup`
- Prefix/suffix color customization

### Suggested New Features

#### 11.1 Enhanced Keyboard Input (kbd)
**Priority:** HIGH

Better keyboard shortcut visualization.

**New Attributes:**
- `data-cli-key-style` - Style: `simple`, `box`, `mac`, `windows`
- `data-cli-key-separator` - Separator for key combinations (default: `+`)
- `data-cli-key-border` - Border style for box mode
- `data-cli-modifier-color` - Color for modifier keys (Ctrl, Alt, etc.)

**Example Usage:**
```html
<kbd data-cli-key-style="box">Ctrl+Alt+Delete</kbd>
```

**Output:**
```
[ Ctrl ] + [ Alt ] + [ Delete ]
```

#### 11.2 Code/Sample Context
**Priority:** MEDIUM

Add context indicators for code samples.

**New Attributes (for `samp`):**
- `data-cli-context` - Context: `input`, `output`, `error`
- `data-cli-context-marker` - Marker prefix (default: `$`, `>`, `!`)
- `data-cli-context-color` - Color based on context

**Example Usage:**
```html
<samp data-cli-context="output" data-cli-context-marker=">">Hello World</samp>
```

**Output:**
```
> Hello World
```

#### 11.3 Diff-Style Highlighting
**Priority:** MEDIUM

Add support for diff-like additions and deletions.

**New Attributes (for `ins`/`del`):**
- `data-cli-diff-style` - Style: `simple`, `git`, `unified`
- `data-cli-show-marker` - Show marker: `true`/`false`
- `data-cli-add-marker` - Addition marker (default: `+`)
- `data-cli-del-marker` - Deletion marker (default: `-`)

**Example Usage:**
```html
<del data-cli-diff-style="git" data-cli-show-marker="true">old text</del>
<ins data-cli-diff-style="git" data-cli-show-marker="true">new text</ins>
```

**Output:**
```
- old text
+ new text
```

#### 11.4 Variable Type Hints
**Priority:** LOW

Add type hints for variables.

**New Attributes (for `var`):**
- `data-cli-type` - Variable type (e.g., `string`, `number`, `boolean`)
- `data-cli-show-type` - Show type: `true`/`false`
- `data-cli-type-color` - Color for type display
- `data-cli-type-format` - Format: `prefix`, `suffix`, `tooltip`

**Example Usage:**
```html
<var data-cli-type="string" data-cli-show-type="true">username</var>
```

**Output:**
```
username<string>
```

#### 11.5 Mark/Highlight Styles
**Priority:** MEDIUM

Enhanced highlighting with different styles.

**New Attributes (for `mark`):**
- `data-cli-highlight-style` - Style: `background`, `underline`, `box`, `arrows`
- `data-cli-highlight-char` - Character for background (default: `░`)

**Example Usage:**
```html
<mark data-cli-highlight-style="arrows">important text</mark>
```

**Output:**
```
» important text «
```

---

## 12. Inputs

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/inputs.js`

### Current Features
- Multiple input type support (checkbox, radio, button, range, color, file, text, etc.)
- Disabled state support
- Custom markers for checked/unchecked states
- Color customization per input type
- Range slider visualization
- Color input with hex display

### Suggested New Features

#### 12.1 Input Validation States
**Priority:** HIGH

Visual indicators for validation states.

**New Attributes:**
- `data-cli-valid` - Mark as valid: `true`/`false`
- `data-cli-invalid` - Mark as invalid: `true`/`false`
- `data-cli-valid-marker` - Valid indicator (default: `✓`)
- `data-cli-invalid-marker` - Invalid indicator (default: `✗`)
- `data-cli-valid-color` - Valid color (default: `green`)
- `data-cli-invalid-color` - Invalid color (default: `red`)

**Example Usage:**
```html
<input type="text" value="user@example"
       data-cli-invalid="true"
       data-cli-invalid-marker="✗">
```

**Output:**
```
user@example ✗
```

#### 12.2 Required Field Indicator
**Priority:** HIGH

Show required field marker.

**New Attributes:**
- `data-cli-required` - Mark as required: `true`/`false`
- `data-cli-required-marker` - Required indicator (default: `*`)
- `data-cli-required-color` - Required color (default: `red`)

**Example Usage:**
```html
<input type="text" data-cli-required="true" data-cli-required-marker="*">
```

#### 12.3 Placeholder Display
**Priority:** MEDIUM

Show placeholder text for empty inputs.

**New Attributes:**
- `data-cli-show-placeholder` - Show placeholder: `true`/`false`
- `data-cli-placeholder-color` - Placeholder color (default: `gray dim`)
- `data-cli-placeholder-prefix` - Prefix for placeholder
- `data-cli-placeholder-suffix` - Suffix for placeholder

**Example Usage:**
```html
<input type="text"
       placeholder="Enter your name"
       data-cli-show-placeholder="true"
       data-cli-placeholder-color="gray">
```

#### 12.4 Range with Labels
**Priority:** MEDIUM

Add min/max labels to range inputs.

**New Attributes:**
- `data-cli-show-labels` - Show min/max labels: `true`/`false`
- `data-cli-show-value-position` - Value position: `inline`, `above`, `below`
- `data-cli-label-color` - Label color

**Example Usage:**
```html
<input type="range"
       min="0" max="100" value="50"
       data-cli-show-labels="true"
       data-cli-show-value-position="above">
```

**Output:**
```
       50
0 ██████████░░░░░░░░░░ 100
```

#### 12.5 Button States
**Priority:** MEDIUM

Enhanced button states and styles.

**New Attributes:**
- `data-cli-button-style` - Style: `simple`, `filled`, `outline`, `3d`
- `data-cli-button-state` - State: `normal`, `hover`, `active`, `loading`
- `data-cli-loading-marker` - Loading indicator (default: `⟳`)

**Example Usage:**
```html
<button data-cli-button-style="filled" data-cli-button-state="loading">
  Submit
</button>
```

**Output:**
```
[ ⟳ Submit ]
```

---

## 13. Select

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/select.js`

### Current Features
- Multiple selection support
- Custom markers for selected/unselected options
- Optgroup support with custom indicators
- Color customization for options and groups
- Disabled state support
- Label/name display with prefix/suffix

### Suggested New Features

#### 13.1 Search/Filter Indicator
**Priority:** MEDIUM

Show that options can be filtered.

**New Attributes:**
- `data-cli-searchable` - Mark as searchable: `true`/`false`
- `data-cli-search-marker` - Search indicator (default: `🔍`)
- `data-cli-search-placeholder` - Placeholder text

**Example Usage:**
```html
<select data-cli-searchable="true" data-cli-search-placeholder="Type to filter...">
  ...
</select>
```

**Output:**
```
Country: 🔍 Type to filter...
○ United States
○ Canada
○ Mexico
```

#### 13.2 Option Count Display
**Priority:** LOW

Show total/selected option counts.

**New Attributes:**
- `data-cli-show-count` - Show counts: `true`/`false`
- `data-cli-count-format` - Format: `selected`, `total`, `both`
- `data-cli-count-position` - Position: `title`, `bottom`

**Example Usage:**
```html
<select multiple
        data-cli-show-count="true"
        data-cli-count-format="both">
  <option selected>Item 1</option>
  <option>Item 2</option>
  <option selected>Item 3</option>
</select>
```

**Output:**
```
Items (2/3 selected):
◉ Item 1
○ Item 2
◉ Item 3
```

#### 13.3 Option Descriptions
**Priority:** LOW

Add descriptions under options.

**New Attributes (for `option`):**
- `data-cli-description` - Description text
- `data-cli-description-color` - Description color (default: `gray`)
- `data-cli-description-indent` - Indentation for description

**Example Usage:**
```html
<select>
  <option data-cli-description="Fast and efficient">Standard Shipping</option>
  <option data-cli-description="Arrives tomorrow">Express Shipping</option>
</select>
```

**Output:**
```
○ Standard Shipping
  Fast and efficient
○ Express Shipping
  Arrives tomorrow
```

---

## 14. Progress/Meter

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/progress.js`

### Current Features
- Filled and empty marker customization
- Color customization for filled/empty sections
- Value and max attribute support
- Automatic ratio calculation
- Meter with threshold support

### Suggested New Features

#### 14.1 Percentage/Value Display
**Priority:** HIGH

Show progress percentage or values.

**New Attributes:**
- `data-cli-show-percentage` - Show percentage: `true`/`false`
- `data-cli-show-value` - Show value: `true`/`false`
- `data-cli-value-position` - Position: `right`, `left`, `center`, `above`, `below`
- `data-cli-value-format` - Format: `percentage`, `fraction`, `both`

**Example Usage:**
```html
<progress value="75" max="100"
          data-cli-show-percentage="true"
          data-cli-value-position="right">
</progress>
```

**Output:**
```
 ███████████████░░░░░ 75%
```

#### 14.2 Threshold Colors for Meter
**Priority:** HIGH

Automatic color changes based on thresholds.

**New Attributes:**
- `data-cli-low-color` - Color when value < low (default: `red`)
- `data-cli-mid-color` - Color when low <= value < high (default: `yellow`)
- `data-cli-high-color` - Color when value >= high (default: `green`)
- `data-cli-auto-color` - Enable automatic coloring: `true`/`false`

**Example Usage:**
```html
<meter value="30" min="0" max="100" low="30" high="70"
       data-cli-auto-color="true">
</meter>
```

#### 14.3 Label/Title Display
**Priority:** MEDIUM

Add labels to progress bars.

**New Attributes:**
- `data-cli-label` - Label text
- `data-cli-label-position` - Position: `left`, `above`
- `data-cli-label-color` - Label color

**Example Usage:**
```html
<progress value="60" max="100"
          data-cli-label="Upload Progress"
          data-cli-label-position="above">
</progress>
```

**Output:**
```
Upload Progress
 ████████████░░░░░░░░
```

#### 14.4 Multi-Segment Progress
**Priority:** LOW

Show multiple segments in one progress bar.

**New Attributes:**
- `data-cli-segments` - Segment values (comma-separated)
- `data-cli-segment-colors` - Colors for each segment (comma-separated)
- `data-cli-segment-labels` - Labels for segments

**Example Usage:**
```html
<progress data-cli-segments="30,20,10"
          data-cli-segment-colors="green,yellow,red"
          max="100">
</progress>
```

**Output:**
```
 ██████░░░░░█
```

#### 14.5 Indeterminate State
**Priority:** LOW

Support for indeterminate/loading state.

**New Attributes:**
- `data-cli-indeterminate` - Indeterminate mode: `true`/`false`
- `data-cli-indeterminate-marker` - Marker for animation (default: `⣾`)
- `data-cli-indeterminate-style` - Style: `spinner`, `pulse`, `dots`

**Example Usage:**
```html
<progress data-cli-indeterminate="true" data-cli-indeterminate-style="spinner">
</progress>
```

---

## 15. Address

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/address.js`

### Current Features
- Color customization
- Block-level display

### Suggested New Features

#### 15.1 Address Format Indicators
**Priority:** MEDIUM

Visual formatting for different address types.

**New Attributes:**
- `data-cli-format` - Format: `postal`, `email`, `phone`, `multi-line`
- `data-cli-show-icon` - Show type icon: `true`/`false`
- `data-cli-icon` - Custom icon
- `data-cli-postal-icon` - Postal address icon (default: `📍`)
- `data-cli-email-icon` - Email icon (default: `✉`)
- `data-cli-phone-icon` - Phone icon (default: `📞`)

**Example Usage:**
```html
<address data-cli-format="email" data-cli-show-icon="true">
  support@example.com
</address>
```

**Output:**
```
✉ support@example.com
```

#### 15.2 Structured Address Display
**Priority:** MEDIUM

Better formatting for postal addresses.

**New Attributes:**
- `data-cli-indent-lines` - Indent continuation lines: `true`/`false`
- `data-cli-line-prefix` - Prefix for each line
- `data-cli-separator` - Separator between address parts

**Example Usage:**
```html
<address data-cli-indent-lines="true" data-cli-line-prefix="  ">
  John Doe<br>
  123 Main Street<br>
  City, State 12345
</address>
```

**Output:**
```
  John Doe
  123 Main Street
  City, State 12345
```

#### 15.3 QR Code/vCard Hint
**Priority:** LOW

Indicate that contact info could be encoded.

**New Attributes:**
- `data-cli-show-vcard-hint` - Show vCard hint: `true`/`false`
- `data-cli-vcard-marker` - vCard indicator (default: `[vCard]`)

---

## 16. Definitions (dl/dt/dd)

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/definitions.js`

### Current Features
- Color customization for dl, dt, dd
- Indentation for dd elements
- Margin control

### Suggested New Features

#### 16.1 Definition List Styles
**Priority:** MEDIUM

Different layout styles for definition lists.

**New Attributes:**
- `data-cli-layout` - Layout: `default`, `compact`, `table`, `inline`
- `data-cli-separator` - Separator between term and definition (for inline mode)
- `data-cli-separator-color` - Separator color

**Example Usage:**
```html
<dl data-cli-layout="inline" data-cli-separator=" : ">
  <dt>Name</dt><dd>John Doe</dd>
  <dt>Age</dt><dd>30</dd>
</dl>
```

**Output:**
```
Name : John Doe
Age : 30
```

#### 16.2 Term Markers
**Priority:** MEDIUM

Add markers or bullets to terms.

**New Attributes (for `dt`):**
- `data-cli-marker` - Marker before term (default: none)
- `data-cli-marker-color` - Marker color
- `data-cli-show-colon` - Show colon after term: `true`/`false`

**Example Usage:**
```html
<dl>
  <dt data-cli-marker="▸" data-cli-show-colon="true">Term</dt>
  <dd>Definition</dd>
</dl>
```

**Output:**
```
▸ Term:
  Definition
```

#### 16.3 Multi-Definition Indicators
**Priority:** LOW

Show when a term has multiple definitions.

**New Attributes:**
- `data-cli-multi-indicator` - Indicator for multiple definitions
- `data-cli-number-definitions` - Number definitions: `true`/`false`

**Example Usage:**
```html
<dl>
  <dt>Java</dt>
  <dd data-cli-multi-indicator="1.">Programming language</dd>
  <dd data-cli-multi-indicator="2.">Indonesian island</dd>
</dl>
```

**Output:**
```
Java
  1. Programming language
  2. Indonesian island
```

---

## 17. Image

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/img.js`

### Current Features
- Alt/title text display
- Custom markers (prefix, open, close)
- Color customization for markers and text

### Suggested New Features

#### 17.1 Dimension Display
**Priority:** MEDIUM

Show image dimensions when available.

**New Attributes:**
- `data-cli-show-dimensions` - Show dimensions: `true`/`false`
- `data-cli-dimension-format` - Format: `wxh`, `descriptive`, `both`
- `data-cli-dimension-color` - Dimension text color

**Example Usage:**
```html
<img src="photo.jpg"
     alt="Photo"
     width="1920" height="1080"
     data-cli-show-dimensions="true">
```

**Output:**
```
![Photo] (1920x1080)
```

#### 17.2 Image Type Indicators
**Priority:** LOW

Show file type or format.

**New Attributes:**
- `data-cli-show-type` - Show file type: `true`/`false`
- `data-cli-type-from` - Source: `extension`, `attribute`
- `data-cli-type-color` - Type label color

**Example Usage:**
```html
<img src="diagram.svg"
     alt="Diagram"
     data-cli-show-type="true"
     data-cli-type-from="extension">
```

**Output:**
```
![Diagram] (SVG)
```

#### 17.3 Broken Image Indicator
**Priority:** LOW

Visual indicator for broken/missing images.

**New Attributes:**
- `data-cli-broken` - Mark as broken: `true`/`false`
- `data-cli-broken-marker` - Broken indicator (default: `✗`)
- `data-cli-broken-color` - Broken indicator color (default: `red`)

**Example Usage:**
```html
<img src="missing.jpg"
     alt="Missing"
     data-cli-broken="true">
```

**Output:**
```
✗[Missing]
```

---

## 18. Ruby

**File:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/ruby.js`

### Current Features
- Ruby text (rt) displayed in parentheses
- Color customization for ruby and rt elements
- Ruby parenthesis (rp) hidden

### Suggested New Features

#### 18.1 Annotation Position
**Priority:** MEDIUM

Allow annotations above or inline.

**New Attributes:**
- `data-cli-position` - Position: `inline`, `above`, `below`
- `data-cli-separator` - Separator for inline mode (default: ` `)

**Example Usage:**
```html
<ruby data-cli-position="above">
  漢字
  <rt>kanji</rt>
</ruby>
```

**Output (simulated):**
```
  kanji
  漢字
```

#### 18.2 Annotation Styles
**Priority:** LOW

Different styles for annotations.

**New Attributes:**
- `data-cli-style` - Style: `parentheses`, `brackets`, `superscript`, `subscript`
- `data-cli-open-marker` - Custom opening marker
- `data-cli-close-marker` - Custom closing marker

---

## 19. Span/Center

**Files:** `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/span.js`, `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/center.js`

### Current Features
- Color customization
- Center alignment for center tag
- Block/inline variants

### Suggested New Features

#### 19.1 Highlight/Background Effects
**Priority:** MEDIUM

Add background-like effects for spans.

**New Attributes:**
- `data-cli-effect` - Effect: `none`, `highlight`, `box`, `underline`
- `data-cli-effect-char` - Character for effect (default: `░`)
- `data-cli-effect-color` - Effect color

**Example Usage:**
```html
<span data-cli-effect="highlight" data-cli-effect-color="yellow">
  Important text
</span>
```

#### 19.2 Alignment Options
**Priority:** LOW

Add right alignment option.

**New Attributes (for span when in block context):**
- `data-cli-align` - Alignment: `left`, `center`, `right`

---

## Summary of Priority Levels

### High Priority Features (Quick Wins & High Impact)

1. **Table**: Row highlighting, column styling, row numbering
2. **List**: Task/checkbox lists, status indicators, item highlighting
3. **Headers**: Underline styles, header numbering, icon support
4. **HR**: Text labels in horizontal rules
5. **Blockquote**: Citation/attribution support
6. **Fieldset**: Required field indicators, validation states
7. **Inputs**: Validation states, required field indicators
8. **Progress**: Percentage/value display, threshold colors for meter
9. **Text Styles (kbd)**: Enhanced keyboard shortcut visualization

### Medium Priority Features (Nice to Have)

1. **Table**: Border customization
2. **List**: Priority indicators, numbered progress
3. **Details**: Nested level indicators, title badges
4. **Figure**: Image placeholders/ASCII art
5. **Headers**: Icon/emoji prefix
6. **HR**: Gradient/pattern styles, partial width
7. **Blockquote**: Multi-line marker styles
8. **Various**: Search/filter indicators, label displays

### Low Priority Features (Future Enhancements)

1. Various decorative enhancements
2. Advanced styling options
3. Specialized display modes
4. Integration hints (QR codes, vCards, etc.)

---

## Implementation Notes

### Common Patterns to Reuse

1. **Marker System** (from code.js): Use for numbering, bullets, indicators
2. **Color Functions**: Consistent `chalkString` usage with theme fallbacks
3. **Prefix/Suffix Pattern**: Common across abbr, kbd, samp - standardize
4. **State Indicators**: Success/warning/error/info color schemes
5. **Line Highlighting**: The range parsing logic from code.js (e.g., "1,3,5-7")
6. **Position Options**: Top/bottom/both pattern for labels and indicators

### Accessibility Considerations

- Ensure visual indicators have text equivalents
- Maintain clear contrast in color choices
- Provide fallbacks for unicode characters
- Keep layouts readable in monochrome terminals

### Theme Integration

All new attributes should:
- Support theme defaults
- Allow custom attribute overrides
- Use consistent naming conventions: `data-cli-*`
- Provide fallback values when theme is incomplete

---

## Next Steps

1. **Phase 1**: Implement high-priority features for most-used tags (table, list, headers)
2. **Phase 2**: Add validation and state indicators across input elements
3. **Phase 3**: Enhance visual styling (borders, patterns, decorations)
4. **Phase 4**: Advanced features (multi-segment displays, complex layouts)

Each feature should include:
- Unit tests
- Example HTML files in `/examples/html/tags-custom/`
- Theme configuration documentation
- Type definitions in `index.d.ts`

---

*Generated: 2025-12-09*
*Based on analysis of: `/home/grigorii/Projects/GitHub/grigorii-horos/cli-html/lib/tags/`*
