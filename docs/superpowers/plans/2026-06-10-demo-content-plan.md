# Demo Content Plan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 17 new example files and update 4 existing ones — HTML tag test datasets, full HTML showcase pages, and markdown documents demonstrating all rendering features.

**Architecture:** Pure content creation — HTML fragments, complete HTML documents, and GFM markdown files. No code changes. Each task creates or updates one file and verifies rendering. Tasks are fully independent.

**Tech Stack:** HTML5, GFM markdown, `node bin/html.js <file>` for HTML verification, `node bin/markdown.js <file>` for markdown verification.

---

## File Map

| Action | File | Notes |
|--------|------|-------|
| UPDATE | `examples/html/tags/hr.html` | Add named styles section |
| UPDATE | `examples/html/tags/ruby.html` | Add annotation brackets section |
| UPDATE | `examples/html/tags/definitions.html` | Add dt suffix section |
| UPDATE | `examples/html/tags/text-styles.html` | Add q cite + time datetime sections |
| CREATE | `examples/html/tags/dialog.html` | New |
| CREATE | `examples/html/tags/media.html` | New |
| CREATE | `examples/html/full/technical-article.html` | New |
| CREATE | `examples/html/full/recipe.html` | New |
| CREATE | `examples/html/full/changelog-full.html` | New |
| CREATE | `examples/html/full/glossary.html` | New |
| CREATE | `examples/html/full/author-profile.html` | New |
| CREATE | `examples/html/full/news-article.html` | New |
| CREATE | `examples/html/full/museum-entry.html` | New |
| CREATE | `examples/html/full/academic-paper.html` | New |
| CREATE | `examples/markdown/features/inline-html.md` | New |
| CREATE | `examples/markdown/full/recipe.md` | New |
| CREATE | `examples/markdown/full/glossary.md` | New |
| CREATE | `examples/markdown/full/news-article.md` | New |
| CREATE | `examples/markdown/full/museum-entry.md` | New |
| CREATE | `examples/markdown/full/contributing.md` | New |
| CREATE | `examples/markdown/full/architecture.md` | New |
| CREATE | `examples/markdown/full/migration-guide.md` | New |
| CREATE | `examples/markdown/full/release-notes.md` | New |

---

## Task 1: Update hr.html — add named styles section

**Files:**
- Modify: `examples/html/tags/hr.html`

- [ ] **Step 1: Prepend named styles section**

Read current file. Add the following BEFORE the existing content (at the very top):

```html
<h2>Named Styles (data-cli-style)</h2>

<p>Single (default):</p>
<hr data-cli-style="single">

<p>Double:</p>
<hr data-cli-style="double">

<p>Bold:</p>
<hr data-cli-style="bold">

<p>Dashed:</p>
<hr data-cli-style="dashed">

<p>Dotted:</p>
<hr data-cli-style="dotted">

<p>Double + cyan color:</p>
<hr data-cli-style="double" data-cli-color="cyan">

<p>Bold + red color:</p>
<hr data-cli-style="bold" data-cli-color="red bold">

<p>Dashed + yellow color:</p>
<hr data-cli-style="dashed" data-cli-color="yellow">

<p>Dotted + magenta color:</p>
<hr data-cli-style="dotted" data-cli-color="magenta dim">

<p>Single + green:</p>
<hr data-cli-style="single" data-cli-color="green">

<h2>Custom Marker Override (data-cli-marker)</h2>

```

