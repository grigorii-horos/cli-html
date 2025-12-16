#!/usr/bin/env node

/**
 * Screenshot Generator for HTML Examples
 *
 * This script generates terminal screenshots for all HTML example files
 * using termshot. It provides a more flexible alternative to the bash script.
 *
 * Usage:
 *   node scripts/generate-screenshots.js [options]
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
  examplesDir: join(PROJECT_ROOT, 'examples/html'),
  binHtml: join(PROJECT_ROOT, 'bin/html.js'),
  binMarkdown: join(PROJECT_ROOT, 'bin/markdown.js'),
  outputDir: null, // Will be set to examples/html/screenshots or examples/markdown/screenshots
  force: false,
  filter: null,
  parallel: 4,
  verbose: false,
  recursive: true, // Search recursively in subdirectories
  type: 'html', // 'html', 'markdown', or 'all'
  optimize: true, // Enable PNG optimization with optipng

  // Termshot configuration
  termshot: {
    columns: 120,
  },

  // Optipng configuration
  optipng: {
    level: 7, // Optimization level (0-7, 7 is maximum)
    strip: true, // Strip metadata
  },
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  // Check for type argument (html, markdown, all)
  if (args.length > 0 && !args[0].startsWith('--')) {
    config.type = args.shift();
  }

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
      case '--no-optimize':
        config.optimize = false;
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

  // Set examples directory based on type
  if (config.type === 'markdown' || config.type === 'md') {
    config.examplesDir = join(PROJECT_ROOT, 'examples/markdown');
  } else if (config.type === 'all') {
    // Will process both in main()
  }

  // Set output directory if not specified
  if (!config.outputDir) {
    config.outputDir = join(config.examplesDir, 'screenshots');
  }
}

function printHelp() {
  console.log(`
${colors.bold}Screenshot Generator for HTML Examples${colors.reset}

${colors.cyan}Usage:${colors.reset}
  node scripts/generate-screenshots.js [options]

${colors.cyan}Options:${colors.reset}
  --force              Regenerate all screenshots
  --filter <pattern>   Only process files matching pattern
  --parallel <n>       Number of parallel processes (default: 4)
  --output <dir>       Output directory for screenshots
  --verbose            Enable verbose logging
  --help               Show this help message

${colors.cyan}Examples:${colors.reset}
  # Generate all screenshots
  node scripts/generate-screenshots.js

  # Force regenerate all screenshots
  node scripts/generate-screenshots.js --force

  # Only generate screenshots for code examples
  node scripts/generate-screenshots.js --filter "code"

  # Use 8 parallel processes
  node scripts/generate-screenshots.js --parallel 8

  # Generate screenshots with verbose output
  node scripts/generate-screenshots.js --verbose
`);
}

// Check if a command is installed
async function checkCommand(command) {
  return new Promise((resolve) => {
    const proc = spawn(command, ['--version']);
    proc.on('error', () => resolve(false));
    proc.on('exit', (code) => resolve(code === 0));
  });
}

// Check if termshot is installed
async function checkTermshot() {
  return checkCommand('termshot');
}

// Check if optipng is installed
async function checkOptipng() {
  return checkCommand('optipng');
}

// Optimize PNG file with optipng
async function optimizePng(pngFile) {
  if (!config.optimize) return;

  return new Promise((resolve) => {
    const args = [
      `-o${config.optipng.level}`,
    ];

    if (config.optipng.strip) {
      args.push('-strip', 'all');
    }

    args.push(pngFile);

    if (config.verbose) {
      console.log(`${colors.cyan}Optimizing:${colors.reset} optipng ${args.join(' ')}`);
    }

    const proc = spawn('optipng', args, {
      stdio: config.verbose ? 'inherit' : 'pipe',
    });

    proc.on('error', () => {
      if (config.verbose) {
        console.log(`${colors.yellow}Warning: optipng failed${colors.reset}`);
      }
      resolve();
    });

    proc.on('exit', () => resolve());
  });
}

// Find all example files in directory (recursively)
function findExampleFiles(extensions = ['.html', '.md']) {
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
        // Skip node_modules, hidden directories, and screenshots
        if (!entry.startsWith('.') && entry !== 'node_modules' && entry !== 'screenshots') {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        // Check if file has valid extension
        const hasValidExt = extensions.some(ext => entry.endsWith(ext));
        if (hasValidExt) {
          // Apply filter if specified
          if (!config.filter || entry.includes(config.filter)) {
            files.push(fullPath);
          }
        }
      }
    }
  }

  scanDirectory(config.examplesDir);

  return files.sort();
}

// Generate screenshot for a single file
async function generateScreenshot(inputFile) {
  // Get relative path from examples dir to preserve directory structure
  const relativePath = inputFile.replace(config.examplesDir + '/', '');
  const ext = inputFile.endsWith('.md') ? '.md' : '.html';
  const filename = basename(inputFile, ext);
  const isMarkdown = ext === '.md';
  const binPath = isMarkdown ? config.binMarkdown : config.binHtml;

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

    const renderProc = spawn('node', [binPath, inputFile], {
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

      termshotProc.on('exit', async (code) => {
        // Clean up temp file
        try { unlinkSync(tempFile); } catch {}

        if (code === 0) {
          // Optimize PNG if enabled
          await optimizePng(outputFile);
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

  console.log(`${colors.blue}${colors.bold}=== Screenshot Generator ===${colors.reset}`);
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

  // Check if html binary exists
  if (!existsSync(config.binHtml)) {
    console.error(`${colors.red}Error: HTML binary not found: ${config.binHtml}${colors.reset}`);
    process.exit(1);
  }

  // Create output directory
  if (!existsSync(config.outputDir)) {
    mkdirSync(config.outputDir, { recursive: true });
  }

  // Find example files
  const extensions = (config.type === 'markdown' || config.type === 'md') ? ['.md'] : ['.html'];
  const files = findExampleFiles(extensions);

  if (files.length === 0) {
    console.log(`${colors.yellow}No example files found${colors.reset}`);
    return;
  }

  console.log(`Found ${files.length} example files\n`);

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
