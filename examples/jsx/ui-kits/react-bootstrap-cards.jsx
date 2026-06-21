import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

// react-bootstrap Card + ListGroup (dev-only UI kit). Cards render as nested
// containers; cli-html shows their structure and text.

const features = [
  { label: 'JSX rendering', tag: 'new' },
  { label: 'Markdown (GFM)', tag: 'stable' },
  { label: 'HTML tags', tag: 'stable' },
];

export default (
  <div>
    <h1>Feature cards</h1>

    <Card>
      <Card.Body>
        <Card.Title>cli-html</Card.Title>
        <Card.Subtitle>Render to the terminal</Card.Subtitle>
        <Card.Text>
          One engine for HTML, Markdown and JSX.
        </Card.Text>
      </Card.Body>
      <ListGroup>
        {features.map((feature) => (
          <ListGroup.Item key={feature.label}>
            {feature.label} <Badge bg="secondary">{feature.tag}</Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  </div>
);
