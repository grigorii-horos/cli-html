import React from 'react';

// Fieldsets with legends, used as labelled containers.

const Panel = ({ legend, children }) => (
  <fieldset>
    <legend>{legend}</legend>
    {children}
  </fieldset>
);

export default (
  <>
    <h1>Fieldsets</h1>

    <Panel legend="Build">
      <ul>
        <li>install dependencies</li>
        <li>run tests</li>
        <li>publish</li>
      </ul>
    </Panel>

    <Panel legend="Notes">
      <p>Use a fieldset to group related output under a label.</p>
    </Panel>
  </>
);
