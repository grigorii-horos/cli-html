# Media & Definition List Visual Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render `<video>` and `<audio>` as inline placeholders (currently invisible voidTags), and add ` ::` suffix styling to `<dt>` in definition lists.

**Architecture:** Two independent tasks, each follows the existing pattern. `<video>`/`<audio>` mirrors `lib/tags/img.js` exactly (indicator + prefix + text + suffix, all from config). `<dt>` suffix mirrors `createStyledTagWithMarkers` used by `samp`/`sub`/`sup`. All config in `config.yaml` — no hardcoded fallbacks.

**Tech Stack:** Node.js ESM, `lib/core/attr.js` (`getAttr`), `lib/core/color.js` (`applyColor`, `applyThemeColor`), `lib/utilities.js` (`getAttribute`), `npm test` (Node built-in test runner).

---

## File Map

| File | Change |
|------|--------|
| `lib/tags/media.js` | **Create** — video + audio handlers |
| `lib/tags/void.js` | **Modify** — remove audio, video exports |
| `lib/tags.js` | **Modify** — import audio, video from media.js instead of void.js |
| `lib/tags/definitions.js` | **Modify** — dt adds suffix from theme |
| `config.yaml` | **Modify** — add video/audio sections; add suffix to dt |
| `index.d.ts` | **Modify** — add VideoStyle, AudioStyle; update dt type |
| `test/rendering/config-override.test.js` | **Modify** — add tests for all changes |

---

## Task 1: `<dt>` suffix `::`

**Files:**
- Modify: `lib/tags/definitions.js`
- Modify: `config.yaml:327-329`
- Modify: `index.d.ts:572`
- Test: `test/rendering/config-override.test.js`

- [ ] **Step 1: Write failing test**

Add to `test/rendering/config-override.test.js`, inside the top-level `describe`:

```javascript
describe('definition list — dt suffix', () => {
  it('default config renders :: suffix', () => {
    const plain = stripAnsi(renderHTML('<dl><dt>HTML</dt><dd>Hyper Text</dd></dl>'));
    assert.ok(plain.includes('HTML ::'), `Expected 'HTML ::' in: ${plain}`);
  });

  it('custom suffix marker from theme is respected', () => {
    const plain = stripAnsi(renderHTML(
      '<dl><dt>CSS</dt></dl>',
      { dt: { suffix: { marker: ' —' } } }
    ));
    assert.ok(plain.includes('CSS —'), `Expected 'CSS —' in: ${plain}`);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test 2>&1 | grep -A3 "dt suffix"
```

Expected: `AssertionError` — `HTML ::` not in output (currently no suffix).

- [ ] **Step 3: Add suffix to config.yaml**

Replace lines 327–329 in `config.yaml`:

```yaml
  dt:
    color: blue bold  # Definition term color
    suffix:
      marker: ' ::'  # Suffix after term
      color: gray dim
```

- [ ] **Step 4: Update `lib/tags/definitions.js`**

Replace the `dt` export (currently lines ~1–14):

```javascript
import compose from 'compose-function';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getAttribute, indentify } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';

export const dt = (tag, context) => {
  const theme = context.theme.dt || {};
  return blockTag(
    (value) => {
      const styledValue = applyThemeColor(getAttr(tag, 'color'), theme.color, value);
      const suffix = getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker ?? '';
      const styledSuffix = applyColor(getAttr(tag, 'suffix.color') ?? theme.suffix?.color, suffix);
      return `${styledValue}${styledSuffix}`;
    },
    { marginTop: 1, marginBottom: 1 },
  )(tag, { ...context, lineWidth: context.lineWidth - 1 });
};
```

Keep `dd` and `dl` exports unchanged.

- [ ] **Step 5: Update `index.d.ts` — DtStyle**

Find line 572: `dt?: ChalkString;`

Replace with:

```typescript
dt?: ChalkString | {
  color?: ChalkString;
  suffix?: {
    marker?: string;
    color?: ChalkString;
  };
};
```

- [ ] **Step 6: Run tests to verify pass**

```bash
npm test 2>&1 | grep -E "^# (pass|fail)"
```

