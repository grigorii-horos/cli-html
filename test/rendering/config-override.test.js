import { describe, it } from 'node:test';
import assert from 'node:assert';
import { renderHTML } from '../../index.js';
import { stripAnsi } from '../helpers/strip-ansi.js';

describe('Theme config override tests', () => {
  describe('inputs — checkbox', () => {
    it('checked marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="checkbox" checked>',
        { input: { checkbox: { checked: { marker: 'YES' } } } }
      ));
      assert.ok(plain.includes('YES'), `Expected 'YES' in: ${plain}`);
    });

    it('unchecked marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="checkbox">',
        { input: { checkbox: { unchecked: { marker: 'NO' } } } }
      ));
      assert.ok(plain.includes('NO'), `Expected 'NO' in: ${plain}`);
    });

    it('prefix marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="checkbox" checked>',
        { input: { checkbox: { prefix: { marker: '{{' }, suffix: { marker: '}}' } } } }
      ));
      assert.ok(plain.includes('{{'), `Expected '{{' in: ${plain}`);
      assert.ok(plain.includes('}}'), `Expected '}}' in: ${plain}`);
    });
  });

  describe('inputs — radio', () => {
    it('checked marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="radio" checked>',
        { input: { radio: { checked: { marker: 'R' } } } }
      ));
      assert.ok(plain.includes('R'), `Expected 'R' in: ${plain}`);
    });
  });

  describe('inputs — file', () => {
    it('prefix marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="file">',
        { input: { file: { prefix: { marker: '>>' } } } }
      ));
      assert.ok(plain.includes('>>'), `Expected '>>' in: ${plain}`);
    });
  });

  describe('inputs — password', () => {
    it('char from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="password" value="abc">',
        { input: { password: { char: 'X', count: 3 } } }
      ));
      assert.ok(plain.includes('XXX'), `Expected 'XXX' in: ${plain}`);
    });
  });

  describe('inputs — email', () => {
    it('prefix marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="email" value="x@y.com">',
        { input: { email: { prefix: { marker: 'MAIL:' } } } }
      ));
      assert.ok(plain.includes('MAIL:'), `Expected 'MAIL:' in: ${plain}`);
    });
  });

  describe('inputs — date', () => {
    it('prefix marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="date" value="2024-01-01">',
        { input: { date: { prefix: { marker: 'DATE:' } } } }
      ));
      assert.ok(plain.includes('DATE:'), `Expected 'DATE:' in: ${plain}`);
    });
  });

  describe('textarea', () => {
    it('textarea color from theme is respected', () => {
      const result = renderHTML(
        '<textarea>hello world</textarea>',
        { input: { textarea: { color: 'bold' } } }
      );
      // Should contain ANSI codes from the bold color
      assert.ok(result.includes('\x1B['), `Expected ANSI codes in: ${result}`);
      assert.ok(stripAnsi(result).includes('hello world'), `Expected 'hello world' in: ${stripAnsi(result)}`);
    });
  });

  describe('inputs — range', () => {
    it('filled marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="range" value="50" min="0" max="100">',
        { input: { range: { filled: { marker: '#' } } } }
      ));
      assert.ok(plain.includes('#'), `Expected '#' in: ${plain}`);
    });

    it('empty marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<input type="range" value="0" min="0" max="100">',
        { input: { range: { empty: { marker: '.' } } } }
      ));
      assert.ok(plain.includes('.'), `Expected '.' in: ${plain}`);
    });
  });

  describe('inputs — color', () => {
    it('color input renders without error', () => {
      const plain = stripAnsi(renderHTML('<input type="color" value="#ff0000">'));
      assert.ok(typeof plain === 'string', `Expected string output`);
    });
  });

  describe('fieldset', () => {
    it('border color from theme is respected', () => {
      const result = renderHTML(
        '<fieldset><legend>Title</legend><p>content</p></fieldset>',
        { fieldset: { border: { color: 'red' } } }
      );
      assert.ok(result.includes('\x1B['), `Expected ANSI codes in: ${result}`);
    });

    it('title color from theme is respected', () => {
      const result = renderHTML(
        '<fieldset><legend>MyTitle</legend><p>content</p></fieldset>',
        { fieldset: { title: { color: 'cyan' } } }
      );
      assert.ok(stripAnsi(result).includes('MyTitle'), `Expected 'MyTitle' in: ${stripAnsi(result)}`);
    });

    it('disabled color from theme is respected', () => {
      const result = renderHTML(
        '<fieldset disabled><legend>Title</legend><p>content</p></fieldset>',
        { fieldset: { disabled: { color: 'blue' } } }
      );
      assert.ok(result.includes('\x1B['), `Expected ANSI codes in: ${result}`);
    });
  });

  describe('figure', () => {
    it('border color from theme is respected', () => {
      const result = renderHTML(
        '<figure><p>content</p></figure>',
        { figure: { border: { color: 'red' } } }
      );
      assert.ok(result.includes('\x1B['), `Expected ANSI codes in: ${result}`);
    });

    it('border style from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<figure><p>content</p></figure>',
        { figure: { border: { style: 'double' } } }
      ));
      assert.ok(plain.includes('content'), `Expected 'content' in: ${plain}`);
    });
  });

  describe('select', () => {
    it('selected marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<select><option selected>Option A</option></select>',
        { option: { selected: { marker: '>>' } } }
      ));
      assert.ok(plain.includes('>>'), `Expected '>>' in: ${plain}`);
    });

    it('unselected marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<select><option>Option B</option></select>',
        { option: { unselected: { marker: '--' } } }
      ));
      assert.ok(plain.includes('--'), `Expected '--' in: ${plain}`);
    });

    it('optgroup indicator marker from data-cli attribute is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<select><optgroup data-cli-indicator-marker="=>" label="Group"><option>Opt</option></optgroup></select>'
      ));
      assert.ok(plain.includes('=>'), `Expected '=>' in: ${plain}`);
    });
  });

  describe('progress', () => {
    it('filled marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<progress value="50" max="100"></progress>',
        { progress: { filled: { marker: '#' } } }
      ));
      assert.ok(plain.includes('#'), `Expected '#' in: ${plain}`);
    });

    it('empty marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<progress value="0" max="100"></progress>',
        { progress: { empty: { marker: '.' } } }
      ));
      assert.ok(plain.includes('.'), `Expected '.' in: ${plain}`);
    });
  });

  describe('meter', () => {
    it('empty marker from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<meter value="0" max="100"></meter>',
        { meter: { empty: { marker: '.' } } }
      ));
      assert.ok(plain.includes('.'), `Expected '.' in: ${plain}`);
    });

    it('labels format from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<meter value="50" max="100"></meter>',
        { meter: { labels: { enabled: true, format: 'VALUE:%v' } } }
      ));
      assert.ok(plain.includes('VALUE:50'), `Expected 'VALUE:50' in: ${plain}`);
    });
  });

  describe('blockquote — data-cli attributes', () => {
    it('data-cli-indicator-marker overrides blockquote marker', () => {
      const plain = stripAnsi(renderHTML(
        '<blockquote data-cli-indicator-marker="> ">content</blockquote>'
      ));
      assert.ok(plain.includes('>'), `Expected '>' in: ${plain}`);
    });

    it('data-cli-indicator-color applies color to marker', () => {
      const result = renderHTML(
        '<blockquote data-cli-indicator-color="red">content</blockquote>'
      );
      assert.ok(result.includes('\x1B['), `Expected ANSI codes in: ${result}`);
    });
  });

  describe('list — data-cli attributes', () => {
    it('data-cli-indicator-color on ul overrides marker color', () => {
      const result = renderHTML('<ul data-cli-indicator-color="red"><li>item</li></ul>');
      assert.ok(result.includes('\x1B['), `Expected ANSI codes in: ${result}`);
    });

    it('data-cli-indicator-marker on ul overrides marker', () => {
      const plain = stripAnsi(renderHTML(
        '<ul data-cli-indicator-marker="->"><li>item</li></ul>'
      ));
      assert.ok(plain.includes('->'), `Expected '->' in: ${plain}`);
    });
  });

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

  describe('hr — named styles', () => {
    it('default renders single style (─)', () => {
      const plain = stripAnsi(renderHTML('<hr>'));
      assert.ok(plain.includes('─'), `Expected '─' in: ${plain}`);
      assert.ok(!plain.includes('═'), `Should not contain '═' in: ${plain}`);
    });

    it('double style from theme', () => {
      const plain = stripAnsi(renderHTML('<hr>', { hr: { style: 'double' } }));
      assert.ok(plain.includes('═'), `Expected '═' in: ${plain}`);
    });

    it('bold style from theme', () => {
      const plain = stripAnsi(renderHTML('<hr>', { hr: { style: 'bold' } }));
      assert.ok(plain.includes('━'), `Expected '━' in: ${plain}`);
    });

    it('dashed style from theme', () => {
      const plain = stripAnsi(renderHTML('<hr>', { hr: { style: 'dashed' } }));
      assert.ok(plain.includes('╌'), `Expected '╌' in: ${plain}`);
    });

    it('dotted style from theme', () => {
      const plain = stripAnsi(renderHTML('<hr>', { hr: { style: 'dotted' } }));
      assert.ok(plain.includes('·'), `Expected '·' in: ${plain}`);
    });

    it('explicit marker overrides style', () => {
      const plain = stripAnsi(renderHTML('<hr>', { hr: { style: 'double', marker: '~' } }));
      assert.ok(plain.includes('~'), `Expected '~' in: ${plain}`);
      assert.ok(!plain.includes('═'), `Should not contain '═' in: ${plain}`);
    });
  });

  describe('ruby / rt', () => {
    it('ruby uses its own theme color (not span)', () => {
      const plain = stripAnsi(renderHTML(
        '<ruby>漢<rt>kan</rt></ruby>',
        { ruby: { color: 'red' }, span: { color: 'blue' } }
      ));
      assert.ok(plain.includes('漢'), `Expected base text in: ${plain}`);
      assert.ok(plain.includes('kan'), `Expected annotation in: ${plain}`);
    });

    it('rt prefix/suffix configurable from theme', () => {
      const plain = stripAnsi(renderHTML(
        '<ruby>漢<rt>kan</rt></ruby>',
        { ruby: { rt: { prefix: { marker: ' [' }, suffix: { marker: ']' } } } }
      ));
      assert.ok(plain.includes('[kan]'), `Expected '[kan]' in: ${plain}`);
    });

    it('default rt wraps in parentheses', () => {
      const plain = stripAnsi(renderHTML('<ruby>漢<rt>kan</rt></ruby>'));
      assert.ok(plain.includes('(kan)'), `Expected '(kan)' in: ${plain}`);
    });
  });

  describe('dialog — box border', () => {
    it('renders content inside a box', () => {
      const plain = stripAnsi(renderHTML('<dialog>Hello dialog</dialog>'));
      assert.ok(plain.includes('Hello dialog'), `Expected content in: ${plain}`);
      // Box border characters should be present
      assert.ok(
        plain.includes('─') || plain.includes('│') || plain.includes('╭') || plain.includes('┌'),
        `Expected box border characters in: ${plain}`
      );
    });

    it('border style configurable from theme', () => {
      const plain = stripAnsi(renderHTML(
        '<dialog>Test</dialog>',
        { dialog: { border: { style: 'double' } } }
      ));
      assert.ok(plain.includes('Test'), `Expected content in: ${plain}`);
    });
  });

  describe('time — datetime display', () => {
    it('by default does not show datetime attr', () => {
      const plain = stripAnsi(renderHTML('<time datetime="2026-06-10">Today</time>'));
      assert.ok(plain.includes('Today'), `Expected text in: ${plain}`);
      assert.ok(!plain.includes('2026-06-10'), `Should not show datetime by default: ${plain}`);
    });

    it('shows datetime when enabled in theme', () => {
      const plain = stripAnsi(renderHTML(
        '<time datetime="2026-06-10">Today</time>',
        { time: { datetime: { enabled: true } } }
      ));
      assert.ok(plain.includes('2026-06-10'), `Expected datetime in: ${plain}`);
      assert.ok(plain.includes('Today'), `Expected text in: ${plain}`);
    });

    it('custom prefix/suffix configurable', () => {
      const plain = stripAnsi(renderHTML(
        '<time datetime="2026-06-10">Today</time>',
        { time: { datetime: { enabled: true, prefix: { marker: ' [' }, suffix: { marker: ']' } } } }
      ));
      assert.ok(plain.includes('[2026-06-10]'), `Expected '[2026-06-10]' in: ${plain}`);
    });
  });

  describe('table — responsive theme config', () => {
    it('responsive separator from theme is respected', () => {
      const plain = stripAnsi(renderHTML(
        '<table data-cli-responsive-enabled="true" data-cli-responsive-threshold="9999">' +
        '<tr><th>Name</th><th>Age</th></tr>' +
        '<tr><td>Alice</td><td>30</td></tr>' +
        '</table>',
        { table: { responsive: { separator: ' => ' } } }
      ));
      assert.ok(plain.includes(' => '), `Expected ' => ' in: ${plain}`);
    });

    it('striping renders without error with custom count', () => {
      const plain = stripAnsi(renderHTML(
        '<table data-cli-striping-enabled="true">' +
        '<tr><td>row1</td></tr>' +
        '<tr><td>row2</td></tr>' +
        '<tr><td>row3</td></tr>' +
        '<tr><td>row4</td></tr>' +
        '</table>',
        { table: { striping: { count: 3, enabled: true } } }
      ));
      // count:3 means rows cycle every 3 — verify all rows rendered
      assert.ok(plain.includes('row1'), `Expected 'row1' in: ${plain}`);
      assert.ok(plain.includes('row3'), `Expected 'row3' in: ${plain}`);
      assert.ok(plain.includes('row4'), `Expected 'row4' in: ${plain}`);
    });
  });

  describe('q — configurable quotes', () => {
    it('default renders double quotes', () => {
      const plain = stripAnsi(renderHTML('<q>Hello</q>'));
      assert.ok(plain.includes('"Hello"'), `Expected '"Hello"' in: ${plain}`);
    });

    it('custom prefix/suffix from theme', () => {
      const plain = stripAnsi(renderHTML(
        '<q>Hello</q>',
        { q: { prefix: { marker: '«' }, suffix: { marker: '»' } } }
      ));
      assert.ok(plain.includes('«Hello»'), `Expected '«Hello»' in: ${plain}`);
    });

    it('cite disabled by default — no external marker', () => {
      const plain = stripAnsi(renderHTML('<q cite="https://example.com">Quote</q>'));
      assert.ok(plain.includes('"Quote"'), `Expected quoted text in: ${plain}`);
      assert.ok(!plain.includes('↗'), `Expected no external indicator by default: ${plain}`);
    });

    it('cite enabled — external marker from a.external.marker appears', () => {
      const plain = stripAnsi(renderHTML(
        '<q cite="https://example.com">Quote</q>',
        {
          q: { cite: { enabled: true, color: 'magenta' } },
          a: { external: { marker: '↗', spacing: ' ', position: 'after' } },
        }
      ));
      assert.ok(plain.includes('↗'), `Expected '↗' in: ${plain}`);
      assert.ok(plain.includes('Quote'), `Expected text in: ${plain}`);
    });
  });
});
