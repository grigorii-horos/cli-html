import { describe, it } from 'node:test';
import assert from 'node:assert';

import { renderHTML } from '../../index.js';
import { stripAnsi } from '../helpers/strip-ansi.js';

const render = (html, theme = {}) => stripAnsi(renderHTML(html, { lineWidth: { value: 80 }, ...theme })).trim();

describe('img', () => {
  it('shows alt text, falling back to title and then "Image"', () => {
    assert.strictEqual(render('<img alt="Logo" src="a.png">'), '![Logo]');
    assert.strictEqual(render('<img title="Tip" src="a.png">'), '![Tip]');
    assert.strictEqual(render('<img src="a.png">'), '![Image]');
  });

  it('accepts custom markers, including empty ones', () => {
    assert.strictEqual(
      render('<img alt="x" data-cli-indicator-marker="" data-cli-prefix-marker="<" data-cli-suffix-marker=">">'),
      '<x>',
    );
  });

  it('uses theme markers', () => {
    assert.strictEqual(render('<img alt="x">', { img: { indicator: { marker: '📷 ' } } }), '📷 [x]');
  });
});

describe('br', () => {
  it('breaks lines inside a paragraph', () => {
    assert.strictEqual(render('<p>one<br>two<br/>three</p>'), 'one\ntwo\nthree');
  });
});

describe('data', () => {
  it('renders only the text by default', () => {
    assert.strictEqual(render('<data value="42">Answer</data>'), 'Answer');
  });

  it('shows the value when enabled by attribute or theme', () => {
    assert.strictEqual(render('<data value="42" data-cli-value-enabled="true">Answer</data>'), 'Answer [42]');
    assert.strictEqual(render('<data value="42">Answer</data>', { data: { value: { enabled: true } } }), 'Answer [42]');
  });

  it('accepts custom value markers', () => {
    assert.strictEqual(
      render('<data value="42" data-cli-value-enabled="true" data-cli-value-prefix-marker=" (" data-cli-value-suffix-marker=")">Answer</data>'),
      'Answer (42)',
    );
  });

  it('ignores an empty value', () => {
    assert.strictEqual(render('<data data-cli-value-enabled="true">Answer</data>'), 'Answer');
  });
});

describe('blink', () => {
  it('renders plain text by default', () => {
    assert.strictEqual(render('<blink>Hi</blink>'), 'Hi');
  });

  it('shows the indicator at the configured position', () => {
    assert.strictEqual(render('<blink data-cli-animation-enabled="true">Hi</blink>'), '↯ Hi ↯');
    assert.strictEqual(render('<blink data-cli-animation-enabled="true" data-cli-animation-indicator-position="before">Hi</blink>'), '↯ Hi');
    assert.strictEqual(render('<blink data-cli-animation-enabled="true" data-cli-animation-position="after" data-cli-animation-marker="*">Hi</blink>'), 'Hi *');
  });
});

describe('marquee', () => {
  it('shows the direction indicator', () => {
    assert.strictEqual(render('<marquee>Hi</marquee>'), '⟵ Hi');
    assert.strictEqual(render('<marquee direction="right">Hi</marquee>'), '⟶ Hi');
  });

  it('falls back to the left indicator for an unknown direction', () => {
    assert.strictEqual(render('<marquee direction="diagonal">Hi</marquee>'), '⟵ Hi');
  });

  it('can be disabled or moved after the text', () => {
    assert.strictEqual(render('<marquee data-cli-direction-enabled="false">Hi</marquee>'), 'Hi');
    assert.strictEqual(render('<marquee data-cli-direction-position="after">Hi</marquee>'), 'Hi ⟵');
  });
});
