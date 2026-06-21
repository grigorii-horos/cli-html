import React from 'react';
import {
  Section,
  Heading,
  Text,
  Hr,
  Link,
  Row,
  Column,
} from '@react-email/components';

// Built with @react-email/components (a dev-only UI kit). Its components render
// to semantic HTML (Section -> table, Heading -> h1, Text -> p, Hr -> hr,
// Row/Column -> table cells, Link -> a), which cli-html then draws to the
// terminal. CSS/inline styles are ignored; structure is kept.

const items = [
  { title: 'renderJSX', body: 'Render React/JSX straight to the terminal.' },
  { title: 'jsx CLI', body: 'Run a .jsx file with the jsx command.' },
  { title: 'Examples', body: 'Tags, full documents and UI-kit demos.' },
];

export default (
  <Section>
    <Heading as="h1">cli-html Weekly</Heading>
    <Text>Everything new in this release.</Text>
    <Hr />

    {items.map((item) => (
      <Section key={item.title}>
        <Heading as="h2">{item.title}</Heading>
        <Text>{item.body}</Text>
      </Section>
    ))}

    <Hr />
    <Row>
      <Column>
        <Link href="https://github.com/grigorii-horos/cli-html">Docs</Link>
      </Column>
      <Column>
        <Link href="https://www.npmjs.com/package/cli-html">npm</Link>
      </Column>
    </Row>
  </Section>
);
