import React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Table } from 'reactstrap';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';

// Cross-kit example: headings from @mui/material, the table from reactstrap,
// badges/alert from react-bootstrap, plus native cli-html elements. Mixing kits
// works because each renders to plain semantic HTML.

const services = [
  { name: 'api', uptime: 99.98, state: 'operational' },
  { name: 'web', uptime: 99.91, state: 'operational' },
  { name: 'search', uptime: 97.40, state: 'degraded' },
  { name: 'billing', uptime: 100, state: 'operational' },
];

const stateColor = (state) =>
  ({ operational: 'success', degraded: 'warning', down: 'danger' })[state];

const degraded = services.filter((service) => service.state !== 'operational');
const avgUptime = (
  services.reduce((sum, service) => sum + service.uptime, 0) / services.length
).toFixed(2);

export default (
  <div>
    <Typography variant="h1">System status</Typography>
    <Typography variant="body2">Average uptime {avgUptime}%</Typography>
    <Divider />

    {degraded.length > 0 && (
      <Alert variant="warning">
        {degraded.length} service{degraded.length > 1 ? 's' : ''} degraded:{' '}
        {degraded.map((service) => service.name).join(', ')}
      </Alert>
    )}

    <Table bordered striped>
      <thead>
        <tr>
          <th>Service</th>
          <th>Uptime</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <tr key={service.name}>
            <td>{service.name}</td>
            <td>{service.uptime}%</td>
            <td>
              <Badge bg={stateColor(service.state)}>{service.state}</Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>

    <h2>Legend</h2>
    <ul>
      <li><Badge bg="success">operational</Badge> — all good</li>
      <li><Badge bg="warning">degraded</Badge> — partial outage</li>
      <li><Badge bg="danger">down</Badge> — unavailable</li>
    </ul>
  </div>
);
