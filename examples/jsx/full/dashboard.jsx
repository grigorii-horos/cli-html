import React from 'react';

// Data-driven dashboard: metrics, progress and a task list from state.

const services = [
  { name: 'api', value: 92 },
  { name: 'web', value: 78 },
  { name: 'worker', value: 45 },
];

const incidents = [
  { time: '09:12', level: 'info', text: 'Deploy 6.1.0' },
  { time: '11:40', level: 'warn', text: 'Worker queue backlog' },
  { time: '14:03', level: 'info', text: 'Backlog cleared' },
];

const tasks = [
  { label: 'Ship JSX renderer', done: true },
  { label: 'Write examples', done: true },
  { label: 'Record screencast', done: false },
];

const Metric = ({ name, value }) => (
  <p>
    <strong>{name}</strong>
    <br />
    <progress value={value} max="100" />
  </p>
);

export default (
  <>
    <h1>Service dashboard</h1>

    <h2>Uptime</h2>
    {services.map((service) => (
      <Metric key={service.name} {...service} />
    ))}

    <h2>Incidents</h2>
    <table>
      <thead>
        <tr><th>Time</th><th>Level</th><th>Event</th></tr>
      </thead>
      <tbody>
        {incidents.map((incident) => (
          <tr key={incident.time}>
            <td>{incident.time}</td>
            <td>{incident.level}</td>
            <td>{incident.text}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2>Checklist</h2>
    <ul>
      {tasks.map((task) => (
        <li key={task.label}>
          {task.done ? '✓' : '○'}{' '}
          {task.done ? <del>{task.label}</del> : task.label}
        </li>
      ))}
    </ul>
  </>
);
