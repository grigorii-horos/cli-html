import React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

// A multi-section admin dashboard built with @mui/material (dev-only UI kit).
// MUI renders semantic HTML statically: Typography -> h1..h6/p (variantMapping),
// Table -> table, Divider -> hr, List -> ul/li. CSS is ignored by cli-html.

const kpis = [
  { metric: 'Requests', value: '1.2M', delta: '+8%' },
  { metric: 'Errors', value: '312', delta: '-21%' },
  { metric: 'p95 latency', value: '184ms', delta: '+3%' },
];

const regions = [
  { name: 'us-east', share: 48 },
  { name: 'eu-west', share: 31 },
  { name: 'ap-south', share: 21 },
];

const activity = [
  { who: 'deploy-bot', what: 'released 6.1.0' },
  { who: 'alice', what: 'merged #142' },
  { who: 'monitor', what: 'cleared incident' },
];

const Stat = ({ metric, value, delta }) => (
  <TableRow>
    <TableCell>{metric}</TableCell>
    <TableCell>{value}</TableCell>
    <TableCell>{delta}</TableCell>
  </TableRow>
);

export default (
  <div>
    <Typography variant="h1">Operations dashboard</Typography>
    <Typography variant="body1">Last 24 hours · production</Typography>
    <Divider />

    <Typography variant="h2">Key metrics</Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Metric</TableCell>
          <TableCell>Value</TableCell>
          <TableCell>Δ</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {kpis.map((kpi) => (
          <Stat key={kpi.metric} {...kpi} />
        ))}
      </TableBody>
    </Table>

    <Typography variant="h2">Traffic by region</Typography>
    <List>
      {regions.map((region) => (
        <ListItem key={region.name}>
          <ListItemText>
            {region.name} — {region.share}%
          </ListItemText>
        </ListItem>
      ))}
    </List>

    <Divider />

    <Typography variant="h2">Recent activity</Typography>
    <List>
      {activity.map((event) => (
        <ListItem key={event.what}>
          <ListItemText>
            <strong>{event.who}</strong>: {event.what}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  </div>
);
