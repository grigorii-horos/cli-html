# Code Blocks

Code blocks support syntax highlighting for many languages.

## Inline Code

Use `inline code` for short snippets like `const x = 42` or `npm install`.

## JavaScript

```javascript
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120
```

## Python

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print([fibonacci(i) for i in range(10)])
```

## Bash

```bash
#!/bin/bash

# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build
```

## TypeScript

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

## JSON

```json
{
  "name": "cli-html",
  "version": "4.5.1",
  "description": "Render HTML and Markdown to Terminal",
  "main": "index.js",
  "scripts": {
    "test": "node --test",
    "build": "npm run compile"
  }
}
```

## SQL

```sql
SELECT users.name, COUNT(orders.id) as order_count
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE users.active = true
GROUP BY users.id
ORDER BY order_count DESC
LIMIT 10;
```

## HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Example Page</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a paragraph.</p>
</body>
</html>
```

## CSS

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}
```

## Plain Text

```
This is a plain text code block
without syntax highlighting.
Useful for terminal output or logs.
```
