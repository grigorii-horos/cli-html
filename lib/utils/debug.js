/**
 * Debugging utilities
 * Helps diagnose rendering issues and understand tag processing
 *
 * @module debug
 */

import { visualLength } from './string.js';

/**
 * Debug configuration
 */
const config = {
  enabled: process.env.DEBUG === 'true' || process.env.DEBUG === 'verbose',
  verbose: process.env.DEBUG === 'verbose',
};

/**
 * Check if debugging is enabled
 * @returns {boolean} - True if enabled
 */
export const isDebugEnabled = () => config.enabled;

/**
 * Set debug configuration
 * @param {object} options - Configuration options
 */
export const setDebugConfig = (options) => {
  Object.assign(config, options);
};

/**
 * Get debug configuration
 * @returns {object} - Current configuration
 */
export const getDebugConfig = () => ({ ...config });

/**
 * Debug tag processing
 */
const tagStack = [];
let tagCounter = 0;

/**
 * Start tracking tag processing
 * @param {object} tag - HTML tag
 * @param {object} context - Rendering context
 * @returns {number} - Tag ID
 */
export const debugTagStart = (tag, context = {}) => {
  if (!config.enabled || !config.verbose) return null;

  const tagId = ++tagCounter;
  const entry = {
    id: tagId,
    name: tag?.nodeName || 'unknown',
    depth: tagStack.length,
    startTime: process.hrtime.bigint(),
  };

  tagStack.push(entry);

  return tagId;
};

/**
 * End tracking tag processing
 * @param {number} tagId - Tag ID from debugTagStart
 * @param {*} result - Rendering result
 * @returns {object} - Debug info
 */
export const debugTagEnd = (tagId, result = null) => {
  if (!config.enabled || !config.verbose || tagId === null) return null;

  const entry = tagStack.pop();
  if (!entry || entry.id !== tagId) {
    return null;
  }

  const endTime = process.hrtime.bigint();
  const durationNs = endTime - entry.startTime;
  const durationMs = Number(durationNs) / 1_000_000;

  const debugInfo = {
    ...entry,
    endTime,
    durationMs,
    resultType: result?.type,
    hasValue: result?.value !== null && result?.value !== undefined,
  };

  return debugInfo;
};

/**
 * Get current tag stack
 * @returns {array} - Current tag stack
 */
export const getTagStack = () => {
  return tagStack.map(entry => ({
    name: entry.name,
    depth: entry.depth,
    id: entry.id,
  }));
};

/**
 * Debug theme resolution
 * @param {string} element - Element name
 * @param {object} themeValue - Resolved theme value
 * @param {object} customValue - Custom value
 */
export const debugTheme = (element, themeValue, customValue = null) => {
  if (!config.enabled || !config.verbose) return;

  console.log(`[THEME] ${element}:`);
  if (customValue !== null && customValue !== undefined) {
    console.log(`  Custom: ${JSON.stringify(customValue)}`);
  }
  if (themeValue) {
    console.log(`  Theme: ${JSON.stringify(themeValue)}`);
  }
};

/**
 * Debug attribute resolution
 * @param {string} tagName - Tag name
 * @param {string} attrName - Attribute name
 * @param {*} value - Resolved value
 * @param {*} defaultValue - Default value
 */
export const debugAttribute = (tagName, attrName, value, defaultValue = null) => {
  if (!config.enabled || !config.verbose) return;

  const used = value !== defaultValue ? value : `default: ${defaultValue}`;
  console.log(`[ATTR] <${tagName}> ${attrName} = ${used}`);
};

/**
 * Visualize document structure
 * @param {object} tag - HTML tag
 * @param {number} maxDepth - Maximum depth to show
 * @param {number} currentDepth - Current depth (internal)
 * @returns {string} - Tree visualization
 */
export const visualizeStructure = (tag, maxDepth = 5, currentDepth = 0) => {
  if (!tag || currentDepth >= maxDepth) return '';

  const indent = '  '.repeat(currentDepth);
  const lines = [];

  // Current tag
  const attrs = tag.attrs?.map(a => `${a.name}="${a.value}"`).join(' ') || '';
  const tagLine = attrs
    ? `<${tag.nodeName} ${attrs}>`
    : `<${tag.nodeName}>`;

  lines.push(`${indent}${tagLine}`);

  // Children
  if (tag.childNodes && tag.childNodes.length > 0) {
    for (const child of tag.childNodes) {
      if (child.nodeName === '#text') {
        const text = child.value?.trim();
        if (text) {
          const preview = text.length > 50 ? text.slice(0, 50) + '...' : text;
          lines.push(`${indent}  "${preview}"`);
        }
      } else {
        lines.push(visualizeStructure(child, maxDepth, currentDepth + 1));
      }
    }
  }

  return lines.join('\n');
};

/**
 * Analyze document complexity
 * @param {object} tag - HTML tag
 * @returns {object} - Complexity metrics
 */
