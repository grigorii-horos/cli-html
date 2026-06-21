import React from 'react';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';

// Built with react-bootstrap (a dev-only UI kit). Its components render to
// semantic HTML (Table -> table, Alert -> div, Badge -> span). cli-html keeps
// the structure and ignores the bootstrap CSS classes.

const deps = [
  { name: 'react', version: '19.2.7', status: 'ok' },
  { name: '@babel/core', version: '7.29.7', status: 'ok' },
  { name: 'cli-highlight', version: '2.1.11', status: 'outdated' },
];

export default (
  <div>
    <h1>Dependency report</h1>

    <Alert variant="warning">
      <Alert.Heading>Heads up</Alert.Heading>
      One dependency is out of date.
    </Alert>

    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Package</th>
          <th>Version</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {deps.map((dep) => (
          <tr key={dep.name}>
            <td>{dep.name}</td>
            <td>{dep.version}</td>
            <td>
              <Badge bg={dep.status === 'ok' ? 'success' : 'warning'}>
                {dep.status}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);
