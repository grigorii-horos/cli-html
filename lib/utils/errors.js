/**
 * Enhanced error handling with context
 * Provides detailed, actionable error messages
 *
 * @module errors
 */

/**
 * Custom error class with context
 */
export class CliHtmlError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'CliHtmlError';
    this.context = context;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Get formatted error message with context
   * @returns {string} - Formatted error message
   */
  toString() {
    const lines = [
      `${this.name}: ${this.message}`,
      '',
    ];

    if (this.context.tag) {
      lines.push(`Tag: <${this.context.tag}>`);
    }

    if (this.context.attribute) {
      lines.push(`Attribute: ${this.context.attribute}`);
    }

    if (this.context.value !== undefined) {
      lines.push(`Value: ${JSON.stringify(this.context.value)}`);
    }

    if (this.context.expected) {
      lines.push(`Expected: ${this.context.expected}`);
    }

    if (this.context.file) {
      lines.push(`File: ${this.context.file}`);
    }

    if (this.context.line) {
      lines.push(`Line: ${this.context.line}`);
    }

    if (this.context.suggestion) {
      lines.push('', `Suggestion: ${this.context.suggestion}`);
    }

    if (this.stack && process.env.DEBUG === 'verbose') {
      lines.push('', 'Stack trace:', this.stack);
    }

    return lines.join('\n');
  }
}

/**
 * Parsing error
 */
export class ParseError extends CliHtmlError {
  constructor(message, context = {}) {
    super(message, context);
    this.name = 'ParseError';
  }
}

/**
 * Rendering error
 */
export class RenderError extends CliHtmlError {
  constructor(message, context = {}) {
    super(message, context);
    this.name = 'RenderError';
  }
}

/**
 * Theme configuration error
 */
export class ThemeError extends CliHtmlError {
  constructor(message, context = {}) {
    super(message, context);
    this.name = 'ThemeError';
  }
}

/**
 * Validation error
 */
export class ValidationError extends CliHtmlError {
  constructor(message, context = {}) {
    super(message, context);
    this.name = 'ValidationError';
  }
}

/**
 * Create error with context from tag
 * @param {Error} error - Original error
 * @param {object} tag - HTML tag object
 * @param {string} operation - Operation being performed
 * @returns {CliHtmlError} - Enhanced error
 */
export const createTagError = (error, tag, operation) => {
  const context = {
    tag: tag?.nodeName || 'unknown',
    operation,
  };

  // Extract attributes if available
  if (tag?.attrs && tag.attrs.length > 0) {
    context.attributes = tag.attrs.map(attr => `${attr.name}="${attr.value}"`).join(' ');
  }

  return new RenderError(
    `Error during ${operation}: ${error.message}`,
    context
  );
};

/**
 * Create validation error with suggestions
 * @param {string} field - Field name
 * @param {*} value - Invalid value
 * @param {string} expected - Expected format
 * @param {string} suggestion - Suggestion for fixing
 * @returns {ValidationError} - Validation error
 */
export const createValidationError = (field, value, expected, suggestion = null) => {
  return new ValidationError(
    `Invalid value for ${field}`,
    {
      attribute: field,
      value,
      expected,
      suggestion: suggestion || `Please provide a valid ${expected}`,
    }
  );
};

/**
 * Create theme error with suggestions
 * @param {string} property - Theme property
 * @param {*} value - Invalid value
 * @param {string} suggestion - Suggestion for fixing
 * @returns {ThemeError} - Theme error
 */
export const createThemeError = (property, value, suggestion = null) => {
  return new ThemeError(
    `Invalid theme property: ${property}`,
    {
      attribute: property,
      value,
      suggestion: suggestion || 'Check theme configuration documentation',
    }
  );
};

/**
 * Create parse error with line information
 * @param {string} message - Error message
 * @param {string} content - Content being parsed
 * @param {number} position - Character position of error
 * @returns {ParseError} - Parse error
 */
export const createParseError = (message, content, position) => {
  // Calculate line and column
  const lines = content.substring(0, position).split('\n');
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;

  // Get context (surrounding lines)
  const allLines = content.split('\n');
  const contextStart = Math.max(0, line - 3);
  const contextEnd = Math.min(allLines.length, line + 2);
  const contextLines = allLines.slice(contextStart, contextEnd);

  return new ParseError(message, {
    line,
    column,
    context: contextLines.join('\n'),
    suggestion: 'Check HTML syntax around the indicated line',
  });
};

