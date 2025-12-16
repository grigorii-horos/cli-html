import { describe, it } from 'node:test';
import assert from 'node:assert';
import { renderMarkdown } from '../../index.js';

describe('Markdown Rendering', () => {
  describe('Basic Syntax', () => {
    it('should render headings', () => {
      const md = '# Heading 1\n## Heading 2\n### Heading 3';
      const result = renderMarkdown(md);
      assert.ok(result.includes('Heading 1'));
      assert.ok(result.includes('Heading 2'));
      assert.ok(result.includes('Heading 3'));
    });

    it('should render paragraphs', () => {
      const md = 'First paragraph.\n\nSecond paragraph.';
      const result = renderMarkdown(md);
      assert.ok(result.includes('First paragraph'));
      assert.ok(result.includes('Second paragraph'));
    });

    it('should render bold text', () => {
      const md = 'This is **bold** text.';
      const result = renderMarkdown(md);
      assert.ok(result.includes('bold'));
    });

    it('should render italic text', () => {
      const md = 'This is *italic* text.';
      const result = renderMarkdown(md);
      assert.ok(result.includes('italic'));
    });

    it('should render inline code', () => {
      const md = 'Use `const x = 1;` for variables.';
      const result = renderMarkdown(md);
      assert.ok(result.includes('const x = 1'));
    });

    it('should render code blocks', () => {
      const md = '```javascript\nconst x = 1;\n```';
      const result = renderMarkdown(md);
      assert.ok(result.includes('const') || result.includes('x'));
    });
  });

  describe('Lists', () => {
    it('should render unordered lists', () => {
      const md = '- Item 1\n- Item 2\n- Item 3';
      const result = renderMarkdown(md);
      assert.ok(result.includes('Item 1'));
      assert.ok(result.includes('Item 2'));
      assert.ok(result.includes('Item 3'));
    });

    it('should render ordered lists', () => {
      const md = '1. First\n2. Second\n3. Third';
      const result = renderMarkdown(md);
      assert.ok(result.includes('First'));
      assert.ok(result.includes('Second'));
      assert.ok(result.includes('Third'));
    });

    it('should render nested lists', () => {
      const md = '- Parent\n  - Child 1\n  - Child 2';
      const result = renderMarkdown(md);
      assert.ok(result.includes('Parent'));
      assert.ok(result.includes('Child 1'));
      assert.ok(result.includes('Child 2'));
    });
  });

  describe('GitHub Flavored Markdown', () => {
    it('should render task lists', () => {
      const md = '- [x] Completed task\n- [ ] Incomplete task';
      const result = renderMarkdown(md);
      assert.ok(result.includes('Completed task'));
      assert.ok(result.includes('Incomplete task'));
    });

    it('should render tables', () => {
      const md = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |';
      const result = renderMarkdown(md);
      assert.ok(result.includes('Header 1'));
      assert.ok(result.includes('Header 2'));
      assert.ok(result.includes('Cell 1'));
      assert.ok(result.includes('Cell 2'));
    });

    it('should render strikethrough', () => {
      const md = '~~strikethrough~~';
      const result = renderMarkdown(md);
      assert.ok(result.includes('strikethrough'));
    });

    it('should render alerts - NOTE', () => {
      const md = '> [!NOTE]\n> Important information';
      const result = renderMarkdown(md);
      assert.ok(result.includes('NOTE') || result.includes('Important information'));
    });

    it('should render alerts - WARNING', () => {
      const md = '> [!WARNING]\n> Be careful!';
      const result = renderMarkdown(md);
      assert.ok(result.includes('WARNING') || result.includes('careful'));
    });

    it('should render alerts - TIP', () => {
      const md = '> [!TIP]\n> Helpful tip';
      const result = renderMarkdown(md);
      assert.ok(result.includes('TIP') || result.includes('Helpful'));
    });
  });

  describe('Extended Syntax', () => {
    it('should render blockquotes', () => {
      const md = '> This is a quote';
      const result = renderMarkdown(md);
      assert.ok(result.includes('This is a quote'));
    });

    it('should render horizontal rules', () => {
      const md = 'Before\n\n---\n\nAfter';
      const result = renderMarkdown(md);
      assert.ok(result.includes('Before'));
      assert.ok(result.includes('After'));
    });

    it('should render links', () => {
      const md = '[Link text](https://example.com)';
      const result = renderMarkdown(md);
      assert.ok(result.includes('Link text'));
    });

    it('should render footnotes', () => {
      const md = 'Text with footnote[^1].\n\n[^1]: Footnote content.';
      const result = renderMarkdown(md);
      assert.ok(result.includes('Text with footnote'));
    });

    it('should render abbreviations', () => {
      const md = 'HTML is great.\n\n*[HTML]: Hyper Text Markup Language';
      const result = renderMarkdown(md);
      assert.ok(result.includes('HTML'));
    });

    it('should render definition lists', () => {
      const md = 'Term\n: Definition';
      const result = renderMarkdown(md);
      assert.ok(result.includes('Term'));
      assert.ok(result.includes('Definition'));
    });

    it('should render subscript', () => {
      const md = 'H~2~O';
      const result = renderMarkdown(md);
      assert.ok(result.includes('H') && result.includes('O'));
    });

    it('should render superscript', () => {
      const md = 'x^2^';
      const result = renderMarkdown(md);
      assert.ok(result.includes('x'));
    });

    it('should render inserted text', () => {
      const md = '++inserted text++';
      const result = renderMarkdown(md);
      assert.ok(result.includes('inserted text'));
    });

    it('should render marked text', () => {
      const md = '==highlighted==';
      const result = renderMarkdown(md);
      assert.ok(result.includes('highlighted'));
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty markdown', () => {
      const result = renderMarkdown('');
      assert.strictEqual(result.trim(), '');
    });

    it('should handle plain text', () => {
      const result = renderMarkdown('Just plain text');
      assert.ok(result.includes('Just plain text'));
    });

    it('should handle multiple blank lines', () => {
      const md = 'Line 1\n\n\n\nLine 2';
      const result = renderMarkdown(md);
      assert.ok(result.includes('Line 1'));
      assert.ok(result.includes('Line 2'));
    });

    it('should handle special characters', () => {
      const md = 'Text with < > & characters';
      const result = renderMarkdown(md);
      assert.ok(result.length > 0);
    });
  });

  describe('Custom Themes', () => {
    it('should accept custom theme for markdown', () => {
      const md = '# Themed Heading';
      const theme = { h1: 'blue bold' };
      const result = renderMarkdown(md, theme);
      assert.ok(result.includes('Themed Heading'));
    });
  });
});
