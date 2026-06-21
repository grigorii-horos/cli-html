import React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// An analytics report (@mui/material, dev-only). Demonstrates derived data:
// sorting, aggregation, percentages and a funnel — all computed in JS, then
// rendered as semantic HTML that cli-html draws to the terminal.

const pages = [
  { path: '/', views: 48210, bounce: 0.32 },
  { path: '/docs', views: 31044, bounce: 0.18 },
  { path: '/pricing', views: 12903, bounce: 0.51 },
  { path: '/blog/jsx', views: 9221, bounce: 0.27 },
  { path: '/download', views: 7740, bounce: 0.44 },
];

const sources = [
  { name: 'Organic', sessions: 41200 },
  { name: 'Direct', sessions: 22800 },
  { name: 'Referral', sessions: 13900 },
  { name: 'Social', sessions: 6100 },
];

const funnel = [
  { stage: 'Visited', count: 84000 },
  { stage: 'Signed up', count: 12600 },
  { stage: 'Activated', count: 7350 },
  { stage: 'Paid', count: 1880 },
];

const pct = (n) => `${Math.round(n * 100)}%`;
const totalViews = pages.reduce((sum, page) => sum + page.views, 0);
const totalSessions = sources.reduce((sum, source) => sum + source.sessions, 0);
const topPages = [...pages].sort((a, b) => b.views - a.views);
const funnelStart = funnel[0].count;

export default (
  <div>
    <Typography variant="h1">Analytics — June 2026</Typography>
    <Typography variant="body2">
      {totalViews.toLocaleString('en-US')} page views ·{' '}
      {totalSessions.toLocaleString('en-US')} sessions
    </Typography>
    <Divider />

    <Typography variant="h2">Top pages</Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Page</TableCell>
          <TableCell>Views</TableCell>
          <TableCell>Share</TableCell>
          <TableCell>Bounce</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {topPages.map((page) => (
          <TableRow key={page.path}>
            <TableCell>{page.path}</TableCell>
            <TableCell>{page.views.toLocaleString('en-US')}</TableCell>
            <TableCell>{pct(page.views / totalViews)}</TableCell>
            <TableCell>{pct(page.bounce)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>{totalViews.toLocaleString('en-US')}</TableCell>
          <TableCell>100%</TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>

    <Typography variant="h2">Traffic sources</Typography>
    <Table>
      <TableBody>
        {sources.map((source) => (
          <TableRow key={source.name}>
            <TableCell>{source.name}</TableCell>
            <TableCell>{pct(source.sessions / totalSessions)}</TableCell>
            <TableCell>
              <progress value={source.sessions} max={totalSessions} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <Divider />

    <Typography variant="h2">Conversion funnel</Typography>
    <Table>
      <TableBody>
        {funnel.map((step, index) => (
          <TableRow key={step.stage}>
            <TableCell>{step.stage}</TableCell>
            <TableCell>{step.count.toLocaleString('en-US')}</TableCell>
            <TableCell>{pct(step.count / funnelStart)}</TableCell>
            <TableCell>
              {index === 0
                ? '—'
                : `${pct(step.count / funnel[index - 1].count)} of prev`}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
