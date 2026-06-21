import React from 'react';

// An author profile built from boxed layouts.

const ProfileCard = ({ name, role, bio, links }) => (
  <fieldset>
    <legend>{name}</legend>
    <p><em>{role}</em></p>
    <p>{bio}</p>
    <ul>
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href}>{link.label}</a>
        </li>
      ))}
    </ul>
  </fieldset>
);

export default (
  <>
    <h1>Author profile</h1>

    <ProfileCard
      name="Grigorii Horos"
      role="Maintainer"
      bio="Builds terminal renderers."
      links={[
        { label: 'GitHub', href: 'https://github.com/grigorii-horos' },
        { label: 'cli-html', href: 'https://github.com/grigorii-horos/cli-html' },
      ]}
    />

    <figure>
      <blockquote>The terminal is a canvas.</blockquote>
      <figcaption>cli-html</figcaption>
    </figure>

    <details>
      <summary>More about this page</summary>
      <p>A collapsible block, rendered from JSX.</p>
    </details>
  </>
);
