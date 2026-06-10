# Demo Content Plan

**Goal:** Create and update example files that serve as both test datasets (all tag variants + customizations) and user showcase (realistic content), covering HTML tag examples, full HTML pages, and markdown documents.

**Philosophy:** Each tag example file covers base usage + all meaningful variants + all `data-cli-*` attribute overrides. Full pages use realistic content that naturally exercises new features (dialog, media, ruby/rt, hr named styles, time datetime, q cite, dt suffix).

---

## Section 1: `examples/html/tags/` — tag test datasets

### Create new

#### `dialog.html`

Demonstrates `<dialog>` box border rendering.

Sections:
1. Default dialog (round border, cyan)
2. Border styles: single, double, bold, classic (one example each)
3. Border colors: green, magenta, yellow, red
4. Dim border: `data-cli-border-dim="true"`
5. Custom padding: `data-cli-padding-left="3"`
6. Combined: custom border + color + content
7. Nested content: dialog containing a list, headings, paragraphs

#### `media.html`

Demonstrates `<video>` and `<audio>` inline placeholder rendering.

Sections:
1. Basic video — no attributes (fallback title "Video")
2. Video with `src` — title extracted from filename
3. Video with `title` attribute — explicit title wins
4. Basic audio — no attributes
5. Audio with `src` and `title`
6. Custom indicator marker: `data-cli-indicator-marker="▶"`
7. Custom prefix/suffix: `data-cli-prefix-marker="[" data-cli-suffix-marker="]"`
8. Custom title color: `data-cli-title-color="cyan bold"`
9. Multiple media elements inline in paragraph text

### Update existing

#### `hr.html` — add Named Styles section

Add new section at top (before existing "Custom color" section):

```
## Named Styles (data-cli-style)
```

Show all 5 styles via `data-cli-style`: single, double, bold, dashed, dotted.
Show 5 combinations of style + color (e.g., `data-cli-style="double" data-cli-color="cyan"`).
Note: existing `data-cli-marker` examples remain — they override style.

#### `ruby.html` — add Custom Annotation Brackets section

Add new section:

```
## Custom Annotation Brackets (data-cli-prefix-marker / data-cli-suffix-marker)
```

Show:
- Square brackets: `data-cli-prefix-marker=" [" data-cli-suffix-marker="]"`
- Angle brackets: `data-cli-prefix-marker=" <" data-cli-suffix-marker=">"`
- No brackets (empty): `data-cli-prefix-marker="" data-cli-suffix-marker=""`
- Custom color: `data-cli-prefix-color="cyan" data-cli-suffix-color="cyan"`
- Combined: custom brackets + custom annotation color

#### `definitions.html` — add Custom Term Suffix section

Add new section:

```
## Custom Term Suffix (data-cli-suffix-marker)
```

Show:
- Default suffix `::` (from config)
- Custom suffix `→`: `data-cli-suffix-marker=" →"`
- Custom suffix `:` (simple colon)
- No suffix: `data-cli-suffix-marker=""`
- Custom suffix color: `data-cli-suffix-color="yellow"`
- Combined: custom suffix + term color

#### `text-styles.html` — add cite and datetime sections

Add two new sections:

**Section: `<q>` with cite attribute**
- Basic `<q>` (default quotes)
- Custom quotes via `data-cli-prefix-marker="«" data-cli-suffix-marker="»"`
- `<q cite="https://example.com">` — cite disabled by default (no marker shown)
- Same with `data-cli-cite-enabled="true"` — external marker appears
- `data-cli-cite-color="cyan"` — custom link color

**Section: `<time>` with datetime display**
- `<time>Today</time>` — datetime disabled by default
- `<time datetime="2026-06-10">Today</time>` with `data-cli-datetime-enabled="true"`
- Custom prefix/suffix: `data-cli-datetime-prefix-marker=" [" data-cli-datetime-suffix-marker="]"`
- Custom color: `data-cli-datetime-color="yellow"`
- ISO duration: `<time datetime="PT30M">30 minutes</time>`

---

