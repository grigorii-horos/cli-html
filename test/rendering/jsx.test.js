import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createElement } from 'react';

import { renderJSX } from '../../index.js';

const Component = () => createElement('em', null, 'component text');

describe('JSX Rendering', () => {
  it('renders a React element', async () => {
    const element = createElement('h1', null, 'JSX Heading');
    const result = await renderJSX(element);
    assert.ok(result.includes('JSX Heading'));
    assert.ok(result.length > 0);
  });

  it('renders a function component', async () => {
    const result = await renderJSX(Component);
    assert.ok(result.includes('component text'));
  });

  it('renders nested elements through the HTML pipeline', async () => {
    const element = createElement(
      'ul',
      null,
      createElement('li', null, 'one'),
      createElement('li', null, 'two'),
    );
    const result = await renderJSX(element);
    assert.ok(result.includes('one'));
    assert.ok(result.includes('two'));
  });

  it('applies a theme', async () => {
    const element = createElement('h1', null, 'Themed');
    const result = await renderJSX(element, { h1: 'green bold' });
    assert.ok(result.includes('Themed'));
  });
});
