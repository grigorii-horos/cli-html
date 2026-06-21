import React from 'react';

// All six heading levels, plus a component that builds one from a prop.

const Heading = ({ level, children }) => {
  const Tag = `h${level}`;
  return <Tag>{children}</Tag>;
};

export default (
  <>
    <h1>Heading level 1</h1>
    <h2>Heading level 2</h2>
    <h3>Heading level 3</h3>
    <h4>Heading level 4</h4>
    <h5>Heading level 5</h5>
    <h6>Heading level 6</h6>

    {[1, 2, 3].map((level) => (
      <Heading key={level} level={level}>
        Generated h{level}
      </Heading>
    ))}
  </>
);