Then append the EXISTING content after the above (the existing content starts with the old `<h2>` about custom markers — replace its heading with the new one above so there's no duplicate `<h2>` opener).

The final file should start with the Named Styles section and flow into the existing custom marker/color examples.

- [ ] **Step 2: Verify**

```bash
node bin/html.js examples/html/tags/hr.html
```

Expected: renders without errors, shows 5 distinct line styles then colored examples.

- [ ] **Step 3: Commit**

```bash
git add examples/html/tags/hr.html
git commit -m "docs: add named hr styles examples"
```

---

## Task 2: Update ruby.html — add annotation brackets section

**Files:**
- Modify: `examples/html/tags/ruby.html`

- [ ] **Step 1: Append new section at end of file**

Add the following to the END of `examples/html/tags/ruby.html`:

```html

<h3>Custom Annotation Brackets (data-cli-prefix-marker / data-cli-suffix-marker)</h3>

<p>Square brackets:</p>
<p><ruby>漢字<rt data-cli-prefix-marker=" [" data-cli-suffix-marker="]">かんじ</rt></ruby></p>

<p>Angle brackets:</p>
<p><ruby>東京<rt data-cli-prefix-marker=" &lt;" data-cli-suffix-marker="&gt;">とうきょう</rt></ruby></p>

<p>No brackets (empty):</p>
<p><ruby>日本<rt data-cli-prefix-marker="" data-cli-suffix-marker="">にほん</rt></ruby></p>

<p>Colored brackets:</p>
<p><ruby>勉強<rt data-cli-prefix-marker=" (" data-cli-suffix-marker=")" data-cli-prefix-color="cyan" data-cli-suffix-color="cyan">べんきょう</rt></ruby></p>

<p>Custom brackets + annotation color:</p>
<p><ruby>富士山<rt data-cli-prefix-marker=" «" data-cli-suffix-marker="»" data-cli-color="yellow bold" data-cli-prefix-color="yellow" data-cli-suffix-color="yellow">ふじさん</rt></ruby></p>

<p>Multiple with different brackets in one sentence:</p>
<p>
  <ruby>私<rt data-cli-prefix-marker=" [" data-cli-suffix-marker="]">わたし</rt></ruby>は
  <ruby>学生<rt data-cli-prefix-marker=" [" data-cli-suffix-marker="]">がくせい</rt></ruby>です。
</p>
```

- [ ] **Step 2: Verify**

```bash
node bin/html.js examples/html/tags/ruby.html
```

Expected: renders without errors, new section shows ruby with bracket customizations.

- [ ] **Step 3: Commit**

```bash
git add examples/html/tags/ruby.html
git commit -m "docs: add rt annotation bracket customization examples"
```

---

## Task 3: Update definitions.html — add dt suffix section

**Files:**
- Modify: `examples/html/tags/definitions.html`

- [ ] **Step 1: Append new section at end of file**

Add the following to the END of `examples/html/tags/definitions.html`:

```html

<h3>Custom Term Suffix (data-cli-suffix-marker)</h3>

<p>Default suffix (:: from config):</p>
<dl>
  <dt>Term</dt>
  <dd>Default suffix applied automatically from config</dd>
</dl>

<p>Arrow suffix:</p>
<dl>
  <dt data-cli-suffix-marker=" →">HTML</dt>
  <dd>HyperText Markup Language</dd>
  <dt data-cli-suffix-marker=" →">CSS</dt>
  <dd>Cascading Style Sheets</dd>
</dl>

<p>Simple colon suffix:</p>
<dl>
  <dt data-cli-suffix-marker=":">JavaScript</dt>
  <dd>A programming language for the web</dd>
</dl>

<p>No suffix (empty string):</p>
<dl>
  <dt data-cli-suffix-marker="">Python</dt>
  <dd>A general-purpose programming language</dd>
  <dt data-cli-suffix-marker="">Rust</dt>
  <dd>A systems programming language focused on safety</dd>
</dl>

<p>Colored suffix:</p>
<dl>
  <dt data-cli-suffix-color="yellow">Go</dt>
  <dd>A statically typed, compiled language by Google</dd>
  <dt data-cli-suffix-color="cyan">TypeScript</dt>
  <dd>A typed superset of JavaScript</dd>
</dl>

<p>Custom suffix + term color:</p>
<dl>
  <dt data-cli-color="magenta bold" data-cli-suffix-marker=" ▸" data-cli-suffix-color="magenta">Node.js</dt>
  <dd>JavaScript runtime built on Chrome's V8 engine</dd>
  <dt data-cli-color="cyan bold" data-cli-suffix-marker=" ▸" data-cli-suffix-color="cyan">Deno</dt>
  <dd>A modern runtime for JavaScript and TypeScript</dd>
</dl>
```

- [ ] **Step 2: Verify**

```bash
node bin/html.js examples/html/tags/definitions.html
```

Expected: renders without errors, new section shows dt with various suffix styles.

- [ ] **Step 3: Commit**

```bash
git add examples/html/tags/definitions.html
git commit -m "docs: add dt suffix customization examples"
```

---

## Task 4: Update text-styles.html — add q cite and time datetime sections

**Files:**
- Modify: `examples/html/tags/text-styles.html`

- [ ] **Step 1: Append two new sections at end of file**

Add the following to the END of `examples/html/tags/text-styles.html`:

```html

<h3>Quote with Cite Attribute (data-cli-cite-enabled)</h3>

<p>Default — double quotes, no cite indicator:</p>
<p><q>To be or not to be, that is the question.</q></p>

<p>Custom prefix/suffix markers:</p>
<p><q data-cli-prefix-marker="«" data-cli-suffix-marker="»">Veni, vidi, vici.</q></p>

<p>With cite attr — disabled by default (no external marker):</p>
<p><q cite="https://shakespeare.example">All the world's a stage.</q></p>

<p>With cite enabled (data-cli-cite-enabled="true"):</p>
<p><q cite="https://shakespeare.example" data-cli-cite-enabled="true">All the world's a stage.</q></p>

<p>Cite enabled with custom link color:</p>
<p><q cite="https://example.com" data-cli-cite-enabled="true" data-cli-cite-color="cyan">The quick brown fox jumps over the lazy dog.</q></p>

<p>Custom brackets + cite enabled:</p>
<p><q cite="https://example.com" data-cli-prefix-marker="&ldquo;" data-cli-suffix-marker="&rdquo;" data-cli-cite-enabled="true">Form follows function.</q></p>

<h3>Time with Datetime Display (data-cli-datetime-enabled)</h3>

<p>Default — text only, datetime attr hidden:</p>
<p>Published: <time datetime="2026-06-10">June 10, 2026</time></p>

<p>With datetime enabled (data-cli-datetime-enabled="true"):</p>
<p>Published: <time datetime="2026-06-10" data-cli-datetime-enabled="true">June 10, 2026</time></p>

<p>ISO duration — cooking time:</p>
<p>Prep time: <time datetime="PT45M" data-cli-datetime-enabled="true">45 minutes</time></p>

<p>Historical date:</p>
<p>Founded: <time datetime="1969-07-20" data-cli-datetime-enabled="true">Moon landing day</time></p>

<p>Custom prefix/suffix markers:</p>
<p>Event: <time datetime="2026-12-31" data-cli-datetime-enabled="true" data-cli-datetime-prefix-marker=" [" data-cli-datetime-suffix-marker="]">New Year's Eve</time></p>

<p>Custom datetime color:</p>
<p>Deadline: <time datetime="2026-09-01" data-cli-datetime-enabled="true" data-cli-datetime-color="red bold">September 1</time></p>

<p>Full customization:</p>
<p>Version: <time datetime="2026-06-10T12:00:00Z" data-cli-datetime-enabled="true" data-cli-datetime-color="cyan" data-cli-datetime-prefix-marker=" (" data-cli-datetime-suffix-marker=")">release day</time></p>
```

- [ ] **Step 2: Verify**

```bash
node bin/html.js examples/html/tags/text-styles.html
```

Expected: renders without errors, new sections show q with cite and time with datetime variants.

- [ ] **Step 3: Commit**

```bash
git add examples/html/tags/text-styles.html
git commit -m "docs: add q cite and time datetime display examples"
```

---

## Task 5: Create dialog.html

**Files:**
- Create: `examples/html/tags/dialog.html`

- [ ] **Step 1: Write file**

```html
<h1>Dialog Box Border Examples</h1>

<h2>Default Dialog</h2>

<dialog>
  <p>This is a default dialog with round border and cyan color.</p>
  <p>Content can include multiple paragraphs and inline elements.</p>
</dialog>

<h2>Border Styles</h2>

<h3>Single</h3>
<dialog data-cli-border-style="single">
  <p>Single-line border style.</p>
</dialog>

<h3>Double</h3>
<dialog data-cli-border-style="double">
  <p>Double-line border style.</p>
</dialog>

<h3>Bold</h3>
<dialog data-cli-border-style="bold">
  <p>Bold border style.</p>
</dialog>

<h3>Classic</h3>
<dialog data-cli-border-style="classic">
  <p>Classic (ASCII) border style.</p>
</dialog>

<h2>Border Colors</h2>

<dialog data-cli-border-color="green">
  <p>Green border.</p>
</dialog>

<dialog data-cli-border-color="magenta">
  <p>Magenta border.</p>
</dialog>

<dialog data-cli-border-color="yellow">
  <p>Yellow border.</p>
</dialog>

<dialog data-cli-border-color="red">
  <p>Red border.</p>
</dialog>

<h2>Dim Border</h2>

<dialog data-cli-border-dim="true">
  <p>Dimmed border (subtle appearance).</p>
</dialog>

<h2>Custom Padding</h2>

<dialog data-cli-padding-left="3">
  <p>Extra left padding (3 spaces).</p>
</dialog>

<h2>Content Color</h2>

<dialog data-cli-color="yellow">
  <p>Dialog with yellow content color.</p>
</dialog>

<h2>Rich Content</h2>

<dialog>
  <h3>Further Reading</h3>
  <ul>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog">MDN: dialog element</a></li>
    <li><a href="https://html.spec.whatwg.org/#the-dialog-element">WHATWG: The dialog element</a></li>
  </ul>
  <p>The <code>&lt;dialog&gt;</code> element represents a dialog box or other interactive component.</p>
</dialog>

<h2>Combined Customization</h2>

<dialog data-cli-border-style="double" data-cli-border-color="cyan" data-cli-padding-left="2">
  <strong>Notice</strong>
  <p>This dialog combines double border style with cyan color and custom padding.</p>
</dialog>

<dialog data-cli-border-style="bold" data-cli-border-color="red" data-cli-border-dim="true">
  <strong>Warning</strong>
  <p>Bold red dimmed border for high-priority alerts.</p>
</dialog>
```

- [ ] **Step 2: Verify**

```bash
node bin/html.js examples/html/tags/dialog.html
```

Expected: renders without errors, each dialog shows as a box with appropriate border style.

- [ ] **Step 3: Commit**

```bash
git add examples/html/tags/dialog.html
git commit -m "docs: add dialog box border examples"
```

---

## Task 6: Create media.html

**Files:**
- Create: `examples/html/tags/media.html`

- [ ] **Step 1: Write file**

```html
<h1>Media Element Examples (Video &amp; Audio)</h1>

<h2>Video</h2>

<h3>No attributes (fallback title)</h3>
<p>Inline video: <video></video></p>

<h3>With src (title from filename)</h3>
<p>Conference talk: <video src="videos/keynote-2026.mp4"></video></p>

<h3>With title attribute (explicit title wins)</h3>
<p>Tutorial: <video src="videos/tutorial.mp4" title="Getting Started Tutorial"></video></p>

<h3>Title only (no src)</h3>
<p>Demo: <video title="Live Demo Recording"></video></p>

<h2>Audio</h2>

<h3>No attributes (fallback title)</h3>
<p>Recording: <audio></audio></p>

<h3>With src</h3>
<p>Podcast: <audio src="audio/episode-42.mp3"></audio></p>

<h3>With title</h3>
<p>Pronunciation: <audio src="audio/pronunciation.mp3" title="Pronunciation Guide"></audio></p>

<h2>Custom Indicator</h2>

<p>Custom play marker: <video title="Demo" data-cli-indicator-marker="▶"></video></p>
<p>Custom audio marker: <audio title="Clip" data-cli-indicator-marker="♪"></audio></p>
<p>No indicator: <video title="Recording" data-cli-indicator-marker=""></video></p>

<h2>Custom Prefix / Suffix</h2>

<p>Bracketed: <video title="Tutorial" data-cli-prefix-marker="[" data-cli-suffix-marker="]"></video></p>
<p>Labeled: <video title="Demo" data-cli-prefix-marker="Video: " data-cli-suffix-marker=""></video></p>
<p>Parentheses: <audio title="Guide" data-cli-prefix-marker="(" data-cli-suffix-marker=")"></audio></p>

<h2>Custom Colors</h2>

<p>Cyan title: <video title="Webinar" data-cli-title-color="cyan bold"></video></p>
<p>Yellow audio: <audio title="Interview" data-cli-title-color="yellow"></audio></p>
<p>Colored indicator: <video title="Clip" data-cli-indicator-color="magenta"></video></p>
<p>Colored prefix: <video title="Talk" data-cli-prefix-marker="▶ " data-cli-prefix-color="green" data-cli-title-color="green"></video></p>

<h2>Inline in Paragraph Text</h2>

<p>
  The conference featured a keynote <video title="Opening Keynote"></video> followed by
  a panel discussion <audio title="Panel: Future of the Web"></audio> and a hands-on
  workshop recording <video title="Workshop Recording"></video>.
</p>

<p>
  For pronunciation guides, listen to the audio clip
  <audio src="audio/guide.mp3" title="Audio Pronunciation Guide"></audio>
  embedded directly in the text flow.
</p>
```

- [ ] **Step 2: Verify**

```bash
node bin/html.js examples/html/tags/media.html
```

Expected: renders without errors, each media element shows as inline placeholder with title and indicator.

- [ ] **Step 3: Commit**

```bash
git add examples/html/tags/media.html
git commit -m "docs: add video and audio inline placeholder examples"
```

---

## Task 7: Create technical-article.html

**Files:**
- Create: `examples/html/full/technical-article.html`

- [ ] **Step 1: Write file**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Character Encoding and Unicode: A Developer's Guide</title>
</head>
<body>

<article>

<header>
  <h1>Character Encoding and Unicode: A Developer's Guide</h1>
  <p>
    <small>
      Published <time datetime="2026-06-01">June 1, 2026</time> ·
      Updated <time datetime="2026-06-10">June 10, 2026</time> ·
      <strong>15 min read</strong>
    </small>
  </p>
</header>

<hr>

<h2>Introduction</h2>

<p>
  Every string in your program is a sequence of characters. But what is a character?
  The answer has been contentious for decades. <abbr title="American Standard Code for Information Interchange">ASCII</abbr>
  gave us 128 symbols. <abbr title="International Organization for Standardization">ISO</abbr>-8859 tried to extend that.
  Then came <dfn>Unicode</dfn> — a universal character set designed to represent every writing system on Earth.
</p>

<p>
  As <q cite="https://unicode.org/standard/WhatIsUnicode.html">Unicode provides a unique number for every character,
  no matter what the platform, no matter what the program, no matter what the language.</q>
  That promise changed how we think about text.
</p>

<hr>

<h2>A Brief History</h2>

<p>
  The Unicode Standard was first published in
  <time datetime="1991">1991</time>, with version 1.0 covering 7,129 characters.
  Today, Unicode <time datetime="2023-09-12">15.1</time> defines 149,813 characters
  across 161 scripts.
</p>

<figure>
  <pre>
  Unicode versions over time:
  1.0  (1991) ── 7,129 characters
  3.0  (1999) ── 49,194 characters
  6.0  (2010) ── 109,449 characters
  15.1 (2023) ── 149,813 characters
  </pre>
  <figcaption>Growth of the Unicode character repertoire</figcaption>
</figure>

<hr>

<h2>Scripts and Writing Systems</h2>

<p>Unicode covers writing systems from across history and geography. Here are a few examples:</p>

<dl>
  <dt>Latin</dt>
  <dd>Used by most European languages, including English, French, Spanish, German.</dd>

  <dt>CJK Unified Ideographs</dt>
  <dd>
    Shared characters for <ruby>漢字<rt>hànzì</rt></ruby> (Chinese),
    <ruby>漢字<rt>かんじ</rt></ruby> (Japanese kanji), and
    <ruby>한자<rt>hanja</rt></ruby> (Korean).
  </dd>

  <dt>Arabic</dt>
  <dd>Right-to-left script used by Arabic, Persian, Urdu, and other languages.</dd>

  <dt>Devanagari</dt>
  <dd>Used for Hindi (<ruby>हिन्दी<rt>hindī</rt></ruby>), Sanskrit, Nepali, and others.</dd>
</dl>

<hr>

<h2>UTF-8: The Dominant Encoding</h2>

<p>
  <dfn><abbr title="Unicode Transformation Format">UTF</abbr>-8</dfn> encodes Unicode as 1–4 bytes per character.
  ASCII characters (U+0000 to U+007F) use a single byte — making UTF-8 backward-compatible with ASCII.
</p>

<p>
  As <q cite="https://tools.ietf.org/html/rfc3629">UTF-8, a transformation format of ISO 10646</q>,
  it has become the default encoding for the web. As of
  <time datetime="2024-01-01">2024</time>, over 98% of websites use UTF-8.
</p>

<pre><code class="language-javascript">// Always specify encoding explicitly
const fs = require('fs');
const text = fs.readFileSync('file.txt', 'utf8');
console.log(text.length);        // character count
console.log(Buffer.byteLength(text, 'utf8'));  // byte count</code></pre>

<blockquote>
  <p><strong>Key insight:</strong> <code>string.length</code> in JavaScript counts UTF-16 code units,
  not Unicode code points. For emoji and rare CJK characters, these differ.</p>
</blockquote>

<hr>

<h2>Normalization</h2>

<p>
  Unicode includes multiple ways to represent the same character.
  The letter <strong>é</strong> can be encoded as a single precomposed character (U+00E9)
  or as <strong>e</strong> + combining acute accent (U+0065 U+0301).
  Both look identical but compare as unequal without normalization.
</p>

<p>
  The four normalization forms are <abbr title="Canonical Decomposition">NFD</abbr>,
  <abbr title="Canonical Decomposition, followed by Canonical Composition">NFC</abbr>,
  <abbr title="Compatibility Decomposition">NFKD</abbr>, and
  <abbr title="Compatibility Decomposition, followed by Canonical Composition">NFKC</abbr>.
  For most applications, <strong>NFC</strong> is the right choice.
</p>

<hr>

<h2>Video Resources</h2>

<p>
  For a visual introduction, see the talk
  <video title="Unicode: The Secret of å, ñ, and 🎉 (Tom Scott)" src="https://youtube.example/unicode"></video>
  and the conference presentation
  <video title="Unicode Internals — PyCon 2023"></video>.
</p>

<dialog>
  <h3>Further Reading</h3>
  <ul>
    <li><cite>The Unicode Standard</cite> — <a href="https://unicode.org">unicode.org</a></li>
    <li><q cite="https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/">The Absolute Minimum Every Software Developer Must Know About Unicode</q> — Joel Spolsky, <time datetime="2003-10-08">2003</time></li>
    <li><abbr title="Request for Comments">RFC</abbr> 3629: UTF-8, a transformation format of ISO 10646</li>
  </ul>
</dialog>

</article>

</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
node bin/html.js examples/html/full/technical-article.html
```

Expected: full article renders with ruby annotations, q citations, time tags, video placeholders, dialog box.

- [ ] **Step 3: Commit**

```bash
git add examples/html/full/technical-article.html
git commit -m "docs: add technical article full HTML example"
```

---

## Task 8: Create recipe.html

**Files:**
- Create: `examples/html/full/recipe.html`

- [ ] **Step 1: Write file**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Tonkotsu Ramen (豚骨ラーメン) — Traditional Recipe</title>
</head>
<body>

<article>

<header>
  <h1><ruby>豚骨<rt>とんこつ</rt></ruby>ラーメン — Tonkotsu Ramen</h1>
  <p>
    A rich, creamy pork-bone broth ramen originating from
    <ruby>福岡<rt>ふくおか</rt></ruby> (Fukuoka), Japan.
  </p>
  <p>
    <small>
      Prep time: <time datetime="PT30M">30 minutes</time> ·
      Cook time: <time datetime="PT12H">12 hours</time> ·
      Serves: 4
    </small>
  </p>
</header>

<hr data-cli-style="bold">

<p>
  <q cite="https://ramen-museum.example/tonkotsu">Tonkotsu broth is made by boiling pork bones at a rolling boil
  for many hours, which breaks down the collagen into gelatin, creating a milky-white,
  intensely flavored stock.</q>
</p>

<p>Pronunciation guide: <audio title="How to say: Tonkotsu Ramen" src="audio/tonkotsu.mp3"></audio></p>

<hr data-cli-style="dashed">

<h2>Ingredients</h2>

<h3>For the Broth</h3>
<dl>
  <dt data-cli-suffix-marker=" —">Pork trotters (<ruby>豚足<rt>ぶたあし</rt></ruby>)</dt>
  <dd>2 kg, split by the butcher</dd>

  <dt data-cli-suffix-marker=" —">Pork fatback (<ruby>背脂<rt>せあぶら</rt></ruby>)</dt>
  <dd>500 g</dd>

  <dt data-cli-suffix-marker=" —">Green onions (<ruby>葱<rt>ねぎ</rt></ruby>)</dt>
  <dd>4 stalks</dd>

  <dt data-cli-suffix-marker=" —">Ginger (<ruby>生姜<rt>しょうが</rt></ruby>)</dt>
  <dd>50 g, unpeeled, halved</dd>

  <dt data-cli-suffix-marker=" —">Garlic (<ruby>にんにく<rt>garlic</rt></ruby>)</dt>
  <dd>1 whole head, halved crosswise</dd>
</dl>

<h3>For the Tare (Seasoning Sauce)</h3>
<dl>
  <dt data-cli-suffix-marker=" —">Soy sauce (<ruby>醤油<rt>しょうゆ</rt></ruby>)</dt>
  <dd>100 ml</dd>

  <dt data-cli-suffix-marker=" —">Mirin (<ruby>味醂<rt>みりん</rt></ruby>)</dt>
  <dd>50 ml</dd>

  <dt data-cli-suffix-marker=" —">Sake (<ruby>酒<rt>さけ</rt></ruby>)</dt>
  <dd>50 ml</dd>
</dl>

<hr data-cli-style="dashed">

<h2>Method</h2>

<h3>Step 1: Blanch the Bones</h3>

<p>
  Cover bones with cold water, bring to a boil, cook <time datetime="PT10M">10 minutes</time>.
  Drain and rinse under cold water to remove impurities.
</p>

<hr data-cli-style="dotted">

<h3>Step 2: Build the Broth</h3>

<p>
  Place cleaned bones in a large pot. Cover with water, bring to a vigorous boil.
  Maintain a rolling boil — not a simmer — for <time datetime="PT8H">8 hours</time>.
  The vigorous boil emulsifies the fat and creates the characteristic milky-white color.
</p>

<dialog>
  <strong>Chef's Tip</strong>
  <p>
    The key to authentic tonkotsu is maintaining a <em>full rolling boil</em> throughout cooking.
    A gentle simmer produces a clear broth, not the creamy white tonkotsu style.
    Top up with hot water as the level drops.
  </p>
</dialog>

<hr data-cli-style="dotted">

<h3>Step 3: Make the Tare</h3>

<p>
  Combine soy sauce, mirin, and sake in a small saucepan.
  Bring to a simmer over medium heat for <time datetime="PT5M">5 minutes</time> to cook off the alcohol.
  Cool and store. Add 2–3 tbsp per bowl when serving.
</p>

<hr data-cli-style="dotted">

<h3>Step 4: Prepare Toppings</h3>

<p>Classic toppings for <ruby>博多<rt>はかた</rt></ruby>-style tonkotsu:</p>

<ul>
  <li><ruby>叉焼<rt>チャーシュー</rt></ruby> — braised pork belly slices</li>
  <li><ruby>味玉<rt>あじたま</rt></ruby> — marinated soft-boiled egg</li>
  <li><ruby>木耳<rt>きくらげ</rt></ruby> — black mushrooms</li>
  <li><ruby>海苔<rt>のり</rt></ruby> — nori sheet</li>
  <li>Green onions, sesame seeds, pickled ginger</li>
</ul>

<hr data-cli-style="bold">

<footer>
  <p>
    <small>Recipe adapted from <cite>Ramen: Japanese Noodles and Small Dishes</cite>
    by Tove Nilsson. Original preparation technique from
    <q cite="https://ichiran.example">Ichiran Ramen, Fukuoka, est. <time datetime="1960">1960</time></q>.</small>
  </p>
</footer>

</article>

</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
node bin/html.js examples/html/full/recipe.html
```

Expected: recipe renders with ruby annotations, time durations, audio placeholder, dl/dt ingredients, dialog tip, hr styles.

- [ ] **Step 3: Commit**

```bash
git add examples/html/full/recipe.html
git commit -m "docs: add recipe full HTML example"
```

---

## Task 9: Create changelog-full.html

**Files:**
- Create: `examples/html/full/changelog-full.html`

- [ ] **Step 1: Write file**

```html
<!DOCTYPE html>
<html>
<head>
  <title>cli-html Changelog</title>
</head>
<body>

<h1>cli-html Changelog</h1>

<p>All notable changes to this project are documented here. Format based on
<a href="https://keepachangelog.com">Keep a Changelog</a>.</p>

<hr data-cli-style="double">

<h2>v6.0.0 — <time datetime="2026-06-10">June 10, 2026</time></h2>

<dialog>
  <strong>Migration Note: v5 → v6</strong>
  <p>The theme configuration format has changed. All color values are now plain
  chalk-string format (<code>"red bold"</code>). Remove any function-based color
  values from your config. Run <code>cli-html --validate-config</code> to check
  your configuration file.</p>
</dialog>

<h3>Added</h3>
<ul>
  <li><ins>Named styles for <code>&lt;hr&gt;</code></ins>: single, double, bold, dashed, dotted via <code>hr.style</code> config</li>
  <li><ins>Configurable <code>&lt;ruby&gt;</code>/<code>&lt;rt&gt;</code></ins>: prefix/suffix markers for annotations</li>
  <li><ins>Box border for <code>&lt;dialog&gt;</code></ins>: mirrors <code>&lt;figure&gt;</code> and <code>&lt;fieldset&gt;</code> border system</li>
  <li><ins>Datetime display for <code>&lt;time&gt;</code></ins>: show <code>datetime</code> attribute when <code>time.datetime.enabled: true</code></li>
  <li><ins>Cite-as-link for <code>&lt;q&gt;</code></ins>: <code>cite</code> attribute treated as external link when enabled</li>
  <li><ins>Inline <code>&lt;video&gt;</code>/<code>&lt;audio&gt;</code></ins>: inline placeholders showing title or filename</li>
</ul>

<h3>Breaking Changes</h3>
<dl>
  <dt data-cli-color="red">Theme color format</dt>
  <dd><del>Function-based color values</del> → <ins>chalk-string format only</ins>. See migration note above.</dd>

  <dt data-cli-color="red">hr.marker removed as primary config</dt>
  <dd>Use <code>hr.style</code> instead. <code>hr.marker</code> still works as an explicit character override.</dd>
</dl>

<details>
  <summary>Full diff from v5.3.0</summary>
  <p>See <a href="https://github.com/example/cli-html/compare/v5.3.0...v6.0.0">GitHub comparison</a> for the complete change set including all internal refactoring.</p>
</details>

<hr data-cli-style="dashed">

<h2>v5.3.0 — <time datetime="2026-05-15">May 15, 2026</time></h2>

<h3>Added</h3>
<ul>
  <li><ins>Inline <code>&lt;dt&gt;</code> suffix</ins>: configurable suffix marker after term text
    (closes <q cite="https://github.com/example/cli-html/issues/47">#47</q>)</li>
  <li><ins>Media placeholders</ins>: <code>&lt;video&gt;</code> and <code>&lt;audio&gt;</code>
    now render inline title instead of nothing</li>
</ul>

<h3>Fixed</h3>
<ul>
  <li><code>&lt;ruby&gt;</code> color bug: was inheriting from <code>&lt;span&gt;</code> theme instead of own config
    (reported in <q cite="https://github.com/example/cli-html/issues/51">#51</q>)</li>
</ul>

<hr data-cli-style="dashed">

<h2>v5.2.0 — <time datetime="2026-04-01">April 1, 2026</time></h2>

<h3>Changed</h3>
<ul>
  <li>Core architecture rewrite: theme values now plain strings, <code>getAttr()</code> replaces <code>getCustomAttributes()</code></li>
  <li>Removed <code>parseStyleEntry()</code> — no longer needed</li>
  <li>Removed <code>lib/utils/find-parrent-tag.js</code> — dead code</li>
</ul>

<hr data-cli-style="double">

<h2>v5.0.0 — <time datetime="2026-01-10">January 10, 2026</time></h2>

<dialog>
  <strong>Migration Note: v4 → v5</strong>
  <p>Input element configuration moved under <code>input.*</code> namespace.
  Button element now uses <code>button.*</code> (separate from <code>input.button.*</code>).
  Table sub-elements (td, th, tr, etc.) are now top-level theme keys.</p>
</dialog>

<h3>Breaking Changes</h3>
<dl>
  <dt data-cli-color="red">Table configuration</dt>
  <dd>Table sub-elements moved to top-level: <del><code>table.td</code></del> → <ins><code>td</code></ins></dd>

  <dt data-cli-color="red">Button element</dt>
  <dd><del><code>input.button</code></del> for the <code>&lt;button&gt;</code> HTML element → <ins><code>button</code></ins></dd>
</dl>

</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
node bin/html.js examples/html/full/changelog-full.html
```

Expected: changelog renders with time dates, hr double/dashed between versions, dialog migration notes, ins/del, dl/dt.

- [ ] **Step 3: Commit**

```bash
git add examples/html/full/changelog-full.html
git commit -m "docs: add changelog full HTML example"
```

---

## Task 10: Create glossary.html

**Files:**
- Create: `examples/html/full/glossary.html`

- [ ] **Step 1: Write file**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Typography Glossary</title>
</head>
<body>

<h1>Typography Glossary</h1>

<p>A reference guide to typographic terms, with pronunciation guides and historical context.</p>

<hr data-cli-style="bold">

<h2>A</h2>

<dl>
  <dt><dfn>Ascender</dfn></dt>
  <dd>
    The portion of a lowercase letter that extends above the x-height.
    Found in letters b, d, f, h, i, k, l, t.
    <q cite="https://fonts.google.com/knowledge/glossary/ascender">Ascenders help distinguish lowercase letters from capitals.</q>
  </dd>

  <dt><dfn>Aperture</dfn></dt>
  <dd>
    The partially enclosed, somewhat rounded negative space in some characters,
    such as n, C, S, and the lower part of e.
    First described in typographic literature around <time datetime="1680">the 1680s</time>.
  </dd>
</dl>

<hr data-cli-style="bold">

<h2>B</h2>

<dl>
  <dt><dfn>Baseline</dfn></dt>
  <dd>
    The imaginary line on which most letters and other characters sit.
    Descenders (g, j, p, q, y) dip below the baseline.
    Fundamental to <ruby>活字<rt>かつじ</rt></ruby> (movable type) systems.
  </dd>

  <dt><dfn>Bezier curve</dfn>
    <audio title="Pronunciation: Bezier" src="audio/bezier.mp3"></audio>
  </dt>
  <dd>
    Named after engineer <ruby>Pierre Bézier<rt>pjɛʁ bezje</rt></ruby>
    (<time datetime="1910-09-01">1910</time>–<time datetime="1999-11-25">1999</time>),
    who popularized its use in <abbr title="Computer-Aided Design">CAD</abbr> systems.
    Used in PostScript and OpenType to define glyph outlines.
  </dd>
</dl>

<hr data-cli-style="bold">

<h2>K</h2>

<dl>
  <dt><dfn>Kerning</dfn>
    <audio title="Pronunciation: Kerning" src="audio/kerning.mp3"></audio>
  </dt>
  <dd>
    Adjustment of spacing between specific pairs of characters to achieve
    visually consistent spacing. Differs from <em>tracking</em>, which adjusts
    spacing uniformly across a range of text.
    <q cite="https://practicaltypography.com/kerning.html">Kerning is the fine-tuning of space between individual character pairs.</q>
  </dd>
</dl>

<hr data-cli-style="bold">

<h2>L</h2>

<dl>
  <dt><dfn>Leading</dfn>
    <audio title="Pronunciation: Leading (rhymes with heading, not feeding)" src="audio/leading.mp3"></audio>
  </dt>
  <dd>
    Line spacing — the distance from one baseline to the next.
    Named after the strips of lead used in hot-metal typesetting
    to increase space between lines of type, practiced since
    <time datetime="1450">the mid-1400s</time> when
    <ruby>Johannes Gutenberg<rt>ˈjoːhanəs ˈɡuːtənbɛʁk</rt></ruby>
    introduced movable type to Europe.
  </dd>

  <dt><dfn>Ligature</dfn></dt>
  <dd>
    A glyph representing two or more letters joined together.
    Common examples: fi, fl, ff, ffi, ffl.
    In Arabic script (<ruby>العربية<rt>al-ʿArabiyya</rt></ruby>),
    most characters connect to adjacent letters.
  </dd>
</dl>

<hr data-cli-style="bold">

<h2>S</h2>

<dl>
  <dt><dfn>Serif</dfn></dt>
  <dd>
    Small decorative strokes at the ends of the main strokes of a letter.
    Typefaces with serifs (Times New Roman, Georgia) are called <em>serif</em> typefaces.
    Those without (Arial, Helvetica) are called <em>sans-serif</em>
    (<ruby>sans<rt>from French: without</rt></ruby>).
  </dd>

  <dt><dfn>Stem</dfn></dt>
  <dd>
    The main vertical stroke of a letter. In letters like I, H, l, the
    entire character may be considered a stem. Stem weight determines
    the apparent boldness of a typeface.
    <q cite="https://ilovetypography.com/2008/01/14/type-terminology-stem/">The stem is the skeleton of the letterform.</q>
  </dd>
</dl>

<hr data-cli-style="bold">

<h2>X</h2>

<dl>
  <dt><dfn>x-height</dfn></dt>
  <dd>
    The height of lowercase letters, specifically the letter <strong>x</strong>,
    which has no ascender or descender. A large x-height (relative to cap height)
    improves legibility at small sizes. First systematically measured in
    <time datetime="1932">1932</time> as part of legibility research.
  </dd>
</dl>

<dialog>
  <h3>Further Resources</h3>
  <ul>
    <li><cite>Thinking with Type</cite> by Ellen Lupton — <time datetime="2004">2004</time></li>
    <li><cite>The Elements of Typographic Style</cite> by Robert Bringhurst — <time datetime="1992">1992</time></li>
    <li><a href="https://fonts.google.com/knowledge">Google Fonts Knowledge</a></li>
  </ul>
</dialog>

</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
node bin/html.js examples/html/full/glossary.html
```

Expected: glossary renders with dl/dt definitions, ruby pronunciations, audio placeholders, time dates, q citations, hr between letters, dialog.

- [ ] **Step 3: Commit**

```bash
git add examples/html/full/glossary.html
git commit -m "docs: add glossary full HTML example"
```

---

## Task 11: Create author-profile.html

**Files:**
- Create: `examples/html/full/author-profile.html`

- [ ] **Step 1: Write file**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Author Profile — Yoko Ogawa</title>
</head>
<body>

<article>

<header>
  <h1>
    <ruby>小川洋子<rt>おがわようこ</rt></ruby>
    <small>(Yoko Ogawa)</small>
  </h1>
  <p>
    <audio title="Pronunciation: Ogawa Yoko" src="audio/ogawa-yoko.mp3"></audio>
    Japanese novelist · Born <time datetime="1962-03-30">March 30, 1962</time>
    in <ruby>岡山市<rt>おかやまし</rt></ruby> (Okayama City), Japan
  </p>
</header>

<hr>

<h2>About</h2>

<p>
  Yoko Ogawa is one of Japan's most celebrated contemporary authors, known for her
  precisely crafted, quietly unsettling fiction. Her work often explores themes of
  memory, loss, and the fragility of the human body.
</p>

<p>
  <q cite="https://guardian.example/ogawa-interview-2022">I write about what we lose —
  and what remains after the loss. A room, a number, a person. What disappears
  leaves its own kind of presence.</q>
</p>

<dialog>
  <h3>Extended Biography</h3>
  <p>
    Ogawa graduated from <ruby>早稲田大学<rt>わせだだいがく</rt></ruby> (Waseda University)
    in <time datetime="1988">1988</time>. She published her debut novel while still a student.
    Her writing is characterized by precise, spare prose and a focus on isolated characters
    navigating strange and melancholy situations. She lives in
    <ruby>兵庫県<rt>ひょうごけん</rt></ruby> (Hyogo Prefecture).
  </p>
</dialog>

<hr>

<h2>Selected Works</h2>

<dl>
  <dt><cite><ruby>妊娠カレンダー<rt>にんしんカレンダー</rt></ruby></cite> (Pregnancy Diary)</dt>
  <dd>
    <time datetime="1991">1991</time> · Akutagawa Prize winner ·
    Ogawa's breakthrough work, three interconnected stories about bodies and transformation.
  </dd>

  <dt><cite><ruby>博士の愛した数式<rt>はかせのあいしたすうしき</rt></ruby></cite> (The Housekeeper and the Professor)</dt>
  <dd>
    <time datetime="2003">2003</time> · Translated into over 30 languages ·
    A mathematician with an 80-minute memory, his housekeeper, and her son —
    and the beauty of numbers that outlasts forgetting.
  </dd>

  <dt><cite><ruby>密やかな結晶<rt>ひそやかなけっしょう</rt></ruby></cite> (The Memory Police)</dt>
  <dd>
    <time datetime="1994">1994</time> · English translation published <time datetime="2019">2019</time> ·
    On an unnamed island, objects disappear and those who remember them are hunted.
  </dd>
</dl>

<hr>

<h2>Awards &amp; Recognition</h2>

<dl>
  <dt><time datetime="1991">1991</time></dt>
  <dd>Akutagawa Prize — <cite>妊娠カレンダー</cite></dd>

  <dt><time datetime="2004">2004</time></dt>
  <dd>Yomiuri Prize for Literature — <cite>博士の愛した数式</cite></dd>

  <dt><time datetime="2023">2023</time></dt>
  <dd>International Booker Prize longlist — <cite>The Memory Police</cite></dd>
</dl>

<hr>

<h2>Talks &amp; Interviews</h2>

<p>
  <video title="Ogawa Yoko in conversation — Edinburgh International Book Festival 2022"></video>
</p>
<p>
  <video title="The Memory Police: Between Dream and Reality — Japan Foundation lecture"></video>
</p>
<p>
  Audio interview:
  <audio title="Yoko Ogawa on writing, mathematics, and memory — BBC Radio 4"></audio>
</p>

<hr>

<address>
  <p>
    Publisher: <a href="https://publisher.example">Harvill Secker</a> (UK) /
    <a href="https://pantheon.example">Pantheon Books</a> (US)
  </p>
</address>

</article>

</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
node bin/html.js examples/html/full/author-profile.html
```

Expected: profile renders with ruby name, audio pronunciation, dialog bio, dl/dt works, time dates, video/audio talks, q citation.

- [ ] **Step 3: Commit**

```bash
git add examples/html/full/author-profile.html
git commit -m "docs: add author profile full HTML example"
```

---

## Task 12: Create news-article.html

**Files:**
- Create: `examples/html/full/news-article.html`

- [ ] **Step 1: Write file**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Breakthrough in Neural Machine Translation — Tech News</title>
</head>
<body>

<article>

<header>
  <h1>Researchers Achieve Human-Level Accuracy in Low-Resource Language Translation</h1>
  <p>
    <address>By <strong>Sarah Chen</strong> and <strong>Marcos Oliveira</strong></address>
    Published <time datetime="2026-06-10T09:30:00Z">June 10, 2026, 09:30 UTC</time> ·
    Updated <time datetime="2026-06-10T14:15:00Z">14:15 UTC</time>
  </p>
</header>

<hr data-cli-style="bold">

<p>
  A team of researchers at the <abbr title="International Computational Linguistics Institute">ICLI</abbr>
  announced today a significant breakthrough in machine translation for low-resource languages —
  those with limited training data — achieving accuracy scores comparable to professional human translators
  for the first time.
</p>

<video title="Press conference: ICLI researchers present translation results" src="video/icli-pressconf.mp4"></video>

<hr>

<h2>The Research</h2>

<p>
  The new approach, called <dfn>Cross-Lingual Transfer with Minimal Supervision</dfn> (<abbr>CTMS</abbr>),
  was tested on 47 languages including <ruby>ᓀᐦᐃᔭᐍᐏᐣ<rt>nêhiyawêwin</rt></ruby> (Plains Cree),
  <ruby>isiZulu<rt>Zulu</rt></ruby>, and <ruby>ꆈꌠ꒿<rt>Nuosu Yi</rt></ruby>.
</p>

<p>
  Lead researcher <ruby>陳思慧<rt>Chén Sīhuì</rt></ruby> stated:
  <q cite="https://icli.example/press/2026-06-10">We trained the model on fewer than 5,000 sentence pairs
  per language — a fraction of what was previously considered the minimum for useful neural translation.
  The results exceeded our expectations for every language in the test set.</q>
</p>

<hr>

<h2>Implications</h2>

<p>
  The breakthrough has significant implications for the estimated 3,000 languages that currently
  have no digital translation support. Of the world's 7,000+ languages, fewer than 100 are
  well-supported by existing translation services.
</p>

<blockquote>
  <p>
    <q cite="https://endangered-languages.example/report-2025">Approximately 40% of languages
    are at risk of disappearing by the end of the century. Digital tools that preserve and
    enable communication in these languages are critically needed.</q>
  </p>
  <footer>— Endangered Languages Project, <time datetime="2025">2025 Report</time></footer>
</blockquote>

<dialog>
  <h3>Related Stories</h3>
  <ul>
    <li><a href="#">UNESCO Atlas of Endangered Languages updated for <time datetime="2026">2026</time></a></li>
    <li><a href="#">How <ruby>机器翻译<rt>jīqì fānyì</rt></ruby> (machine translation) changed global commerce</a></li>
    <li><a href="#">Interview: Preserving oral traditions in the digital age</a></li>
  </ul>
</dialog>

<hr>

<h2>Expert Reaction</h2>

<p>
  <ruby>Müller<rt>ˈmʏlɐ</rt></ruby>, professor of computational linguistics at ETH Zürich,
  called the result
  <q cite="https://eth.example/reaction-ctms">"a genuine step change, not an incremental improvement.
  The field has been searching for a solution to the low-resource problem for a decade."</q>
</p>

<p>
  The paper, <cite>Cross-Lingual Transfer with Minimal Supervision for Endangered Language Preservation</cite>,
  was published in <cite>Nature Language Processing</cite> on
  <time datetime="2026-06-10">June 10, 2026</time>.
  A preprint has been available since <time datetime="2026-05-28">May 28</time>.
</p>

<hr>

<h2>Audio &amp; Video</h2>

<p>
  <audio title="Full press conference audio — 42 minutes" src="audio/icli-pressconf.mp3"></audio>
</p>
<p>
  <video title="Explainer: How CTMS works — 8 minute animation"></video>
</p>

</article>

</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
node bin/html.js examples/html/full/news-article.html
```

Expected: news article renders with time publication dates, q citations, video/audio, ruby names, hr bold, dialog related stories.

- [ ] **Step 3: Commit**

```bash
git add examples/html/full/news-article.html
git commit -m "docs: add news article full HTML example"
```

---

## Task 13: Create museum-entry.html

**Files:**
- Create: `examples/html/full/museum-entry.html`

- [ ] **Step 1: Write file**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Bronze Ritual Vessel (青銅禮器) — Museum Collection</title>
</head>
<body>

<article>

<header>
  <h1>
    <ruby>青銅禮器<rt>qīngtóng lǐqì</rt></ruby>
    — Bronze Ritual Vessel
  </h1>
  <p>
    <audio title="Audio guide: Bronze Ritual Vessel, Gallery 12, Item 7" src="audio/guide-bronze-vessel.mp3"></audio>
  </p>
</header>

<hr>

<h2>Object Information</h2>

<dl>
  <dt data-cli-suffix-marker=":">Culture</dt>
  <dd>Chinese, <ruby>商朝<rt>Shāng dynasty</rt></ruby></dd>

  <dt data-cli-suffix-marker=":">Date</dt>
  <dd>Approximately <time datetime="-1200">1200 BCE</time> to <time datetime="-1050">1050 BCE</time></dd>

  <dt data-cli-suffix-marker=":">Medium</dt>
  <dd>Bronze (copper-tin alloy, approximately 80% copper, 20% tin)</dd>

  <dt data-cli-suffix-marker=":">Dimensions</dt>
  <dd>Height: 38.4 cm · Width: 22.1 cm · Weight: 4.8 kg</dd>

  <dt data-cli-suffix-marker=":">Current location</dt>
  <dd>Gallery 12 (East Asian Antiquities), Case 7</dd>

  <dt data-cli-suffix-marker=":">Accession number</dt>
  <dd>1923.0847.A</dd>
</dl>

<hr>

<h2>Description</h2>

<p>
  This <ruby>鼎<rt>dǐng</rt></ruby> (ritual food vessel) is a fine example of late
  <ruby>商朝<rt>Shāng dynasty</rt></ruby> bronze casting, characterized by its bold
  <ruby>饕餮紋<rt>tāotiè wén</rt></ruby> (taotie mask motif) — a face-like design
  that appears across Shang bronzes but whose significance remains debated by scholars.
</p>

<p>
  As described in the museum's founding catalogue:
  <q cite="https://museum.example/catalogue/1923">The vessel exemplifies the mastery of
  Chinese bronze-founders of the second millennium BCE. The precision of the casting,
  the sharpness of the decorative registers, and the uniformity of the alloy composition
  indicate production in a highly organised workshop with specialised craftspeople.</q>
</p>

<video title="3D model: rotate and examine the vessel" src="video/bronze-vessel-3d.mp4"></video>

<hr>

<h2>Historical Context</h2>

<p>
  Bronze ritual vessels were central to <ruby>商朝<rt>Shāng</rt></ruby> religious practice.
  Vessels were used in ancestral ceremonies, filled with food or wine offerings.
  The <ruby>鼎<rt>dǐng</rt></ruby> specifically held cooked meat offerings and was
  considered one of the most sacred vessel types.
</p>

<p>
  The Shang dynasty, which ruled from approximately
  <time datetime="-1600">1600 BCE</time> to <time datetime="-1046">1046 BCE</time>,
  is notable as the earliest Chinese dynasty confirmed by both archaeological evidence
  and contemporary written records — oracle bone inscriptions
  (<ruby>甲骨文<rt>jiǎgǔwén</rt></ruby>).
</p>

<blockquote>
  <p>
    <q cite="https://cambridge.example/ancient-china">Bronze was to Shang China what
    silicon is to modern computing — the material substrate on which an entire
    civilisation was organised.</q>
  </p>
  <footer>— Professor Li Wei, <cite>Ancient China: Technology and Society</cite>,
  <time datetime="2018">2018</time></footer>
</blockquote>

<dialog>
  <h3>Provenance</h3>
  <p>
    Excavated in <time datetime="1920">1920</time> near
    <ruby>安陽<rt>Ānyáng</rt></ruby> (Anyang), <ruby>河南省<rt>Hénán province</rt></ruby>,
    China, during construction works. Acquired by the museum in
    <time datetime="1923">1923</time> through purchase from a private collector.
    Export documentation filed with the government of China,
    reference no. 1923/EX/0847.
  </p>
  <p>
    The museum acknowledges this object was acquired under colonial-era conditions
    and is currently in dialogue with cultural heritage authorities regarding
    its long-term status.
  </p>
</dialog>

<hr>

<h2>Technical Analysis</h2>

<p>
  X-ray fluorescence analysis conducted in <time datetime="2019">2019</time> confirmed
  the alloy composition. Thermoluminescence dating of associated ceramic fragments
  places the vessel's manufacture between <time datetime="-1250">1250</time> and
  <time datetime="-1150">1150 BCE</time>.
</p>

</article>

</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
node bin/html.js examples/html/full/museum-entry.html
```

Expected: museum entry renders with ruby CJK names, time ancient dates, q catalog quotes, audio guide, video 3D tour, dl/dt metadata, dialog provenance.

- [ ] **Step 3: Commit**

```bash
git add examples/html/full/museum-entry.html
git commit -m "docs: add museum entry full HTML example"
```

---

## Task 14: Create academic-paper.html

**Files:**
- Create: `examples/html/full/academic-paper.html`

- [ ] **Step 1: Write file**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Honorific Systems in East Asian Languages — Abstract</title>
</head>
<body>

<article>

<header>
  <h1>Honorific Systems in East Asian Languages: A Comparative Analysis</h1>

  <dl>
    <dt data-cli-suffix-marker=":">Authors</dt>
    <dd>
      <ruby>田中美穂<rt>たなかみほ</rt></ruby> (Miho Tanaka)<sup>1</sup>,
      <ruby>박지수<rt>Park Jisu</rt></ruby><sup>2</sup>,
      <ruby>王芳<rt>Wáng Fāng</rt></ruby><sup>3</sup>
    </dd>

    <dt data-cli-suffix-marker=":">Affiliations</dt>
    <dd>
      <sup>1</sup> Department of Linguistics, <ruby>東京大学<rt>とうきょうだいがく</rt></ruby> (University of Tokyo) ·
      <sup>2</sup> Korean Language Institute, <ruby>서울대학교<rt>Seoul National University</rt></ruby> ·
      <sup>3</sup> Department of Chinese, Peking University
    </dd>

    <dt data-cli-suffix-marker=":">Submitted</dt>
    <dd><time datetime="2026-03-15">March 15, 2026</time></dd>

    <dt data-cli-suffix-marker=":">Accepted</dt>
    <dd><time datetime="2026-05-22">May 22, 2026</time></dd>

    <dt data-cli-suffix-marker=":">Published</dt>
    <dd><time datetime="2026-06-01">June 1, 2026</time></dd>

    <dt data-cli-suffix-marker=":">Journal</dt>
    <dd><cite>Journal of East Asian Linguistics</cite>, Vol. 35, No. 2</dd>

    <dt data-cli-suffix-marker=":">DOI</dt>
    <dd>10.1007/s10831-026-09284-x</dd>
  </dl>
</header>

<hr>

<h2>Abstract</h2>

<p>
  Honorific systems — grammaticalized means of encoding social relationships in language —
  exhibit remarkable structural diversity across East Asian languages. This paper presents
  a comparative analysis of honorific systems in Japanese (<ruby>敬語<rt>けいご</rt></ruby>,
  <em>keigo</em>), Korean (<ruby>존댓말<rt>jondaenmal</rt></ruby>), and Mandarin Chinese
  (<ruby>敬語<rt>jìngyǔ</rt></ruby>), examining morphological, lexical, and pragmatic
  dimensions across a corpus of 12,000 naturally-occurring utterances.
</p>

<p>
  Our findings confirm the typological claim advanced by
  <q cite="https://doi.example/10.1017/s0022226702001482">Shibatani (2006) that
  Japanese and Korean honorifics constitute a grammatical category in the strict sense,
  while Mandarin honorifics are primarily lexical</q>, but complicate this binary
  with evidence of ongoing grammaticalization in formal Mandarin registers.
</p>

<hr>

<h2>1. Introduction</h2>

<p>
  The social functions of language have long attracted linguistic inquiry. Among the most
  systematic realizations of social meaning in grammar are <dfn>honorifics</dfn>:
  linguistic forms that encode the relative social status, familiarity, or role of
  conversation participants.
</p>

<p>
  Japanese <ruby>敬語<rt>けいご</rt></ruby> is perhaps the most frequently cited example
  in the typological literature, comprising three subsystems:
</p>

<ul>
  <li><ruby>尊敬語<rt>そんけいご</rt></ruby> (<em>sonkeigo</em>) — respectful language, exalting the addressee or subject</li>
  <li><ruby>謙譲語<rt>けんじょうご</rt></ruby> (<em>kenjōgo</em>) — humble language, lowering the speaker</li>
  <li><ruby>丁寧語<rt>ていねいご</rt></ruby> (<em>teineigo</em>) — polite language, neutral register marking</li>
</ul>

<p>
  Korean presents a parallel tripartite system in
  <ruby>존댓말<rt>jondaenmal</rt></ruby> vs. <ruby>반말<rt>banmal</rt></ruby> (informal speech),
  with a complex system of sentence-final endings that encode speech levels.
  As noted by
  <q cite="https://doi.example/10.1515/ijsl.2010.012">Brown and Levinson (1987):
  politeness phenomena are universal, but the grammatical resources languages deploy
  to realize them vary enormously.</q>
</p>

<hr>

<h2>2. Data and Methodology</h2>

<p>
  Our corpus was collected between <time datetime="2024-09">September 2024</time> and
  <time datetime="2025-08">August 2025</time>, comprising:
</p>

<table>
  <thead>
    <tr>
      <th>Language</th>
      <th>Register</th>
      <th>Utterances</th>
      <th>Source</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Japanese</td>
      <td>Formal spoken</td>
      <td>2,000</td>
      <td>NHK broadcast transcripts</td>
    </tr>
    <tr>
      <td>Japanese</td>
      <td>Casual spoken</td>
      <td>2,000</td>
      <td>Corpus of Spontaneous Japanese</td>
    </tr>
    <tr>
      <td>Korean</td>
      <td>Formal spoken</td>
      <td>2,000</td>
      <td>Korean Broadcasting System</td>
    </tr>
    <tr>
      <td>Korean</td>
      <td>Casual spoken</td>
      <td>2,000</td>
      <td>Spoken Korean Corpus</td>
    </tr>
    <tr>
      <td>Mandarin</td>
      <td>Formal spoken</td>
      <td>2,000</td>
      <td><abbr title="Central China Television">CCTV</abbr> transcripts</td>
    </tr>
  </tbody>
</table>

<hr>

<h2>3. Key Findings</h2>

<p>
  In Japanese, honorific morphology was present in 78% of utterances in formal registers
  and 31% in casual registers, confirming the obligatory nature of register selection
  in most social contexts. The verbal suffix <ruby>ます<rt>-masu</rt></ruby>
  appeared in 94% of formal utterances, confirming its role as the primary register marker.
</p>

<dialog>
  <h3>Note on Transcription</h3>
  <p>
    Japanese data is transcribed in <ruby>ローマ字<rt>rōmaji</rt></ruby> (romanization)
    following the <abbr title="Modified Hepburn romanization">Modified Hepburn</abbr> system
    throughout this paper. Korean uses <abbr title="Revised Romanization of Korean">RR</abbr> system.
    Mandarin uses <ruby>拼音<rt>Pīnyīn</rt></ruby>.
    Original-script forms are provided on first use and in the appendix glossary.
  </p>
</dialog>

<hr>

<h2>References</h2>

<ul>
  <li>
    Brown, P. &amp; Levinson, S. (1987). <cite>Politeness: Some Universals in Language Usage</cite>.
    Cambridge University Press.
    <q cite="https://doi.example/10.1017/cbo9780511813085">Cited in relation to face-threatening acts.</q>
  </li>
  <li>
    Shibatani, M. (2006). Honorifics. In <cite>Encyclopedia of Language and Linguistics</cite>, 2nd ed.
    Elsevier. DOI: <cite>10.1016/b0-08-044854-2/01839-0</cite>
  </li>
  <li>
    <ruby>田中美穂<rt>たなかみほ</rt></ruby> &amp; <ruby>박지수<rt>Park Jisu</rt></ruby> (2024).
    Register variation in Japanese business communication.
    <cite>Language in Society</cite>, 53(2), 214–238.
    DOI: 10.1017/s0047404524000089
  </li>
</ul>

</article>

</body>
</html>
```

- [ ] **Step 2: Verify**

```bash
node bin/html.js examples/html/full/academic-paper.html
```

Expected: academic paper renders with ruby linguistic examples, q citations with DOI, time dates, dl/dt metadata, dialog note, table of corpus data, hr between sections.

- [ ] **Step 3: Commit**

```bash
git add examples/html/full/academic-paper.html
git commit -m "docs: add academic paper full HTML example"
```

---

## Task 15: Create inline-html.md

**Files:**
- Create: `examples/markdown/features/inline-html.md`

- [ ] **Step 1: Write file**

````markdown
# Inline HTML Elements in Markdown

Markdown supports inline HTML. These elements are passed through to the renderer,
so all `cli-html` features work when embedded in markdown content.

## Dialog Box

Embed a dialog box directly in markdown:

<dialog>
  **Important Notice**

  This is a dialog box rendered from inline HTML inside a markdown document.
  The border style and colors are configured via `config.yaml`.
</dialog>

## Video and Audio

Reference media files inline:

The conference recording <video title="Opening Keynote 2026"></video> is available
alongside the audio-only version <audio title="Keynote Audio Track"></audio>.

Or on their own lines:

<video src="videos/tutorial.mp4" title="Getting Started Tutorial"></video>

<audio src="audio/pronunciation.mp3" title="Pronunciation Guide"></audio>

## Ruby Annotations

Ruby annotations work as inline HTML in markdown:

The character <ruby>漢字<rt>かんじ</rt></ruby> means "Chinese characters" in Japanese.

Common Japanese phrases:
- <ruby>ありがとう<rt>arigatou</rt></ruby> — thank you
- <ruby>よろしく<rt>yoroshiku</rt></ruby> — nice to meet you / please take care of me
- <ruby>初めまして<rt>はじめまして</rt></ruby> — how do you do

Chinese example: <ruby>你好<rt>nǐ hǎo</rt></ruby> (hello)

## Time with Datetime

The `datetime` attribute is always present but display requires `time.datetime.enabled: true` in config:

Published: <time datetime="2026-06-10">June 10, 2026</time>

With display enabled via data attribute:
<time datetime="2026-06-10" data-cli-datetime-enabled="true">June 10, 2026</time>

ISO duration: <time datetime="PT45M" data-cli-datetime-enabled="true">45 minutes</time>

## Quote with Cite

The `cite` attribute is present but link display requires `q.cite.enabled: true` in config or per-element attribute:

Default (no cite display): <q cite="https://example.com">The best way to predict the future is to invent it.</q>

With cite enabled via data attribute:
<q cite="https://example.com" data-cli-cite-enabled="true">The best way to predict the future is to invent it.</q>

## Combined Example

A paragraph mixing markdown and inline HTML:

The researcher <ruby>陳思慧<rt>Chén Sīhuì</rt></ruby> stated:
<q cite="https://research.example/2026" data-cli-cite-enabled="true">The results exceeded our expectations.</q>
The announcement was made on <time datetime="2026-06-10" data-cli-datetime-enabled="true">June 10, 2026</time>.
A recording is available: <video title="Press Conference Recording"></video>
````

- [ ] **Step 2: Verify**

```bash
node bin/markdown.js examples/markdown/features/inline-html.md
```

Expected: markdown renders with inline HTML elements: dialog box, video/audio placeholders, ruby annotations, time tags, q with cite.

- [ ] **Step 3: Commit**

```bash
git add examples/markdown/features/inline-html.md
git commit -m "docs: add inline HTML elements markdown feature example"
```

---

## Task 16: Create recipe.md

**Files:**
- Create: `examples/markdown/full/recipe.md`

- [ ] **Step 1: Write file**

````markdown
# <ruby>担担麺<rt>たんたんめん</rt></ruby> — Tantanmen (Spicy Sesame Noodles)

*A Japanese adaptation of Sichuan* <ruby>担担面<rt>dàndàn miàn</rt></ruby> *(dan dan noodles)*

**Prep:** <time datetime="PT15M">15 min</time> · **Cook:** <time datetime="PT20M">20 min</time> · **Serves:** 2

---

> [!NOTE]
> Tantanmen is the Japanese adaptation of Chinese dan dan noodles. It tends to be richer and creamier
> than the Sichuan original, with a pronounced sesame flavor. Both versions are delicious.

## Ingredients

### Broth

| Ingredient | Amount |
|-----------|--------|
| Chicken stock | 600 ml |
| Soy milk (unsweetened) | 200 ml |
| Sesame paste (<ruby>芝麻醬<rt>zhīma jiàng</rt></ruby>) | 3 tbsp |
| Soy sauce (<ruby>醤油<rt>しょうゆ</rt></ruby>) | 2 tbsp |
| Chili oil (<ruby>辣油<rt>ラーユ</rt></ruby>) | 1–2 tbsp (to taste) |
| Sesame oil | 1 tsp |
| Garlic, minced | 2 cloves |
| Ginger, grated | 1 tsp |

### Toppings

- Ground pork (<ruby>豚挽き肉<rt>ぶたひきにく</rt></ruby>) — 200g
- Soft-boiled egg (<ruby>半熟卵<rt>はんじゅくたまご</rt></ruby>) — 1 per serving
- Green onions, thinly sliced
- Sesame seeds
- Blanched spinach or bok choy

### Noodles

Fresh ramen noodles (<ruby>生麵<rt>なまめん</rt></ruby>) — 2 portions, or dried ramen noodles

---

## Method

### 1. Cook the pork topping

Heat a pan over medium-high heat. Add a splash of oil, then add pork and garlic.
Cook until browned, breaking into small pieces, about **5 minutes**.
Season with 1 tbsp soy sauce and a pinch of sugar. Set aside.

---

### 2. Build the broth

In a saucepan, sauté ginger in a little oil for **1 minute**.
Add chicken stock and bring to a simmer. Whisk in:

```
sesame paste + soy sauce + sesame oil
```

Then add soy milk and chili oil. Keep warm over low heat — **do not boil** after adding soy milk.

---

### 3. Cook the noodles

Cook noodles according to package instructions. Fresh noodles: **2 minutes**. Drain well.

---

### 4. Assemble

1. Divide noodles between two bowls
2. Ladle hot broth over noodles
3. Top with seasoned pork, halved soft-boiled egg, green onions, sesame seeds
4. Add extra chili oil to taste

---

## Notes

> The key to rich tantanmen broth is **not boiling** after adding dairy. A gentle simmer preserves
> the creamy texture. If the broth breaks, it still tastes fine but loses visual appeal.

Adapted from <q cite="https://seriouseats.example/tantanmen">Serious Eats: Tantanmen recipe</q>
and the cookbook <cite>Japanese Soul Cooking</cite> by Tadashi Ono &amp; Harris Salat,
<time datetime="2013">2013</time>.
````

- [ ] **Step 2: Verify**

```bash
node bin/markdown.js examples/markdown/full/recipe.md
```

Expected: recipe renders with ruby annotations, time durations, table, lists, blockquote alerts, q cite, hr dividers.

- [ ] **Step 3: Commit**

```bash
git add examples/markdown/full/recipe.md
git commit -m "docs: add recipe markdown full example"
```

---

## Task 17: Create glossary.md

**Files:**
- Create: `examples/markdown/full/glossary.md`

- [ ] **Step 1: Write file**

````markdown
# Web Development Glossary

A quick reference for common terms in modern web development.

---

## A

API
: **Application Programming Interface** — A set of rules and protocols that allows
  different software applications to communicate with each other. REST and GraphQL
  are common API styles. <q cite="https://mdn.example/api">An API is a way for two
  or more computer programs to communicate with each other.</q>

Async/Await
: JavaScript syntax for working with Promises. `async` functions always return a
  Promise; `await` pauses execution until a Promise resolves. Introduced in
  <ruby>ECMAScript<rt>ES2017</rt></ruby>.

---

## B

Bundle
: A single file (or small set of files) produced by a build tool that combines many
  source modules into a deployable artifact. Common bundlers: webpack, Rollup, esbuild, Vite.

---

## C

CDN
: **Content Delivery Network** — A geographically distributed group of servers that
  caches content close to end users to improve load times. Examples: Cloudflare,
  Fastly, Akamai.

CI/CD
: **Continuous Integration / Continuous Deployment** — Practices where code changes
  are automatically tested (CI) and deployed (CD) on every push.

  > [!TIP]
  > A good CI pipeline catches broken builds before they reach production.
  > At minimum: lint → test → build.

CORS
: **Cross-Origin Resource Sharing** — A browser security mechanism that controls
  which domains can make requests to a server. Configured via HTTP headers.
  Common source of errors when building APIs consumed by browsers.

---

## D

DOM
: **Document Object Model** — A tree-like in-memory representation of an HTML document.
  JavaScript interacts with the page by manipulating the DOM. Created when the browser
  parses HTML.

---

## H

HTTP
: **HyperText Transfer Protocol** — The foundation of data communication on the web.
  HTTP/1.1 was standardized in <time datetime="1997">1997</time>;
  HTTP/2 in <time datetime="2015">2015</time>;
  HTTP/3 (based on <abbr title="Quick UDP Internet Connections">QUIC</abbr>) in <time datetime="2022">2022</time>.

---

## J

JSON
: **JavaScript Object Notation** — A lightweight text-based data interchange format.
  Originally derived from JavaScript object syntax but is language-independent.
  Replaced XML as the dominant data format for web APIs around <time datetime="2006">2006</time>.

  ```json
  {
    "name": "example",
    "version": "1.0.0",
    "type": "module"
  }
  ```

---

## R

REST
: **Representational State Transfer** — An architectural style for building web APIs
  defined by Roy Fielding in his doctoral dissertation in <time datetime="2000">2000</time>.
  Key constraints: stateless, uniform interface, client-server separation.

  <q cite="https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm">REST is intended
  to evoke an image of how a well-designed Web application behaves: a network of web pages
  (a virtual state-machine), where the user progresses through the application by selecting
  links (state transitions).</q> — Roy Fielding, <time datetime="2000">2000</time>

---

## S

SSR
: **Server-Side Rendering** — Generating HTML on the server for each request, as opposed
  to client-side rendering where the browser builds the page from JavaScript.
  Improves initial load performance and SEO.

---

## T

TypeScript
: A strongly-typed superset of JavaScript developed by Microsoft, first released in
  <time datetime="2012">2012</time>. Compiles to plain JavaScript. Adds static type
  checking, interfaces, and enums.

  ```typescript
  interface User {
    id: number;
    name: string;
    email?: string;
  }
  ```

---

## W

WebSocket
: A protocol providing full-duplex communication over a single TCP connection.
  Unlike HTTP, the connection stays open, allowing the server to push data to the
  client at any time. Standardized in <time datetime="2011">2011</time> (RFC 6455).
````

- [ ] **Step 2: Verify**

```bash
node bin/markdown.js examples/markdown/full/glossary.md
```

Expected: glossary renders with definition lists, ruby annotations, time dates, q citations, code blocks, alerts.

- [ ] **Step 3: Commit**

```bash
git add examples/markdown/full/glossary.md
git commit -m "docs: add glossary markdown full example"
```

---

## Task 18: Create news-article.md

**Files:**
- Create: `examples/markdown/full/news-article.md`

- [ ] **Step 1: Write file**

````markdown
# Open Source Project Reaches 10 Million Downloads

*By **Alex Rivera** · Published <time datetime="2026-06-10">June 10, 2026</time>*

---

The terminal HTML renderer `cli-html` has reached 10 million monthly downloads on npm,
making it one of the most widely used CLI display libraries in the Node.js ecosystem.

## The Numbers

According to npm download statistics as of <time datetime="2026-06-01">June 1, 2026</time>:

| Metric | Value |
|--------|-------|
| Monthly downloads | 10.2M |
| Weekly downloads | 2.4M |
| GitHub stars | 8,700 |
| Open issues | 23 |
| Contributors | 47 |

The project has grown 340% since <time datetime="2025-01-01">January 2025</time>.

---

## What People Are Saying

<q cite="https://github.com/example/cli-tool">We replaced our custom terminal formatting code
with cli-html and reduced our renderer codebase by 60%.</q>

— comment from a popular CLI tool's release notes

<q cite="https://dev.to/example/building-cli-tools">The theming system is genuinely powerful.
I configured a custom color scheme in about 10 minutes and it handles every edge case
my content throws at it.</q>

— developer blog post

---

## Why Terminals?

> [!NOTE]
> Despite the prevalence of web UIs, terminal-based tools remain dominant for developer
> workflows: CI logs, deployment scripts, code review tools, monitoring dashboards.

The maintainer <ruby>小林健太<rt>こばやしけんた</rt></ruby> (Kobayashi Kenta) wrote
in the project's 5th anniversary post:

<q cite="https://blog.example/cli-html-5-years">The terminal is not going away. If anything,
developers are more productive in the terminal now than they were five years ago.
The tools have simply become better at displaying rich information.</q>

---

## Looking Ahead

The roadmap for <time datetime="2026">2026</time> includes:

- [ ] Screen reader accessibility improvements
- [ ] Right-to-left text support for Arabic and Hebrew
- [ ] Sixel graphics for terminals that support it
- [x] Named `<hr>` styles *(shipped in v6.0.0)*
- [x] `<dialog>` box border *(shipped in v6.0.0)*

The project welcomes contributions. See the [contributing guide](CONTRIBUTING.md) for details.
````

- [ ] **Step 2: Verify**

```bash
node bin/markdown.js examples/markdown/full/news-article.md
```

Expected: news article renders with time dates, q citations with inline HTML, table, task list, blockquote alert, ruby.

- [ ] **Step 3: Commit**

```bash
git add examples/markdown/full/news-article.md
git commit -m "docs: add news article markdown full example"
```

---

## Task 19: Create museum-entry.md

**Files:**
- Create: `examples/markdown/full/museum-entry.md`

- [ ] **Step 1: Write file**

````markdown
# Terracotta Warrior — Museum Collection Entry

**Collection:** Ancient World · **Gallery:** 7, Case 3 · **Accession:** 1985.0234.B

---

## Object

<ruby>兵馬俑<rt>bīngmǎ yǒng</rt></ruby> — Terracotta Warrior Figure

**Period:** Qin dynasty (<ruby>秦朝<rt>Qín cháo</rt></ruby>),
approximately <time datetime="-210">210 BCE</time>

**Dimensions:** Height 183 cm · Weight 130 kg  
**Medium:** Terracotta (fired clay), with traces of original polychrome pigment

---

## Description

This life-size terracotta soldier is one of an estimated 8,000 figures buried in the
mausoleum complex of <ruby>秦始皇<rt>Qín Shǐhuáng</rt></ruby> (Qin Shi Huang),
the first emperor of a unified China.

Each figure was individually crafted and originally painted in vivid colors.
The paint has almost entirely deteriorated due to oxidation on exposure to air
during excavation beginning in <time datetime="1974">1974</time>.

> <q cite="https://bbc.example/terracotta-army">When the pits were first opened,
> the warriors were covered in bright paint — red, green, blue, black, white.
> Within minutes of exposure to air, the lacquer began to curl and the paint began
> to flake.</q>
>
> — Documentary: *The Terracotta Army*, <time datetime="2018">2018</time>

---

## Historical Context

The mausoleum was constructed over <time datetime="PT38Y">38 years</time>, reportedly
using a workforce of 700,000 laborers. The terracotta army was intended to protect the
emperor in the afterlife.

Key dates:

| Event | Date |
|-------|------|
| Construction begins | <time datetime="-246">246 BCE</time> |
| Emperor's death | <time datetime="-210">210 BCE</time> |
| Discovery by farmers | <time datetime="1974-03-29">March 29, 1974</time> |
| UNESCO World Heritage designation | <time datetime="1987">1987</time> |

---

## Provenance

This figure was acquired by the museum in <time datetime="1985">1985</time> through
a formal loan arrangement with the <ruby>陝西省歷史博物館<rt>Shaanxi History Museum</rt></ruby>.
The loan was converted to a permanent acquisition in <time datetime="2003">2003</time>
under a bilateral cultural agreement.

> [!NOTE]
> The museum is committed to transparency in provenance research. Full documentation
> is available for inspection by appointment.

---

## Further Reading

- <cite>The First Emperor: China's Terracotta Army</cite> (British Museum Press, 2007)
- <cite>China: The Three Emperors 1662–1795</cite> — Royal Academy of Arts
- [UNESCO World Heritage: Mausoleum of the First Qin Emperor](https://whc.unesco.org/en/list/441)
````

- [ ] **Step 2: Verify**

```bash
node bin/markdown.js examples/markdown/full/museum-entry.md
```

Expected: museum entry renders with ruby, time dates, q citations inline HTML, tables, blockquote alert.

- [ ] **Step 3: Commit**

```bash
git add examples/markdown/full/museum-entry.md
git commit -m "docs: add museum entry markdown full example"
```

---

## Task 20: Create contributing.md

**Files:**
- Create: `examples/markdown/full/contributing.md`

- [ ] **Step 1: Write file**

````markdown
# Contributing to cli-html

Thank you for your interest in contributing! This guide covers everything you need to know
to submit a bug report, propose a feature, or send a pull request.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How to Contribute](#how-to-contribute)
4. [Pull Request Process](#pull-request-process)
5. [Style Guide](#style-guide)

---

## Code of Conduct

This project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/).
By participating, you agree to uphold a welcoming, respectful environment.

> [!IMPORTANT]
> Harassment of any kind will result in immediate removal from the project.

---

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- git

### Setup

```bash
git clone https://github.com/example/cli-html.git
cd cli-html
npm install
npm test
```

All 195 tests should pass. If they don't, open an issue before proceeding.

### Project Structure

```
cli-html/
├── bin/           # CLI entry points (html.js, markdown.js, md.js)
├── lib/
│   ├── core/      # Color, attr, merge utilities
│   ├── tag-helpers/   # blockTag, inlineTag primitives
│   ├── tags/      # One file per tag group
│   └── utils/     # render-tag, get-theme, etc.
├── config.yaml    # Default theme configuration (single source of truth)
├── examples/      # Example files and screenshots
└── test/          # Node built-in test runner
```

---

## How to Contribute

### Reporting Bugs

Before opening an issue:
- [ ] Search existing issues for duplicates
- [ ] Check you're on the latest version (`npm list cli-html`)
- [ ] Test with `DEBUG=1 node bin/html.js your-file.html` for debug output

**Include in your report:**
- cli-html version
- Node.js version
- Operating system
- Minimal reproduction HTML/markdown
- Expected vs. actual output (use `FORCE_COLOR=1` for colored output)

### Proposing Features

Open an issue with the `enhancement` label. Describe:
1. The use case (what problem does this solve?)
2. Proposed configuration keys (following existing `config.yaml` structure)
3. Proposed `data-cli-*` attributes (following naming conventions in `DATA_ATTRIBUTES.md`)

> [!TIP]
> Features that improve existing standard HTML elements are more likely to be accepted
> than features that add non-standard behavior. See the project philosophy in `CLAUDE.md`.

---

## Pull Request Process

1. Fork the repository and create a branch: `git checkout -b feat/your-feature`
2. Write failing tests first (TDD)
3. Implement the feature
4. Update `config.yaml` with new defaults
5. Update `index.d.ts` with TypeScript types
6. Update `DATA_ATTRIBUTES.md` if adding `data-cli-*` attributes
7. Add an example to `examples/html/tags/` or `examples/markdown/features/`
8. Run `npm test` — all tests must pass
9. Run `npm run fix` — no lint errors
10. Open a PR against `master`

### PR Checklist

- [ ] Tests written and passing (`npm test`)
- [ ] `config.yaml` updated with defaults
- [ ] TypeScript types updated (`index.d.ts`)
- [ ] `DATA_ATTRIBUTES.md` updated (if adding `data-cli-*` attributes)
- [ ] Example file added or updated
- [ ] No hardcoded fallback values that duplicate `config.yaml`

---

## Style Guide

### JavaScript

- **ESM only** — `import`/`export`, no `require()`
- **No comments** unless the WHY is non-obvious
- **`??` not `||`** for theme reads (preserves intentional empty strings)
- **`getAttr(tag, 'dot.path')`** for `data-cli-*` attributes
- **`getAttribute(tag, 'attr', default)`** for standard HTML attributes

### config.yaml

Follow the standard configuration structures documented in `CLAUDE.md`:
- `prefix/suffix` for markers that wrap content
- `indicator` for single leading markers
- `border/padding` for container elements
- `enabled` flag for optional features

### Commit Messages

```
feat: add named styles to <hr>
fix: ruby color uses own theme instead of span
docs: add dialog box border examples
test: add rt annotation customization tests
```

---

## Questions?

Open a [GitHub Discussion](https://github.com/example/cli-html/discussions) for questions
not suitable for issues. The maintainer responds within a few days.

<kbd>Ctrl+C</kbd> to cancel any running command. <kbd>Ctrl+Z</kbd> to suspend.
````

- [ ] **Step 2: Verify**

```bash
node bin/markdown.js examples/markdown/full/contributing.md
```

Expected: CONTRIBUTING doc renders with code blocks, task lists, blockquote alerts, table-of-contents list, kbd shortcuts.

- [ ] **Step 3: Commit**

```bash
git add examples/markdown/full/contributing.md
git commit -m "docs: add CONTRIBUTING markdown full example"
```

---

## Task 21: Create architecture.md

**Files:**
- Create: `examples/markdown/full/architecture.md`

- [ ] **Step 1: Write file**

````markdown
# cli-html Architecture

This document describes the internal architecture of cli-html for contributors and maintainers.

---

## Overview

cli-html takes HTML (or Markdown → HTML) and renders it to styled terminal output using ANSI escape codes via [chalk](https://github.com/chalk/chalk).

The rendering pipeline:

```
Input (HTML string or file)
  │
  ▼
parse5 (HTML parser)
  │ AST
  ▼
render-tag.js (recursive renderer)
  │
  ├── tag registry (lib/tags.js)
  │     └── tag handlers (lib/tags/*.js)
  │
  ├── theme (lib/utils/get-theme.js)
  │     └── config.yaml (base) + user config (override)
  │
  └── output (ANSI-colored string)
```

For Markdown input, an additional step runs first:

```
Markdown string
  │
  ▼
markdown-it (+ plugins)
  │ HTML string
  ▼
(same pipeline as above)
```

---

## Core Modules

### `lib/utils/render-tag.js`

The heart of the renderer. Recursively walks the parse5 AST.

- Uses `WeakMap` for caching (auto-GC when nodes are no longer referenced)
- `MAX_DEPTH = 100` prevents infinite recursion on malformed HTML
- Context object flows through the tree: `{ theme, lineWidth, asciiMode, depth }`

```javascript
// Simplified render-tag logic
function renderNode(node, context) {
  if (context.depth > MAX_DEPTH) return null;

  const handler = tagRegistry[node.nodeName];
  if (!handler) return renderChildren(node, context);

  return handler(node, { ...context, depth: context.depth + 1 });
}
```

### `lib/utils/get-theme.js`

Merges base config (`config.yaml`) with user overrides.

```javascript
export function getTheme(customInput = {}) {
  return deepMerge(BASE_THEME, customInput);
}
```

Theme values are **plain strings** (`"red bold"`, `"bgBlue white"`). No chalk functions in the theme object.

### `lib/core/color.js`

Applies chalk-string colors to text.

```javascript
applyColor(spec, text)            // spec is a chalk-string or null
applyThemeColor(custom, theme, text) // custom attr override → theme → no color
```

### `lib/core/attr.js`

Reads `data-cli-*` attributes via dot-path notation.

```javascript
getAttr(tag, 'prefix.marker')  // reads data-cli-prefix-marker
getAttr(tag, 'border.color')   // reads data-cli-border-color
```

Returns `null` when attribute absent. Always returns strings (not booleans).
Boolean attributes: check `getAttr(tag, 'key') === 'true'`.

---

## Tag Handler Pattern

Every tag handler has the same signature:

```javascript
export const myTag = (tag, context) => {
  // Returns one of:
  // { type: 'inline', value, pre: null, post: null, nodeName }
  // { type: 'block', value, marginTop?, marginBottom? }
  // null (suppress output)
};
```

For block elements, use `blockTag()` from `lib/tag-helpers/block-tag.js`.
For inline elements, use `inlineTag()` from `lib/tag-helpers/inline-tag.js`.

```javascript
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttr } from '../core/attr.js';
import { applyThemeColor } from '../core/color.js';

export const time = inlineTag((value, tag, context) => {
  const theme = context.theme.time ?? {};
  return applyThemeColor(getAttr(tag, 'color'), theme.color, value);
});
```

---

## Configuration System

### Two-level config

1. **Base config** (`config.yaml`) — default values for every theme property
2. **User config** — platform-specific file, merged over base at startup

User config locations:
- Linux: `~/.config/cli-html/config.yaml`
- macOS: `~/Library/Preferences/cli-html/config.yaml`
- Windows: `%LOCALAPPDATA%\cli-html\Config\config.yaml`

### Three-level override per element

Priority (high → low):
1. `data-cli-*` attribute on the HTML element
2. User config (`~/.config/cli-html/config.yaml`)
3. Base config (`config.yaml`)

In code:
```javascript
const color = getAttr(tag, 'color') ?? context.theme.myTag?.color;
```

---

## Adding a New Tag

1. Create `lib/tags/your-tag.js`
2. Import and register in `lib/tags.js`
3. Add defaults to `config.yaml`
4. Add TypeScript types to `index.d.ts`
5. Add example to `examples/html/tags/your-tag.html`
6. Add tests to `test/rendering/config-override.test.js`

See `CLAUDE.md` for the complete tag authoring guide.

---

## Performance

- `WeakMap` caching in `render-tag.js`: cached render results per node
- LRU eviction (max 1000 entries) for string length calculations
- Theme is computed once at startup, not per-render
- `registerCache()` system for coordinated cache management

---

## Testing

```bash
npm test                  # Run all 195 tests
FORCE_COLOR=1 node --test # With forced color output
```

Tests use Node's built-in test runner. Test files in `test/`:

```
test/
├── rendering/
│   ├── config-override.test.js   # Theme + data-cli-* override tests
│   └── snapshot.test.js          # Visual snapshot tests
└── utils/
    └── *.test.js                 # Utility function tests
```
````

- [ ] **Step 2: Verify**

```bash
node bin/markdown.js examples/markdown/full/architecture.md
```

Expected: architecture doc renders with headings hierarchy, code blocks, ASCII diagram, definition-like sections, lists.

- [ ] **Step 3: Commit**

```bash
git add examples/markdown/full/architecture.md
git commit -m "docs: add architecture markdown full example"
```

---

## Task 22: Create migration-guide.md

**Files:**
- Create: `examples/markdown/full/migration-guide.md`

- [ ] **Step 1: Write file**

````markdown
# Migration Guide: v5 → v6

This guide covers breaking changes and migration steps when upgrading from cli-html v5.x to v6.0.

> [!WARNING]
> v6.0 contains breaking changes to theme configuration. Read this guide carefully before upgrading.

---

## Quick Summary

| What changed | v5 behavior | v6 behavior |
|---|---|---|
| Theme color values | Functions or strings | Strings only |
| `hr` config | `hr.marker: '─'` | `hr.style: single` |
| `getCustomAttributes()` | Used in tag handlers | Removed — use `getAttr()` |
| `parseStyleEntry()` | Used in get-theme.js | Removed |
| `dialog` rendering | Plain colored block | Box border |
| `<video>` / `<audio>` | Empty (void element) | Inline placeholder |

---

## Breaking Change 1: Theme Color Format

### Before (v5)

```javascript
// Custom theme using function values — NO LONGER WORKS
renderHTML(html, {
  h1: (text) => chalk.bold.red(text),  // ❌ functions not accepted
  code: { color: chalk.yellow }         // ❌ chalk object not accepted
});
```

### After (v6)

```javascript
// Use chalk-string format
renderHTML(html, {
  h1: 'bold red',                       // ✅ chalk-string
  code: { color: 'yellow' }             // ✅ chalk-string in object
});
```

**How to migrate:**

- [ ] Search your config for any function values
- [ ] Replace `chalk.red` → `'red'`
- [ ] Replace `chalk.bold.red` → `'bold red'`
- [ ] Replace `chalk.bgBlue.white` → `'bgBlue white'`

Run `cli-html --validate-config` to check your config file for invalid values.

---

## Breaking Change 2: HR Configuration

### Before (v5)

```yaml
# config.yaml
theme:
  hr:
    marker: '─'   # Character to repeat
    color: gray
```

### After (v6)

```yaml
# config.yaml
theme:
  hr:
    style: single   # single | double | bold | dashed | dotted
    marker: ''      # explicit override (empty = use style)
    color: gray
```

**How to migrate:**

- [ ] If you had `hr.marker: '─'` → change to `hr.style: single` (or leave unset — `single` is default)
- [ ] If you had a custom marker like `hr.marker: '='` → keep it as `hr.marker: '='` (still supported)
- [ ] Update any `data-cli-marker` attributes to `data-cli-style="double"` etc. where applicable

---

## Breaking Change 3: `getCustomAttributes()` Removed

This is an **internal API change** — only affects custom tag handlers.

### Before (v5)

```javascript
import { getCustomAttributes } from '../utilities.js';

export const myTag = (tag, context) => {
  const custom = getCustomAttributes(tag);
  const color = custom.myColor || context.theme.myTag?.color;
  // ...
};
```

### After (v6)

```javascript
import { getAttr } from '../core/attr.js';

export const myTag = (tag, context) => {
  const color = getAttr(tag, 'color') ?? context.theme.myTag?.color;
  // ...
};
```

**How to migrate:**

- [ ] Replace `getCustomAttributes(tag).someAttr` with `getAttr(tag, 'dot.path')`
- [ ] Change `||` to `??` for theme fallbacks

---

## New in v6: Non-Breaking

These features are **additive** — existing code continues to work.

### `<dialog>` Box Border

~~Previously rendered as plain colored block.~~

Now renders with a configurable box border. To opt out or customize:

```yaml
theme:
  dialog:
    border:
      style: single  # round | single | double | bold | classic
      color: gray    # change from default cyan
```

### `<video>` / `<audio>` Inline Placeholders

~~Previously: void elements, rendered nothing.~~

Now: render as inline title with indicator. Existing HTML that uses these elements
will now show placeholders. If you want to suppress:

```yaml
theme:
  video:
    indicator:
      marker: ''
    prefix:
      marker: ''
    suffix:
      marker: ''
```

### `<time>` Datetime Display

Opt-in: `time.datetime.enabled: false` by default. No change to existing output.

To enable:

```yaml
theme:
  time:
    datetime:
      enabled: true
```

---

## Upgrade Steps

- [ ] `npm install cli-html@6` to upgrade
- [ ] Run `cli-html --validate-config` to check config
- [ ] Fix any theme color function values (see Breaking Change 1)
- [ ] Update `hr` config if you customized it (see Breaking Change 2)
- [ ] Update any custom tag handlers (see Breaking Change 3)
- [ ] Run `npm test` in your project to verify nothing broke
- [ ] Check rendered output visually with your common HTML/markdown files

---

## Getting Help

- Open an issue: [github.com/example/cli-html/issues](https://github.com/example/cli-html/issues)
- Check the [CHANGELOG](CHANGELOG.md) for the full list of changes
````

- [ ] **Step 2: Verify**

```bash
node bin/markdown.js examples/markdown/full/migration-guide.md
```

Expected: migration guide renders with blockquote warnings, tables, code blocks (before/after), task checklists, del/ins strikethrough.

- [ ] **Step 3: Commit**

```bash
git add examples/markdown/full/migration-guide.md
git commit -m "docs: add migration guide markdown full example"
```

---

## Task 23: Create release-notes.md

**Files:**
- Create: `examples/markdown/full/release-notes.md`

- [ ] **Step 1: Write file**

````markdown
# Release Notes

Release history for cli-html. For upgrade instructions, see [Migration Guide](migration-guide.md).

---

## v6.0.0

> [!IMPORTANT]
> Breaking changes. See [migration guide](migration-guide.md) before upgrading.

**Released:** <time datetime="2026-06-10">June 10, 2026</time>

### New Features

- **`<hr>` named styles** — `single`, `double`, `bold`, `dashed`, `dotted` via `hr.style` config or `data-cli-style` attribute
- **`<ruby>`/`<rt>` configurable** — custom prefix/suffix markers for annotations; fixed color inheritance bug
- **`<dialog>` box border** — configurable box border using boxen (same system as `<figure>` and `<fieldset>`)
- **`<time>` datetime display** — opt-in display of `datetime` attribute value after text
- **`<q>` cite as link** — opt-in rendering of `cite` attribute as external link using `a.external` marker config
- **`<video>`/`<audio>` inline** — inline title placeholder instead of empty void element
- **`<dt>` suffix** — configurable suffix marker after term text (default `::`)

### Breaking Changes

- Theme color values must be chalk-strings (functions no longer accepted)
- `hr.marker: '─'` replaced by `hr.style: single`
- `getCustomAttributes()` removed (internal API) — use `getAttr()` from `lib/core/attr.js`
- `parseStyleEntry()` removed — theme is now plain deepMerged strings

### Internal

- Core rewrite: `getTheme()` is now a 15-line deepMerge (was 1064 lines)
- `lib/core/` directory added: `attr.js`, `color.js`, `disabled.js`, `merge.js`

---

## v5.3.0

**Released:** <time datetime="2026-05-15">May 15, 2026</time>

### New Features

- Enhanced input types: color picker, password strength indicator, email prefix, date formatting
- Configurable button element (`<button>` separate from `<input type="button">`)
- `<select>` with selected option indicator

### Fixed

- Table responsive mode threshold calculation off by one
- `<meter>` high/low boundary markers not rendering at exact boundary values
- `<progress>` percentage label alignment with wide terminals

---

## v5.2.0

**Released:** <time datetime="2026-04-01">April 1, 2026</time>

### New Features

- **`<details>`/`<summary>`** with configurable open/closed indicator and box border
- **`<fieldset>`** with legend title and border

### Changed

- Minimum Node.js version raised to 20.0.0
- `config.yaml` table sub-elements moved to top-level keys

---

## v5.0.0

**Released:** <time datetime="2026-01-10">January 10, 2026</time>

> [!WARNING]
> Breaking: table and button configuration moved. See v5 migration notes.

### New Features

- Full GFM support for markdown rendering (tables, task lists, footnotes, alerts)
- `<figure>` with configurable box border
- Complete input type coverage: checkbox, radio, range, file, color, date, email

### Breaking Changes

- Table elements now top-level theme keys (`td`, `th`, `tr` — not `table.td`)
- `<button>` uses `button.*` theme (not `input.button.*`)

---

## v4.x

**End of life:** <time datetime="2026-01-10">January 10, 2026</time>

v4.x is no longer maintained. Upgrade to v5.0.0 or later.

---

## Earlier Versions

See [GitHub releases](https://github.com/example/cli-html/releases) for release notes
prior to v4.0.0.
````

- [ ] **Step 2: Verify**

```bash
node bin/markdown.js examples/markdown/full/release-notes.md
```

Expected: release notes render with headings, blockquote alerts, lists, inline code, time tags, hr dividers between versions.

- [ ] **Step 3: Commit**

```bash
git add examples/markdown/full/release-notes.md
git commit -m "docs: add release notes markdown full example"
```
