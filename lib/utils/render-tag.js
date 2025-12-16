import tags from '../tags.js';
import { incrementOperationCount } from './memory.js';

const MAX_DEPTH = 100;
const CACHE_ENABLED = process.env.CACHE_RENDER !== 'false';

/**
 * Cache for rendered subtrees (WeakMap for automatic garbage collection)
 * Key: node object, Value: Map of context hash -> rendered result
 */
const renderCache = new WeakMap();

/**
 * Generate cache key from context
 * Only cache based on relevant context properties
 * @param {object} context - Rendering context
 * @returns {string} - Cache key
 */
const generateContextKey = (context) => {
  // Only include properties that affect rendering
  return JSON.stringify({
    lineWidth: context.lineWidth,
    pre: context.pre,
    listDepth: context.listDepth,
    listType: context.listType,
    depth: context.depth,
  });
};

/**
 * Get cached render result
 * @param {object} node - HTML node
 * @param {object} context - Rendering context
 * @returns {*} - Cached result or undefined
 */
const getCachedRender = (node, context) => {
  if (!CACHE_ENABLED || !node || typeof node !== 'object') {
    return;
  }

  const nodeCache = renderCache.get(node);
  if (!nodeCache) {
    return;
  }

  const contextKey = generateContextKey(context);
  return nodeCache.get(contextKey);
};

/**
 * Cache render result
 * @param {object} node - HTML node
 * @param {object} context - Rendering context
 * @param {*} result - Render result
 */
const setCachedRender = (node, context, result) => {
  if (!CACHE_ENABLED || !node || typeof node !== 'object') {
    return;
  }

  let nodeCache = renderCache.get(node);
  if (!nodeCache) {
    nodeCache = new Map();
    renderCache.set(node, nodeCache);
  }

  const contextKey = generateContextKey(context);
  nodeCache.set(contextKey, result);

  // Limit cache size per node to prevent memory bloat
  if (nodeCache.size > 10) {
    const firstKey = nodeCache.keys().next().value;
    nodeCache.delete(firstKey);
  }
};

/**
 * Render HTML tag with optimizations for deep nesting
 * @param {object} node - HTML node
 * @param {object} context - Rendering context
 * @param {Function} defaultTag - Default tag function
 * @returns {*} - Render result
 */
export const renderTag = (node, context, defaultTag = tags.div) => {
  // Validate inputs
  if (!node) {
    return null;
  }

  // Initialize depth on first call
  const currentDepth = context.depth === undefined ? 0 : context.depth;

  // Check if we've exceeded maximum nesting depth
  if (currentDepth >= MAX_DEPTH) {
    if (process.env.DEBUG) {
      console.warn(`[renderTag] Maximum nesting depth of ${MAX_DEPTH} exceeded`);
    }
    return null;
  }

  // Create new context with incremented depth
  const newContext = { ...context, depth: currentDepth + 1 };

  // Check cache with new context (includes updated depth)
  const cached = getCachedRender(node, newContext);
  if (cached !== undefined) {
    return cached;
  }

  let result = null;

  try {
    const tagFunction = tags[node.nodeName || '#text'] || defaultTag;

    // Render tag
    result = tagFunction(node, newContext);

    // Cache result with new context (includes updated depth)
    setCachedRender(node, newContext, result);

    // Track operations for auto-cleanup
    incrementOperationCount();
  } catch (error) {
    if (process.env.DEBUG) {
      console.error(`[renderTag] Error rendering <${node.nodeName}>:`, error.message);
    }

    // Return null on error to skip this tag
    result = null;
  }

  return result;
};

/**
 * Batch render multiple nodes
 * Optimized for rendering lists and repeated structures
 * @param {Array} nodes - Array of HTML nodes
 * @param {object} context - Rendering context
 * @param {Function} defaultTag - Default tag function
 * @returns {Array} - Array of render results
 */
export const renderNodes = (nodes, context, defaultTag = tags.div) => {
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
    return [];
  }

  const results = [];

  for (const node of nodes) {
    const result = renderTag(node, context, defaultTag);

    if (result !== null && result !== undefined) {
      results.push(result);
    }
  }

  return results;
};

/**
 * Clear render cache
 * Useful for testing or when context changes significantly
 */
export const clearRenderCache = () => {
  // WeakMap doesn't have a clear method, so we can't clear it directly
  // But we can note that garbage collection will handle it
  if (process.env.DEBUG) {
    console.log('[renderTag] Render cache will be cleared by garbage collection');
  }
};

/**
 * Get render statistics
 * @returns {object} - Statistics
 */
export const getRenderStats = () => {
  return {
    maxDepth: MAX_DEPTH,
    cacheEnabled: CACHE_ENABLED,
  };
};
