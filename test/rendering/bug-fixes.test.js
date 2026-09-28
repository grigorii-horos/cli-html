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

    it('rejects unknown options and a missing --config value', () => {
      assert.strictEqual(run(['-x'], '').status, 2);
      assert.strictEqual(run(['--config'], '').status, 2);
    });
  });
});
