import React from 'react';

// A blog post: front matter, prose, code and a tag list.

const post = {
  title: 'Rendering JSX in the terminal',
  author: 'Grigorii Horos',
  date: '2026-06-21',
  tags: ['jsx', 'cli', 'react'],
};

const Tags = ({ tags }) => (
  <p>
    {tags.map((tag) => (
      <React.Fragment key={tag}>
        <kbd>{tag}</kbd>{' '}
      </React.Fragment>
    ))}
  </p>
);

export default (
  <>
    <h1>{post.title}</h1>
    <p>
      <em>by {post.author} · {post.date}</em>
    </p>
    <Tags tags={post.tags} />

    <hr />

    <p>
      <code>cli-html</code> can now render JSX. The default export of a file is
      transpiled, rendered to HTML with <strong>react-dom</strong>, then drawn to
      the terminal by the same engine used for HTML and Markdown.
    </p>

    <h2>Example</h2>
    <pre>
      <code className="language-sh">{`jsx examples/jsx/full/blog.jsx`}</code>
    </pre>

    <blockquote>
      One renderer, three inputs: HTML, Markdown and JSX.
    </blockquote>
  </>
);
