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

The term <ruby>WWW<rt>World Wide Web</rt></ruby> refers to the internet.

Common Japanese phrases:
- <ruby>ASAP<rt>As Soon As Possible</rt></ruby> — quickly
- <ruby>FYI<rt>For Your Information</rt></ruby> — informational
- <ruby>DIY<rt>Do It Yourself</rt></ruby> — self-made

Example: <ruby>ETA<rt>Estimated Time of Arrival</rt></ruby> (arrival)

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

The researcher <ruby>Alice Smith<rt>A. Smith</rt></ruby> stated:
<q cite="https://research.example/2026" data-cli-cite-enabled="true">The results exceeded our expectations.</q>
The announcement was made on <time datetime="2026-06-10" data-cli-datetime-enabled="true">June 10, 2026</time>.
A recording is available: <video title="Press Conference Recording"></video>
