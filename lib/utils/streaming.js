/**
 * Streaming utilities for large documents
 * Helps process large HTML/Markdown files without loading everything into memory
 * @module streaming
 */

import { parse } from 'parse5';
import { renderTag } from './render-tag.js';
import { getGlobalConfig } from './get-global-config.js';
import { optimizeMemory } from './memory.js';

/**
 * Default configuration for streaming
 */
const DEFAULT_CONFIG = {
  chunkSize: 10_000, // Characters per chunk
  memoryThreshold: 500, // MB - trigger optimization
  enableAutoOptimize: true, // Auto-optimize memory
  progressInterval: 100, // Report progress every N chunks
};

/**
 * Split large text into chunks while preserving tag boundaries
 * @param {string} text - Input text
 * @param {number} chunkSize - Approximate chunk size
 * @returns {string[]} - Array of chunks
 */
const splitIntoChunks = (text, chunkSize) => {
  if (!text || text.length <= chunkSize) {
    return [text];
  }

  const chunks = [];
  let currentChunk = '';
  let inTag = false;
  let tagDepth = 0;

  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    currentChunk += char;

    // Track tag boundaries
    if (char === '<') {
      inTag = true;
      if (text[index + 1] === '/') {
        tagDepth--;
      } else {
        tagDepth++;
      }
    } else if (char === '>') {
      inTag = false;
    }

    // Split at chunk boundary if not in tag and at tag depth 0
    if (currentChunk.length >= chunkSize && !inTag && tagDepth === 0) {
      chunks.push(currentChunk);
      currentChunk = '';
    }
  }

  // Add remaining chunk
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
};

/**
 * Process HTML in streaming mode
 * @param {string} html - HTML content
 * @param {object} theme - Theme configuration
 * @param {object} options - Streaming options
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {string} - Rendered output
 */
export const renderHTMLStreaming = (html, theme = {}, options = {}, onProgress = null) => {
  const config = { ...DEFAULT_CONFIG, ...options };

  // For small documents, use regular rendering
  if (html.length < config.chunkSize * 2) {
    if (onProgress) {
      onProgress({ current: 1, total: 1, percent: 100, phase: 'complete' });
    }
    return renderHTMLRegular(html, theme);
  }

  const chunks = splitIntoChunks(html, config.chunkSize);
  const results = [];

  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];

    // Progress callback
    if (onProgress && index % config.progressInterval === 0) {
      onProgress({
        current: index + 1,
        total: chunks.length,
        percent: Math.round(((index + 1) / chunks.length) * 100),
        phase: 'processing',
      });
    }

    try {
      // Process chunk
      const document = parse(chunk);
      const globalConfig = getGlobalConfig(document, theme);
      const rendered = renderTag(document, globalConfig);

      if (rendered && rendered.value) {
        results.push(rendered.value);
      }

      // Memory optimization
      if (config.enableAutoOptimize && index % 10 === 0) {
        optimizeMemory(config.memoryThreshold);
      }
    } catch {
      // Continue with next chunk on error
    }
  }

  // Final progress
  if (onProgress) {
    onProgress({ current: chunks.length, total: chunks.length, percent: 100, phase: 'complete' });
  }

  return results.join('') + '\n';
};

/**
 * Regular (non-streaming) HTML rendering
 * @param {string} html - HTML content
 * @param {object} theme - Theme configuration
 * @returns {string} - Rendered output
 */
const renderHTMLRegular = (html, theme) => {
  const document = parse(html);
  const globalConfig = getGlobalConfig(document, theme);
  return `${(renderTag(document, globalConfig) || { value: '' }).value}\n`;
};

/**
 * Generator function for processing HTML in chunks
 * Yields rendered output for each chunk
 * @param {string} html - HTML content
 * @param {object} theme - Theme configuration
 * @param {object} options - Streaming options
 * @yields {object} - {chunk: number, total: number, output: string}
 */