## Section 2: `examples/html/full/` — 8 new full pages

Each page is a realistic HTML document using semantic HTML throughout. Each naturally incorporates new features (dialog, media, ruby/rt, hr named styles, time datetime, q cite, dt suffix) alongside existing elements (headings, lists, code, blockquote, table, fieldset, figure, etc.).

### `technical-article.html`

Article about a web technology (e.g., "The History of HTML"). Uses:
- `<ruby>` for terminology in original language (Japanese, Chinese)
- `<q cite="https://spec.example">` for spec quotations
- `<time datetime="1991-08-06">` for historical dates
- `<video title="Tim Berners-Lee interview">` inline reference
- `<hr data-cli-style="single">` between sections
- `<dialog>` for "Further Reading" expandable block
- `<dl><dt>` with suffix for term definitions
- `<code>`, `<pre>`, `<blockquote>`, `<figure>`, `<abbr>`, `<details>`

### `recipe.html`

Asian recipe (e.g., Japanese ramen or Chinese dumplings). Uses:
- `<ruby>` for dish names and ingredients in original script
- `<time datetime="PT45M">` for preparation/cooking times (ISO 8601 duration)
- `<audio title="pronunciation guide">` for ingredient pronunciation
- `<dl><dt data-cli-suffix-marker=" —">` for ingredient list
- `<q cite="https://source.example">` for recipe origin attribution
- `<dialog>` for chef tips and warnings
- `<hr data-cli-style="dashed">` between recipe steps
- `<ol>` for steps, `<figure>` for plating description, `<table>` for nutrition

### `changelog-full.html`

Software changelog (different name from existing `changelog.md`). Uses:
- `<time datetime="2026-06-10">` for release dates
- `<hr data-cli-style="double">` between major versions
- `<hr data-cli-style="dashed">` between minor versions
- `<q cite="https://github.com/example/issues/123">` for issue references
- `<dialog>` for migration notes
- `<dl><dt>` for breaking changes
- `<ins>`, `<del>` for added/removed features
- `<code>`, `<ul>`, `<details>`

### `glossary.html`

Technical glossary (e.g., typography or linguistics terms). Uses:
- `<ruby>` for term pronunciation (IPA or language of origin)
- `<audio title="pronunciation">` for audio pronunciation guide
- `<dl><dt>` with default suffix `::` for all terms
- `<q cite="https://source.example">` for authoritative definitions
- `<time datetime="1440">` for approximate historical dates
- `<hr data-cli-style="bold">` between alphabetical sections
- `<abbr>`, `<dfn>`, `<blockquote>`, `<details>`

### `author-profile.html`

Profile of a multilingual author/researcher. Uses:
- `<ruby>` for name in original script (e.g., Japanese, Arabic, Chinese)
- `<audio title="name pronunciation">` for name pronunciation
- `<q cite="https://interview.example">` for author quotes
- `<time datetime="2024-03-15">` for talk/publication dates
- `<video title="keynote recording">` for recorded presentations
- `<dialog>` for extended biography
- `<dl><dt>` for publications, affiliations, awards
- `<address>`, `<figure>`, `<table>`, `<ul>`, `<blockquote>`

### `news-article.html`

Breaking news or investigative article. Uses:
- `<time datetime="2026-06-10T09:30:00Z">` for publication and event timestamps
- `<q cite="https://source.example">` for direct quotes with attribution
- `<video title="press conference footage">` and `<audio title="interview clip">`
- `<hr data-cli-style="bold">` between major sections
- `<dialog>` for "Related Stories" block
- `<ruby>` for foreign proper nouns
- `<address>` for byline, `<figure>`, `<blockquote>`, `<details>`, `<abbr>`

### `museum-entry.html`

Museum catalog entry for an ancient artifact. Uses:
- `<ruby>` for artifact name in original script
- `<time datetime="-3000">` for archaeological dating
- `<q cite="https://catalog.museum.example">` for catalog descriptions
- `<audio title="curator audio guide">` for audio guide
- `<video title="3D model tour">` for virtual tour
- `<dialog>` for provenance and acquisition history
- `<dl><dt>` for metadata (material, dimensions, origin, current location)
- `<figure>`, `<blockquote>`, `<table>`, `<details>`

