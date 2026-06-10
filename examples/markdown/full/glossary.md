# Web Development Glossary

A quick reference for common terms in modern web development.

---

## A

API
: **Application Programming Interface** — A set of rules and protocols that allows
  different software applications to communicate with each other. REST and GraphQL
  are common API styles. <q cite="https://mdn.example/api">An API is a way for two
  or more computer programs to communicate with each other.</q>

Async/Await
: JavaScript syntax for working with Promises. `async` functions always return a
  Promise; `await` pauses execution until a Promise resolves. Introduced in
  <ruby>ECMAScript<rt>ES2017</rt></ruby>.

---

## B

Bundle
: A single file (or small set of files) produced by a build tool that combines many
  source modules into a deployable artifact. Common bundlers: webpack, Rollup, esbuild, Vite.

---

## C

CDN
: **Content Delivery Network** — A geographically distributed group of servers that
  caches content close to end users to improve load times. Examples: Cloudflare,
  Fastly, Akamai.

CI/CD
: **Continuous Integration / Continuous Deployment** — Practices where code changes
  are automatically tested (CI) and deployed (CD) on every push.

  > [!TIP]
  > A good CI pipeline catches broken builds before they reach production.
  > At minimum: lint → test → build.

CORS
: **Cross-Origin Resource Sharing** — A browser security mechanism that controls
  which domains can make requests to a server. Configured via HTTP headers.
  Common source of errors when building APIs consumed by browsers.

---

## D

DOM
: **Document Object Model** — A tree-like in-memory representation of an HTML document.
  JavaScript interacts with the page by manipulating the DOM. Created when the browser
  parses HTML.

---

## H

HTTP
: **HyperText Transfer Protocol** — The foundation of data communication on the web.
  HTTP/1.1 was standardized in <time datetime="1997">1997</time>;
  HTTP/2 in <time datetime="2015">2015</time>;
  HTTP/3 (based on QUIC) in <time datetime="2022">2022</time>.

---

## J

JSON
: **JavaScript Object Notation** — A lightweight text-based data interchange format.
  Originally derived from JavaScript object syntax but is language-independent.
  Replaced XML as the dominant data format for web APIs around <time datetime="2006">2006</time>.

  ```json
  {
    "name": "example",
    "version": "1.0.0",
    "type": "module"
  }
  ```

---

## R

REST
: **Representational State Transfer** — An architectural style for building web APIs
  defined by Roy Fielding in his doctoral dissertation in <time datetime="2000">2000</time>.
  Key constraints: stateless, uniform interface, client-server separation.

  <q cite="https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm">REST is intended
  to evoke an image of how a well-designed Web application behaves: a network of web pages
  (a virtual state-machine), where the user progresses through the application by selecting
  links (state transitions).</q> — Roy Fielding, <time datetime="2000">2000</time>

---

## S

SSR
: **Server-Side Rendering** — Generating HTML on the server for each request, as opposed
  to client-side rendering where the browser builds the page from JavaScript.
  Improves initial load performance and SEO.

---

## T

TypeScript
: A strongly-typed superset of JavaScript developed by Microsoft, first released in
  <time datetime="2012">2012</time>. Compiles to plain JavaScript. Adds static type
  checking, interfaces, and enums.

  ```typescript
  interface User {
    id: number;
    name: string;
    email?: string;
  }
  ```

---

## W

WebSocket
: A protocol providing full-duplex communication over a single TCP connection.
  Unlike HTTP, the connection stays open, allowing the server to push data to the
  client at any time. Standardized in <time datetime="2011">2011</time> (RFC 6455).
