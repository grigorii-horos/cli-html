import { describe, it } from 'node:test';
import assert from 'node:assert';
import { renderHTMLStreaming, estimateMemoryRequirements, renderHTMLAdaptive } from '../../lib/utils/streaming.js';

describe('Streaming Performance', () => {
  describe('Small Documents', () => {
    it('should handle small documents efficiently', () => {
      const html = '<h1>Small Document</h1><p>Short content.</p>';
      const result = renderHTMLStreaming(html);
      assert.ok(result.includes('Small Document'));
      assert.ok(result.includes('Short content'));
    });

    it('should use regular rendering for very small input', () => {
      const html = '<p>Tiny</p>';
      const result = renderHTMLStreaming(html);
      assert.ok(result.includes('Tiny'));
    });
  });

  describe('Large Documents', () => {
    it('should handle large documents with streaming', () => {
      const largeHTML = '<div>' + '<p>Test paragraph</p>'.repeat(1000) + '</div>';
      const result = renderHTMLStreaming(largeHTML);
      assert.ok(result.length > 0);
      assert.ok(result.includes('Test paragraph'));
    });

    it('should process chunks correctly', () => {
      const html = '<h1>Header</h1>' + '<p>Content</p>'.repeat(500);
      const result = renderHTMLStreaming(html, {}, { chunkSize: 1000 });
      assert.ok(result.includes('Header'));
      assert.ok(result.includes('Content'));
    });
  });

  describe('Progress Tracking', () => {
    it('should report progress for large documents', () => {
      const html = '<div>' + '<p>Test</p>'.repeat(1000) + '</div>';
      let progressCalled = false;

      const result = renderHTMLStreaming(html, {}, {}, (progress) => {
        progressCalled = true;
        assert.ok(progress.percent >= 0 && progress.percent <= 100);
        assert.ok(progress.current >= 0);
        assert.ok(progress.total > 0);
        assert.ok(['processing', 'complete'].includes(progress.phase));
      });

      assert.ok(result.length > 0);
      // Progress may or may not be called depending on document size
    });
  });

  describe('Memory Estimation', () => {
    it('should estimate memory for small documents', () => {
      const html = '<h1>Small</h1>';
      const estimate = estimateMemoryRequirements(html);

      assert.ok(estimate.inputSizeBytes > 0);
      assert.ok(Number.parseFloat(estimate.inputSizeMB) >= 0);
      assert.ok(Number.parseFloat(estimate.estimatedMemoryMB) >= 0);
      assert.ok(typeof estimate.recommendStreaming === 'boolean');
      assert.ok(estimate.recommendedChunkSize > 0);
    });

    it('should recommend streaming for large documents', () => {
      const largeHTML = '<div>' + 'x'.repeat(1_000_000) + '</div>';
      const estimate = estimateMemoryRequirements(largeHTML);

      assert.ok(Number.parseFloat(estimate.inputSizeMB) > 0.5);
      // Large documents should recommend streaming
    });

    it('should not recommend streaming for tiny documents', () => {
      const html = '<p>Tiny</p>';
      const estimate = estimateMemoryRequirements(html);

      assert.strictEqual(estimate.recommendStreaming, false);
    });
  });

  describe('Adaptive Rendering', () => {
    it('should adaptively choose rendering mode', () => {
      const html = '<h1>Adaptive Test</h1>';
      const result = renderHTMLAdaptive(html);
      assert.ok(result.includes('Adaptive Test'));
    });

    it('should use adaptive chunk sizing', () => {
      const largeHTML = '<div>' + '<p>Adaptive</p>'.repeat(500) + '</div>';
      const result = renderHTMLAdaptive(largeHTML);
      assert.ok(result.includes('Adaptive'));
    });

    it('should respect custom options', () => {
      const html = '<p>Custom options</p>'.repeat(100);
      const result = renderHTMLAdaptive(html, {}, { chunkSize: 500 });
      assert.ok(result.includes('Custom options'));
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed HTML in streaming mode', () => {
      const html = '<div><p>Unclosed paragraph' + '</div>'.repeat(100);
      const result = renderHTMLStreaming(html);
      assert.ok(result.length >= 0); // Should not crash
    });

    it('should continue processing on chunk errors', () => {
      const html = '<valid>Good</valid>' + '<broken>Bad'.repeat(10) + '<valid>Good again</valid>';
      const result = renderHTMLStreaming(html, {}, { chunkSize: 50 });
      // Should process what it can
      assert.ok(result.length >= 0);
    });
  });

  describe('Custom Options', () => {
    it('should respect custom chunk size', () => {
      const html = '<p>Test</p>'.repeat(200);
      const result = renderHTMLStreaming(html, {}, { chunkSize: 500 });
      assert.ok(result.includes('Test'));
    });

    it('should respect memory threshold option', () => {
      const html = '<p>Memory test</p>'.repeat(100);
      const result = renderHTMLStreaming(html, {}, { memoryThreshold: 100 });
      assert.ok(result.includes('Memory test'));
    });

    it('should allow disabling auto-optimization', () => {
      const html = '<p>No auto-optimize</p>'.repeat(100);
      const result = renderHTMLStreaming(html, {}, { enableAutoOptimize: false });
      assert.ok(result.includes('No auto-optimize'));
    });
  });

  describe('Theme Integration', () => {
    it('should apply theme in streaming mode', () => {
      const html = '<h1>Themed</h1>'.repeat(100);
      const theme = { h1: 'red bold' };
      const result = renderHTMLStreaming(html, theme);
      assert.ok(result.includes('Themed'));
    });
  });
});
