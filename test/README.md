# Test Suite Documentation

This directory contains the comprehensive test suite for cli-html.

## Test Structure

```
test/
├── rendering/           # Core rendering tests
│   ├── html-basic.test.js      # HTML element rendering
│   └── markdown.test.js        # Markdown & GFM features
├── performance/         # Performance & streaming tests
│   └── streaming.test.js       # Streaming API tests
├── integration/         # Integration tests
│   └── cli.test.js             # CLI command tests
└── fixtures/            # Test data
    ├── simple.html
    ├── simple.md
    └── test-config.yaml
```

## Running Tests

### All tests
```bash
npm test
```

### Watch mode (auto-rerun on changes)
```bash
npm run test:watch
```

### With coverage
```bash
npm run test:coverage
```

### Specific test file
```bash
node --test test/rendering/html-basic.test.js
```

### Verbose output
```bash
node --test --test-reporter=spec
```

## Test Categories

### 1. HTML Rendering Tests (`rendering/html-basic.test.js`)
Tests core HTML element rendering:
- Headings (h1-h6)
- Paragraphs
- Text formatting (bold, italic, code)
- Lists (ordered, unordered, nested)
- Links
- Code blocks
- Tables
- Edge cases (empty input, malformed HTML)
- Custom themes

**Total: ~35 tests**

### 2. Markdown Rendering Tests (`rendering/markdown.test.js`)
Tests Markdown to terminal conversion:
- Basic syntax (headings, paragraphs, emphasis)
- Lists and nested lists
- Code blocks with syntax highlighting
- GitHub Flavored Markdown features:
  - Task lists (`- [x]`)
  - Tables
  - Strikethrough
  - Alerts (`[!NOTE]`, `[!WARNING]`, etc.)
- Extended syntax:
  - Footnotes
  - Abbreviations
  - Definition lists
  - Subscript/Superscript
  - Inserted/Marked text
- Edge cases

**Total: ~40 tests**

### 3. Streaming Performance Tests (`performance/streaming.test.js`)
Tests streaming API for large documents:
- Small document handling
- Large document processing
- Progress tracking
- Memory estimation
- Adaptive rendering
- Error handling
- Custom options
- Theme integration

**Total: ~15 tests**

### 4. CLI Integration Tests (`integration/cli.test.js`)
Tests command-line interface:
- HTML command with file input
- HTML command with stdin
- Markdown command with file input
- Markdown command with stdin
- Custom config files
- Error handling
- Non-existent files

**Total: ~8 tests**

## Writing New Tests

### Example Test Structure

```javascript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { renderHTML } from '../../index.js';

describe('Feature Name', () => {
  describe('Sub-feature', () => {
    it('should do something specific', () => {
      const input = '<div>Test</div>';
      const result = renderHTML(input);
      assert.ok(result.includes('Test'));
    });
  });
});
```

### Best Practices

1. **Descriptive test names**: Use "should" statements
   ```javascript
   it('should render bold text correctly')
   ```

2. **Test one thing**: Each test should verify one specific behavior
   ```javascript
   // Good
   it('should render h1 tags')
   it('should apply custom theme to h1')

   // Avoid
   it('should render all headings with custom themes')
   ```

3. **Use fixtures**: For complex test data, use files in `fixtures/`
   ```javascript
   const html = fs.readFileSync('test/fixtures/complex.html', 'utf8');
   ```

4. **Test edge cases**: Always test:
   - Empty input
   - Null/undefined
   - Malformed input
   - Very large input
   - Special characters

5. **Async tests**: Use async/await for asynchronous operations
   ```javascript
   it('should handle async operations', async () => {
     const result = await asyncFunction();
     assert.ok(result);
   });
   ```

## Coverage Goals

Target coverage metrics:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 85%
- **Lines**: > 80%

View coverage report:
```bash
npm run test:coverage
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
```

## Continuous Integration

Tests run automatically on:
- Every push to `master`, `main`, `develop`
- Every pull request
- Node.js versions: 18.x, 20.x, 21.x

See `.github/workflows/ci.yml` for full CI configuration.

## Troubleshooting

### Tests timing out
Increase timeout for specific test:
```javascript
it('slow test', { timeout: 10000 }, async () => {
  // test code
});
```

### ANSI color issues
Tests use `FORCE_COLOR=1` for consistent output. If colors appear in test output:
```bash
NO_COLOR=1 npm test
```

### Memory issues with large tests
Use streaming for large document tests:
```javascript
import { renderHTMLStreaming } from '../../lib/utils/streaming.js';
```

## Adding New Test Categories

1. Create new test file in appropriate directory
2. Follow naming convention: `feature-name.test.js`
3. Import required modules
4. Write descriptive test suite
5. Add to this README

## Performance Benchmarking

For performance testing beyond unit tests:
```bash
# Run with performance monitoring
PERFORMANCE=true npm test

# Profile specific test
node --prof test/performance/streaming.test.js
```

## Test Data

Fixture files are shared across tests:
- `simple.html` - Basic HTML document
- `simple.md` - Basic Markdown document
- `test-config.yaml` - Custom theme configuration

Add new fixtures as needed for complex scenarios.