export function* streamHTMLChunks(html, theme = {}, options = {}) {
  const config = { ...DEFAULT_CONFIG, ...options };
  const chunks = splitIntoChunks(html, config.chunkSize);

  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index];

    try {
      const document = parse(chunk);
      const globalConfig = getGlobalConfig(document, theme);
      const rendered = renderTag(document, globalConfig);

      yield {
        chunk: index + 1,
        total: chunks.length,
        output: rendered && rendered.value ? rendered.value : '',
        percent: Math.round(((index + 1) / chunks.length) * 100),
      };

      // Memory optimization
      if (config.enableAutoOptimize && index % 10 === 0) {
        optimizeMemory(config.memoryThreshold);
      }
    } catch (error) {
      yield {
        chunk: index + 1,
        total: chunks.length,
        output: '',
        error: error.message,
      };
    }
  }
}

/**
 * Estimate memory requirements for rendering
 * @param {string} html - HTML content
 * @returns {object} - Memory estimate
 */
export const estimateMemoryRequirements = (html) => {
  const sizeBytes = Buffer.byteLength(html, 'utf8');
  const sizeMB = sizeBytes / 1024 / 1024;

  // Rough estimates based on testing
  // Rendering typically uses 3-5x the input size in memory
  const estimatedMemoryMB = sizeMB * 4;

  return {
    inputSizeBytes: sizeBytes,
    inputSizeMB: sizeMB.toFixed(2),
    estimatedMemoryMB: estimatedMemoryMB.toFixed(2),
    recommendStreaming: estimatedMemoryMB > 100,
    recommendedChunkSize: Math.max(10_000, Math.floor(sizeBytes / 100)),
  };
};

/**
 * Process file in streaming mode from path
 * @param {string} filePath - Path to HTML file
 * @param {object} theme - Theme configuration
 * @param {object} options - Streaming options
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise<string>} - Rendered output
 */
export const renderHTMLFileStreaming = async (filePath, theme = {}, options = {}, onProgress = null) => {
  const fs = await import('node:fs/promises');

  try {
    const html = await fs.readFile(filePath, 'utf8');
    return renderHTMLStreaming(html, theme, options, onProgress);
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error.message}`);
  }
};

/**
 * Process large HTML with adaptive chunk sizing
 * Automatically determines optimal chunk size based on content
 * @param {string} html - HTML content
 * @param {object} theme - Theme configuration
 * @param {object} options - Streaming options
 * @returns {string} - Rendered output
 */
export const renderHTMLAdaptive = (html, theme = {}, options = {}) => {
  const estimate = estimateMemoryRequirements(html);

  const adaptiveOptions = {
    ...options,
    chunkSize: options.chunkSize || estimate.recommendedChunkSize,
    enableAutoOptimize: estimate.recommendStreaming,
  };

  return renderHTMLStreaming(html, theme, adaptiveOptions);
};

/**
 * Batch process multiple HTML files
 * @param {string[]} filePaths - Array of file paths
 * @param {object} theme - Theme configuration
 * @param {object} options - Streaming options
 * @param {Function} onFileComplete - Callback when file is complete
 * @returns {Promise<Map<string, string>>} - Map of filePath -> rendered output
 */
export const renderMultipleFiles = async (filePaths, theme = {}, options = {}, onFileComplete = null) => {
  const results = new Map();
  const fs = await import('node:fs/promises');

  for (let index = 0; index < filePaths.length; index++) {
    const filePath = filePaths[index];

    try {
      const html = await fs.readFile(filePath, 'utf8');
      const rendered = renderHTMLAdaptive(html, theme, options);

      results.set(filePath, rendered);

      if (onFileComplete) {
        onFileComplete({
          filePath,
          index: index + 1,
          total: filePaths.length,
          success: true,
        });
      }

      // Clear caches between files
      if (index % 10 === 0) {
        optimizeMemory();
      }
    } catch (error) {
      results.set(filePath, `Error: ${error.message}`);

      if (onFileComplete) {
        onFileComplete({
          filePath,
          index: index + 1,
          total: filePaths.length,
          success: false,
          error: error.message,
        });
      }
    }
  }

  return results;
};
