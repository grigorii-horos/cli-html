#!/usr/bin/env node

/**
 * Basic Markdown rendering example
 *
 * This example demonstrates how to use cli-html as a library
 * to render Markdown content with GitHub Flavored Markdown support.
 */

import { renderMarkdown } from '../../index.js';

// Example 1: Basic Markdown formatting
console.log('=== Example 1: Basic Markdown ===\n');
const basicMarkdown = `
# Welcome to cli-html

This is a **powerful** library for rendering Markdown in the terminal.

It supports *italic*, **bold**, \`inline code\`, and much more!
`;
console.log(renderMarkdown(basicMarkdown));

// Example 2: GitHub Flavored Markdown Alerts
console.log('\n=== Example 2: GFM Alerts ===\n');
const alertsMarkdown = `
> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
`;
console.log(renderMarkdown(alertsMarkdown));

// Example 3: Task Lists
console.log('\n=== Example 3: Task Lists ===\n');
const taskListMarkdown = `
## My Tasks

- [x] Complete the documentation
- [x] Write unit tests
- [ ] Deploy to production
- [ ] Send release notes
`;
console.log(renderMarkdown(taskListMarkdown));

// Example 4: Tables
console.log('\n=== Example 4: Tables ===\n');
const tableMarkdown = `
## Team Members

| Name         | Role       | Email              |
|--------------|------------|-------------------|
| John Doe     | Developer  | john@example.com  |
| Jane Smith   | Designer   | jane@example.com  |
| Bob Johnson  | Manager    | bob@example.com   |
`;
console.log(renderMarkdown(tableMarkdown));

// Example 5: Code Blocks with Syntax Highlighting
console.log('\n=== Example 5: Code Blocks ===\n');
const codeMarkdown = `
## JavaScript Example

\`\`\`javascript
async function fetchUser(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  const user = await response.json();
  return user;
}

const user = await fetchUser(123);
console.log(user);
\`\`\`

## Python Example

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(f"fib({i}) = {fibonacci(i)}")
\`\`\`
`;
console.log(renderMarkdown(codeMarkdown));

// Example 6: Lists and Nested Items
console.log('\n=== Example 6: Nested Lists ===\n');
const nestedListMarkdown = `
## Project Structure

1. Frontend
   - React components
   - CSS modules
   - Redux store
2. Backend
   - API routes
   - Database models
   - Middleware
3. DevOps
   - CI/CD pipeline
   - Docker configuration
   - Monitoring setup
`;
console.log(renderMarkdown(nestedListMarkdown));

// Example 7: Strikethrough and Links
console.log('\n=== Example 7: Strikethrough & Links ===\n');
const mixedMarkdown = `
## Release Notes v2.0

- ~~Old feature removed~~
- New authentication system
- Check out our [documentation](https://github.com/grigorii-horos/cli-html)
- Visit [npm package](https://www.npmjs.com/package/cli-html)
`;
console.log(renderMarkdown(mixedMarkdown));

// Example 8: Blockquotes
console.log('\n=== Example 8: Blockquotes ===\n');
const quoteMarkdown = `
## Inspiration

> "Code is like humor. When you have to explain it, it's bad."
>
> — Cory House

> "First, solve the problem. Then, write the code."
>
> — John Johnson
`;
console.log(renderMarkdown(quoteMarkdown));
