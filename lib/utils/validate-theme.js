/**
 * Theme Validation Module
 *
 * Validates theme configuration and provides helpful error messages.
 *
 * @module validate-theme
 */

/**
 * Valid chalk color names (basic set)
 */
const VALID_COLORS = [
  'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white',
  'gray', 'grey',
  'blackBright', 'redBright', 'greenBright', 'yellowBright',
  'blueBright', 'magentaBright', 'cyanBright', 'whiteBright',
];

/**
 * Valid chalk modifiers
 */
const VALID_MODIFIERS = [
  'bold', 'dim', 'italic', 'underline', 'inverse', 'hidden', 'strikethrough',
  'reset',
];

/**
 * Valid chalk background colors
 */
const VALID_BG_COLORS = [
  'bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite',
  'bgBlackBright', 'bgRedBright', 'bgGreenBright', 'bgYellowBright',
  'bgBlueBright', 'bgMagentaBright', 'bgCyanBright', 'bgWhiteBright',
];

/**
 * Valid border styles for boxen
 */
const VALID_BORDER_STYLES = [
  'single', 'double', 'round', 'bold', 'singleDouble', 'doubleSingle',
  'classic', 'arrow',
];

/**
 * Check if a color string is valid
 *
 * @param {string} color - Color string to validate
 * @returns {boolean} - True if valid
 *
 * @example
 * isValidColor('red bold')      // => true
 * isValidColor('bgBlue white')  // => true
 * isValidColor('invalid')       // => false
 */
export const isValidColor = (color) => {
  if (!color || typeof color !== 'string') return false;

  // Split by spaces to check each part
  const parts = color.trim().split(/\s+/);

  return parts.every(part => {
    return VALID_COLORS.includes(part) ||
           VALID_MODIFIERS.includes(part) ||
           VALID_BG_COLORS.includes(part);
  });
};

/**
 * Check if border style is valid
 *
 * @param {string} style - Border style to validate
 * @returns {boolean} - True if valid
 */
export const isValidBorderStyle = (style) => {
  return VALID_BORDER_STYLES.includes(style);
};

/**
 * Validate a theme color configuration
 *
 * @param {string} key - Configuration key (e.g., 'h1', 'code.block')
 * @param {*} value - Configuration value
 * @param {string[]} warnings - Array to collect warnings
 * @returns {boolean} - True if valid
 */
const validateColorConfig = (key, value, warnings) => {
  if (value === null || value === undefined || value === '') {
    return true; // Empty is valid (means no styling)
  }

  if (typeof value === 'string') {
    if (!isValidColor(value)) {
      warnings.push(`Invalid color in '${key}': '${value}'`);
      return false;
    }
    return true;
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    // Object format: { color: '...', marker: '...', ... }
    if (value.color && typeof value.color === 'string') {
      if (!isValidColor(value.color)) {
        warnings.push(`Invalid color in '${key}.color': '${value.color}'`);
        return false;
      }
    }
    return true;
  }

  return true;
};

/**
 * Validate border configuration
 *
 * @param {string} key - Configuration key
 * @param {object} border - Border configuration
 * @param {string[]} warnings - Array to collect warnings
 */
const validateBorderConfig = (key, border, warnings) => {
  if (!border || typeof border !== 'object') return;

  if (border.style && !isValidBorderStyle(border.style)) {
    warnings.push(
      `Invalid border style in '${key}.border.style': '${border.style}'. ` +
      `Valid styles: ${VALID_BORDER_STYLES.join(', ')}`
    );
  }

  if (border.color && !isValidColor(border.color)) {
    warnings.push(`Invalid border color in '${key}.border.color': '${border.color}'`);
  }
};

/**
 * Validate theme configuration
 *
 * @param {object} theme - Theme configuration to validate
 * @returns {object} - Validation result with errors and warnings
 *
 * @example
 * const result = validateTheme(myTheme);
 * if (!result.valid) {
 *   console.error('Theme has errors:', result.errors);
 * }
 * if (result.warnings.length > 0) {
 *   console.warn('Theme warnings:', result.warnings);
 * }
 */
