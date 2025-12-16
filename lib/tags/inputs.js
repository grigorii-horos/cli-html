import chalkString from 'chalk-string';
import chalk from 'chalk';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getCustomAttributes, getDisabledColor } from '../utilities.js';

/**
 * Add required field indicator to input value
 * @param {string} value - Input value
 * @param {object} tag - HTML tag
 * @param {object} custom - Custom attributes
 * @param {object} theme - Theme configuration
 * @returns {string} - Value with required indicator
 */
const addRequiredIndicator = (value, tag, custom, theme) => {
  // Check if input is required
  const isRequired = getAttribute(tag, 'required', null) !== null;
  if (!isRequired) {
    return value;
  }

  // Check if required indicator is enabled
  const requiredConfig = theme.input?.required;
  const isEnabled = custom.required?.enabled === undefined
    ? (requiredConfig?.enabled !== false)
    : (custom.required.enabled === 'true' || custom.required.enabled === true);

  if (!isEnabled) {
    return value;
  }

  // Get marker and color
  const marker = custom.required?.marker || requiredConfig?.indicator?.marker || '*';
  const markerColorFunction = custom.required?.color
    ? (text) => chalkString(custom.required.color, { colors: true })(text)
    : (requiredConfig?.indicator?.color
        ? (typeof requiredConfig.indicator.color === 'function'
            ? requiredConfig.indicator.color
            : (text) => chalkString(requiredConfig.indicator.color, { colors: true })(text))
        : (text) => text);

  const styledMarker = markerColorFunction(marker);
  const position = custom.required?.position || requiredConfig?.indicator?.position || 'after';

  // Add marker before or after value
  return position === 'before' ? styledMarker + ' ' + value : value + ' ' + styledMarker;
};

export const button = (tag, context) => {
  const custom = getCustomAttributes(tag);
  const isDisabled = getAttribute(tag, 'disabled', null) !== null;

  return inlineTag(
    (value) => {
      const prefixMarker = custom.prefix?.marker || context.theme.button?.prefix?.marker || '[ ';
      const suffixMarker = custom.suffix?.marker || context.theme.button?.suffix?.marker || ' ]';

      const prefixColorFunction = custom.prefix?.color
        ? (text) => chalkString(custom.prefix.color, { colors: true })(text)
        : context.theme.button?.prefix?.color;

      const suffixColorFunction = custom.suffix?.color
        ? (text) => chalkString(custom.suffix.color, { colors: true })(text)
        : context.theme.button?.suffix?.color;

      const textColorFunction = custom.color
        ? (text) => chalkString(custom.color, { colors: true })(text)
        : context.theme.button?.color;

      const result = `${prefixColorFunction(prefixMarker)}${textColorFunction(value)}${suffixColorFunction(suffixMarker)}`;
      return isDisabled ? chalkString(getDisabledColor(custom, context.theme.button), { colors: true })(result) : result;
    },
  )(tag, context);
};

