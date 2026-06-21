import React from 'react';

// Quick tour of cli-html's JSX rendering.

const Feature = ({ name, children }) => (
  <>
    <h2>{name}</h2>
    <p>{children}</p>
  </>
);

export default (
  <>
    <h1>cli-html · JSX demo</h1>
    <p>
      Run with <code>jsx examples/jsx/full/demo.jsx</code>. JSX is transpiled,
      rendered to HTML via react-dom, then drawn to the terminal by cli-html.
    </p>
    <Feature name="Components">
      Function components and plain elements both work.
    </Feature>
    <Feature name="Lists">
      Standard HTML elements render with the active theme.
    </Feature>
    <ul>
      <li>headings</li>
      <li>paragraphs</li>
      <li><strong>bold</strong> and <em>italic</em></li>
    </ul>
    <blockquote>Same renderer as the html and markdown commands.</blockquote>
  </>
);