export const validateTheme = (theme) => {
  const errors = [];
  const warnings = [];

  if (!theme) {
    return { valid: true, errors: [], warnings: [] };
  }

  if (typeof theme !== 'object' || Array.isArray(theme)) {
    errors.push('Theme must be an object');
    return { valid: false, errors, warnings };
  }

  // Validate basic heading styles (required)
  const requiredKeys = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  for (const key of requiredKeys) {
    if (!theme[key]) {
      warnings.push(`Missing recommended configuration for '${key}'`);
    } else {
      validateColorConfig(key, theme[key], warnings);
    }
  }

  // Validate code configuration
  if (theme.code) {
    if (theme.code.inline) {
      validateColorConfig('code.inline', theme.code.inline, warnings);
    }
    if (theme.code.block) {
      validateColorConfig('code.block', theme.code.block, warnings);

      if (theme.code.block.numbers) {
        validateColorConfig('code.block.numbers', theme.code.block.numbers, warnings);
      }
    }
  }

  // Validate table configuration
  if (theme.table) {
    for (const key of ['header', 'caption', 'cell', 'td', 'th']) {
      if (theme.table[key]) {
        validateColorConfig(`table.${key}`, theme.table[key], warnings);
      }
    }
  }

  // Validate list configurations
  if (theme.ol?.indicators && typeof theme.ol.indicators === 'object') {
    for (const [type, config] of Object.entries(theme.ol.indicators)) {
      if (config?.color) {
        validateColorConfig(`ol.indicators.${type}`, config.color, warnings);
      }
    }
  }

  if (theme.ul?.indicators && typeof theme.ul.indicators === 'object') {
    for (const [type, config] of Object.entries(theme.ul.indicators)) {
      if (config?.color) {
        validateColorConfig(`ul.indicators.${type}`, config.color, warnings);
      }
    }
  }

  // Validate border configurations
  if (theme.figure?.border) {
    validateBorderConfig('figure', theme.figure, warnings);
  }
  if (theme.fieldset?.border) {
    validateBorderConfig('fieldset', theme.fieldset, warnings);
  }
  if (theme.details?.border) {
    validateBorderConfig('details', theme.details, warnings);
  }

  // Validate progress/meter
  if (theme.progress) {
    if (theme.progress.filled) {
      validateColorConfig('progress.filled', theme.progress.filled, warnings);
    }
    if (theme.progress.empty) {
      validateColorConfig('progress.empty', theme.progress.empty, warnings);
    }
  }

  // Validate input configurations
  if (theme.input) {
    const inputTypes = ['checkbox', 'radio', 'button', 'textInput', 'textarea', 'range'];
    for (const type of inputTypes) {
      if (theme.input[type]) {
        validateColorConfig(`input.${type}`, theme.input[type], warnings);
      }
    }
  }

  // Check for duplicate or conflicting keys
  const seenKeys = new Set();
  const checkDuplicates = (obj, prefix = '') => {
    for (const key of Object.keys(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (seenKeys.has(fullKey)) {
        warnings.push(`Duplicate key detected: '${fullKey}'`);
      }
      seenKeys.add(fullKey);

      if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
        checkDuplicates(obj[key], fullKey);
      }
    }
  };
  checkDuplicates(theme);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate and throw if theme is invalid
 *
 * @param {object} theme - Theme to validate
 * @throws {Error} - If theme has errors
 *
 * @example
 * try {
 *   assertValidTheme(myTheme);
 * } catch (error) {
 *   console.error('Invalid theme:', error.message);
 * }
 */
export const assertValidTheme = (theme) => {
  const result = validateTheme(theme);

  if (!result.valid) {
    throw new Error(
      `Invalid theme configuration:\n${result.errors.join('\n')}`
    );
  }

  if (result.warnings.length > 0) {
    console.warn(
      `Theme validation warnings:\n${result.warnings.join('\n')}`
    );
  }
};

/**
 * Get helpful suggestions for invalid colors
 *
 * @param {string} invalidColor - Invalid color string
 * @returns {string[]} - Array of suggestions
 *
 * @example
 * suggestColors('reed')  // => ['red', 'redBright']
 * suggestColors('gren')  // => ['green', 'greenBright']
 */
export const suggestColors = (invalidColor) => {
  if (!invalidColor) return [];

  const allValidColors = [
    ...VALID_COLORS,
    ...VALID_BG_COLORS,
  ];

  // Simple string distance calculation (Levenshtein-like)
  const distance = (a, b) => {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  };

  // Find closest matches
  const suggestions = allValidColors
    .map(color => ({ color, distance: distance(invalidColor.toLowerCase(), color.toLowerCase()) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map(item => item.color);

  return suggestions;
};
