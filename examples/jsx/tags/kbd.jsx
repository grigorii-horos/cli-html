import React from 'react';

// Keyboard shortcuts rendered from data, joining keys with kbd.

const shortcuts = [
  { action: 'Save', keys: ['Ctrl', 'S'] },
  { action: 'Quit', keys: ['Ctrl', 'C'] },
  { action: 'Search', keys: ['Ctrl', 'Shift', 'F'] },
];

const Combo = ({ keys }) => (
  <>
    {keys.map((key, index) => (
      <React.Fragment key={key}>
        {index > 0 && ' + '}
        <kbd>{key}</kbd>
      </React.Fragment>
    ))}
  </>
);

export default (
  <>
    <h1>Keyboard shortcuts</h1>
    <ul>
      {shortcuts.map((shortcut) => (
        <li key={shortcut.action}>
          {shortcut.action}: <Combo keys={shortcut.keys} />
        </li>
      ))}
    </ul>
  </>
);
