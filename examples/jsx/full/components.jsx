import React from 'react';

// Composition showcase: small components combined into a page.

const Badge = ({ children }) => <kbd>{children}</kbd>;

const Section = ({ title, children }) => (
  <>
    <h2>{title}</h2>
    {children}
  </>
);

const Step = ({ n, children }) => (
  <p>
    <strong>{n}.</strong> {children}
  </p>
);

export default (
  <>
    <h1>Components &amp; props</h1>
    <p>
      JSX lets you factor terminal output into reusable pieces. Press{' '}
      <Badge>Ctrl</Badge> <Badge>C</Badge> to quit.
    </p>

    <Section title="Composition">
      <p>Components nest like any HTML element.</p>
      <Step n={1}>Define a component.</Step>
      <Step n={2}>Pass it props and children.</Step>
      <Step n={3}>
        Render it with <code>jsx examples/jsx/full/components.jsx</code>.
      </Step>
    </Section>

    <Section title="Children">
      <blockquote>
        Anything between the tags arrives as <code>props.children</code>.
      </blockquote>
    </Section>
  </>
);
