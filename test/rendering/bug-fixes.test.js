import { describe, it } from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderHTML, renderMarkdown } from '../../index.js';
import { stripAnsi } from '../helpers/strip-ansi.js';

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const plain = (output) => stripAnsi(output);

describe('Regression fixes', () => {
  describe('code blocks', () => {
    it('renders ```diff blocks instead of dropping them', () => {
      const output = plain(renderMarkdown('```diff\n+ added\n- removed\n```\n'));
      assert.ok(output.includes('added'));
      assert.ok(output.includes('removed'));
    });

    it('renders code with an unknown language as plain code', () => {
      const output = plain(renderMarkdown('```nosuchlang\nhello\n```\n'));
      assert.ok(output.includes('hello'));
    });
  });

  describe('HTML entities', () => {
    it('decodes entities only once', () => {
      const output = plain(renderHTML('<p>Write &amp;lt;div&amp;gt; and &amp;amp;</p>'));
      assert.ok(output.includes('Write &lt;div&gt; and &amp;'), output);
    });

    it('keeps escaped entities in markdown inline code and pre', () => {
      assert.ok(plain(renderMarkdown('`&lt;`')).includes('&lt;'));
      assert.ok(plain(renderHTML('<pre>&amp;lt;b&amp;gt;</pre>')).includes('&lt;b&gt;'));
    });
  });

  describe('theme', () => {
    it('treats a string theme entry as the color, keeping other settings', () => {
      const output = plain(renderHTML('<h1>Hi</h1><blockquote>quote</blockquote>', {
        theme: { h1: (text) => `<${text}>`, blockquote: 'red' },
      }));
      assert.ok(output.includes('# <Hi>'), output);
      assert.ok(output.includes('│ quote'), output);
    });

    it('does not reuse cached themes that differ only by color functions', () => {
      const first = renderHTML('<h1>Hi</h1>', { h1: { color: (text) => `A:${text}` } });
      const second = renderHTML('<h1>Hi</h1>', { h1: { color: (text) => `B:${text}` } });
      assert.ok(plain(first).includes('A:Hi'));
      assert.ok(plain(second).includes('B:Hi'));
    });
  });

  describe('inputs', () => {
    for (const checked of ['checked', 'checked="checked"', 'checked="true"']) {
      it(`treats <input ${checked}> as checked`, () => {
        const checkbox = plain(renderHTML(`<input type="checkbox" ${checked}>`));
        const radio = plain(renderHTML(`<input type="radio" ${checked}>`));
        assert.ok(checkbox.includes('[✓]'), checkbox);
        assert.ok(radio.includes('(•)'), radio);
      });
    }
  });

  describe('cli-render meta tags', () => {
    it('parses cli-render-line-width as a number', () => {
      const output = plain(renderHTML(
        '<meta name="cli-render-line-width" content="12"><p>hello world foo bar</p>',
        { lineWidth: { value: 80 } },
      ));
      assert.strictEqual(output.trim(), 'hello world\nfoo bar');
    });

    it('ignores unknown and invalid meta settings', () => {
      const output = plain(renderHTML(
        '<meta name="cli-render-theme" content="x"><meta name="cli-render-line-width" content="abc"><p>hello world</p>',
        { lineWidth: { value: 80 } },
      ));
      assert.strictEqual(output.trim(), 'hello world');
    });
  });

  describe('markdown containers', () => {
    it('renders ::: containers with a title', () => {
      const output = plain(renderMarkdown('::: warning\nbody\n:::\n\n::: tip Custom title\nx\n:::\n'));
      assert.ok(output.includes('Warning'));
      assert.ok(output.includes('body'));
      assert.ok(output.includes('Custom title'));
      assert.ok(!output.includes(':::'));
    });
  });

  describe('attribute names', () => {
    it('accepts full-path code block attributes and the short aliases', () => {
      const code = (attribute) => plain(renderHTML(`<pre><code class="language-js" ${attribute}>a\n</code></pre>`));
      assert.ok(!code('data-cli-block-numbers-enabled="false"').includes('1 '));
      assert.ok(!code('data-cli-numbers-enabled="false"').includes('1 '));
    });

    it('accepts data-cli-checkbox-checked-marker and data-cli-checked-marker', () => {
      assert.ok(plain(renderHTML('<input type="checkbox" checked data-cli-checkbox-checked-marker="X">')).includes('X'));
      assert.ok(plain(renderHTML('<input type="checkbox" checked data-cli-checked-marker="Y">')).includes('Y'));
    });

    it('reads kbd key and del/ins diff attributes', () => {
      const output = plain(renderHTML('<kbd data-cli-key-style="box" data-cli-prefix-marker="<" data-cli-suffix-marker=">">Ctrl+S</kbd> <del data-cli-diff-style="git" data-cli-diff-marker="X">a</del>'));
      assert.ok(output.includes('<Ctrl> + <S>'), output);
      assert.ok(output.includes('X a'), output);
    });
  });

  describe('nesting limit', () => {
    it('warns once when content is nested too deeply', () => {
      const warnings = [];
      const onWarning = (warning) => warnings.push(warning.message);
      process.on('warning', onWarning);
      const deep = `${'<div>'.repeat(120)}deep${'</div>'.repeat(120)}`;
      const output = renderHTML(`${deep}${deep}<p>after</p>`);
      return new Promise((resolve) => setImmediate(() => {
        process.off('warning', onWarning);
        assert.ok(output.includes('after'));
        assert.strictEqual(warnings.filter((message) => message.includes('nested deeper')).length, 1);
        resolve();
      }));
    });
  });

  describe('CLI', () => {
    const run = (args, input) => spawnSync('node', [join(PROJECT_ROOT, 'bin/html.js'), ...args], {
      input,
      encoding: 'utf8',
    });

    it('keeps top-level settings from a config file with a theme key', () => {
      const directory = mkdtempSync(join(tmpdir(), 'cli-html-'));
      const configPath = join(directory, 'config.yaml');
      writeFileSync(configPath, 'lineWidth:\n  value: 20\ntheme:\n  p:\n    color: red\n');

      const result = run(['--config', configPath], '<p>one two three four five six seven eight</p>');
      assert.strictEqual(result.status, 0);
      assert.ok(plain(result.stdout).split('\n').every((line) => line.length <= 20), result.stdout);
    });

    it('prints help instead of treating -h as a file', () => {
      const result = run(['-h'], '');
      assert.strictEqual(result.status, 0);
      assert.ok(result.stdout.startsWith('Usage: html'));
    });

    it('warns about but accepts the never-implemented --streaming/--verbose flags', () => {
      const result = run(['--streaming', '--verbose'], '<p>x</p>');
      assert.strictEqual(result.status, 0);
      assert.ok(result.stderr.includes('--streaming is not supported'));
    });

    it('rejects unknown options and a missing --config value', () => {
      assert.strictEqual(run(['-x'], '').status, 2);
      assert.strictEqual(run(['--config'], '').status, 2);
    });
  });
});