export const analyzeComplexity = (tag) => {
  const metrics = {
    totalTags: 0,
    maxDepth: 0,
    tagCounts: {},
    textNodes: 0,
    totalTextLength: 0,
  };

  const analyze = (node, depth = 0) => {
    if (!node) return;

    if (node.nodeName === '#text') {
      metrics.textNodes++;
      metrics.totalTextLength += node.value?.length || 0;
      return;
    }

    metrics.totalTags++;
    metrics.maxDepth = Math.max(metrics.maxDepth, depth);

    const name = node.nodeName || 'unknown';
    metrics.tagCounts[name] = (metrics.tagCounts[name] || 0) + 1;

    if (node.childNodes) {
      for (const child of node.childNodes) {
        analyze(child, depth + 1);
      }
    }
  };

  analyze(tag);

  return metrics;
};

/**
 * Format complexity report
 * @param {object} metrics - Complexity metrics
 * @returns {string} - Formatted report
 */
export const formatComplexityReport = (metrics) => {
  const lines = [
    'Document Complexity Analysis:',
    '',
    `Total tags: ${metrics.totalTags}`,
    `Max depth: ${metrics.maxDepth}`,
    `Text nodes: ${metrics.textNodes}`,
    `Total text length: ${metrics.totalTextLength} chars`,
    '',
    'Tag distribution:',
  ];

  const sortedTags = Object.entries(metrics.tagCounts)
    .sort((a, b) => b[1] - a[1]);

  for (const [tag, count] of sortedTags) {
    lines.push(`  ${tag.padEnd(20)} : ${count}`);
  }

  return lines.join('\n');
};

/**
 * Debug output formatting
 * @param {*} result - Rendering result
 * @returns {object} - Output analysis
 */
export const analyzeOutput = (result) => {
  if (!result || !result.value) {
    return {
      empty: true,
      hasValue: false,
    };
  }

  const value = result.value;
  const lines = value.split('\n');

  return {
    empty: false,
    hasValue: true,
    type: result.type,
    length: value.length,
    visualLength: visualLength(value),
    lines: lines.length,
    marginTop: result.marginTop || 0,
    marginBottom: result.marginBottom || 0,
    longestLine: Math.max(...lines.map(l => visualLength(l))),
    hasAnsi: value.includes('\x1b'),
    firstLine: lines[0]?.substring(0, 100),
  };
};

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Bytes
 * @returns {string} - Formatted string
 */
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const sign = bytes < 0 ? '-' : '';
  const absBytes = Math.abs(bytes);

  if (absBytes < 1024) return `${sign}${absBytes} B`;
  if (absBytes < 1024 * 1024) return `${sign}${(absBytes / 1024).toFixed(1)} KB`;
  return `${sign}${(absBytes / 1024 / 1024).toFixed(2)} MB`;
};

/**
 * Create debug session
 * Tracks all operations in a rendering session
 */
export class DebugSession {
  constructor(name = 'session') {
    this.name = name;
    this.startTime = Date.now();
    this.operations = [];
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Log operation
   * @param {string} operation - Operation name
   * @param {object} details - Operation details
   */
  logOperation(operation, details = {}) {
    this.operations.push({
      operation,
      details,
      timestamp: Date.now() - this.startTime,
    });
  }

  /**
   * Log error
   * @param {Error} error - Error
   * @param {object} context - Context
   */
  logError(error, context = {}) {
    this.errors.push({
      error: error.message,
      context,
      timestamp: Date.now() - this.startTime,
    });
  }

  /**
   * Log warning
   * @param {string} message - Warning message
   * @param {object} context - Context
   */
  logWarning(message, context = {}) {
    this.warnings.push({
      message,
      context,
      timestamp: Date.now() - this.startTime,
    });
  }

  /**
   * Get summary
   * @returns {object} - Summary
   */
  getSummary() {
    const duration = Date.now() - this.startTime;

    return {
      name: this.name,
      duration,
      operationCount: this.operations.length,
      errorCount: this.errors.length,
      warningCount: this.warnings.length,
      hasIssues: this.errors.length > 0 || this.warnings.length > 0,
    };
  }

  /**
   * Get formatted report
   * @returns {string} - Formatted report
   */
  getReport() {
    const summary = this.getSummary();
    const lines = [
      `Debug Session: ${this.name}`,
      `Duration: ${summary.duration}ms`,
      `Operations: ${summary.operationCount}`,
      '',
    ];

    if (this.errors.length > 0) {
      lines.push('Errors:');
      for (const { error, timestamp } of this.errors) {
        lines.push(`  [${timestamp}ms] ${error}`);
      }
      lines.push('');
    }

    if (this.warnings.length > 0) {
      lines.push('Warnings:');
      for (const { message, timestamp } of this.warnings) {
        lines.push(`  [${timestamp}ms] ${message}`);
      }
      lines.push('');
    }

    if (config.verbose && this.operations.length > 0) {
      lines.push('Operations:');
      for (const { operation, timestamp } of this.operations) {
        lines.push(`  [${timestamp}ms] ${operation}`);
      }
    }

    return lines.join('\n');
  }

  /**
   * Print report to console
   */
  printReport() {
    console.log(this.getReport());
  }
}

/**
 * Export configuration
 */
export const DebugConfig = config;
