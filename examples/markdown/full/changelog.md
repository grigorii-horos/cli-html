# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> [!NOTE]
> This changelog follows the Keep a Changelog format and includes all significant changes.

## [Unreleased]

### Added

- New feature for batch operations
- Support for custom event handlers
- Experimental WebSocket support

### Changed

- Improved performance of data processing by 40%
- Updated dependencies to latest versions

### Fixed

- Memory leak in event listener cleanup
- Race condition in async operations

---

## [2.1.0] - 2025-12-01

### Added

- **Plugin System** - New plugin architecture for extensibility
- **TypeScript Support** - Full TypeScript definitions and strict mode
- **Performance Monitoring** - Built-in performance tracking
- **CLI Tool** - Command-line interface for common tasks

### Changed

- **Breaking:** Renamed `initialize()` to `init()` for consistency
- Updated minimum Node.js version to 18.0.0
- Improved error messages with more context
- Refactored internal event system

### Deprecated

- `oldMethod()` will be removed in v3.0.0
- Legacy config format (use new format instead)

### Fixed

- [#123](https://github.com/user/repo/issues/123) - Fixed crash on invalid input
- [#124](https://github.com/user/repo/issues/124) - Memory leak in long-running processes
- [#125](https://github.com/user/repo/issues/125) - Incorrect type definitions

### Security

- Updated vulnerable dependencies
- Added input validation to prevent injection attacks

## [2.0.0] - 2025-10-15

> [!WARNING]
> This is a major release with breaking changes. Please review the migration guide.

### Added

- Complete rewrite with modern architecture
- Support for async/await patterns
- New configuration system
- Comprehensive test suite with 95% coverage
- Detailed documentation with examples

### Changed

- **Breaking:** New API interface (see migration guide)
- **Breaking:** Removed deprecated methods from v1.x
- **Breaking:** Changed default behavior of `process()` method
- Updated all dependencies to latest stable versions

### Removed

- Deprecated methods from v1.x
- Legacy configuration format
- Support for Node.js < 18

### Migration Guide

**Old API (v1.x):**

```javascript
const app = require('old-package');
app.initialize({ config: 'value' });
app.process(data);
```

**New API (v2.0):**

```javascript
import { createApp } from 'new-package';

const app = createApp({
  config: 'value'
});

await app.process(data);
```

---

## [1.5.2] - 2025-09-01

### Fixed

- [#115](https://github.com/user/repo/issues/115) - Fixed compatibility with latest React version
- [#116](https://github.com/user/repo/issues/116) - Corrected documentation typos
- Edge case in date parsing

### Security

- Patched security vulnerability in dependency

## [1.5.1] - 2025-08-15

### Fixed

- Hot fix for critical bug in production builds
- Restored accidentally removed backward compatibility

## [1.5.0] - 2025-08-01

### Added

- Support for custom validators
- New `onError` callback option
- Ability to chain multiple operations
- Enhanced debugging tools

### Changed

- Improved performance of large dataset processing
- Better error messages with stack traces
- Updated documentation with more examples

### Fixed

- [#100](https://github.com/user/repo/issues/100) - Fixed timezone handling
- [#101](https://github.com/user/repo/issues/101) - Corrected async race condition
- Various minor bug fixes

## [1.4.0] - 2025-06-15

### Added

- **Batch Processing** - Process multiple items efficiently
- **Retry Logic** - Automatic retry for failed operations
- **Caching Layer** - Optional caching for improved performance

### Changed

- Optimized memory usage
- Streamlined initialization process

### Deprecated

- `oldConfigFormat` - use new format instead

## [1.3.0] - 2025-05-01

### Added

- Support for custom formatters
- New utility functions
- Integration with popular frameworks

### Fixed

- [#80](https://github.com/user/repo/issues/80) - Fixed Windows compatibility
- [#81](https://github.com/user/repo/issues/81) - Resolved path resolution issues

## [1.2.0] - 2025-03-15

### Added

- Promise-based API
- Stream support for large files
- Internationalization (i18n) support

### Changed

- Improved documentation
- Better TypeScript types

## [1.1.0] - 2025-02-01

### Added

- New configuration options
- Support for plugins
- Examples and tutorials

### Fixed

- [#50](https://github.com/user/repo/issues/50) - Fixed callback timing
- [#51](https://github.com/user/repo/issues/51) - Corrected default values

## [1.0.0] - 2025-01-01

### Added

- Initial stable release
- Core functionality
- Basic documentation
- Test suite

### Features

- Data processing
- Event handling
- Configuration management
- Error handling

---

## Version History Summary

| Version | Date | Type | Highlights |
|---------|------|------|------------|
| 2.1.0 | 2025-12-01 | Feature | Plugin system, TypeScript |
| 2.0.0 | 2025-10-15 | Major | Complete rewrite |
| 1.5.2 | 2025-09-01 | Patch | Bug fixes |
| 1.5.0 | 2025-08-01 | Feature | Custom validators |
| 1.0.0 | 2025-01-01 | Major | Initial release |

## Change Types

### Added
New features or functionality

### Changed
Changes to existing functionality

### Deprecated
Features marked for removal in future versions

### Removed
Features removed in this version

### Fixed
Bug fixes

### Security
Security-related changes

---

## Support

> [!IMPORTANT]
> Only the latest major version receives active support and security updates.

### Version Support Policy

| Version | Status | Support Until |
|---------|--------|---------------|
| 2.x | Active | Ongoing |
| 1.x | Maintenance | 2026-01-01 |
| 0.x | End of Life | 2025-01-01 |

## Contributing

To add an entry to the changelog:

1. Create a new section under `[Unreleased]`
2. Use one of the standard categories (Added, Changed, etc.)
3. Write a clear, concise description
4. Link to relevant issues or PRs
5. Update on release

## Links

- [GitHub Releases](https://github.com/user/repo/releases)
- [Migration Guides](https://docs.example.com/migration)
- [Breaking Changes](https://docs.example.com/breaking-changes)

---

[unreleased]: https://github.com/user/repo/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/user/repo/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/user/repo/compare/v1.5.2...v2.0.0
[1.5.2]: https://github.com/user/repo/compare/v1.5.1...v1.5.2
[1.5.1]: https://github.com/user/repo/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/user/repo/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/user/repo/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/user/repo/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/user/repo/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/user/repo/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