export const input = (tag, context) => {
  const custom = getCustomAttributes(tag);

  if (getAttribute(tag, 'type', 'text') === 'checkbox') {
    const isDisabled = getAttribute(tag, 'disabled', null) !== null;
    const prefixMarker = custom.checkbox.prefix.marker || context.theme.input.checkbox.prefix.marker || '[';
    const suffixMarker = custom.checkbox.suffix.marker || context.theme.input.checkbox.suffix.marker || ']';
    const isChecked = getAttribute(tag, 'checked', ' ') === '';
    const marker = isChecked
      ? (custom.checked.marker || context.theme.input.checkbox.checked.marker || '✓')
      : (custom.unchecked.marker || context.theme.input.checkbox.unchecked.marker || ' ');

    const prefixColorFunction = custom.checkbox.prefix.color
      ? (text) => chalkString(custom.checkbox.prefix.color, { colors: true })(text)
      : context.theme.input.checkbox.prefix.color;

    const suffixColorFunction = custom.checkbox.suffix.color
      ? (text) => chalkString(custom.checkbox.suffix.color, { colors: true })(text)
      : context.theme.input.checkbox.suffix.color;

    const markerColorFunction = isChecked
      ? (custom.checked.color
        ? (text) => chalkString(custom.checked.color, { colors: true })(text)
        : context.theme.input.checkbox.checked.color)
      : (custom.unchecked.color
        ? (text) => chalkString(custom.unchecked.color, { colors: true })(text)
        : context.theme.input.checkbox.unchecked.color);

    let result = `${prefixColorFunction(prefixMarker)}${markerColorFunction(marker)}${suffixColorFunction(suffixMarker)}`;
    result = addRequiredIndicator(result, tag, custom, context.theme);

    return {
      pre: null,
      value: isDisabled ? chalkString(getDisabledColor(custom, context.theme.input), { colors: true })(result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  if (getAttribute(tag, 'type', 'text') === 'radio') {
    const isDisabled = getAttribute(tag, 'disabled', null) !== null;
    const prefixMarker = custom.radio.prefix.marker || context.theme.input.radio.prefix.marker || '(';
    const suffixMarker = custom.radio.suffix.marker || context.theme.input.radio.suffix.marker || ')';
    const isChecked = getAttribute(tag, 'checked', ' ') === '';
    const marker = isChecked
      ? (custom.radio.checked.marker || context.theme.input.radio.checked.marker || '•')
      : (custom.radio.unchecked.marker || context.theme.input.radio.unchecked.marker || ' ');

    const prefixColorFunction = custom.radio.prefix.color
      ? (text) => chalkString(custom.radio.prefix.color, { colors: true })(text)
      : context.theme.input.radio.prefix.color;

    const suffixColorFunction = custom.radio.suffix.color
      ? (text) => chalkString(custom.radio.suffix.color, { colors: true })(text)
      : context.theme.input.radio.suffix.color;

    const markerColorFunction = isChecked
      ? (custom.radio.checked.color
        ? (text) => chalkString(custom.radio.checked.color, { colors: true })(text)
        : context.theme.input.radio.checked.color)
      : (custom.radio.unchecked.color
        ? (text) => chalkString(custom.radio.unchecked.color, { colors: true })(text)
        : context.theme.input.radio.unchecked.color);

    let result = `${prefixColorFunction(prefixMarker)}${markerColorFunction(marker)}${suffixColorFunction(suffixMarker)}`;
    result = addRequiredIndicator(result, tag, custom, context.theme);

    return {
      pre: null,
      value: isDisabled ? chalkString(getDisabledColor(custom, context.theme.input), { colors: true })(result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  if (getAttribute(tag, 'type', 'text') === 'button') {
    const isDisabled = getAttribute(tag, 'disabled', null) !== null;
    const prefixMarker = custom.button?.prefix?.marker || context.theme.input.button?.prefix?.marker || '[ ';
    const suffixMarker = custom.button?.suffix?.marker || context.theme.input.button?.suffix?.marker || ' ]';
    const value = getAttribute(tag, 'value', '');

    const prefixColorFunction = custom.button?.prefix?.color
      ? (text) => chalkString(custom.button.prefix.color, { colors: true })(text)
      : context.theme.input.button?.prefix?.color;

    const suffixColorFunction = custom.button?.suffix?.color
      ? (text) => chalkString(custom.button.suffix.color, { colors: true })(text)
      : context.theme.input.button?.suffix?.color;

    const textColorFunction_ = custom.button?.color
      ? (text) => chalkString(custom.button.color, { colors: true })(text)
      : context.theme.input.button?.color;

    const result = `${prefixColorFunction(prefixMarker)}${textColorFunction_(value)}${suffixColorFunction(suffixMarker)}`;

    return {
      pre: null,
      value: isDisabled ? chalkString(getDisabledColor(custom, context.theme.input), { colors: true })(result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  if (getAttribute(tag, 'type', 'text') === 'hidden') {
    return null;
  }

  // Input type="range"
  if (getAttribute(tag, 'type', 'text') === 'range') {
    const isDisabled = getAttribute(tag, 'disabled', null) !== null;
    const value = Number.parseFloat(getAttribute(tag, 'value', '50'));
    const min = Number.parseFloat(getAttribute(tag, 'min', '0'));
    const max = Number.parseFloat(getAttribute(tag, 'max', '100'));

    // Calculate percentage (handle division by zero when min === max)
    const range = max - min;
    const percentage = range > 0 ? ((value - min) / range) * 100 : 0;
    const width = 20; // Total width of the slider
    const filledWidth = Math.round((percentage / 100) * width);

    // Get markers and colors from custom or theme
    const filledMarker = custom.range.filled || context.theme.input?.range?.filled?.marker || '█';
    const emptyMarker = custom.range.empty || context.theme.input?.range?.empty?.marker || '░';
    const thumbMarker = custom.range.thumb || context.theme.input?.range?.thumb?.marker || '●';

    const filledColorFunction = custom.range.filledColor
      ? (text) => chalkString(custom.range.filledColor, { colors: true })(text)
      : context.theme.input?.range?.filled?.color;

    const emptyColorFunction = custom.range.emptyColor
      ? (text) => chalkString(custom.range.emptyColor, { colors: true })(text)
      : context.theme.input?.range?.empty?.color;

    const thumbColorFunction = custom.range.thumbColor
      ? (text) => chalkString(custom.range.thumbColor, { colors: true })(text)
      : context.theme.input?.range?.thumb?.color;

    // Build slider
    const filled = filledMarker.repeat(Math.max(0, filledWidth - 1));
    const empty = emptyMarker.repeat(Math.max(0, width - filledWidth));

    const styledFilled = filledColorFunction ? filledColorFunction(filled) : filled;
    const styledThumb = thumbColorFunction ? thumbColorFunction(thumbMarker) : thumbMarker;
    const styledEmpty = emptyColorFunction ? emptyColorFunction(empty) : empty;

    const slider = `${styledFilled}${styledThumb}${styledEmpty}`;
    const valueDisplay = ` ${value}`;

    const result = `${slider}${valueDisplay}`;

    return {
      pre: null,
      value: isDisabled ? chalkString(getDisabledColor(custom, context.theme.input), { colors: true })(result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  // Input type="color"
  if (getAttribute(tag, 'type', 'text') === 'color') {
    const isDisabled = getAttribute(tag, 'disabled', null) !== null;
    const value = getAttribute(tag, 'value', '#000000');

    // Get configuration from custom attributes or theme
    const indicator = custom.colorInput.indicator || context.theme.input?.color?.indicator?.marker || '■';
    const prefixMarker = custom.colorInput.prefix.marker || context.theme.input?.color?.prefix?.marker || '(';
    const suffixMarker = custom.colorInput.suffix.marker || context.theme.input?.color?.suffix?.marker || ')';
    const showHex = custom.colorInput.hex.enabled !== 'false' && custom.colorInput.hex.enabled !== false;

    const prefixColorFunction = custom.colorInput.prefix.color
      ? (text) => chalkString(custom.colorInput.prefix.color, { colors: true })(text)
      : context.theme.input?.color?.prefix?.color;

    const suffixColorFunction = custom.colorInput.suffix.color
      ? (text) => chalkString(custom.colorInput.suffix.color, { colors: true })(text)
      : context.theme.input?.color?.suffix?.color;

    const valueColorFunction = custom.colorInput.value.color
      ? (text) => chalkString(custom.colorInput.value.color, { colors: true })(text)
      : context.theme.input?.color?.value?.color;

    // Color the indicator with the actual color value
    let coloredIndicator = indicator;
    try {
      // Use chalk.bgHex to create colored block
      coloredIndicator = chalk.bgHex(value)('  ');
    } catch {
      // If coloring fails, use default indicator
      coloredIndicator = indicator;
    }

    // Build the display
    let display = coloredIndicator;

    if (showHex) {
      const styledPrefix = prefixColorFunction ? prefixColorFunction(prefixMarker) : prefixMarker;
      const styledSuffix = suffixColorFunction ? suffixColorFunction(suffixMarker) : suffixMarker;
      const styledValue = valueColorFunction ? valueColorFunction(value) : value;

      display = `${coloredIndicator} ${styledPrefix}${styledValue}${styledSuffix}`;
    }

    return {
      pre: null,
      value: isDisabled ? chalkString('gray dim', { colors: true })(display) : display,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  // Input type="file"
  if (getAttribute(tag, 'type', 'text') === 'file') {
    const isDisabled = getAttribute(tag, 'disabled', null) !== null;
    const value = getAttribute(tag, 'value', '');
    const placeholder = custom.file?.placeholder || context.theme.input?.file?.placeholder || 'No file chosen';
    const filePrefixMarker = custom.file?.prefix?.marker || context.theme.input?.file?.prefix?.marker || '@';

    const filePrefixColorFunction = custom.file?.prefix?.color
      ? (text) => chalkString(custom.file.prefix.color, { colors: true })(text)
      : context.theme.input?.file?.prefix?.color;

    const fileTextColorFunction = custom.file?.color
      ? (text) => chalkString(custom.file.color, { colors: true })(text)
      : context.theme.input?.file?.color;

    const styledPrefix = filePrefixColorFunction ? filePrefixColorFunction(filePrefixMarker) : filePrefixMarker;
    const displayText = value || placeholder;
    const styledText = fileTextColorFunction ? fileTextColorFunction(displayText) : displayText;

    const result = `${styledPrefix} ${styledText}`;

    return {
      pre: null,
      value: isDisabled ? chalkString(getDisabledColor(custom, context.theme.input), { colors: true })(result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  // Input type="password" - show fixed number of asterisks
  if (getAttribute(tag, 'type', 'text') === 'password') {
    const isDisabled = getAttribute(tag, 'disabled', null) !== null;
    const passwordChar = custom.password.char || context.theme.input?.password?.char || '•';
    const passwordCount = Number(custom.password.count || context.theme.input?.password?.count || 5);

    const passwordColorFunction = custom.password.color
      ? (text) => chalkString(custom.password.color, { colors: true })(text)
      : context.theme.input?.password?.color;

    // Display fixed number of characters regardless of actual value
    const maskedValue = passwordChar.repeat(passwordCount);
    const styledValue = passwordColorFunction ? passwordColorFunction(maskedValue) : maskedValue;

    return {
      pre: null,
      value: isDisabled ? chalkString('gray dim', { colors: true })(styledValue) : styledValue,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  // Input type="email" - show with @ indicator
  if (getAttribute(tag, 'type', 'text') === 'email') {
    const isDisabled = getAttribute(tag, 'disabled', null) !== null;
    const value = getAttribute(tag, 'value', '');
    const placeholder = getAttribute(tag, 'placeholder', '');
    const emailPrefixMarker = custom.email.prefix.marker || context.theme.input?.email?.prefix?.marker || '@ ';

    const emailPrefixColorFunction = custom.email.prefix.color
      ? (text) => chalkString(custom.email.prefix.color, { colors: true })(text)
      : context.theme.input?.email?.prefix?.color;

    const emailColorFunction = custom.email.color
      ? (text) => chalkString(custom.email.color, { colors: true })(text)
      : context.theme.input?.email?.color;

    const styledPrefix = emailPrefixColorFunction ? emailPrefixColorFunction(emailPrefixMarker) : emailPrefixMarker;
    const displayText = value || placeholder;
    const styledText = emailColorFunction ? emailColorFunction(displayText) : displayText;

    let result = `${styledPrefix}${styledText}`;
    result = addRequiredIndicator(result, tag, custom, context.theme);

    return {
      pre: null,
      value: isDisabled ? chalkString('gray dim', { colors: true })(result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  // Input type="date" - show with calendar indicator
  if (getAttribute(tag, 'type', 'text') === 'date') {
    const isDisabled = getAttribute(tag, 'disabled', null) !== null;
    const value = getAttribute(tag, 'value', '');
    const datePrefixMarker = custom.date.prefix.marker || context.theme.input?.date?.prefix?.marker || '# ';

    const datePrefixColorFunction = custom.date.prefix.color
      ? (text) => chalkString(custom.date.prefix.color, { colors: true })(text)
      : context.theme.input?.date?.prefix?.color;

    const dateColorFunction = custom.date.color
      ? (text) => chalkString(custom.date.color, { colors: true })(text)
      : context.theme.input?.date?.color;

    const styledPrefix = datePrefixColorFunction ? datePrefixColorFunction(datePrefixMarker) : datePrefixMarker;
    const styledValue = dateColorFunction ? dateColorFunction(value) : value;

    let result = `${styledPrefix}${styledValue}`;
    result = addRequiredIndicator(result, tag, custom, context.theme);

    return {
      pre: null,
      value: isDisabled ? chalkString('gray dim', { colors: true })(result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  // Text inputs (text, search, url, tel, number, etc.)
  const isDisabled = getAttribute(tag, 'disabled', null) !== null;
  const value = getAttribute(tag, 'value', '');
  const placeholder = getAttribute(tag, 'placeholder', '');
  const showPlaceholder = custom.showPlaceholder || getAttribute(tag, 'data-cli-show-placeholder', 'false');

  // Get custom or theme colors
  const textColorFunction = custom.textInput.color
    ? (text) => chalkString(custom.textInput.color, { colors: true })(text)
    : context.theme.input?.textInput?.color;

  const placeholderColor = custom.placeholderColor
    || getAttribute(tag, 'data-cli-placeholder-color')
    || 'gray dim';

  // Determine what to display
  let displayValue = value;
  if (!value && placeholder && (showPlaceholder === 'true' || showPlaceholder === true)) {
    displayValue = chalkString(placeholderColor, { colors: true })(placeholder);
  } else if (value) {
    displayValue = textColorFunction ? textColorFunction(value) : value;
  }

  // Add required marker using our unified function
  let result = displayValue;
  result = addRequiredIndicator(result, tag, custom, context.theme);

  return {
    pre: null,
    value: isDisabled ? chalkString('gray dim', { colors: true })(result) : result,
    post: null,
    type: 'inline',
    nodeName: tag.nodeName,
  };
};

export const output = inlineTag();

export const textarea = (tag, context) => {
  const custom = getCustomAttributes(tag);
  const isDisabled = getAttribute(tag, 'disabled', null) !== null;
  const value = tag.childNodes && tag.childNodes[0] && tag.childNodes[0].value
    ? tag.childNodes[0].value
    : '';

  // Check for custom color first, then fallback to textarea theme, then code theme
  const textColorFunction = custom.textarea.color
    ? (text) => chalkString(custom.textarea.color, { colors: true })(text)
    : (context.theme.input?.textarea?.color || context.theme.code?.inline?.color);

  const result = textColorFunction ? textColorFunction(value) : value;

  return {
    type: 'inline',
    value: isDisabled ? chalkString(getDisabledColor(custom, context.theme.input), { colors: true })(result) : result,
  };
};
