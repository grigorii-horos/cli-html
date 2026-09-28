import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import stringWidth from 'string-width';

import { renderHTML, renderMarkdown } from '../../index.js';

// Renders every example at a fixed width and compares the plain text with a
// stored snapshot, so any layout change shows up in review.
// Update the snapshots after an intended change with: UPDATE_SNAPSHOTS=1 npm test
const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SNAPSHOT_DIR = join(PROJECT_ROOT, 'test/snapshots');
const UPDATE = process.env.UPDATE_SNAPSHOTS === '1';
const WIDTH = 80;

// SGR colors, OSC 8 hyperlinks and other escape sequences
const stripEscapes = (text) => text.replaceAll(/\u001B\][^\u0007]*\u0007|\u001B\[[\d;]*[A-Za-z]/g, '');

const findExamples = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  if (entry.isDirectory()) return findExamples(path);
  return /\.(html|md)$/.test(entry.name) && entry.name !== 'README.md' ? [path] : [];
});

const examples = ['examples/html', 'examples/markdown']
  .flatMap((directory) => findExamples(join(PROJECT_ROOT, directory)))
  .toSorted();

describe('Example snapshots', () => {
  for (const file of examples) {
    const name = relative(join(PROJECT_ROOT, 'examples'), file);

    it(name, () => {
      const source = readFileSync(file, 'utf8');
      const theme = { lineWidth: { value: WIDTH } };
      const output = stripEscapes(file.endsWith('.md') ? renderMarkdown(source, theme) : renderHTML(source, theme));
      const snapshotPath = join(SNAPSHOT_DIR, `${name}.txt`);

      const tooWide = output.split('\n').filter((line) => stringWidth(line) > WIDTH);
      assert.deepStrictEqual(tooWide, [], `${name} has lines wider than ${WIDTH} columns`);

      if (UPDATE || !existsSync(snapshotPath)) {
        mkdirSync(dirname(snapshotPath), { recursive: true });
        writeFileSync(snapshotPath, output);
        return;
      }

      assert.strictEqual(output, readFileSync(snapshotPath, 'utf8'), `Output of ${name} changed; run UPDATE_SNAPSHOTS=1 npm test if intended`);
    });
  }
});
