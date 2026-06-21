import React from 'react';

// Blockquotes, including nested quotes and a cite.

const Quote = ({ author, children }) => (
  <blockquote>
    <p>{children}</p>
    <p><cite>— {author}</cite></p>
  </blockquote>
);

export default (
  <>
    <h1>Blockquotes</h1>

    <Quote author="Edsger Dijkstra">
      Simplicity is prerequisite for reliability.
    </Quote>

    <h2>Nested</h2>
    <blockquote>
      <p>Outer quote.</p>
      <blockquote>
        <p>Inner, deeper quote.</p>
      </blockquote>
    </blockquote>
  </>
);
