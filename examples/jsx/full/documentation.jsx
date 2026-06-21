import React from 'react';

// A documentation page: code blocks, keyboard keys, definitions, links.

const CodeBlock = ({ language, children }) => (
  <pre>
    <code className={`language-${language}`}>{children}</code>
  </pre>
);

export default (
  <>
    <h1>cli-html JSX API</h1>

    <p>
      Import <code>renderJSX</code> from{' '}
      <a href="https://github.com/grigorii-horos/cli-html">cli-html</a>.
    </p>

    <h2>Library</h2>
    <CodeBlock language="js">
      {`import { renderJSX } from 'cli-html';

const App = () => <h1>Hello</h1>;
console.log(await renderJSX(<App />));`}
    </CodeBlock>

    <h2>CLI</h2>
    <p>
      Run a file with the <code>jsx</code> command, then quit with{' '}
      <kbd>Ctrl</kbd> + <kbd>C</kbd>:
    </p>
    <CodeBlock language="sh">{`jsx examples/jsx/full/documentation.jsx`}</CodeBlock>

    <h2>Notes</h2>
    <dl>
      <dt>Async</dt>
      <dd>renderJSX returns a Promise; react/react-dom load lazily.</dd>
      <dt>Default export</dt>
      <dd>May be a React element or a component.</dd>
    </dl>
  </>
);
