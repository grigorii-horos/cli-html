# API Standardization Guide

This document defines the standardized API for customizing HTML elements in cli-html.

## Naming Conventions

**Consistent naming across all elements:**

- **`indicator`** - Visual markers that indicate state or grouping
  - Used in: `optgroup` (group prefix), `details` (open/closed toggle)
  - Format: `{ marker: string, color: string }` or `{ open: { marker, color }, closed: { marker, color } }`
  - Examples: `▸` for optgroup, `▼`/`▶` for details
  - **Important:** Always use `{ marker, color }` objects, not plain strings

- **`indicators`** - List item markers (plural for multiple types)
  - Used in: `ol` (ordered lists), `ul` (unordered lists)
  - Format: Object with multiple marker styles, each with `{ marker, color }`
  - Examples: `•`, `○`, `1.`, `I.`
  - Note: Use plural `indicators` to distinguish from single `indicator`

- **`prefix`/`suffix`** - Text wrapping markers
  - Used in: `kbd`, `samp`, `sub`, `sup`, `select`, `a.title`
  - Format: `{ marker: string, color: string }`
  - Examples: `[` and `]` for kbd, `' ('` and `')'` for a.title

**Why this structure?**
- ✅ Avoids redundancy (`indicator.marker` instead of `marker.marker`)
- ✅ Clear semantic meaning for each term
- ✅ Consistent across all elements (`indicator` for single, `indicators` for collections)
- ✅ Easy to extend with additional properties
- ✅ Backwards compatible (old `markers` key still works)

---

## 1. Border API

All block-level elements that support borders should use this unified structure:

### Theme Configuration

```yaml
<element>:
  border:
    enabled: true          # Optional - whether to show border (default: true if border exists)
    color: colorName       # Border color (chalk-string format)
    style: styleName       # Border style: single, double, round, bold, classic
    dim: false             # Whether to dim the border (default: false)
```

### Data Attributes

```html
<element data-cli-border="colorName">
<element data-cli-border-style="single|double|round|bold|classic">
<element data-cli-border-dim="true|false">
```

### Applicable Elements

- `figure`
- `fieldset`
- `details`
- `table` (new)
- Future block elements

---

## 2. Marker Naming Convention

### 2.1 Linear Markers (Single Character/String)

Used for: separators, list bullets, line markers

**Theme Configuration:**
```yaml
<element>:
  marker: "─"              # The marker character(s)
  markerColor: colorName   # Optional - separate color for marker (if different from text)
```

**Data Attributes:**
```html
<element data-cli-marker="─">
<element data-cli-marker-color="colorName">
```

**Applicable Elements:**
- `hr` - horizontal rule marker
- `h1-h6` - header prefix marker
- `blockquote` - left border marker
- `ul` markers - disc/square/circle
- `ol` markers - 1/A/a/I/i

---

### 2.2 Wrapping Markers (Prefix/Suffix)

Used for: elements that wrap content with opening/closing characters

**Theme Configuration (Nested Format - PREFERRED):**
```yaml
<element>:
  prefix:
    marker: "("            # Opening character(s)
    color: colorName       # Optional - prefix color
  suffix:
    marker: ")"            # Closing character(s)
    color: colorName       # Optional - suffix color
```

**Theme Configuration (Flat Format - Legacy):**
```yaml
<element>:
  prefix: "("              # Opening character(s)
  prefixColor: colorName   # Optional - prefix color
  suffix: ")"              # Closing character(s)
  suffixColor: colorName   # Optional - suffix color
```

**Data Attributes:**
```html
<element data-cli-prefix="(">
<element data-cli-prefix-color="colorName">
<element data-cli-suffix=")">
<element data-cli-suffix-color="colorName">
```

**Applicable Elements:**
- `kbd` - keyboard input brackets
- `samp` - sample output markers
- `sub` - subscript markers
- `sup` - superscript markers
- `abbr` title - already uses titlePrefixMarker/titleSuffixMarker (keep for compatibility)

**Why Nested Format?**
- ✅ More consistent with other nested structures (border, href, title)
- ✅ Easier to extend with additional properties
- ✅ Better YAML readability and organization
- ✅ Backwards compatible (flat format still works)

---

### 2.3 Complex Markers (Multiple Parts)

Used for: elements with multiple visual components

**Theme Configuration:**
```yaml
<element>:
  open:                    # Opening marker
    marker: "["
    color: colorName
  close:                   # Closing marker
    marker: "]"
    color: colorName
  checked:                 # State-specific markers
    marker: "✓"
    color: colorName
  unchecked:
    marker: " "
    color: colorName
```

