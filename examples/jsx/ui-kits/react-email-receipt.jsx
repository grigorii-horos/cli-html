import React from 'react';
import {
  Section,
  Heading,
  Text,
  Hr,
  Row,
  Column,
} from '@react-email/components';

// An order receipt laid out with @react-email/components (dev-only UI kit).

const order = {
  id: 'A-1042',
  lines: [
    { item: 'cli-html license', qty: 1, price: 0 },
    { item: 'Support (yearly)', qty: 1, price: 49 },
    { item: 'Stickers', qty: 3, price: 2 },
  ],
};

const total = order.lines.reduce((sum, line) => sum + line.qty * line.price, 0);

const LineRow = ({ item, qty, price }) => (
  <Row>
    <Column>{item}</Column>
    <Column>x{qty}</Column>
    <Column>${qty * price}</Column>
  </Row>
);

export default (
  <Section>
    <Heading as="h1">Receipt</Heading>
    <Text>Order {order.id}</Text>
    <Hr />

    {order.lines.map((line) => (
      <LineRow key={line.item} {...line} />
    ))}

    <Hr />
    <Row>
      <Column><Text>Total</Text></Column>
      <Column><Text>${total}</Text></Column>
    </Row>
  </Section>
);
