# Contributing to cli-html

Thank you for your interest in contributing! This guide covers everything you need to know
to submit a bug report, propose a feature, or send a pull request.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [How to Contribute](#how-to-contribute)
4. [Pull Request Process](#pull-request-process)
5. [Style Guide](#style-guide)

---

## Code of Conduct

This project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/).
By participating, you agree to uphold a welcoming, respectful environment.

> [!IMPORTANT]
> Harassment of any kind will result in immediate removal from the project.

---

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- git

### Setup

```bash
git clone https://github.com/example/cli-html.git
cd cli-html
npm install
npm test
```

All 195 tests should pass. If they don't, open an issue before proceeding.

### Project Structure

```
cli-html/
├── bin/           # CLI entry points (html.js, markdown.js, md.js)
├── lib/
│   ├── core/      # Color, attr, merge utilities
│   ├── tag-helpers/   # blockTag, inlineTag primitives
│   ├── tags/      # One file per tag group
│   └── utils/     # render-tag, get-theme, etc.
├── config.yaml    # Default theme configuration (single source of truth)
├── examples/      # Example files and screenshots
└── test/          # Node built-in test runner
```

---

## How to Contribute

### Reporting Bugs

Before opening an issue:
- [ ] Search existing issues for duplicates
- [ ] Check you're on the latest version (`npm list cli-html`)
- [ ] Test with `DEBUG=1 node bin/html.js your-file.html` for debug output

**Include in your report:**
- cli-html version
- Node.js version
- Operating system
- Minimal reproduction HTML/markdown
- Expected vs. actual output (use `FORCE_COLOR=1` for colored output)

### Proposing Features

Open an issue with the `enhancement` label. Describe:
1. The use case (what problem does this solve?)
2. Proposed configuration keys (following existing `config.yaml` structure)
3. Proposed `data-cli-*` attributes (following naming conventions in `DATA_ATTRIBUTES.md`)

> [!TIP]
> Features that improve existing standard HTML elements are more likely to be accepted
> than features that add non-standard behavior. See the project philosophy in `CLAUDE.md`.

---

## Pull Request Process

1. Fork the repository and create a branch: `git checkout -b feat/your-feature`
2. Write failing tests first (TDD)
3. Implement the feature
4. Update `config.yaml` with new defaults
5. Update `index.d.ts` with TypeScript types
6. Update `DATA_ATTRIBUTES.md` if adding `data-cli-*` attributes
7. Add an example to `examples/html/tags/` or `examples/markdown/features/`
8. Run `npm test` — all tests must pass
9. Run `npm run fix` — no lint errors
10. Open a PR against `master`

### PR Checklist

- [ ] Tests written and passing (`npm test`)
- [ ] `config.yaml` updated with defaults
- [ ] TypeScript types updated (`index.d.ts`)
- [ ] `DATA_ATTRIBUTES.md` updated (if adding `data-cli-*` attributes)
- [ ] Example file added or updated
- [ ] No hardcoded fallback values that duplicate `config.yaml`

---

## Style Guide

### JavaScript

- **ESM only** — `import`/`export`, no `require()`
- **No comments** unless the WHY is non-obvious
- **`??` not `||`** for theme reads (preserves intentional empty strings)
- **`getAttr(tag, 'dot.path')`** for `data-cli-*` attributes
- **`getAttribute(tag, 'attr', default)`** for standard HTML attributes

### config.yaml

Follow the standard configuration structures documented in `CLAUDE.md`:
- `prefix/suffix` for markers that wrap content
- `indicator` for single leading markers
- `border/padding` for container elements
- `enabled` flag for optional features

### Commit Messages

```
feat: add named styles to <hr>
fix: ruby color uses own theme instead of span
docs: add dialog box border examples
test: add rt annotation customization tests
```

---

## Questions?

Open a [GitHub Discussion](https://github.com/example/cli-html/discussions) for questions
not suitable for issues. The maintainer responds within a few days.

<kbd>Ctrl+C</kbd> to cancel any running command. <kbd>Ctrl+Z</kbd> to suspend.
