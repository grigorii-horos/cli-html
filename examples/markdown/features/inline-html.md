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
