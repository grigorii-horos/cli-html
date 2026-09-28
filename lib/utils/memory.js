/**
 * Memory management utilities for large documents
 * Helps optimize memory usage and prevent memory leaks
 * @module memory
 */

/**
 * Configuration for memory management
 */
const config = {
  maxCacheSize: 1000,
  autoClearThreshold: 10_000, // Auto-clear caches after this many operations
  enableAutoGC: process.env.ENABLE_AUTO_GC === 'true',
};

/**
 * Operation counter for auto-clear
 */
let operationCount = 0;

/**
 * Increment operation counter and trigger auto-clear if needed
 * @returns {boolean} - True if auto-clear was triggered
 */
export const incrementOperationCount = () => {
  operationCount++;

  if (operationCount >= config.autoClearThreshold) {
    clearAllCaches();
    operationCount = 0;

    if (config.enableAutoGC && globalThis.gc) {
      globalThis.gc();
    }

    return true;
  }

  return false;
};

/**
 * References to cache objects that need to be cleared
 */
const cacheReferences = new Set();

/**
 * Register a cache for auto-clearing
 * @param {Map|WeakMap|Set|WeakSet} cache - Cache to register
 * @param {string} name - Cache name for debugging
 */
export const registerCache = (cache, name = 'unknown') => {
  cacheReferences.add({ cache, name });
};

/**
 * Clear all registered caches
 * @returns {number} - Number of caches cleared
 */
const clearAllCaches = () => {
  let count = 0;

  for (const { cache } of cacheReferences) {
    try {
      if (cache && typeof cache.clear === 'function') {
        cache.clear();
        count++;
      }
    } catch {
      // Silently skip caches that can't be cleared
    }
  }

  return count;
};

