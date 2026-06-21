import React from 'react';

// Figures with captions.

const Figure = ({ caption, children }) => (
  <figure>
    {children}
    <figcaption>{caption}</figcaption>
  </figure>
);

export default (
  <>
    <h1>Figures</h1>

    <Figure caption="A quote presented as a figure">
      <blockquote>The terminal is a canvas.</blockquote>
    </Figure>

    <Figure caption="Listing 1: a one-liner">
      <pre><code className="language-js">{`const id = (x) => x;`}</code></pre>
    </Figure>
  </>
);