**Data Attributes:**
```html
<element data-cli-open-marker="[">
<element data-cli-open-color="colorName">
<element data-cli-close-marker="]">
<element data-cli-close-color="colorName">
```

**Applicable Elements:**
- `checkbox` - uses open/close/checked/unchecked
- `radio` - uses open/close/checked/unchecked
- `button` - uses open/close
- `details` - could use open/closed for summary marker

---

## 3. Padding API

All elements that support padding should use this unified structure:

### Theme Configuration

```yaml
<element>:
  padding:
    top: 0                 # Number of lines above
    bottom: 0              # Number of lines below
    left: 1                # Number of spaces/chars left
    right: 1               # Number of spaces/chars right
```

### Data Attributes

```html
<element data-cli-padding-top="0">
<element data-cli-padding-bottom="0">
<element data-cli-padding-left="1">
<element data-cli-padding-right="1">
```

### Applicable Elements

- `figure` (current: uses boxen padding)
- `fieldset` (current: uses boxen padding)
- `details` (current: uses boxen padding)
- `code` blocks (current: only left padding)
- `table` cells (new)
- `select` (new)

---

## 4. Color API

### 4.1 Basic Color

Simple color application to entire element:

```yaml
<element>:
  color: colorName         # chalk-string format
```

```html
<element data-cli-color="colorName">
```

---

### 4.2 Multi-Part Color

Elements with multiple visual parts:

```yaml
<element>:
  color: colorName         # Main content color
  markerColor: colorName   # Marker-specific color
  borderColor: colorName   # Border-specific color
```

```html
<element data-cli-color="colorName">
<element data-cli-marker-color="colorName">
<element data-cli-border-color="colorName">
```

---

## 5. Display Options API

**IMPORTANT: Use nested structure format - DO NOT use flat naming like `showHref`, `hrefColor`, `titlePrefix`, etc.**

### Theme Configuration (Nested Format - REQUIRED)

```yaml
<element>:
  <feature>:
    enabled: false         # Boolean flag to show/hide feature
    color: colorName       # Color for the feature
    prefix: "("            # Prefix for the feature (if applicable)
    suffix: ")"            # Suffix for the feature (if applicable)
    marker: "•"            # Marker for the feature (if applicable)
```

### Data Attributes

```html
<element data-cli-show-<feature>="true|false">
<element data-cli-<feature>-color="colorName">
<element data-cli-<feature>-prefix="(">
<element data-cli-<feature>-suffix=")">
```

### Examples

**Links (a tag):**
```yaml
a:
  color: blue underline
  href:
    enabled: false         # Show URL in brackets
    color: gray            # Color for displayed URL
  title:
    enabled: false         # Show title attribute
    color: yellow          # Color for title text
    prefix:
      marker: ' ('         # Prefix for title
      color: yellow        # Prefix color
    suffix:
      marker: ')'          # Suffix for title
      color: yellow        # Suffix color
```

```html
<a href="url" title="Title"
   data-cli-show-href="true"
   data-cli-href-color="blue"
   data-cli-show-title="true"
   data-cli-title-color="cyan"
   data-cli-title-prefix="["
   data-cli-title-prefix-color="red"
   data-cli-title-suffix="]"
   data-cli-title-suffix-color="green">
```

**Input File:**
```yaml
input:
  file:
    prefix:
      marker: 📎           # File icon
      color: gray          # Icon color
    text:
      color: cyan          # Filename color
    placeholder: No file chosen
```

**Why Nested Format?**
- ✅ Groups related properties logically
- ✅ Easier to extend with new properties
- ✅ More readable and maintainable
- ✅ Consistent with other complex structures (border, marker)
- ❌ DO NOT use flat naming like `prefixColor`, `textColor` at root level

---

## 6. State-Based Configuration

For elements with multiple states (open/closed, selected/unselected, etc.):

### Theme Configuration

```yaml
<element>:
  <state1>:
    marker: "▶"
    color: colorName
  <state2>:
    marker: "▼"
    color: colorName
```

### Data Attributes

```html
<element data-cli-<state1>-marker="▶">
<element data-cli-<state1>-color="colorName">
```

### Examples

**Details/Summary:**
```yaml
details:
  indicator:
    closed:
      marker: "▶ "
      color: gray
    open:
      marker: "▼ "
      color: gray
```

**Select/Option:**
```yaml
option:
  selected:
    marker: "✓ "
    color: green bold
  unselected:
    marker: "  "
    color: ""
```

---

## 7. Migration Plan

### Phase 1: Add New Standardized Properties (Backward Compatible)

1. Keep existing properties for compatibility
2. Add new standardized properties alongside
3. Update code to prefer new properties over old

