import React from 'react';

// Ordered, unordered and nested lists built from data with .map().

const fruits = ['apples', 'oranges', 'pears'];

const tree = {
  src: ['index.js', 'cli.js'],
  test: ['index.test.js'],
};

export default (
  <>
    <h1>Lists</h1>

    <h2>Unordered</h2>
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>

    <h2>Ordered</h2>
    <ol>
      <li>First</li>
      <li>Second</li>
      <li>Third</li>
    </ol>

    <h2>Nested</h2>
    <ul>
      {Object.entries(tree).map(([dir, files]) => (
        <li key={dir}>
          {dir}/
          <ul>
            {files.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </>
);
