#!/usr/bin/env node

/**
 * Output Generator for HTML Examples
 *
 * This script generates terminal output files for all HTML example files.
 * Since termshot requires a TTY, this creates .txt files with the rendered output.
 *
 * Usage:
 *   node scripts/generate-outputs.js [options]
 *
 * Options:
 *   --force              Regenerate all outputs
 *   --filter <pattern>   Only process files matching pattern
 *   --output <dir>       Output directory for files
 *   --help               Show help
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHTML } from '../index.js';

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
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Configuration
const config = {
  examplesDir: join(PROJECT_ROOT, 'examples/html/tags-custom'),
  outputDir: null,
  force: false,
  filter: null,
};

// Parse arguments
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
      case '--output':
        config.outputDir = args[++i];
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

  if (!config.outputDir) {
    config.outputDir = join(config.examplesDir, 'outputs');
  }
}

function printHelp() {
  console.log(`
${colors.bold}Output Generator for HTML Examples${colors.reset}

${colors.cyan}Usage:${colors.reset}
  node scripts/generate-outputs.js [options]

${colors.cyan}Options:${colors.reset}
  --force              Regenerate all outputs
  --filter <pattern>   Only process files matching pattern
  --output <dir>       Output directory
  --help               Show this help

${colors.cyan}Examples:${colors.reset}
  # Generate all outputs
  node scripts/generate-outputs.js

  # Force regenerate
  node scripts/generate-outputs.js --force

  # Filter by pattern
  node scripts/generate-outputs.js --filter "code"
`);
}

// Find HTML files
function findHtmlFiles() {
  if (!existsSync(config.examplesDir)) {
    console.error(`${colors.red}Error: Examples directory not found${colors.reset}`);
    process.exit(1);
  }

  const files = readdirSync(config.examplesDir)
    .filter(file => file.endsWith('.html'))
    .filter(file => statSync(join(config.examplesDir, file)).isFile())
    .filter(file => !config.filter || file.includes(config.filter))
    .sort();

  return files.map(file => join(config.examplesDir, file));
}

// Generate output for single file
function generateOutput(htmlFile) {
  const filename = basename(htmlFile, '.html');
  const outputFile = join(config.outputDir, `${filename}.txt`);

  // Skip if exists
  if (existsSync(outputFile) && !config.force) {
    return { status: 'skipped', filename };
  }

  try {
    // Read HTML
    const html = readFileSync(htmlFile, 'utf8');

    // Render
    const output = renderHTML(html);

    // Write output
    writeFileSync(outputFile, output, 'utf8');

    return { status: 'success', filename, output: outputFile };
  } catch (error) {
    return { status: 'failed', filename, error: error.message };
  }
}

// Main
async function main() {
  parseArgs();

  console.log(`${colors.blue}${colors.bold}=== Output Generator ===${colors.reset}`);
  console.log(`Examples directory: ${config.examplesDir}`);
  console.log(`Output directory: ${config.outputDir}`);
  console.log(`Force regenerate: ${config.force}`);
  if (config.filter) {
    console.log(`Filter pattern: ${config.filter}`);
  }
  console.log('');

  // Create output directory
  if (!existsSync(config.outputDir)) {
    mkdirSync(config.outputDir, { recursive: true });
  }

  // Find files
  const files = findHtmlFiles();

  if (files.length === 0) {
    console.log(`${colors.yellow}No HTML files found${colors.reset}`);
    return;
  }

  console.log(`Found ${files.length} HTML files\n`);

  // Process files
  const stats = { total: files.length, processed: 0, skipped: 0, failed: 0 };

  for (const file of files) {
    const result = generateOutput(file);

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

  // Summary
  console.log('');
  console.log(`${colors.blue}${colors.bold}=== Summary ===${colors.reset}`);
  console.log(`Total files: ${stats.total}`);
  console.log(`${colors.green}Processed: ${stats.processed}${colors.reset}`);
  console.log(`${colors.yellow}Skipped: ${stats.skipped}${colors.reset}`);
  if (stats.failed > 0) {
    console.log(`${colors.red}Failed: ${stats.failed}${colors.reset}`);
  }

  if (stats.failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
