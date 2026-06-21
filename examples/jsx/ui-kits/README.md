# UI-kit JSX Examples

These examples use third-party React UI kits — `@react-email/components`,
`react-bootstrap`, `reactstrap` and `@mui/material` — declared as
**devDependencies** (they are not runtime dependencies of cli-html and are not
shipped on npm).

The trick: cli-html renders whatever HTML a component produces via
`react-dom`. UI kits that emit **semantic HTML** (tables, headings, paragraphs,
lists, `hr`, `a`) render well — their CSS classes and inline styles are simply
ignored, the structure is kept.

```sh
jsx examples/jsx/ui-kits/<file>.jsx
```

| File | UI kit | Notes |
| --- | --- | --- |
| [react-email-newsletter.jsx](react-email-newsletter.jsx) | `@react-email/components` | Section/Heading/Text/Hr/Row/Column/Link |
| [react-email-receipt.jsx](react-email-receipt.jsx) | `@react-email/components` | Row/Column laid out as an order receipt |
| [react-email-order.jsx](react-email-order.jsx) | `@react-email/components` | Complex transactional email: Container, nested Sections, Button |
| [react-email-marketing.jsx](react-email-marketing.jsx) | `@react-email/components` | Marketing email: hero, 3-up product grid, testimonials, social footer |
| [react-bootstrap-table.jsx](react-bootstrap-table.jsx) | `react-bootstrap` | Table + Alert + Badge dependency report |
| [react-bootstrap-cards.jsx](react-bootstrap-cards.jsx) | `react-bootstrap` | Card + ListGroup + Badge |
| [reactstrap-admin.jsx](reactstrap-admin.jsx) | `reactstrap` | Admin panel: Alert, incident Table with Badges, ListGroup |
| [reactstrap-pricing.jsx](reactstrap-pricing.jsx) | `reactstrap` | Pricing comparison: feature matrix (features × plans) with ✓/✗ |
| [mui-dashboard.jsx](mui-dashboard.jsx) | `@mui/material` | Multi-section dashboard: Typography, Divider, Table, List |
| [mui-invoice.jsx](mui-invoice.jsx) | `@mui/material` | Invoice with a multi-row table footer (subtotal/tax/total) |
| [mui-analytics.jsx](mui-analytics.jsx) | `@mui/material` | Analytics report: sorted tables, aggregates, traffic bars, funnel |
| [mui-kanban.jsx](mui-kanban.jsx) | `@mui/material` | Kanban board: tasks grouped by status into columns |
| [mixed-status-report.jsx](mixed-status-report.jsx) | mixed | Cross-kit: MUI + reactstrap + react-bootstrap + native elements |

> Kits that render only `<div>`/`<span>` with CSS (most styled component
> libraries) will still show their text, but without their visual styling —
> cli-html styles by HTML semantics, not CSS.
