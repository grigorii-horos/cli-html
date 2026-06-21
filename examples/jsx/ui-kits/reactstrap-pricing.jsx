import React from 'react';
import { Table, Badge } from 'reactstrap';

// A pricing comparison built with reactstrap (dev-only). The feature matrix is
// generated from data: features (rows) x plans (columns), with ✓/✗ per cell.

const plans = [
  { id: 'free', name: 'Free', price: '$0', recommended: false },
  { id: 'pro', name: 'Pro', price: '$12/mo', recommended: true },
  { id: 'team', name: 'Team', price: '$49/mo', recommended: false },
];

const features = [
  { label: 'Render HTML & Markdown', free: true, pro: true, team: true },
  { label: 'Render JSX', free: true, pro: true, team: true },
  { label: 'Custom themes', free: false, pro: true, team: true },
  { label: 'Priority support', free: false, pro: true, team: true },
  { label: 'Seats', free: '1', pro: '1', team: 'Unlimited' },
  { label: 'SSO', free: false, pro: false, team: true },
];

const Cell = ({ value }) => {
  if (value === true) return <>✓</>;
  if (value === false) return <>✗</>;
  return <>{value}</>;
};

export default (
  <div>
    <h1>Pricing</h1>

    <p>
      {plans.map((plan) => (
        <React.Fragment key={plan.id}>
          <strong>{plan.name}</strong> {plan.price}
          {plan.recommended && <> <Badge color="primary">popular</Badge></>}
          {'   '}
        </React.Fragment>
      ))}
    </p>

    <Table bordered striped>
      <thead>
        <tr>
          <th>Feature</th>
          {plans.map((plan) => (
            <th key={plan.id}>
              {plan.name}
              {plan.recommended ? ' ★' : ''}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {features.map((feature) => (
          <tr key={feature.label}>
            <td>{feature.label}</td>
            {plans.map((plan) => (
              <td key={plan.id}>
                <Cell value={feature[plan.id]} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
);
