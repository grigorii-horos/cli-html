import React from 'react';

// Turning an array of objects into a table with .map().

const rows = [
  { lang: 'JavaScript', year: 1995, typed: 'dynamic' },
  { lang: 'TypeScript', year: 2012, typed: 'static' },
  { lang: 'Rust', year: 2010, typed: 'static' },
];

const columns = ['lang', 'year', 'typed'];

export default (
  <>
    <h1>Table from data</h1>
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.lang}>
            {columns.map((col) => (
              <td key={col}>{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