Expected: `# pass 170`, `# fail 0` (168 existing + 2 new).

- [ ] **Step 7: Commit**

```bash
git add lib/tags/definitions.js config.yaml index.d.ts test/rendering/config-override.test.js
git commit -m "feat: add :: suffix to <dt> in definition lists"
```

---

## Task 2: `<video>` and `<audio>` inline placeholders

**Files:**
- Create: `lib/tags/media.js`
- Modify: `lib/tags/void.js`
- Modify: `lib/tags.js`
- Modify: `config.yaml`
- Modify: `index.d.ts`
- Test: `test/rendering/config-override.test.js`

- [ ] **Step 1: Write failing tests**

Add to `test/rendering/config-override.test.js`:

```javascript
describe('video placeholder', () => {
  it('renders indicator and title attribute', () => {
    const plain = stripAnsi(renderHTML('<video src="demo.mp4" title="Demo Video"></video>'));
    assert.ok(plain.includes('Demo Video'), `Expected 'Demo Video' in: ${plain}`);
    assert.ok(plain.includes('▶'), `Expected '▶' in: ${plain}`);
  });

  it('falls back to src basename when no title', () => {
    const plain = stripAnsi(renderHTML('<video src="/path/to/clip.mp4"></video>'));
    assert.ok(plain.includes('clip.mp4'), `Expected 'clip.mp4' in: ${plain}`);
  });

  it('falls back to "Video" when no src or title', () => {
    const plain = stripAnsi(renderHTML('<video></video>'));
    assert.ok(plain.includes('Video'), `Expected 'Video' in: ${plain}`);
  });

  it('custom indicator marker from theme is respected', () => {
    const plain = stripAnsi(renderHTML(
      '<video title="clip"></video>',
      { video: { indicator: { marker: '[VID]' } } }
    ));
    assert.ok(plain.includes('[VID]'), `Expected '[VID]' in: ${plain}`);
  });
});

describe('audio placeholder', () => {
  it('renders indicator and title attribute', () => {
    const plain = stripAnsi(renderHTML('<audio src="song.mp3" title="My Song"></audio>'));
    assert.ok(plain.includes('My Song'), `Expected 'My Song' in: ${plain}`);
    assert.ok(plain.includes('♪'), `Expected '♪' in: ${plain}`);
  });

  it('falls back to src basename when no title', () => {
    const plain = stripAnsi(renderHTML('<audio src="/music/track.ogg"></audio>'));
    assert.ok(plain.includes('track.ogg'), `Expected 'track.ogg' in: ${plain}`);
  });

  it('falls back to "Audio" when no src or title', () => {
    const plain = stripAnsi(renderHTML('<audio></audio>'));
    assert.ok(plain.includes('Audio'), `Expected 'Audio' in: ${plain}`);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test 2>&1 | grep -A3 "video placeholder\|audio placeholder"
```

Expected: `AssertionError` — nothing renders (voidTag = empty string).

- [ ] **Step 3: Add video/audio sections to config.yaml**

Find the `# VISUAL ELEMENTS` section (after `marquee` block, near end of file). Add before `center:`:

```yaml
  # ========
  # MEDIA
  # ========

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

- [ ] **Step 4: Create `lib/tags/media.js`**

```javascript
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor } from '../core/color.js';

const getMediaTitle = (tag, fallback) => {
  const title = getAttribute(tag, 'title', null);
  if (title) return title;
  const src = getAttribute(tag, 'src', null);
  if (src) return src.split('/').pop();
  return fallback;
};

const createMediaTag = (themeKey, fallback) => (tag, context) => {
  const title = getMediaTitle(tag, fallback);
  const theme = context.theme[themeKey] || {};

  const indicatorMarker = getAttr(tag, 'indicator.marker') ?? theme.indicator?.marker;
  const prefixMarker = getAttr(tag, 'prefix.marker') ?? theme.prefix?.marker;
  const suffixMarker = getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker;

  const indicatorColor = getAttr(tag, 'indicator.color') ?? theme.indicator?.color;
  const prefixColor = getAttr(tag, 'prefix.color') ?? theme.prefix?.color;
  const suffixColor = getAttr(tag, 'suffix.color') ?? theme.suffix?.color;
  const titleColor = getAttr(tag, 'title.color') ?? theme.title?.color;

  return {
    pre: null,
    value: `${applyColor(indicatorColor, indicatorMarker)}${applyColor(prefixColor, prefixMarker)}${applyColor(titleColor, title)}${applyColor(suffixColor, suffixMarker)}`,
    post: null,
    type: 'inline',
    nodeName: tag.nodeName,
  };
};

