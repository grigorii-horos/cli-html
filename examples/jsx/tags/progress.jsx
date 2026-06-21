import React from 'react';

// Progress and meter bars driven by data.

const stats = [
  { label: 'CPU', value: 35 },
  { label: 'Memory', value: 68 },
  { label: 'Disk', value: 91 },
];

const Bar = ({ label, value }) => (
  <p>
    {label}: {value}%
    <br />
    <progress value={value} max="100" />
  </p>
);

export default (
  <>
    <h1>Progress bars</h1>
    {stats.map((stat) => (
      <Bar key={stat.label} {...stat} />
    ))}

    <h2>Meter</h2>
    <p>
      <meter value="0.7" min="0" max="1" />
    </p>
  </>
);
