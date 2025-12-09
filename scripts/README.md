# 📸 Screenshot Generation Scripts

This directory contains scripts for generating PNG screenshots of HTML examples using termshot.

## ✅ Script is Working!

The script successfully generates PNG screenshots using termshot's `--raw-read` feature.

**Method:** Generate HTML output → Save to temp file → Create PNG with termshot

## 📋 Available Scripts

### `generate-screenshots.js` (Node.js)

Node.js script with parallel processing for fast HTML screenshot generation.

### `generate-markdown-screenshots.js` (Node.js)

Node.js script with parallel processing for fast Markdown screenshot generation.

**Prerequisites:**
- [termshot](https://github.com/homeport/termshot) - `cargo install termshot`
- Node.js 18+

**Usage (HTML):**
```bash
# Generate all HTML screenshots
node scripts/generate-screenshots.js

# Or with executable permissions
./scripts/generate-screenshots.js

# Force regenerate all
node scripts/generate-screenshots.js --force

# Filter by pattern
node scripts/generate-screenshots.js --filter "code"

# Use 8 parallel processes
node scripts/generate-screenshots.js --parallel 8

# Custom output directory
node scripts/generate-screenshots.js --output ./my-screenshots

# Verbose output (see what's happening)
node scripts/generate-screenshots.js --verbose

# Show help
node scripts/generate-screenshots.js --help
```

**Usage (Markdown):**
```bash
# Generate all Markdown screenshots
node scripts/generate-markdown-screenshots.js

# Force regenerate all
node scripts/generate-markdown-screenshots.js --force

# Filter by pattern
node scripts/generate-markdown-screenshots.js --filter "code"

# Use 8 parallel processes
node scripts/generate-markdown-screenshots.js --parallel 8

# Verbose output
node scripts/generate-markdown-screenshots.js --verbose

# Show help
node scripts/generate-markdown-screenshots.js --help
```

**Options:**
- `--force` - Regenerate all screenshots
- `--filter <pattern>` - Only process files matching pattern
- `--parallel <n>` - Number of parallel processes (default: 4)
- `--output <dir>` - Output directory for screenshots
- `--verbose` - Enable verbose logging (recommended for debugging)
- `--help` - Show help message

---

## 🎨 How It Works

The scripts use a **two-step process** to work around termshot's TTY requirement:

1. **Step 1:** Generate HTML output and save to temporary file
   ```bash
   node bin/html.js example.html > /tmp/temp-output.txt
   ```

2. **Step 2:** Create PNG screenshot using termshot's `--raw-read` feature
   ```bash
   termshot --raw-read /tmp/temp-output.txt -f output.png -C 100
   ```

This method works **everywhere** - no TTY needed!

## 🎨 Termshot Configuration

Current configuration:
- **Columns:** 100 (terminal width)
- **Show command:** No
- **Decorations:** Yes (window frame)
- **Shadow:** Yes

You can customize by editing the script files.

---

## 📁 Output Location

By default, screenshots are saved to:
```
examples/html/tags-custom/screenshots/
```

Each screenshot is named after the HTML file:
```
code.html → code.png
lists.html → lists.png
table.html → table.png
```

---

## 🔧 Customization

### Change Terminal Font

Edit the script and modify:
```javascript
font: 'Your Font Name'
```

Popular choices:
- `JetBrains Mono` (default)
- `Fira Code`
- `Cascadia Code`
- `Source Code Pro`
- `IBM Plex Mono`

### Change Terminal Width

Edit:
```javascript
columns: 100  // Change to desired width
```

### Change Image Padding

Edit:
```javascript
padding: 20  // Padding in pixels
```

---

## 📊 Performance

### Node.js Script
- **Processing:** Parallel (4 by default, configurable)
- **Speed:** ~0.5-1 second per screenshot (with parallel=4)
- **Memory:** Medium
- **Best for:** Fast generation of multiple files

**Performance examples:**

| Files | Time (parallel=4) | Files/second |
|-------|------------------|--------------|
| 10    | ~8s              | 1.25         |
| 28    | ~20s             | 1.4          |
| 50    | ~30s             | 1.67         |

**Tips for faster generation:**
- Use `--parallel 8` on powerful machines
- Filter specific files with `--filter` when testing
- Use `--verbose` to monitor progress

---

## 🐛 Troubleshooting

### "termshot: command not found"

**Solution:**
Install termshot:
```bash
cargo install termshot
```

If you don't have Rust/Cargo:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install termshot
```

---

### Screenshots are blank

**Possible causes:**
1. HTML rendering error
2. Terminal too small
3. Font rendering issue

**Solution:**
Run with verbose mode to see errors:
```bash
node scripts/generate-screenshots.js --verbose
```

Test the HTML file directly:
```bash
node bin/html.js examples/html/tags-custom/code.html
```

---

### Permission denied

**Solution:**
Make the script executable:
```bash
chmod +x scripts/generate-screenshots.js
```

---

## 📝 Examples

### Generate only code-related examples
```bash
node scripts/generate-screenshots.js --filter "code"
```

### Force regenerate with 8 parallel processes
```bash
node scripts/generate-screenshots.js --force --parallel 8
```

### Generate to custom directory with verbose output
```bash
node scripts/generate-screenshots.js \
  --output ./docs/images \
  --verbose
```

---

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Generate Screenshots

on:
  push:
    paths:
      - 'examples/html/tags-custom/*.html'
      - 'lib/**/*.js'

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable

      - name: Install termshot
        run: cargo install termshot

      - name: Install dependencies
        run: npm install

      - name: Generate screenshots
        run: node scripts/generate-screenshots.js --force

      - name: Commit screenshots
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add examples/html/tags-custom/screenshots/*.png
          git commit -m "Update screenshots" || exit 0
          git push
```

---

## 🎯 Tips

1. **Use `--verbose` when debugging** - Shows full termshot output
2. **Start with small batches** - Use `--filter` to test changes
3. **Increase `--parallel` on powerful machines** - Can go up to 8-16
4. **Use `--force` sparingly** - Only when theme/code changes
5. **Keep screenshots in git** - They're useful for documentation

---

## 📚 Related Documentation

- [termshot GitHub](https://github.com/homeport/termshot)
- [Main README](../README.md)
- [Examples Documentation](../examples/html/tags-custom/README.md)
- [Issues and Improvements](../ISSUES_AND_IMPROVEMENTS.md)

---

**Last Updated:** 2025-12-09