### `academic-paper.html`

Abstract and introduction of a linguistics research paper. Uses:
- `<ruby>` for linguistic examples in target language
- `<q cite="https://doi.example/10.xxxx">` for cited passages with DOI
- `<time datetime="2026-05-01">` for submission and acceptance dates
- `<hr data-cli-style="single">` between sections (Abstract, Introduction, etc.)
- `<dl><dt>` for paper metadata (authors, journal, keywords)
- `<dialog>` for footnotes/extended references
- `<figure>`, `<table>`, `<code>`, `<blockquote>`, `<abbr>`, `<sup>`

---

## Section 3: `examples/markdown/`

### features/ — 1 new file

#### `inline-html.md`

Demonstrates that HTML elements embedded in markdown are rendered correctly.

Sections:
1. Dialog box: `<dialog>...</dialog>` inline in markdown
2. Video/Audio inline: `<video title="Demo">`, `<audio title="Clip">`
3. Ruby annotations: `<ruby>漢字<rt>かんじ</rt></ruby>`
4. Time with datetime: `<time datetime="2026-06-10">Today</time>` with note that datetime display requires theme config
5. Quote with cite: `<q cite="https://example.com">Quote text</q>` with note about cite.enabled config
6. Combined: paragraph mixing markdown text with inline HTML elements

### full/ — 8 new files

**Mixed themes (4 shared with HTML, written in markdown + inline HTML where needed):**

#### `recipe.md`

Same recipe theme as `recipe.html`. Pure markdown structure (headings, lists, tables for nutrition) with inline HTML for `<ruby>` names and `<time>` durations. No `<dialog>` or `<audio>` (markdown-focused).

#### `glossary.md`

Glossary using markdown definition lists (`:` syntax via markdown-it-deflist). Inline `<ruby>` for pronunciation. Markdown `---` for letter dividers. `<q cite>` inline for authoritative definitions.

#### `news-article.md`

News article. Markdown headings, paragraphs, blockquotes. Inline `<time datetime>` for timestamps, `<q cite>` for direct quotes. `---` for section breaks.

#### `museum-entry.md`

Museum catalog entry. Markdown tables for metadata, blockquotes for catalog text, `<ruby>` inline for original-script names, `<time datetime>` for dates.

**Markdown-natural themes (4 unique to markdown):**

#### `contributing.md`

CONTRIBUTING guide for an open source project. Exercises: task lists, code blocks (multiple languages), tables, blockquote alerts, ordered lists with sub-lists, links, `---` dividers, `<kbd>` shortcuts, `<abbr>`.

#### `architecture.md`

Software architecture document. Exercises: multi-level headings, code blocks, definition lists, blockquotes for design decisions, tables for component comparison, `---` between major sections, footnotes, `<abbr>`.

#### `migration-guide.md`

Version migration guide (v4 → v5). Exercises: alerts (warning/info), `~~deleted~~` / `++inserted++` syntax, before/after code blocks, task checklists, tables for API changes, `<time datetime>` for deadlines.

#### `release-notes.md`

Release notes document (multiple versions). Pure markdown, no inline HTML. Exercises: headings hierarchy, `---` dividers, lists, inline code, links, task lists, `==highlighted==` terms, `~~deprecated~~` items.

---

## File count summary

| Category | Action | Count |
|----------|--------|-------|
| `examples/html/tags/` | Create | 2 |
| `examples/html/tags/` | Update | 4 |
| `examples/html/full/` | Create | 8 |
| `examples/markdown/features/` | Create | 1 |
| `examples/markdown/full/` | Create | 8 |
| **Total** | | **23** |

## Out of scope

- Screenshots (generated separately via `scripts/generate-screenshots.js`)
- Library usage examples (`examples/library-usage/`)
- Updating existing full pages (`blog.html`, `demo.html`, etc.)
- README updates
