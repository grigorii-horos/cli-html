import React from 'react';

// Collapsible details/summary blocks generated from data.

const faqs = [
  { q: 'Is renderJSX async?', a: 'Yes — react/react-dom load lazily.' },
  { q: 'What can the default export be?', a: 'A React element or a component.' },
  { q: 'Where do user modules resolve?', a: 'Relative to the source file.' },
];

export default (
  <>
    <h1>Details / FAQ</h1>
    {faqs.map((faq) => (
      <details key={faq.q}>
        <summary>{faq.q}</summary>
        <p>{faq.a}</p>
      </details>
    ))}
  </>
);
