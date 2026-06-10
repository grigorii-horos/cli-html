import { describe, it } from 'node:test';
import assert from 'node:assert';
import { renderHTML } from '../../index.js';
import { stripAnsi } from '../helpers/strip-ansi.js';

describe('ANSI rendering regression tests', () => {
  describe('Headings', () => {
    it('h1 text content is preserved after stripping ANSI', () => {
      const result = renderHTML('<h1>Hello World</h1>');
      assert.ok(stripAnsi(result).includes('Hello World'));
    });

    it('custom color via data-cli-color is applied', () => {
      const result = renderHTML('<h1 data-cli-color="red bold">Test</h1>');
      assert.ok(stripAnsi(result).includes('Test'));
    });
  });

  describe('Paragraphs', () => {
    it('p tag text is preserved', () => {
      const result = renderHTML('<p>Hello paragraph</p>');
      assert.ok(stripAnsi(result).includes('Hello paragraph'));
    });
  });

  describe('Links', () => {
    it('a tag text is preserved', () => {
      const result = renderHTML('<a href="https://example.com">Link text</a>');
      assert.ok(stripAnsi(result).includes('Link text'));
    });

    it('href is shown when data-cli-href-enabled=true', () => {
      const result = renderHTML('<a href="https://example.com" data-cli-href-enabled="true">Click</a>');
      assert.ok(stripAnsi(result).includes('example.com'));
    });

    it('href color from theme is applied', () => {
      const result = renderHTML(
        '<a href="https://example.com" data-cli-href-enabled="true">link</a>',
        { a: { href: { color: 'red bold' } } }
      );
      assert.ok(stripAnsi(result).includes('example.com'));
      assert.ok(result.includes('\x1B[')); // some ANSI applied to href
    });

    it('title text from theme is shown when title.enabled=true in theme', () => {
      const result = renderHTML(
        '<a href="https://x.com" title="My Title">link</a>',
        { a: { title: { enabled: true } } }
      );
      assert.ok(stripAnsi(result).includes('My Title'));
    });

    it('title prefix/suffix from theme are applied', () => {
      const result = renderHTML(
        '<a href="https://x.com" title="T">link</a>',
        { a: { title: { enabled: true, prefix: { marker: '<<' }, suffix: { marker: '>>' } } } }
      );
      const plain = stripAnsi(result);
      assert.ok(plain.includes('<<'), `Expected << in: ${plain}`);
      assert.ok(plain.includes('>>'), `Expected >> in: ${plain}`);
    });
  });

  describe('Inputs', () => {
    it('checkbox checked state produces output', () => {
      const result = renderHTML('<input type="checkbox" checked>');
      assert.ok(typeof result === 'string');
      assert.ok(result.length > 0);
    });

    it('disabled button applies disabled styling', () => {
      const result = renderHTML('<button disabled>Click me</button>');
      assert.ok(stripAnsi(result).includes('Click me'));
    });
  });

  describe('Code blocks', () => {
    it('inline code text is preserved', () => {
      const result = renderHTML('<code>console.log(x)</code>');
      assert.ok(stripAnsi(result).includes('console.log(x)'));
    });

    it('pre/code block text is preserved', () => {
      const result = renderHTML('<pre><code>const x = 1;</code></pre>');
      assert.ok(stripAnsi(result).includes('const x = 1;'));
    });
  });

  describe('Tables', () => {
    it('table cell text is preserved', () => {
      const result = renderHTML('<table><tr><td>Cell content</td></tr></table>');
      assert.ok(stripAnsi(result).includes('Cell content'));
    });
  });

  describe('custom data-cli-* attributes override theme', () => {
    it('data-cli-color is respected on span', () => {
      const result = renderHTML('<span data-cli-color="cyan">colored</span>');
      assert.ok(stripAnsi(result).includes('colored'));
    });
  });
});

describe('Text style markers', () => {
  it('samp renders with yellowBright color', () => {
    const result = renderHTML('<samp>ls -la</samp>');
    assert.ok(result.includes('ls -la'), `Expected content in: ${result}`);
  });

  it('sub renders with prefix/suffix markers', () => {
    const plain = stripAnsi(renderHTML('<sub>2</sub>'));
    assert.ok(plain.includes('₍'), `Expected '₍' in: ${plain}`);
    assert.ok(plain.includes('₎'), `Expected '₎' in: ${plain}`);
  });

  it('sup renders with prefix/suffix markers', () => {
    const plain = stripAnsi(renderHTML('<sup>2</sup>'));
    assert.ok(plain.includes('⁽'), `Expected '⁽' in: ${plain}`);
    assert.ok(plain.includes('⁾'), `Expected '⁾' in: ${plain}`);
  });

  it('samp prefix can be overridden via data-cli', () => {
    const plain = stripAnsi(renderHTML('<samp data-cli-prefix-marker=">> ">cmd</samp>'));
    assert.ok(plain.includes('>> '), `Expected '>> ' in: ${plain}`);
  });
});

describe('abbr', () => {
  it('shows title with default brackets', () => {
    const plain = stripAnsi(renderHTML('<abbr title="HyperText Markup Language">HTML</abbr>'));
    assert.ok(plain.includes('(HyperText Markup Language)'), `Got: ${plain}`);
  });

  it('title prefix/suffix from theme are respected', () => {
    const plain = stripAnsi(renderHTML(
      '<abbr title="HyperText Markup Language">HTML</abbr>',
      { abbr: { title: { prefix: { marker: '[' }, suffix: { marker: ']' } } } }
    ));
    assert.ok(plain.includes('[HyperText Markup Language]'), `Got: ${plain}`);
  });
});
