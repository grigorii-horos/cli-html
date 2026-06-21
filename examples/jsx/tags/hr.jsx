import React from 'react';

// Horizontal rules as section separators.

const sections = ['Intro', 'Body', 'Conclusion'];

export default (
  <>
    <h1>Horizontal rules</h1>
    {sections.map((section, index) => (
      <React.Fragment key={section}>
        {index > 0 && <hr />}
        <h2>{section}</h2>
        <p>Content for the {section.toLowerCase()} section.</p>
      </React.Fragment>
    ))}
  </>
);
