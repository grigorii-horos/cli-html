import React from 'react';
import {
  Alert,
  Table,
  ListGroup,
  ListGroupItem,
  Badge,
} from 'reactstrap';

// A richer admin panel built with reactstrap (dev-only UI kit). Semantic
// output: Alert -> div, Table -> table, ListGroup -> ul/li, Badge -> span.

const incidents = [
  { id: 'INC-9', service: 'api', severity: 'high', age: '12m' },
  { id: 'INC-8', service: 'web', severity: 'low', age: '3h' },
  { id: 'INC-7', service: 'worker', severity: 'medium', age: '1d' },
];

const queue = [
  { job: 'email:digest', pending: 1240 },
  { job: 'image:resize', pending: 87 },
  { job: 'report:nightly', pending: 0 },
];

const severityColor = (severity) =>
  ({ high: 'danger', medium: 'warning', low: 'secondary' })[severity];

export default (
  <div>
    <h1>Admin panel</h1>

    <Alert color="danger">
      <strong>1 high-severity incident</strong> needs attention.
    </Alert>

    <h2>Open incidents</h2>
    <Table bordered striped>
      <thead>
        <tr>
          <th>ID</th>
          <th>Service</th>
          <th>Severity</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        {incidents.map((incident) => (
          <tr key={incident.id}>
            <td>{incident.id}</td>
            <td>{incident.service}</td>
            <td>
              <Badge color={severityColor(incident.severity)}>
                {incident.severity}
              </Badge>
            </td>
            <td>{incident.age}</td>
          </tr>
        ))}
      </tbody>
    </Table>

    <h2>Queue depth</h2>
    <ListGroup>
      {queue.map((entry) => (
        <ListGroupItem key={entry.job}>
          {entry.job}{' '}
          <Badge color={entry.pending > 0 ? 'primary' : 'success'}>
            {entry.pending}
          </Badge>
        </ListGroupItem>
      ))}
    </ListGroup>
  </div>
);
