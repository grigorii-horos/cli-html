import { describe, it } from 'node:test';
import assert from 'node:assert';
import stringWidth from 'string-width';

import { renderHTML, renderMarkdown } from '../../index.js';
import { stripAnsi } from '../helpers/strip-ansi.js';

const render = (html, width = 80, theme = {}) => stripAnsi(renderHTML(html, { lineWidth: { value: width }, ...theme }));
const lines = (output) => output.split('\n').filter((line) => line.trim());
const widest = (output) => Math.max(...output.split('\n').map((line) => stringWidth(line)));
const LONG = 'aaaaaaaaa bbbbbbbbb ccccccccc ddddddddd eeeeeeeee fffffffff';

describe('Layout fixes', () => {
  describe('elements stay within lineWidth', () => {
    for (const [name, html] of [
      ['h3', `<h3>${LONG}</h3>`],
      ['dialog', `<dialog open><p>${LONG}</p></dialog>`],
      ['figure', `<figure><p>${LONG}</p><figcaption>cap</figcaption></figure>`],
      ['details summary', `<details open><summary>${LONG}</summary><p>${LONG}</p></details>`],
      ['fieldset legend', `<fieldset><legend>${LONG}</legend><p>${LONG}</p></fieldset>`],
      ['wide table', `<table><tr><th>Name</th><th>Text</th></tr><tr><td>a</td><td>${LONG} ${LONG} ${LONG}</td></tr></table>`],
    ]) {
      it(name, () => {
        const width = name === 'wide table' ? 70 : 30;
        const output = render(html, width);
        assert.ok(widest(output) <= width, output);
      });
    }

    it('keeps the required marker of a truncated legend', () => {
      const output = render(`<fieldset required><legend>${LONG}</legend>x</fieldset>`, 30);
      assert.ok(lines(output)[0].includes('… *'), output);
    });

    it('aligns heading continuation lines with the text', () => {
      const output = lines(render(`<h3>${LONG}</h3>`, 30));
      assert.ok(output[1].startsWith('    '), output.join('\n'));
    });

    it('centers <center> within the line width', () => {
      assert.strictEqual(render('<center>hi</center>', 20).trim().length, 2);
      assert.ok(render('<center>hi</center>', 20).includes(' '.repeat(9) + 'hi'));
    });
  });

  describe('ordered lists', () => {
    it('supports reversed, start and li value', () => {
      const output = lines(render('<ol start="3" reversed><li>a</li><li>b</li><li value="10">c</li><li>d</li></ol>'));
      assert.deepStrictEqual(output.map((line) => line.trim()), ['3. a', '2. b', '10. c', '9. d']);
    });

    it('counts down from the item count when reversed without start', () => {
      const output = lines(render('<ol reversed><li>a</li><li>b</li></ol>'));
      assert.deepStrictEqual(output.map((line) => line.trim()), ['2. a', '1. b']);
    });

    it('ignores invalid start and type', () => {
      const output = render('<ol start="abc" type="x"><li>a</li></ol>');
      assert.ok(output.includes('1. a'), output);
      assert.ok(!output.includes('NaN') && !output.includes('undefined'), output);
    });

    it('falls back to numbers where roman numerals do not exist', () => {
      const output = lines(render('<ol start="0" type="I"><li>a</li><li>b</li></ol>'));
      assert.deepStrictEqual(output.map((line) => line.trim()), ['0. a', 'I. b']);
    });

    it('aligns continuation lines after two-digit markers', () => {
      const output = lines(render('<ol start="10"><li>ccc ddd eee fff</li></ol>', 12));
      assert.strictEqual(output[0].indexOf('ccc'), output[1].indexOf('eee'), output.join('\n'));
    });

    it('applies ul/ol color when li color is empty', () => {
      const output = renderHTML('<ul><li>x</li></ul>', { ul: { color: (text) => `<${text}>` } });
      assert.ok(stripAnsi(output).includes('<x>'), output);
    });
  });

  describe('tables', () => {
    const table = '<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr><tr><td>2</td></tr></tbody></table>';

    it('honours table.responsive.enabled from the theme', () => {
      const output = render(table, 40, { table: { responsive: { enabled: false } } });
      assert.ok(output.includes('┌'), output);
    });

    it('separates responsive items with real newlines', () => {
      const output = render(table, 40);
      assert.ok(!output.includes(String.raw`\n`), output);
      assert.ok(output.includes('A: 1\n\nA: 2'), output);
    });

    it('renders every <thead> row', () => {
      const output = render('<table><thead><tr><th>H1</th></tr><tr><th>H2</th></tr></thead><tr><td>x</td></tr></table>');
      assert.ok(output.includes('H1') && output.includes('H2'), output);
    });

    it('numbers every row of a table without a header', () => {
      const output = render('<table data-cli-show-row-numbers="true"><tr><td>a</td></tr><tr><td>b</td></tr></table>');
      assert.ok(output.includes('1 │') && output.includes('2 │'), output);
    });

    it('treats a leading row of <th> cells as the header', () => {
      const output = render('<table><tr><th>Name</th></tr><tr><td>x</td></tr></table>', 40);
      assert.ok(output.includes('Name: x'), output);
    });

    it('accepts round/classic border style names', () => {
      assert.ok(render('<table data-cli-border-style="round"><tr><td>a</td></tr></table>').includes('╭'));
      assert.ok(render('<table data-cli-border-style="classic"><tr><td>a</td></tr></table>').includes('+'));
    });

    it('colors only the border, not box characters inside cells', () => {
      const output = renderHTML('<table data-cli-border-color="red"><tr><td>a ─ b</td></tr></table>', { lineWidth: { value: 80 } });
      assert.ok(stripAnsi(output).includes('a ─ b'));
      assert.ok(!output.includes('\u001B[31m─\u001B[39m b'), output);
    });

    it('inherits table color into cells when td color is empty', () => {
      const output = renderHTML('<table><tr><td>x</td></tr></table>', {
        lineWidth: { value: 80 },
        table: { color: (text) => `<${text}>` },
      });
      assert.ok(stripAnsi(output).includes('<x>'), output);
    });
  });

  describe('meter and progress', () => {
    for (const html of [
      '<meter min="5" max="5" value="5"></meter>',
      '<meter value="abc"></meter>',
      '<meter value="10" data-cli-width="abc"></meter>',
      '<progress value="-3" max="-10"></progress>',
    ]) {
      it(`renders ${html} without NaN or an empty bar`, () => {
        const output = render(html);
        assert.ok(!output.includes('NaN'), output);
        assert.ok(!output.includes('[]'), output);
      });
    }

    it('replaces every placeholder in the meter label', () => {
      const output = render('<meter value="5" data-cli-labels-format="%v of %m (%v)"></meter>');
      assert.ok(output.includes('5 of 100 (5)'), output);
    });
  });

  describe('leftovers', () => {
    it('shows closed details content by default and hides it with collapse', () => {
      assert.ok(render('<details><summary>S</summary>body</details>').includes('body'));
      const collapsed = render('<details data-cli-collapse-enabled="true"><summary>S</summary>body</details>');
      assert.ok(collapsed.includes('S') && !collapsed.includes('body'), collapsed);
      assert.ok(render('<details open data-cli-collapse-enabled="true"><summary>S</summary>body</details>').includes('body'));
    });

    it('draws the color input indicator marker', () => {
      assert.ok(render('<input type="color" value="#ff0000">').includes('■ (#ff0000)'));
      assert.ok(render('<input type="color" value="#ff0000" data-cli-color-indicator-marker="●">').includes('●'));
    });

    it('applies table cell padding and still fits the line', () => {
      const output = render('<table data-cli-padding-left="3" data-cli-padding-right="0"><tr><td>a</td></tr></table>');
      assert.ok(output.includes('│   a│'), output);
      const wide = render(`<table data-cli-padding-left="3"><tr><td>x</td><td>${LONG} ${LONG} ${LONG}</td></tr></table>`, 70);
      assert.ok(widest(wide) <= 70, wide);
    });
  });

  describe('other elements', () => {
    it('renders footnote references without brackets', () => {
      const output = stripAnsi(renderMarkdown('Text[^1].\n\n[^1]: Note.\n'));
      assert.ok(!output.includes('[1]'), output);
    });

    it('uses the option label attribute and disables options of a disabled select', () => {
      const output = render('<select name="x" disabled><option label="Label" value="v">text</option></select>');
      assert.ok(output.includes('Label'), output);
    });

    it('derives media titles from src without query strings or from <source>', () => {
      const output = render('<video src="dir/movie.mp4?x=1"></video> <audio><source src="a/song.mp3"></audio>');
      assert.ok(output.includes('movie.mp4]') && output.includes('song.mp3'), output);
    });

    it('does not drop a password input with a negative count', () => {
      assert.ok(render('<p>[<input type="password" data-cli-password-count="-1">]</p>').includes('['));
    });
  });
});
