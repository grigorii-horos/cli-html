import React from 'react';

// Inline code and highlighted code blocks per language.

const CodeBlock = ({ language, children }) => (
  <pre>
    <code className={`language-${language}`}>{children}</code>
  </pre>
);

export default (
  <>
    <h1>Code</h1>

    <p>
      Inline like <code>npm install cli-html</code> sits in a sentence.
    </p>

    <h2>JavaScript</h2>
    <CodeBlock language="js">
      {`export const sum = (a, b) => a + b;

console.log(sum(2, 3)); // 5`}
    </CodeBlock>

    <h2>JSON</h2>
    <CodeBlock language="json">
      {`{
  "name": "cli-html",
  "bin": { "jsx": "bin/jsx.js" }
}`}
    </CodeBlock>
  </>
);
