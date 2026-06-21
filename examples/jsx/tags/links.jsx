import React from 'react';

// Links, including a list generated from data.

const links = [
  { label: 'cli-html', href: 'https://github.com/grigorii-horos/cli-html' },
  { label: 'cli-jsx', href: 'https://github.com/grigorii-horos/cli-jsx' },
  { label: 'npm', href: 'https://www.npmjs.com/package/cli-html' },
];

export default (
  <>
    <h1>Links</h1>
    <p>
      Inline link to{' '}
      <a href="https://nodejs.org">the Node.js site</a>.
    </p>
    <ul>
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href}>{link.label}</a>
        </li>
      ))}
    </ul>
  </>
);
