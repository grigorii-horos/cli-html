import test from 'node:test';
import assert from 'node:assert/strict';

process.env.FORCE_COLOR = '1';
import htmlToCli from '../index.js';

const progressRegex = /\x1b\[47m\x1b\[32m([^\x1b]*)\x1b\[39m\x1b\[49m\x1b\[40m\x1b\[90m([^\x1b]*)\x1b\[39m\x1b\[49m/;

function getBarLengths(html) {
  const output = htmlToCli(html);
  let match = output.match(progressRegex);
  if (match) {
    return [match[1].length, match[2].length];
  }
  match = output.match(/\x1b\[47m\x1b\[32m([^\x1b]*)\x1b\[39m\x1b\[49m/);
  if (match) {
    return [match[1].length, 0];
  }
  match = output.match(/\x1b\[40m\x1b\[90m([^\x1b]*)\x1b\[39m\x1b\[49m/);
  if (match) {
    return [0, match[1].length];
  }
  return null;
}

test('progress bar is half filled', () => {
  const [filled, empty] = getBarLengths('<progress value="50" max="100"></progress>');
  assert.equal(filled, 10);
  assert.equal(empty, 10);
});

test('progress value exceeding max clamps to full', () => {
  const [filled, empty] = getBarLengths('<progress value="150" max="100"></progress>');
  assert.equal(filled, 20);
  assert.equal(empty, 0);
});

test('progress with zero value is empty', () => {
  const [filled, empty] = getBarLengths('<progress value="0" max="100"></progress>');
  assert.equal(filled, 0);
  assert.equal(empty, 20);
});

test('progress with missing max defaults to 1', () => {
  const [filled, empty] = getBarLengths('<progress value="0.5"></progress>');
  assert.equal(filled, 10);
  assert.equal(empty, 10);
});
