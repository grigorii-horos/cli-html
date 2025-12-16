import { describe, it } from 'node:test';
import assert from 'node:assert';
import { renderHTML } from '../../index.js';

describe('HTML Basic Rendering', () => {
  describe('Headings', () => {
    it('should render h1 tags', () => {
      const html = '<h1>Test Heading</h1>';
      const result = renderHTML(html);
      assert.ok(result.includes('Test Heading'));
      assert.ok(result.length > 0);
    });

    it('should render h2 tags', () => {
      const html = '<h2>Subheading</h2>';
      const result = renderHTML(html);
      assert.ok(result.includes('Subheading'));
    });

    it('should render all heading levels', () => {
      const html = '<h1>H1</h1><h2>H2</h2><h3>H3</h3><h4>H4</h4><h5>H5</h5><h6>H6</h6>';
      const result = renderHTML(html);
      assert.ok(result.includes('H1'));
      assert.ok(result.includes('H2'));
      assert.ok(result.includes('H3'));
      assert.ok(result.includes('H4'));
      assert.ok(result.includes('H5'));
      assert.ok(result.includes('H6'));
    });
  });

  describe('Paragraphs', () => {
    it('should render paragraphs', () => {
      const html = '<p>This is a paragraph.</p>';
      const result = renderHTML(html);
      assert.ok(result.includes('This is a paragraph'));
    });

    it('should render multiple paragraphs', () => {
      const html = '<p>First paragraph.</p><p>Second paragraph.</p>';
      const result = renderHTML(html);
      assert.ok(result.includes('First paragraph'));
      assert.ok(result.includes('Second paragraph'));
    });
  });

  describe('Text Formatting', () => {
    it('should render bold text', () => {
      const html = '<strong>Bold text</strong>';
      const result = renderHTML(html);
      assert.ok(result.includes('Bold text'));
    });

    it('should render italic text', () => {
      const html = '<em>Italic text</em>';
      const result = renderHTML(html);
      assert.ok(result.includes('Italic text'));
    });

    it('should render inline code', () => {
      const html = '<code>const x = 1;</code>';
      const result = renderHTML(html);
      assert.ok(result.includes('const x = 1'));
    });

    it('should render combined formatting', () => {
      const html = '<p>This is <strong>bold</strong> and <em>italic</em> with <code>code</code>.</p>';
      const result = renderHTML(html);
      assert.ok(result.includes('bold'));
      assert.ok(result.includes('italic'));
      assert.ok(result.includes('code'));
    });
  });

  describe('Lists', () => {
    it('should render unordered lists', () => {
      const html = '<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>';
      const result = renderHTML(html);
      assert.ok(result.includes('Item 1'));
      assert.ok(result.includes('Item 2'));
      assert.ok(result.includes('Item 3'));
    });

    it('should render ordered lists', () => {
      const html = '<ol><li>First</li><li>Second</li><li>Third</li></ol>';
      const result = renderHTML(html);
      assert.ok(result.includes('First'));
      assert.ok(result.includes('Second'));
      assert.ok(result.includes('Third'));
    });

    it('should render nested lists', () => {
      const html = '<ul><li>Parent<ul><li>Child 1</li><li>Child 2</li></ul></li></ul>';
      const result = renderHTML(html);
      assert.ok(result.includes('Parent'));
      assert.ok(result.includes('Child 1'));
      assert.ok(result.includes('Child 2'));
    });
  });

  describe('Links', () => {
    it('should render links with href', () => {
      const html = '<a href="https://example.com">Example Link</a>';
      const result = renderHTML(html);
      assert.ok(result.includes('Example Link'));
    });

    it('should render links without href', () => {
      const html = '<a>Plain Link</a>';
      const result = renderHTML(html);
      assert.ok(result.includes('Plain Link'));
    });
  });

  describe('Code Blocks', () => {
    it('should render code blocks', () => {
      const html = '<pre><code>function test() {\n  return true;\n}</code></pre>';
      const result = renderHTML(html);
      assert.ok(result.includes('function test'));
      assert.ok(result.includes('return true'));
    });

    it('should render code blocks with language', () => {
      const html = '<pre><code class="language-javascript">const x = 1;</code></pre>';
      const result = renderHTML(html);
      // Result contains ANSI color codes from syntax highlighting
      // Check for the presence of individual tokens instead
      assert.ok(result.includes('const'));
      assert.ok(result.includes('x'));
      assert.ok(result.includes('1'));
    });
  });

  describe('Tables', () => {
    it('should render simple tables', () => {
      const html = `
        <table>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </table>
      `;
      const result = renderHTML(html);
      assert.ok(result.includes('Header 1'));
      assert.ok(result.includes('Header 2'));
      assert.ok(result.includes('Cell 1'));
      assert.ok(result.includes('Cell 2'));
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty input', () => {
      const result = renderHTML('');
      assert.strictEqual(result.trim(), '');
    });

    it('should handle plain text', () => {
      const result = renderHTML('Just plain text');
      assert.ok(result.includes('Just plain text'));
    });

    it('should handle malformed HTML gracefully', () => {
      const html = '<p>Unclosed paragraph';
      const result = renderHTML(html);
      assert.ok(result.includes('Unclosed paragraph'));
    });

    it('should handle special characters', () => {
      const html = '<p>&lt;div&gt; &amp; &quot;quotes&quot;</p>';
      const result = renderHTML(html);
      assert.ok(result.length > 0);
    });
  });

  describe('Custom Themes', () => {
    it('should accept custom theme', () => {
      const html = '<h1>Themed</h1>';
      const theme = { h1: 'red bold' };
      const result = renderHTML(html, theme);
      assert.ok(result.includes('Themed'));
    });

    it('should work with empty theme', () => {
      const html = '<p>Test</p>';
      const result = renderHTML(html, {});
      assert.ok(result.includes('Test'));
    });
  });
});
