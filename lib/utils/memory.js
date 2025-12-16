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
 * Set memory management configuration
 * @param {object} options - Configuration options
 * @param {number} options.maxCacheSize - Maximum cache size
 * @param {number} options.autoClearThreshold - Auto-clear threshold
 * @param {boolean} options.enableAutoGC - Enable automatic garbage collection
 */
export const setMemoryConfig = (options) => {
  if (options.maxCacheSize !== undefined) {
    config.maxCacheSize = options.maxCacheSize;
  }
  if (options.autoClearThreshold !== undefined) {
    config.autoClearThreshold = options.autoClearThreshold;
  }
  if (options.enableAutoGC !== undefined) {
    config.enableAutoGC = options.enableAutoGC;
  }
};

/**
 * Get current memory configuration
 * @returns {object} - Current configuration
 */
export const getMemoryConfig = () => {
  return { ...config };
};

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
 * Reset operation counter
 */
export const resetOperationCount = () => {
  operationCount = 0;
};

/**
 * Get current operation count
 * @returns {number} - Current count
 */
export const getOperationCount = () => {
  return operationCount;
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
export const clearAllCaches = () => {
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

/**
 * Clear specific cache by name
 * @param {string} name - Cache name
 * @returns {boolean} - True if cache was cleared
 */
export const clearCache = (name) => {
  for (const { cache, name: cacheName } of cacheReferences) {
    if (cacheName === name && cache && typeof cache.clear === 'function') {
        cache.clear();
        return true;
      }
  }

  return false;
};

/**
 * Get cache statistics
 * @returns {object} - Statistics object
 */
export const getCacheStats = () => {
  const stats = {
    totalCaches: cacheReferences.size,
    caches: [],
  };

  for (const { cache, name } of cacheReferences) {
    let size = 0;

    try {
      if (cache instanceof Map || cache instanceof Set) {
        size = cache.size;
      }
    } catch {
      size = -1; // Unknown size
    }

    stats.caches.push({ name, size });
  }

  return stats;
};

/**
 * Create a size-limited cache with LRU eviction
 * @param {number} maxSize - Maximum cache size
 * @param {string} name - Cache name for debugging
 * @returns {object} - Cache object with get/set/clear methods
 */
export const createLimitedCache = (maxSize = config.maxCacheSize, name = 'unknown') => {
  const cache = new Map();

  // Register for auto-clearing
  registerCache(cache, name);

  return {
    get(key) {
      const value = cache.get(key);

      // Move to end (most recently used)
      if (value !== undefined) {
        cache.delete(key);
        cache.set(key, value);
      }

      return value;
    },

    set(key, value) {
      // Delete if exists to move to end
      if (cache.has(key)) {
        cache.delete(key);
      }

      cache.set(key, value);

      // Evict oldest entry if size exceeded
      if (cache.size > maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
    },

    has(key) {
      return cache.has(key);
    },

    delete(key) {
      return cache.delete(key);
    },

    clear() {
      cache.clear();
    },

    get size() {
      return cache.size;
    },

    entries() {
      return cache.entries();
    },

    keys() {
      return cache.keys();
    },

    values() {
      return cache.values();
    },
  };
};

/**
 * Force garbage collection if available
 * Note: Requires --expose-gc flag when running node
 * @returns {boolean} - True if GC was triggered
 */
export const forceGC = () => {
  if (globalThis.gc) {
    globalThis.gc();
    return true;
  }

  return false;
};

/**
 * Get memory usage information
 * @returns {object} - Memory usage object
 */
export const getMemoryUsage = () => {
  const usage = process.memoryUsage();

  return {
    heapUsed: usage.heapUsed,
    heapTotal: usage.heapTotal,
    external: usage.external,
    rss: usage.rss,
    heapUsedMB: (usage.heapUsed / 1024 / 1024).toFixed(2),
    heapTotalMB: (usage.heapTotal / 1024 / 1024).toFixed(2),
    externalMB: (usage.external / 1024 / 1024).toFixed(2),
    rssMB: (usage.rss / 1024 / 1024).toFixed(2),
  };
};

/**
 * Check if memory usage is high
 * @param {number} thresholdMB - Threshold in megabytes (default: 500)
 * @returns {boolean} - True if memory usage is high
 */
export const isMemoryHigh = (thresholdMB = 500) => {
  const usage = getMemoryUsage();
  const heapUsedMB = Number.parseFloat(usage.heapUsedMB);

  return heapUsedMB > thresholdMB;
};

/**
 * Optimize memory if usage is high
 * Clears caches and forces GC if enabled
 * @param {number} thresholdMB - Threshold in megabytes
 * @returns {boolean} - True if optimization was performed
 */
export const optimizeMemory = (thresholdMB = 500) => {
  if (isMemoryHigh(thresholdMB)) {
    clearAllCaches();

    if (config.enableAutoGC) {
      forceGC();
    }

    return true;
  }

  return false;
};