export const video = createMediaTag('video', 'Video');
export const audio = createMediaTag('audio', 'Audio');
```

- [ ] **Step 5: Remove `audio` and `video` from `lib/tags/void.js`**

Remove lines 4 and 39:

```javascript
export {
  voidTag as applet,
  voidTag as area,
  // audio removed — handled by lib/tags/media.js
  voidTag as base,
  voidTag as basefont,
  voidTag as bgsound,
  voidTag as canvas,
  voidTag as datalist,
  voidTag as embed,
  voidTag as frame,
  voidTag as frameset,
  voidTag as head,
  voidTag as iframe,
  voidTag as keygen,
  voidTag as link,
  voidTag as map,
  voidTag as math,
  voidTag as meta,
  voidTag as noframes,
  voidTag as noscript,
  voidTag as object,
  voidTag as optgroup,
  voidTag as option,
  voidTag as param,
  voidTag as plaintext,
  voidTag as portal,
  voidTag as script,
  voidTag as select,
  voidTag as slot,
  voidTag as source,
  voidTag as style,
  voidTag as summary,
  voidTag as svg,
  voidTag as legend,
  voidTag as template,
  voidTag as title,
  voidTag as track,
  // video removed — handled by lib/tags/media.js
  voidTag as wbr,
  voidTag as xmp,
} from '../tag-helpers/void-tag.js';
```

- [ ] **Step 6: Update `lib/tags.js`**

Add import after line 34 (`import { img } from "./tags/img.js";`):

```javascript
import { audio, video } from "./tags/media.js";
```

Remove `audio` and `video` from the void.js import block (lines 81 and 112).

- [ ] **Step 7: Update `index.d.ts` — add VideoStyle, AudioStyle**

After the `ImgStyle` interface (after line 451), add:

```typescript
/**
 * Video placeholder style configuration
 */
export interface VideoStyle {
  indicator?: { marker?: string; color?: ChalkString; };
  prefix?: { marker?: string; color?: ChalkString; };
  suffix?: { marker?: string; color?: ChalkString; };
  title?: { color?: ChalkString; };
}

/**
 * Audio placeholder style configuration
 */
export interface AudioStyle {
  indicator?: { marker?: string; color?: ChalkString; };
  prefix?: { marker?: string; color?: ChalkString; };
  suffix?: { marker?: string; color?: ChalkString; };
  title?: { color?: ChalkString; };
}
```

Find `img?: ImgStyle;` in the `ThemeConfig` interface and add after it:

```typescript
video?: VideoStyle;
audio?: AudioStyle;
```

- [ ] **Step 8: Run all tests**

```bash
npm test 2>&1 | grep -E "^# (tests|pass|fail)"
```

Expected: `# tests 177`, `# pass 177`, `# fail 0`.

- [ ] **Step 9: Manual smoke test**

```bash
node -e "
import('cli-html').then(({ renderHTML }) => {
  console.log(renderHTML('<video src=\"demo.mp4\" title=\"Demo\"></video>'));
  console.log(renderHTML('<audio src=\"/music/song.ogg\"></audio>'));
  console.log(renderHTML('<dl><dt>HTML</dt><dd>Hyper Text Markup Language</dd></dl>'));
});
"
```

Expected output includes:
- `▶ [Demo]`
- `♪ [song.ogg]`
- `HTML ::`

- [ ] **Step 10: Commit**

```bash
git add lib/tags/media.js lib/tags/void.js lib/tags.js config.yaml index.d.ts test/rendering/config-override.test.js
git commit -m "feat: render <video> and <audio> as inline placeholders"
```
