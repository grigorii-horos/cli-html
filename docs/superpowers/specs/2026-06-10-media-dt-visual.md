# Media & Definition List Visual Enhancements

**Goal:** Render `<video>` and `<audio>` as meaningful inline placeholders, and add `::` suffix styling to `<dt>` in definition lists.

**Philosophy:** Improve existing standard HTML elements — no new non-standard elements. Consistent with existing patterns (`<img>`, `<blockquote>`, `<h1>`).

---

## Feature 1: `<video>` and `<audio>` inline placeholders

### Current state

Both tags are `voidTag` — render nothing at all.

### Target output

```
▶ [Demo Video]        ← <video title="Demo Video" src="demo.mp4">
♪ [song.mp3]          ← <audio src="song.mp3">
♪ [My Podcast]        ← <audio title="My Podcast">fallback text</audio>
▶ [Video]             ← <video> (no src, no title, no text)
```

### Text resolution priority

1. `title` attribute
2. Child text content (fallback text inside the tag)
3. Basename of `src` attribute (e.g. `demo.mp4` from `/path/to/demo.mp4`)
4. Hardcoded fallback: `"Video"` / `"Audio"`

### Implementation

New file: `lib/tags/media.js`

Pattern mirrors `lib/tags/img.js` exactly — indicator + prefix + text + suffix, all configurable.

Both `<video>` and `<audio>` use `inlineTag`.

### config.yaml additions

```yaml
video:
  indicator:
    marker: '▶'
    color: cyan
  prefix:
    marker: '['
    color: gray
  suffix:
    marker: ']'
    color: gray
  title:
    color: cyan

audio:
  indicator:
    marker: '♪'
    color: cyan
  prefix:
    marker: '['
    color: gray
  suffix:
    marker: ']'
    color: gray
  title:
    color: cyan
```

### data-cli-* attributes

Same as `<img>`:
- `data-cli-indicator-marker`, `data-cli-indicator-color`
- `data-cli-prefix-marker`, `data-cli-prefix-color`
- `data-cli-suffix-marker`, `data-cli-suffix-color`
- `data-cli-title-color`

### Registration

`lib/tags.js`: remove `video` and `audio` from `void.js` imports, add import from `media.js`.

---

## Feature 2: `<dt>` suffix `::`

### Current state

`<dt>` renders as `blue bold` colored text — no visual marker distinguishing it from surrounding content.

### Target output

```
HTML ::
  Hyper Text Markup Language

CSS ::
  Cascading Style Sheets
```

### Implementation

Modify `lib/tags/definitions.js` — `dt` handler adds suffix from theme config.

Uses `createStyledTagWithMarkers` pattern (already used by `samp`, `sub`, `sup`, `abbr`).

### config.yaml changes

```yaml
dt:
  color: blue bold
  suffix:
    marker: ' ::'
    color: gray dim
```

`dd` and `dl` — unchanged.

### data-cli-* attributes

- `data-cli-suffix-marker`
- `data-cli-suffix-color`

---

## Files changed

| File | Change |
|------|--------|
| `lib/tags/media.js` | New — video + audio handlers |
| `lib/tags/void.js` | Remove video, audio exports |
| `lib/tags.js` | Import video, audio from media.js |
| `lib/tags/definitions.js` | dt uses suffix pattern |
| `config.yaml` | Add video, audio sections; update dt |
| `index.d.ts` | Add VideoStyle, AudioStyle types; update DtStyle |

## Out of scope

- Actual media playback or preview
- Image rendering (ASCII art, sixel)
- `<source>` children of `<video>`/`<audio>` (use `src` on parent only)