**Example:**
```yaml
# Old (keep for compatibility)
details:
  marker: '> '

# New (preferred)
details:
  marker:
    closed: '▶ '
    open: '▼ '
```

### Phase 2: Update Documentation

1. Document new standardized API
2. Mark old properties as deprecated
3. Show migration examples

### Phase 3: Deprecation (Future Version)

1. Show warnings for old property usage
2. Provide migration guide
3. Eventually remove old properties in major version

---

## 8. Property Naming Convention

### Capitalization

- Theme properties: camelCase (`showHref`, `titleColor`)
- Data attributes: kebab-case (`data-cli-show-href`, `data-cli-title-color`)

### Naming Pattern

- Boolean flags: `show<Feature>`, `enable<Feature>`, `<feature>Enabled`
- Colors: `<element>Color`, `<part>Color`
- Markers: `<state>Marker`, `marker`, `prefix`, `suffix`
- Dimensions: `<side>` (top, bottom, left, right), `width`, `height`

---

## 9. Backward Compatibility

All existing configurations must continue to work. When adding new features:

1. ✅ DO add new optional properties
2. ✅ DO support both old and new naming
3. ✅ DO prefer new properties when both exist
4. ❌ DON'T break existing configurations
5. ❌ DON'T remove old properties without deprecation cycle

---

## 10. Complete Example

```yaml
theme:
  # Simple element with standardized API
  kbd:
    color: cyan
    prefix: "["
    prefixColor: gray
    suffix: "]"
    suffixColor: gray

  # Complex element with states
  details:
    border:
      enabled: true
      color: cyan
      style: round
      dim: false
    marker:
      closed: "▶ "
      open: "▼ "
    padding:
      top: 0
      bottom: 0
      left: 1
      right: 1

  # Element with display options
  a:
    color: blue underline
    showHref: false
    hrefColor: gray
    showTitle: false
    titleColor: yellow
    titlePrefix: "("
    titleSuffix: ")"

  # Table with detailed customization
  table:
    border:
      enabled: true
      color: gray
      style: single
    th:
      color: cyan bold
      padding:
        left: 1
        right: 1
    td:
      color: white
      padding:
        left: 1
        right: 1
    tr:
      color: ""
      alternating:
        enabled: false
        colors: ["", "gray dim"]
```

---

This standardization ensures consistency, predictability, and ease of use across all HTML elements in cli-html.

---

## 7. Form Element API - Select, Option, Optgroup

The select element and its children (option, optgroup) have been restructured to follow nested formatting.

### 7.1 Select Element

Controls the appearance of the select container and its name/label.

**Theme Configuration:**
```yaml
select:
  color: cyan bold          # Color for select name text
  prefix:
    marker: ''              # Prefix before select name
    color: ''               # Prefix color
  suffix:
    marker: ':'             # Suffix after select name (default: colon)
    color: cyan bold        # Suffix color
```

**Data Attributes:**
```html
<select name="example"
  data-cli-color="red bold"           # Select name color
  data-cli-prefix=">> "               # Custom prefix
  data-cli-prefix-color="yellow"      # Prefix color
  data-cli-suffix=" <<"               # Custom suffix
  data-cli-suffix-color="green"       # Suffix color
  data-cli-select-label="Custom">     # Override name text
```

**Example:**
```html
<select name="country" 
  data-cli-color="blue bold"
  data-cli-prefix="→ "
  data-cli-prefix-color="yellow"
  data-cli-suffix=" ←"
  data-cli-suffix-color="green">
  <option>USA</option>
  <option selected>Canada</option>
</select>
```

Output: `→ country ←` where `→` is yellow, `country` is blue bold, `←` is green

---

### 7.2 Option Element

Controls the appearance of individual options within a select.

**Theme Configuration:**
```yaml
option:
  color: ''                 # Default color for option text
  selected:
    marker: '◉'             # Marker for selected options
    color: green bold       # Color for selected marker
  unselected:
    marker: '○'             # Marker for unselected options
    color: gray             # Color for unselected marker
```

**Data Attributes:**
```html
<option data-cli-color="yellow">              # Option text color
<select 
  data-cli-selected-marker="✓"                # Custom selected marker
  data-cli-selected-color="green bold"        # Selected marker color
  data-cli-unselected-marker="✗"              # Custom unselected marker
  data-cli-unselected-color="red dim">        # Unselected marker color
```

**Important Notes:**
- The `color` attribute on `<option>` controls the **option text** color
- Marker customization is done on the `<select>` element (applies to all options)
- Individual options can have custom text colors via `data-cli-color`

**Example:**
```html
<select name="items"
  data-cli-selected-marker="✓"
  data-cli-selected-color="green bold">
  <option data-cli-color="yellow">Yellow option</option>
  <option selected data-cli-color="cyan">Cyan selected</option>
</select>
```

