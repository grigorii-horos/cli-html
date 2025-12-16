#!/usr/bin/env node

/**
 * Screenshot Generator for Markdown Examples
 *
 * This script generates terminal screenshots for all Markdown example files
 * using termshot. It provides a more flexible alternative to the bash script.
 *
 * Usage:
 *   node scripts/generate-markdown-screenshots.js [options]
 *
 * Options:
 *   --force              Regenerate all screenshots
 *   --filter <pattern>   Only process files matching pattern
 *   --parallel <n>       Number of parallel processes (default: 4)
 *   --output <dir>       Output directory for screenshots
 *   --verbose            Enable verbose logging
 *   --help               Show help
 *
 * Requirements:
 *   - termshot (install with: cargo install termshot)
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync, unlinkSync } from 'node:fs';
import { basename, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Default configuration
const config = {
  examplesDir: join(PROJECT_ROOT, 'examples/markdown'),
  binMarkdown: join(PROJECT_ROOT, 'bin/markdown.js'),
  outputDir: null, // Will be set to examples/markdown/screenshots
  force: false,
  filter: null,
  parallel: 4,
  verbose: false,
  recursive: true, // Search recursively in subdirectories

  // Termshot configuration
  termshot: {
    columns: 120,
  },
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--force':
        config.force = true;
        break;
      case '--filter':
        config.filter = args[++i];
        break;
      case '--parallel':
        config.parallel = parseInt(args[++i], 10);
        break;
      case '--output':
        config.outputDir = args[++i];
        break;
      case '--verbose':
        config.verbose = true;
        break;
      case '--help':
        printHelp();
        process.exit(0);
        break;
      default:
        console.error(`${colors.red}Unknown option: ${args[i]}${colors.reset}`);
        process.exit(1);
    }
  }

  // Set output directory if not specified
  if (!config.outputDir) {
    config.outputDir = join(config.examplesDir, 'screenshots');
  }
}

function printHelp() {
  console.log(`
${colors.bold}Screenshot Generator for Markdown Examples${colors.reset}

${colors.cyan}Usage:${colors.reset}
  node scripts/generate-markdown-screenshots.js [options]

${colors.cyan}Options:${colors.reset}
  --force              Regenerate all screenshots
  --filter <pattern>   Only process files matching pattern
  --parallel <n>       Number of parallel processes (default: 4)
  --output <dir>       Output directory for screenshots
  --verbose            Enable verbose logging
  --help               Show this help message

${colors.cyan}Examples:${colors.reset}
  # Generate all screenshots
  node scripts/generate-markdown-screenshots.js

  # Force regenerate all screenshots
  node scripts/generate-markdown-screenshots.js --force

  # Only generate screenshots for code examples
  node scripts/generate-markdown-screenshots.js --filter "code"

  # Use 8 parallel processes
  node scripts/generate-markdown-screenshots.js --parallel 8

  # Generate screenshots with verbose output
  node scripts/generate-markdown-screenshots.js --verbose
`);
}

// Check if termshot is installed
async function checkTermshot() {
  return new Promise((resolve) => {
    const proc = spawn('termshot', ['--version']);
    proc.on('error', () => resolve(false));
    proc.on('exit', (code) => resolve(code === 0));
  });
}

// Find all Markdown files in directory (recursively)
function findMarkdownFiles() {
  if (!existsSync(config.examplesDir)) {
    console.error(`${colors.red}Error: Examples directory not found: ${config.examplesDir}${colors.reset}`);
    process.exit(1);
  }

  const files = [];

  function scanDirectory(dir) {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory() && config.recursive) {
        // Skip node_modules and hidden directories
        if (!entry.startsWith('.') && entry !== 'node_modules' && entry !== 'screenshots') {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile() && entry.endsWith('.md') && entry !== 'README.md') {
        // Apply filter if specified
        if (!config.filter || entry.includes(config.filter)) {
          files.push(fullPath);
        }
      }
    }
  }

  scanDirectory(config.examplesDir);

  return files.sort();
}

// Generate screenshot for a single file
async function generateScreenshot(mdFile) {
  // Get relative path from examples dir to preserve directory structure
  const relativePath = mdFile.replace(config.examplesDir + '/', '');
  const filename = basename(mdFile, '.md');

  // Create subdirectory structure in output dir
  const relativeDir = dirname(relativePath);
  const outputSubDir = join(config.outputDir, relativeDir);

  // Ensure output directory exists
  if (!existsSync(outputSubDir)) {
    mkdirSync(outputSubDir, { recursive: true });
  }

  const outputFile = join(outputSubDir, `${filename}.png`);

  // Skip if exists and not forcing
  if (existsSync(outputFile) && !config.force) {
    return { status: 'skipped', filename: relativePath };
  }

  return new Promise((resolve) => {
    // Step 1: Generate output to temporary file
    const tempFile = join('/tmp', `${filename}-${Date.now()}.txt`);

    if (config.verbose) {
      console.log(`${colors.cyan}Step 1:${colors.reset} Generating output to ${tempFile}`);
    }

    const renderProc = spawn('node', [config.binMarkdown, mdFile], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, FORCE_COLOR: '1' },
    });

    let output = '';
    renderProc.stdout.on('data', (data) => {
      output += data.toString();
    });

    renderProc.on('error', (error) => {
      resolve({ status: 'failed', filename: relativePath, error: error.message });
    });

    renderProc.on('exit', (code) => {
      if (code !== 0) {
        resolve({ status: 'failed', filename: relativePath, error: `Render failed with code ${code}` });
        return;
      }

      // Write output to temp file
      try {
        writeFileSync(tempFile, output, 'utf8');
      } catch (error) {
        resolve({ status: 'failed', filename: relativePath, error: `Failed to write temp file: ${error.message}` });
        return;
      }

      // Step 2: Create screenshot from temp file using termshot --raw-read
      const args = [
        '--raw-read', tempFile,
        '-f', outputFile,
        '-C', config.termshot.columns.toString(),
      ];

      if (config.verbose) {
        console.log(`${colors.cyan}Step 2:${colors.reset} Creating screenshot: termshot ${args.join(' ')}`);
      }

      const termshotProc = spawn('termshot', args, {
        stdio: config.verbose ? 'inherit' : 'pipe',
      });

      termshotProc.on('error', (error) => {
        // Clean up temp file
        try { unlinkSync(tempFile); } catch {}
        resolve({ status: 'failed', filename: relativePath, error: error.message });
      });

      termshotProc.on('exit', (code) => {
        // Clean up temp file
        try { unlinkSync(tempFile); } catch {}

        if (code === 0) {
          resolve({ status: 'success', filename: relativePath, output: outputFile });
        } else {
          resolve({ status: 'failed', filename: relativePath, error: `Termshot failed with code ${code}` });
        }
      });
    });
  });
}

// Process files in parallel batches
async function processBatch(files, batchSize) {
  const stats = {
    total: files.length,
    processed: 0,
    skipped: 0,
    failed: 0,
  };

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(generateScreenshot));

    for (const result of results) {
      switch (result.status) {
        case 'success':
          console.log(`${colors.green}✓ Generated${colors.reset} ${result.output}`);
          stats.processed++;
          break;
        case 'skipped':
          console.log(`${colors.yellow}⊘ Skipped${colors.reset} ${result.filename} (already exists)`);
          stats.skipped++;
          break;
        case 'failed':
          console.log(`${colors.red}✗ Failed${colors.reset} ${result.filename}: ${result.error}`);
          stats.failed++;
          break;
      }
    }
  }

  return stats;
}

// Main function
async function main() {
  parseArgs();

  console.log(`${colors.blue}${colors.bold}=== Markdown Screenshot Generator ===${colors.reset}`);
  console.log(`Examples directory: ${config.examplesDir}`);
  console.log(`Output directory: ${config.outputDir}`);
  console.log(`Force regenerate: ${config.force}`);
  console.log(`Parallel processes: ${config.parallel}`);
  if (config.filter) {
    console.log(`Filter pattern: ${config.filter}`);
  }
  console.log('');

  // Check if termshot is installed
  const hasTermshot = await checkTermshot();
  if (!hasTermshot) {
    console.error(`${colors.red}Error: termshot is not installed${colors.reset}`);
    console.error('Install it with: cargo install termshot');
    console.error('Or see: https://github.com/homeport/termshot');
    process.exit(1);
  }

  // Check if markdown binary exists
  if (!existsSync(config.binMarkdown)) {
    console.error(`${colors.red}Error: Markdown binary not found: ${config.binMarkdown}${colors.reset}`);
    process.exit(1);
  }

  // Create output directory
  if (!existsSync(config.outputDir)) {
    mkdirSync(config.outputDir, { recursive: true });
  }

  // Find Markdown files
  const files = findMarkdownFiles();

  if (files.length === 0) {
    console.log(`${colors.yellow}No Markdown files found${colors.reset}`);
    return;
  }

  console.log(`Found ${files.length} Markdown files\n`);

  // Process files
  const stats = await processBatch(files, config.parallel);

  // Print summary
  console.log('');
  console.log(`${colors.blue}${colors.bold}=== Summary ===${colors.reset}`);
  console.log(`Total files: ${stats.total}`);
  console.log(`${colors.green}Processed: ${stats.processed}${colors.reset}`);
  console.log(`${colors.yellow}Skipped: ${stats.skipped}${colors.reset}`);
  if (stats.failed > 0) {
    console.log(`${colors.red}Failed: ${stats.failed}${colors.reset}`);
  }

  // Exit with error if any failed
  if (stats.failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
