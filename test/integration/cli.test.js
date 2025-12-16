import { describe, it } from 'node:test';
import assert from 'node:assert';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '../..');

describe('CLI Integration', () => {
  describe('HTML Command', () => {
    it('should render HTML from file', (t, done) => {
      const proc = spawn('node', [
        join(PROJECT_ROOT, 'bin/html.js'),
        join(PROJECT_ROOT, 'test/fixtures/simple.html')
      ]);

      let output = '';
      proc.stdout.on('data', (data) => {
        output += data.toString();
      });

      proc.on('exit', (code) => {
        assert.strictEqual(code, 0);
        assert.ok(output.length > 0);
        done();
      });
    });

    it('should render HTML from stdin', (t, done) => {
      const proc = spawn('node', [join(PROJECT_ROOT, 'bin/html.js')]);

      let output = '';
      proc.stdout.on('data', (data) => {
        output += data.toString();
      });

      proc.on('exit', (code) => {
        assert.strictEqual(code, 0);
        assert.ok(output.includes('Test'));
        done();
      });

      proc.stdin.write('<h1>Test</h1>');
      proc.stdin.end();
    });

    it('should handle non-existent file', (t, done) => {
      const proc = spawn('node', [
        join(PROJECT_ROOT, 'bin/html.js'),
        'non-existent-file.html'
      ]);

      proc.on('exit', (code) => {
        assert.notStrictEqual(code, 0);
        done();
      });
    });
  });

  describe('Markdown Command', () => {
    it('should render Markdown from file', (t, done) => {
      const proc = spawn('node', [
        join(PROJECT_ROOT, 'bin/markdown.js'),
        join(PROJECT_ROOT, 'test/fixtures/simple.md')
      ]);

      let output = '';
      proc.stdout.on('data', (data) => {
        output += data.toString();
      });

      proc.on('exit', (code) => {
        assert.strictEqual(code, 0);
        assert.ok(output.length > 0);
        done();
      });
    });

    it('should render Markdown from stdin', (t, done) => {
      const proc = spawn('node', [join(PROJECT_ROOT, 'bin/markdown.js')]);

      let output = '';
      proc.stdout.on('data', (data) => {
        output += data.toString();
      });

      proc.on('exit', (code) => {
        assert.strictEqual(code, 0);
        assert.ok(output.includes('Markdown Test'));
        done();
      });

      proc.stdin.write('# Markdown Test\n\nParagraph.');
      proc.stdin.end();
    });
  });

  describe('Custom Config', () => {
    it('should accept custom config file', (t, done) => {
      const proc = spawn('node', [
        join(PROJECT_ROOT, 'bin/html.js'),
        '--config',
        join(PROJECT_ROOT, 'test/fixtures/test-config.yaml'),
        join(PROJECT_ROOT, 'test/fixtures/simple.html')
      ]);

      let output = '';
      proc.stdout.on('data', (data) => {
        output += data.toString();
      });

      proc.on('exit', (code) => {
        assert.strictEqual(code, 0);
        assert.ok(output.length > 0);
        done();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid HTML gracefully', (t, done) => {
      const proc = spawn('node', [join(PROJECT_ROOT, 'bin/html.js')]);

      let output = '';
      proc.stdout.on('data', (data) => {
        output += data.toString();
      });

      proc.on('exit', (code) => {
        assert.strictEqual(code, 0); // Should still exit successfully
        done();
      });

      proc.stdin.write('<broken><html');
      proc.stdin.end();
    });
  });
});
