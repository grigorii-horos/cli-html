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

// A marketing email with deep nesting (@react-email/components, dev-only):
// hero, a 3-up product grid (Row of Columns), testimonials and a footer with
// social links. Containers/Sections/Rows become nested tables in the terminal.

const products = [
  { name: 'Starter', tag: 'CLI only', cta: 'Get started' },
  { name: 'Studio', tag: 'CLI + themes', cta: 'Try Studio' },
  { name: 'Enterprise', tag: 'SSO + support', cta: 'Contact us' },
];

const testimonials = [
  { quote: 'Replaced our docs viewer in an afternoon.', who: 'Dana, DevRel' },
  { quote: 'JSX to terminal is wild — and it just works.', who: 'Sam, CLI dev' },
];

const social = [
  { label: 'GitHub', href: 'https://github.com/grigorii-horos' },
  { label: 'npm', href: 'https://www.npmjs.com/package/cli-html' },
  { label: 'Docs', href: 'https://github.com/grigorii-horos/cli-html#readme' },
];

const Product = ({ name, tag, cta }) => (
  <Column>
    <Heading as="h3">{name}</Heading>
    <Text>{tag}</Text>
    <Button href={`https://example.com/${name.toLowerCase()}`}>{cta}</Button>
  </Column>
);

export default (
  <Container>
    <Section>
      <Heading as="h1">Meet cli-html 6.1</Heading>
      <Text>Render HTML, Markdown and now JSX — straight to the terminal.</Text>
      <Button href="https://example.com/start">Start free</Button>
    </Section>

    <Hr />

    <Section>
      <Heading as="h2">Plans</Heading>
      <Row>
        {products.map((product) => (
          <Product key={product.name} {...product} />
        ))}
      </Row>
    </Section>

    <Hr />

    <Section>
      <Heading as="h2">What people say</Heading>
      {testimonials.map((testimonial) => (
        <Section key={testimonial.who}>
          <Text>“{testimonial.quote}”</Text>
          <Text>— {testimonial.who}</Text>
        </Section>
      ))}
    </Section>

    <Hr />

    <Section>
      <Row>
        {social.map((item) => (
          <Column key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </Column>
        ))}
      </Row>
      <Text>You receive this because you starred cli-html.</Text>
    </Section>
  </Container>
);
