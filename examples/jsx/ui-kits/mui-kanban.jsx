import React from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// A kanban board (@mui/material, dev-only). Tasks are grouped by status with a
// reduce(), then laid out as columns in a single table row.

const tasks = [
  { title: 'Spec JSX API', status: 'done', who: 'AH' },
  { title: 'renderJSX', status: 'done', who: 'AH' },
  { title: 'jsx CLI', status: 'done', who: 'AH' },
  { title: 'UI-kit examples', status: 'doing', who: 'AH' },
  { title: 'Fix tfoot bug', status: 'doing', who: 'AH' },
  { title: 'Screencast', status: 'todo', who: '—' },
  { title: 'Blog post', status: 'todo', who: '—' },
];

const columns = [
  { key: 'todo', label: 'To do' },
  { key: 'doing', label: 'In progress' },
  { key: 'done', label: 'Done' },
];

const byStatus = tasks.reduce((groups, task) => {
  (groups[task.status] ||= []).push(task);
  return groups;
}, {});

const Card = ({ title, who }) => (
  <>
    • {title} <em>({who})</em>
    <br />
  </>
);

export default (
  <div>
    <Typography variant="h1">Sprint board</Typography>
    <Typography variant="body2">{tasks.length} tasks</Typography>

    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.key}>
              {column.label} ({(byStatus[column.key] || []).length})
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.key}>
              {(byStatus[column.key] || []).map((task) => (
                <Card key={task.title} {...task} />
              ))}
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  </div>
);
