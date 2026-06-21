#!/usr/bin/env node

/**
 * Basic JSX rendering example
 *
 * This example demonstrates how to use cli-html as a library
 * to render React/JSX to the terminal via `renderJSX`.
 *
 * Note: renderJSX is async because react/react-dom are loaded lazily.
 * This file uses React.createElement so it runs without a JSX build step;
 * with a bundler/babel you can write actual JSX (see bin: `jsx <file.jsx>`).
 */

import { createElement } from 'react';

import { renderJSX } from '../../index.js';

const List = () => createElement(
  'ul',
  null,
  createElement('li', null, 'one'),
  createElement('li', null, 'two'),
  createElement('li', null, 'three'),
);

const main = async () => {
  // Example 1: A simple element tree
  console.log('=== Example 1: Element tree ===\n');
  const tree = createElement(
    'div',
    null,
    createElement('h1', null, 'Welcome to cli-html'),
    createElement(
      'p',
      null,
      'Render ',
      createElement('strong', null, 'JSX'),
      ' straight to the terminal.',
    ),
  );
  console.log(await renderJSX(tree));

  // Example 2: A function component
  console.log('\n=== Example 2: Component ===\n');
  console.log(await renderJSX(List));

  // Example 3: With a custom theme
  console.log('\n=== Example 3: Custom theme ===\n');
  const heading = createElement('h1', null, 'Themed heading');
  console.log(await renderJSX(heading, { h1: 'magenta bold' }));
};

main();
