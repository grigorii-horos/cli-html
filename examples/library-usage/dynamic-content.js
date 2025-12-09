#!/usr/bin/env node

/**
 * Dynamic content generation example
 *
 * This example demonstrates how to generate HTML/Markdown content
 * dynamically from data and render it in the terminal.
 */

import { renderHTML, renderMarkdown } from '../../index.js';

// Example 1: Generate a user report from data
console.log('=== Example 1: User Report ===\n');

const users = [
  { name: 'Alice Johnson', email: 'alice@example.com', status: 'Active', role: 'Admin' },
  { name: 'Bob Smith', email: 'bob@example.com', status: 'Active', role: 'User' },
  { name: 'Charlie Brown', email: 'charlie@example.com', status: 'Inactive', role: 'User' },
  { name: 'Diana Prince', email: 'diana@example.com', status: 'Active', role: 'Moderator' }
];

const userReportHTML = `
<h1>User Report</h1>
<p>Total Users: <strong>${users.length}</strong></p>
<p>Active Users: <strong>${users.filter(u => u.status === 'Active').length}</strong></p>

<h2>User Details</h2>
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    ${users.map(user => `
    <tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.status === 'Active' ? '✓ Active' : '✗ Inactive'}</td>
    </tr>
    `).join('')}
  </tbody>
</table>
`;

console.log(renderHTML(userReportHTML));

// Example 2: Generate a task list from data
console.log('\n=== Example 2: Task List ===\n');

const tasks = [
  { id: 1, title: 'Implement authentication', completed: true, priority: 'High' },
  { id: 2, title: 'Design user dashboard', completed: true, priority: 'Medium' },
  { id: 3, title: 'Write API documentation', completed: false, priority: 'High' },
  { id: 4, title: 'Set up CI/CD pipeline', completed: false, priority: 'Medium' },
  { id: 5, title: 'Add unit tests', completed: false, priority: 'Low' }
];

const taskListMarkdown = `
# Project Tasks

${tasks.map(task =>
  `- [${task.completed ? 'x' : ' '}] **${task.title}** \`${task.priority}\``
).join('\n')}

## Summary

- **Total Tasks:** ${tasks.length}
- **Completed:** ${tasks.filter(t => t.completed).length}
- **Remaining:** ${tasks.filter(t => !t.completed).length}
- **High Priority:** ${tasks.filter(t => t.priority === 'High' && !t.completed).length} remaining
`;

console.log(renderMarkdown(taskListMarkdown));

// Example 3: Generate documentation from code metadata
console.log('\n=== Example 3: API Documentation ===\n');

const apiEndpoints = [
  {
    method: 'GET',
    path: '/api/users',
    description: 'Get all users',
    params: [],
    returns: 'Array of user objects'
  },
  {
    method: 'POST',
    path: '/api/users',
    description: 'Create a new user',
    params: ['name', 'email', 'role'],
    returns: 'Created user object'
  },
  {
    method: 'GET',
    path: '/api/users/:id',
    description: 'Get user by ID',
    params: ['id'],
    returns: 'User object'
  },
  {
    method: 'DELETE',
    path: '/api/users/:id',
    description: 'Delete user by ID',
    params: ['id'],
    returns: 'Success message'
  }
];

const apiDocsMarkdown = `
# API Documentation

## Endpoints

${apiEndpoints.map(endpoint => `
### \`${endpoint.method}\` ${endpoint.path}

${endpoint.description}

**Parameters:** ${endpoint.params.length > 0 ? endpoint.params.map(p => `\`${p}\``).join(', ') : 'None'}

**Returns:** ${endpoint.returns}
`).join('\n---\n')}
`;

console.log(renderMarkdown(apiDocsMarkdown));

// Example 4: Generate a changelog from version data
console.log('\n=== Example 4: Changelog ===\n');

const versions = [
  {
    version: '2.0.0',
    date: '2025-01-15',
    changes: [
      { type: 'feature', description: 'Added dark mode support' },
      { type: 'feature', description: 'New dashboard layout' },
      { type: 'breaking', description: 'Removed deprecated API endpoints' }
    ]
  },
  {
    version: '1.5.0',
    date: '2024-12-01',
    changes: [
      { type: 'feature', description: 'User profile customization' },
      { type: 'fix', description: 'Fixed authentication bug' },
      { type: 'fix', description: 'Improved performance' }
    ]
  }
];

const changelogMarkdown = `
# Changelog

${versions.map(v => `
## Version ${v.version} (${v.date})

${v.changes.map(change => {
  const icon = change.type === 'feature' ? '✨' :
               change.type === 'fix' ? '🐛' :
               change.type === 'breaking' ? '⚠️' : '📝';
  const label = change.type === 'feature' ? 'Feature' :
                change.type === 'fix' ? 'Fix' :
                change.type === 'breaking' ? 'Breaking' : 'Other';
  return `- ${icon} **${label}:** ${change.description}`;
}).join('\n')}
`).join('\n')}
`;

console.log(renderMarkdown(changelogMarkdown));

// Example 5: Generate statistics dashboard
console.log('\n=== Example 5: Statistics Dashboard ===\n');

const stats = {
  totalSales: 12543,
  revenue: 45678.90,
  activeUsers: 1234,
  serverUptime: 99.9,
  responseTime: 142
};

const dashboardHTML = `
<h1>Dashboard Statistics</h1>

<h2>Key Metrics</h2>
<ul>
  <li><strong>Total Sales:</strong> ${stats.totalSales.toLocaleString()}</li>
  <li><strong>Revenue:</strong> $${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</li>
  <li><strong>Active Users:</strong> ${stats.activeUsers.toLocaleString()}</li>
  <li><strong>Server Uptime:</strong> ${stats.serverUptime}%</li>
  <li><strong>Avg Response Time:</strong> ${stats.responseTime}ms</li>
</ul>

<h2>Server Status</h2>
<blockquote>
  <p>All systems operational ✓</p>
  <p>Last updated: ${new Date().toLocaleString()}</p>
</blockquote>
`;

console.log(renderHTML(dashboardHTML));
