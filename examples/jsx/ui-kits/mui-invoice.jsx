import React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Link from '@mui/material/Link';

// An invoice laid out with @mui/material (dev-only UI kit).

const invoice = {
  number: 'INV-2026-0042',
  from: 'cli-html OSS',
  to: 'Acme Inc.',
  date: '2026-06-21',
  lines: [
    { desc: 'Priority support', qty: 12, unit: 50 },
    { desc: 'Custom theme', qty: 1, unit: 400 },
    { desc: 'Workshop (per seat)', qty: 5, unit: 120 },
  ],
};

const money = (n) => `$${n.toLocaleString('en-US')}`;
const lineTotal = (line) => line.qty * line.unit;
const subtotal = invoice.lines.reduce((sum, line) => sum + lineTotal(line), 0);
const tax = Math.round(subtotal * 0.2);
const total = subtotal + tax;

export default (
  <div>
    <Typography variant="h1">Invoice {invoice.number}</Typography>
    <Typography variant="body2">
      From {invoice.from} · To {invoice.to} · {invoice.date}
    </Typography>
    <Divider />

    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Description</TableCell>
          <TableCell>Qty</TableCell>
          <TableCell>Unit</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {invoice.lines.map((line) => (
          <TableRow key={line.desc}>
            <TableCell>{line.desc}</TableCell>
            <TableCell>{line.qty}</TableCell>
            <TableCell>{money(line.unit)}</TableCell>
            <TableCell>{money(lineTotal(line))}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Subtotal</TableCell>
          <TableCell />
          <TableCell />
          <TableCell>{money(subtotal)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Tax (20%)</TableCell>
          <TableCell />
          <TableCell />
          <TableCell>{money(tax)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell />
          <TableCell />
          <TableCell>{money(total)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>

    <Divider />
    <Typography variant="body2">
      Pay online at{' '}
      <Link href="https://example.com/pay">example.com/pay</Link>
    </Typography>
  </div>
);
