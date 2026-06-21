# JSX Examples

Render any of these with the `jsx` command:

```sh
jsx examples/jsx/full/demo.jsx
jsx examples/jsx/tags/table.jsx
```

Each file's `default` export is a React element or component. JSX is transpiled,
rendered to HTML via `react-dom`, then drawn to the terminal by cli-html.

- **[tags/](tags)** — one element family per file (headings, lists, code, …)
- **[full/](full)** — complete documents (blog, dashboard, changelog, …)
- **[ui-kits/](ui-kits)** — third-party React UI kits (react-email, react-bootstrap)

For library usage (`renderJSX`), see
[../library-usage/jsx-basic.js](../library-usage/jsx-basic.js).