Output:
```
items:
○ Yellow option    (yellow text)
✓ Cyan selected    (green ✓ marker, cyan text)
```

---

### 7.3 Optgroup Element

Controls the appearance of option groups within a select.

**Theme Configuration:**
```yaml
optgroup:
  color: cyan bold          # Default color for entire optgroup
  indicator:
    marker: '▸ '            # Group indicator/prefix
    color: cyan bold        # Indicator color
  label:
    color: cyan bold        # Label text color (overrides optgroup.color)
```

**Data Attributes:**
```html
<optgroup label="Group Name"
  data-cli-color="red bold"           # Applies to label text
  data-cli-marker="→ "                # Custom group marker
  data-cli-marker-color="blue">       # Marker color
```

**Color Priority:**
- Indicator: `data-cli-marker-color` > `optgroup.indicator.color` > `optgroup.color`
- Label: `data-cli-color` > `optgroup.label.color` > `optgroup.color`

**Example:**
```html
<select name="tech">
  <optgroup label="Frontend"
    data-cli-marker="→ "
    data-cli-marker-color="blue bold"
    data-cli-color="cyan">
    <option>React</option>
    <option selected>Vue</option>
  </optgroup>
  <optgroup label="Backend"
    data-cli-color="green bold">
    <option>Node.js</option>
  </optgroup>
</select>
```

Output:
```
tech:
→ Frontend          (blue → marker, cyan label)
  ○ React
  ◉ Vue
▸ Backend           (default ▸ marker, green label)
  ○ Node.js
```

---

### 7.4 Why This Structure?

**Separation of Concerns:**
- `select` - controls the container and name display
- `option` - controls individual option appearance and selection markers
- `optgroup` - controls group organization and labeling

**Nested Structure Benefits:**
- ✅ Logical grouping of related properties (indicator.marker + indicator.color)
- ✅ Consistent with other elements (a.title, input.file, etc.)
- ✅ Easier to extend with new properties
- ✅ More readable YAML configuration
- ✅ Clear naming: `indicator` for visual markers, `bullet` for list items

**Backwards Compatibility:**
- Old flat format still works internally via `parseStyleEntry`
- Data attributes remain flat for simplicity
- Config YAML uses nested structure for better organization

---

## 8. Disabled State API

All form elements and relevant tags support the `disabled` attribute, which applies gray dim styling to indicate non-interactive state.

### 8.1 Supported Elements

**Input Types:**
- `<button>` - Disabled buttons
- `<input type="button">` - Disabled input buttons
- `<input type="checkbox">` - Disabled checkboxes (checked or unchecked)
- `<input type="radio">` - Disabled radio buttons (checked or unchecked)
- `<input type="text">` - Disabled text inputs (and all text-like types: email, password, search, url, tel, number, date, etc.)
- `<input type="range">` - Disabled range sliders
- `<input type="color">` - Disabled color pickers
- `<input type="file">` - Disabled file inputs
- `<textarea>` - Disabled text areas

**Container Elements:**
- `<fieldset>` - Disables entire fieldset including border and all contents
- `<optgroup>` - Disables group label and all child options (inherited)
- `<option>` - Disables individual options

### 8.2 Usage

**HTML Attribute:**
```html
<input type="text" value="Cannot edit" disabled>
<button disabled>Cannot click</button>
<textarea disabled>Cannot modify</textarea>
```

**Inheritance:**
```html
<!-- All options inherit disabled from optgroup -->
<select name="test">
  <optgroup label="Disabled Group" disabled>
    <option>Disabled by parent</option>
    <option>Also disabled by parent</option>
  </optgroup>
</select>

<!-- All inputs inherit disabled from fieldset -->
<fieldset disabled>
  <legend>Disabled Fieldset</legend>
  <input type="text" value="Cannot edit">
  <input type="checkbox"> Cannot check
</fieldset>
```

### 8.3 Styling

**Default Behavior:**
- Disabled state applies `gray dim` styling using chalkString
- ANSI codes: `[90m[2m...[22m[39m`
- Overrides all other color styling when disabled
- Applied to entire element output (markers, borders, text)

**Examples:**

Normal button:
```
[ Click me ]
```

Disabled button:
```
[90m[2m[ Click me ][22m[39m
```

Normal checkbox:
```
[✓] Active
```

Disabled checkbox:
```
[90m[2m[✓][22m[39m Disabled
```

**Why Gray Dim?**
- ✅ Universal indicator of non-interactive state
- ✅ Consistent across all input types
- ✅ Clearly distinguishable from active elements
- ✅ Follows common UI patterns for disabled states

---

