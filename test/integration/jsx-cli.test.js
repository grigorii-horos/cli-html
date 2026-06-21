import { describe, it } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '../..');

describe('JSX CLI Integration', () => {
  it('should render JSX from file', (t, done) => {
    const proc = spawn('node', [
      join(PROJECT_ROOT, 'bin/jsx.js'),
      join(PROJECT_ROOT, 'test/fixtures/simple.jsx'),
    ]);

    let output = '';
    proc.stdout.on('data', (data) => {
      output += data.toString();
    });

    proc.on('exit', (code) => {
      assert.strictEqual(code, 0);
      assert.ok(output.includes('JSX Fixture'));
      done();
    });
  });

  it('should exit non-zero with no argument', (t, done) => {
    const proc = spawn('node', [join(PROJECT_ROOT, 'bin/jsx.js')]);

    proc.on('exit', (code) => {
      assert.strictEqual(code, 1);
      done();
    });
  });

  it('should exit non-zero for a missing file', (t, done) => {
    const proc = spawn('node', [
      join(PROJECT_ROOT, 'bin/jsx.js'),
      join(PROJECT_ROOT, 'test/fixtures/does-not-exist.jsx'),
    ]);

    proc.on('exit', (code) => {
      assert.strictEqual(code, 1);
      done();
    });
  });
});
