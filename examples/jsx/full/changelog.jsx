import React from 'react';

// A changelog generated from structured release data.

const releases = [
  {
    version: '6.1.0',
    date: '2026-06-21',
    added: ['renderJSX', 'jsx CLI command'],
    fixed: [],
  },
  {
    version: '6.0.5',
    date: '2026-05-30',
    added: [],
    fixed: ['Deno ESM import of number-to-alphabet'],
  },
];

const ChangeList = ({ title, items }) =>
  items.length === 0 ? null : (
    <>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );

export default (
  <>
    <h1>Changelog</h1>
    {releases.map((release, index) => (
      <React.Fragment key={release.version}>
        {index > 0 && <hr />}
        <h2>
          <code>{release.version}</code> — {release.date}
        </h2>
        <ChangeList title="Added" items={release.added} />
        <ChangeList title="Fixed" items={release.fixed} />
      </React.Fragment>
    ))}
  </>
);
