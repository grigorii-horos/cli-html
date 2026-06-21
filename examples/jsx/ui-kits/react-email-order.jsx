import React from 'react';
import {
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Row,
  Column,
  Button,
  Link,
} from '@react-email/components';

// A complex transactional email built with @react-email/components (dev-only).
// Container/Section/Row/Column become tables, Button/Link become anchors,
// Heading/Text/Hr map to h1../p/hr — all rendered to the terminal by cli-html.

const order = {
  id: 'ORD-58193',
  customer: 'Jordan',
  eta: 'Jun 25',
  items: [
    { name: 'Mechanical keyboard', qty: 1, price: 129 },
    { name: 'Keycap set', qty: 2, price: 35 },
    { name: 'Wrist rest', qty: 1, price: 25 },
  ],
};

const subtotal = order.items.reduce((s, i) => s + i.qty * i.price, 0);
const shipping = 9;
const total = subtotal + shipping;

const ItemRow = ({ name, qty, price }) => (
  <Row>
    <Column>{name}</Column>
    <Column>x{qty}</Column>
    <Column>${qty * price}</Column>
  </Row>
);

const TotalRow = ({ label, amount }) => (
  <Row>
    <Column><Text>{label}</Text></Column>
    <Column><Text>${amount}</Text></Column>
  </Row>
);

export default (
  <Container>
    <Section>
      <Heading as="h1">Thanks for your order, {order.customer}!</Heading>
      <Text>
        Order <strong>{order.id}</strong> is confirmed. Estimated delivery:{' '}
        {order.eta}.
      </Text>
    </Section>

    <Hr />

    <Section>
      <Heading as="h2">Items</Heading>
      {order.items.map((item) => (
        <ItemRow key={item.name} {...item} />
      ))}
    </Section>

    <Hr />

    <Section>
      <TotalRow label="Subtotal" amount={subtotal} />
      <TotalRow label="Shipping" amount={shipping} />
      <TotalRow label="Total" amount={total} />
    </Section>

    <Section>
      <Button href="https://example.com/orders/58193">Track your order</Button>
    </Section>

    <Hr />

    <Section>
      <Text>
        Questions? Reply to this email or visit our{' '}
        <Link href="https://example.com/help">help center</Link>.
      </Text>
    </Section>
  </Container>
);