/**
 * Wrap function with error handling
 * @param {Function} fn - Function to wrap
 * @param {string} operation - Operation name
 * @param {object} context - Additional context
 * @returns {Function} - Wrapped function
 */
export const wrapWithErrorHandling = (fn, operation, context = {}) => {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      if (error instanceof CliHtmlError) {
        throw error;
      }

      throw new RenderError(
        `Error during ${operation}: ${error.message}`,
        {
          ...context,
          operation,
          originalError: error.message,
        }
      );
    }
  };
};

/**
 * Safe wrapper for async functions
 * @param {Function} fn - Async function to wrap
 * @param {string} operation - Operation name
 * @param {object} context - Additional context
 * @returns {Function} - Wrapped async function
 */
export const wrapAsyncWithErrorHandling = (fn, operation, context = {}) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof CliHtmlError) {
        throw error;
      }

      throw new RenderError(
        `Error during ${operation}: ${error.message}`,
        {
          ...context,
          operation,
          originalError: error.message,
        }
      );
    }
  };
};

/**
 * Error recovery strategies
 */
export const ErrorRecovery = {
  /**
   * Skip invalid content and continue
   */
  SKIP: 'skip',

  /**
   * Use fallback/default value
   */
  FALLBACK: 'fallback',

  /**
   * Throw error and stop
   */
  THROW: 'throw',

  /**
   * Log warning and continue
   */
  WARN: 'warn',
};

/**
 * Handle error with recovery strategy
 * @param {Error} error - Error to handle
 * @param {string} strategy - Recovery strategy
 * @param {*} fallback - Fallback value (for FALLBACK strategy)
 * @param {string} context - Context for logging
 * @returns {*} - Result based on strategy
 */
export const handleError = (error, strategy, fallback = null, context = 'unknown') => {
  switch (strategy) {
    case ErrorRecovery.SKIP:
      if (process.env.DEBUG) {
        console.warn(`[${context}] Skipping due to error:`, error.message);
      }
      return null;

    case ErrorRecovery.FALLBACK:
      if (process.env.DEBUG) {
        console.warn(`[${context}] Using fallback due to error:`, error.message);
      }
      return fallback;

    case ErrorRecovery.WARN:
      console.warn(`[${context}] Warning:`, error.message);
      return fallback;

    case ErrorRecovery.THROW:
    default:
      throw error;
  }
};

/**
 * Collect and aggregate multiple errors
 */
export class ErrorCollector {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Add error
   * @param {Error} error - Error to add
   * @param {object} context - Context
   */
  addError(error, context = {}) {
    this.errors.push({
      error,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Add warning
   * @param {string} message - Warning message
   * @param {object} context - Context
   */
  addWarning(message, context = {}) {
    this.warnings.push({
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Check if there are errors
   * @returns {boolean} - True if errors exist
   */
  hasErrors() {
    return this.errors.length > 0;
  }

  /**
   * Check if there are warnings
   * @returns {boolean} - True if warnings exist
   */
  hasWarnings() {
    return this.warnings.length > 0;
  }

  /**
   * Get summary
   * @returns {object} - Summary object
   */
  getSummary() {
    return {
      errorCount: this.errors.length,
      warningCount: this.warnings.length,
      hasIssues: this.hasErrors() || this.hasWarnings(),
    };
  }

  /**
   * Get formatted report
   * @returns {string} - Formatted report
   */
  getReport() {
    const lines = [];

    if (this.errors.length > 0) {
      lines.push('ERRORS:');
      for (const { error, context } of this.errors) {
        lines.push(`  - ${error.message}`);
        if (context.tag) {
          lines.push(`    Tag: ${context.tag}`);
        }
      }
      lines.push('');
    }

    if (this.warnings.length > 0) {
      lines.push('WARNINGS:');
      for (const { message, context } of this.warnings) {
        lines.push(`  - ${message}`);
        if (context.tag) {
          lines.push(`    Tag: ${context.tag}`);
        }
      }
      lines.push('');
    }

    if (lines.length === 0) {
      return 'No errors or warnings.';
    }

    const summary = this.getSummary();
    lines.unshift(`Found ${summary.errorCount} error(s) and ${summary.warningCount} warning(s):`);
    lines.unshift('');

    return lines.join('\n');
  }

  /**
   * Clear all errors and warnings
   */
  clear() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Throw if there are errors
   * @param {string} message - Error message
   */
  throwIfErrors(message = 'Rendering failed with errors') {
    if (this.hasErrors()) {
      const report = this.getReport();
      throw new RenderError(`${message}\n\n${report}`);
    }
  }
}
