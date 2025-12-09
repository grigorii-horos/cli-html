/**
 * Performance monitoring utilities
 * Helps track rendering performance and identify bottlenecks
 *
 * @module performance
 */

/**
 * Performance metrics storage
 */
const metrics = new Map();

/**
 * Check if performance monitoring is enabled
 * @returns {boolean} - True if enabled
 */
export const isPerformanceEnabled = () => {
  return process.env.PERFORMANCE === 'true' || process.env.DEBUG === 'verbose';
};

/**
 * Start performance timer for a specific operation
 * @param {string} label - Label for the operation
 * @returns {void}
 */
export const startTimer = (label) => {
  if (!isPerformanceEnabled()) return;

  const start = process.hrtime.bigint();
  metrics.set(label, { start, end: null, duration: null });
};

/**
 * End performance timer and calculate duration
 * @param {string} label - Label for the operation
 * @returns {number|null} - Duration in milliseconds or null
 */
export const endTimer = (label) => {
  if (!isPerformanceEnabled()) return null;

  const metric = metrics.get(label);
  if (!metric) {
    console.warn(`[Performance] No timer found for label: ${label}`);
    return null;
  }

  const end = process.hrtime.bigint();
  const durationNs = end - metric.start;
  const durationMs = Number(durationNs) / 1_000_000; // Convert nanoseconds to milliseconds

  metric.end = end;
  metric.duration = durationMs;
  metrics.set(label, metric);

  if (process.env.DEBUG === 'verbose') {
    console.log(`[Performance] ${label}: ${durationMs.toFixed(3)}ms`);
  }

  return durationMs;
};

/**
 * Get metrics for a specific label
 * @param {string} label - Label for the operation
 * @returns {object|null} - Metrics object or null
 */
export const getMetric = (label) => {
  return metrics.get(label) || null;
};

/**
 * Get all metrics
 * @returns {Map} - All metrics
 */
export const getAllMetrics = () => {
  return new Map(metrics);
};

/**
 * Clear all metrics
 * @returns {void}
 */
export const clearMetrics = () => {
  metrics.clear();
};

/**
 * Measure execution time of a function
 * @param {string} label - Label for the operation
 * @param {Function} fn - Function to measure
 * @returns {*} - Function result
 */
export const measure = (label, fn) => {
  if (!isPerformanceEnabled()) {
    return fn();
  }

  startTimer(label);
  try {
    const result = fn();
    endTimer(label);
    return result;
  } catch (error) {
    endTimer(label);
    throw error;
  }
};

/**
 * Measure async execution time of a function
 * @param {string} label - Label for the operation
 * @param {Function} fn - Async function to measure
 * @returns {Promise<*>} - Function result
 */
export const measureAsync = async (label, fn) => {
  if (!isPerformanceEnabled()) {
    return await fn();
  }

  startTimer(label);
  try {
    const result = await fn();
    endTimer(label);
    return result;
  } catch (error) {
    endTimer(label);
    throw error;
  }
};

/**
 * Get formatted performance report
 * @returns {string} - Formatted report
 */
export const getPerformanceReport = () => {
  if (!isPerformanceEnabled()) {
    return 'Performance monitoring is disabled. Set PERFORMANCE=true or DEBUG=verbose to enable.';
  }

  const entries = Array.from(metrics.entries());

  if (entries.length === 0) {
    return 'No performance metrics recorded.';
  }

  const lines = ['Performance Report:', ''];

  // Sort by duration (slowest first)
  entries.sort((a, b) => (b[1].duration || 0) - (a[1].duration || 0));

  const maxLabelLength = Math.max(...entries.map(([label]) => label.length));

  let totalDuration = 0;

  for (const [label, metric] of entries) {
    if (metric.duration === null) {
      lines.push(`  ${label.padEnd(maxLabelLength)} : [not finished]`);
    } else {
      totalDuration += metric.duration;
      const duration = metric.duration.toFixed(3);
      lines.push(`  ${label.padEnd(maxLabelLength)} : ${duration.padStart(10)}ms`);
    }
  }

  lines.push('');
  lines.push(`  ${'TOTAL'.padEnd(maxLabelLength)} : ${totalDuration.toFixed(3).padStart(10)}ms`);

  return lines.join('\n');
};

/**
 * Print performance report to console
 * @returns {void}
 */
export const printPerformanceReport = () => {
  console.log(getPerformanceReport());
};

/**
 * Track memory usage
 * @param {string} label - Label for the snapshot
 * @returns {object} - Memory usage snapshot
 */
export const trackMemory = (label) => {
  if (!isPerformanceEnabled()) return null;

  const usage = process.memoryUsage();
  const snapshot = {
    timestamp: Date.now(),
    heapUsed: usage.heapUsed,
    heapTotal: usage.heapTotal,
    external: usage.external,
    rss: usage.rss,
  };

  if (process.env.DEBUG === 'verbose') {
    const heapUsedMB = (usage.heapUsed / 1024 / 1024).toFixed(2);
    const heapTotalMB = (usage.heapTotal / 1024 / 1024).toFixed(2);
    console.log(`[Memory] ${label}: ${heapUsedMB}MB / ${heapTotalMB}MB (heap used/total)`);
  }

  return snapshot;
};

/**
 * Compare two memory snapshots
 * @param {object} before - Before snapshot
 * @param {object} after - After snapshot
 * @returns {object} - Difference
 */
export const compareMemory = (before, after) => {
  if (!before || !after) return null;

  return {
    heapUsed: after.heapUsed - before.heapUsed,
    heapTotal: after.heapTotal - before.heapTotal,
    external: after.external - before.external,
    rss: after.rss - before.rss,
    duration: after.timestamp - before.timestamp,
  };
};

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Bytes
 * @returns {string} - Formatted string
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  if (bytes < 0) return `-${formatBytes(-bytes)}`;

  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
};
