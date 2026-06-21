import React from 'react';

// Definition lists built from an object of term -> description.

const terms = {
  JSX: 'A syntax extension that describes UI as nested elements.',
  Element: 'A lightweight description of what to render.',
  Component: 'A function that returns elements.',
};

export default (
  <>
    <h1>Definition list</h1>
    <dl>
      {Object.entries(terms).map(([term, description]) => (
        <React.Fragment key={term}>
          <dt>{term}</dt>
          <dd>{description}</dd>
        </React.Fragment>
      ))}
    </dl>
  </>
);
