import chalk from 'chalk';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';
import { isDisabled, getDisabledColor } from '../core/disabled.js';

/**
 * Add required field indicator to input value
 * @param {string} value - Input value
 * @param {object} tag - HTML tag
 * @param {object} theme - Theme configuration
 * @returns {string} - Value with required indicator
 */
const addRequiredIndicator = (value, tag, theme) => {
  const isRequired = getAttribute(tag, 'required', null) !== null;
  if (!isRequired) return value;

  const requiredConfig = theme.input?.required;
  const enabledRaw = getAttr(tag, 'required.enabled');
  const isEnabled = enabledRaw !== null ? enabledRaw === 'true' : requiredConfig?.enabled !== false;
  if (!isEnabled) return value;

  const marker = getAttr(tag, 'required.marker') ?? requiredConfig?.indicator?.marker;
  const markerColor = getAttr(tag, 'required.color') ?? requiredConfig?.indicator?.color;
  const styledMarker = applyColor(markerColor, marker);
  const position = getAttr(tag, 'required.position') ?? requiredConfig?.indicator?.position;

  return position === 'before' ? `${styledMarker} ${value}` : `${value} ${styledMarker}`;
};

export const button = (tag, context) => {
  const theme = context.theme.button || {};
  const disabled = isDisabled(tag);

  return inlineTag(
    (value) => {
      const prefixMarker = getAttr(tag, 'prefix.marker') ?? theme.prefix?.marker;
      const suffixMarker = getAttr(tag, 'suffix.marker') ?? theme.suffix?.marker;
      const styledPrefix = applyThemeColor(getAttr(tag, 'prefix.color'), theme.prefix?.color, prefixMarker);
      const styledSuffix = applyThemeColor(getAttr(tag, 'suffix.color'), theme.suffix?.color, suffixMarker);
      const styledText = applyThemeColor(getAttr(tag, 'color'), theme.color, value);
      const result = `${styledPrefix}${styledText}${styledSuffix}`;
      return disabled ? applyColor(getDisabledColor(tag, theme), result) : result;
    },
  )(tag, context);
};

export const input = (tag, context) => {
  if (getAttribute(tag, 'type', 'text') === 'checkbox') {
    const disabled = isDisabled(tag);
    const prefixMarker = getAttr(tag, 'checkbox.prefix.marker') ?? context.theme.input?.checkbox?.prefix?.marker;
    const suffixMarker = getAttr(tag, 'checkbox.suffix.marker') ?? context.theme.input?.checkbox?.suffix?.marker;
    const isChecked = getAttribute(tag, 'checked', ' ') === '';
    const marker = isChecked
      ? (getAttr(tag, 'checked.marker') ?? context.theme.input?.checkbox?.checked?.marker)
      : (getAttr(tag, 'unchecked.marker') ?? context.theme.input?.checkbox?.unchecked?.marker);

    const styledPrefix = applyThemeColor(getAttr(tag, 'checkbox.prefix.color'), context.theme.input?.checkbox?.prefix?.color, prefixMarker);
    const styledSuffix = applyThemeColor(getAttr(tag, 'checkbox.suffix.color'), context.theme.input?.checkbox?.suffix?.color, suffixMarker);
    const markerColor = isChecked
      ? (getAttr(tag, 'checked.color') ?? context.theme.input?.checkbox?.checked?.color)
      : (getAttr(tag, 'unchecked.color') ?? context.theme.input?.checkbox?.unchecked?.color);
    const styledMarker = applyColor(markerColor, marker);

    let result = `${styledPrefix}${styledMarker}${styledSuffix}`;
    result = addRequiredIndicator(result, tag, context.theme);

    return {
      pre: null,
      value: disabled ? applyColor(getDisabledColor(tag, context.theme.input), result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  if (getAttribute(tag, 'type', 'text') === 'radio') {
    const disabled = isDisabled(tag);
    const prefixMarker = getAttr(tag, 'radio.prefix.marker') ?? context.theme.input?.radio?.prefix?.marker;
    const suffixMarker = getAttr(tag, 'radio.suffix.marker') ?? context.theme.input?.radio?.suffix?.marker;
    const isChecked = getAttribute(tag, 'checked', ' ') === '';
    const marker = isChecked
      ? (getAttr(tag, 'radio.checked.marker') ?? context.theme.input?.radio?.checked?.marker)
      : (getAttr(tag, 'radio.unchecked.marker') ?? context.theme.input?.radio?.unchecked?.marker);

    const styledPrefix = applyThemeColor(getAttr(tag, 'radio.prefix.color'), context.theme.input?.radio?.prefix?.color, prefixMarker);
    const styledSuffix = applyThemeColor(getAttr(tag, 'radio.suffix.color'), context.theme.input?.radio?.suffix?.color, suffixMarker);
    const markerColor = isChecked
      ? (getAttr(tag, 'radio.checked.color') ?? context.theme.input?.radio?.checked?.color)
      : (getAttr(tag, 'radio.unchecked.color') ?? context.theme.input?.radio?.unchecked?.color);
    const styledMarker = applyColor(markerColor, marker);

    let result = `${styledPrefix}${styledMarker}${styledSuffix}`;
    result = addRequiredIndicator(result, tag, context.theme);

    return {
      pre: null,
      value: disabled ? applyColor(getDisabledColor(tag, context.theme.input), result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  if (getAttribute(tag, 'type', 'text') === 'button') {
    const disabled = isDisabled(tag);
    const prefixMarker = getAttr(tag, 'button.prefix.marker') ?? context.theme.input?.button?.prefix?.marker;
    const suffixMarker = getAttr(tag, 'button.suffix.marker') ?? context.theme.input?.button?.suffix?.marker;
    const value = getAttribute(tag, 'value', '');

    const styledPrefix = applyThemeColor(getAttr(tag, 'button.prefix.color'), context.theme.input?.button?.prefix?.color, prefixMarker);
    const styledSuffix = applyThemeColor(getAttr(tag, 'button.suffix.color'), context.theme.input?.button?.suffix?.color, suffixMarker);
    const styledText = applyThemeColor(getAttr(tag, 'button.color'), context.theme.input?.button?.color, value);

    const result = `${styledPrefix}${styledText}${styledSuffix}`;

    return {
      pre: null,
      value: disabled ? applyColor(getDisabledColor(tag, context.theme.input), result) : result,
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
    const disabled = isDisabled(tag);
    const value = Number.parseFloat(getAttribute(tag, 'value', '50'));
    const min = Number.parseFloat(getAttribute(tag, 'min', '0'));
    const max = Number.parseFloat(getAttribute(tag, 'max', '100'));

    // Calculate percentage (handle division by zero when min === max)
    const range = max - min;
    const percentage = range > 0 ? ((value - min) / range) * 100 : 0;
    const width = 20; // Total width of the slider
    const filledWidth = Math.round((percentage / 100) * width);

    // Get markers and colors from custom attributes or theme
    const filledMarker = getAttr(tag, 'range.filled') ?? context.theme.input?.range?.filled?.marker;
    const emptyMarker = getAttr(tag, 'range.empty') ?? context.theme.input?.range?.empty?.marker;
    const thumbMarker = getAttr(tag, 'range.thumb') ?? context.theme.input?.range?.thumb?.marker;

    const filledColor = getAttr(tag, 'range.filled-color') ?? context.theme.input?.range?.filled?.color;
    const emptyColor = getAttr(tag, 'range.empty-color') ?? context.theme.input?.range?.empty?.color;
    const thumbColor = getAttr(tag, 'range.thumb-color') ?? context.theme.input?.range?.thumb?.color;

    // Build slider
    const filled = filledMarker.repeat(Math.max(0, filledWidth - 1));
    const empty = emptyMarker.repeat(Math.max(0, width - filledWidth));

    const styledFilled = applyColor(filledColor, filled);
    const styledThumb = applyColor(thumbColor, thumbMarker);
    const styledEmpty = applyColor(emptyColor, empty);

    const slider = `${styledFilled}${styledThumb}${styledEmpty}`;
    const valueDisplay = ` ${value}`;
    const result = `${slider}${valueDisplay}`;

    return {
      pre: null,
      value: disabled ? applyColor(getDisabledColor(tag, context.theme.input), result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  // Input type="color"
  if (getAttribute(tag, 'type', 'text') === 'color') {
    const disabled = isDisabled(tag);
    const value = getAttribute(tag, 'value', '#000000');

    // Get configuration from custom attributes or theme
    const indicator = getAttr(tag, 'color.indicator') ?? context.theme.input?.color?.indicator?.marker;
    const prefixMarker = getAttr(tag, 'color.prefix.marker') ?? context.theme.input?.color?.prefix?.marker;
    const suffixMarker = getAttr(tag, 'color.suffix.marker') ?? context.theme.input?.color?.suffix?.marker;
    const hexEnabledRaw = getAttr(tag, 'hex.enabled');
    const showHex = hexEnabledRaw !== null ? hexEnabledRaw === 'true' : true;

    const prefixColor = getAttr(tag, 'color.prefix.color') ?? context.theme.input?.color?.prefix?.color;
    const suffixColor = getAttr(tag, 'color.suffix.color') ?? context.theme.input?.color?.suffix?.color;
    const valueColor = getAttr(tag, 'color.value.color') ?? context.theme.input?.color?.value?.color;

    // Color the indicator with the actual color value
    let coloredIndicator = indicator;
    try {
      coloredIndicator = chalk.bgHex(value)('  ');
    } catch {
      coloredIndicator = indicator;
    }

    // Build the display
    let display = coloredIndicator;

    if (showHex) {
      const styledPrefix = applyColor(prefixColor, prefixMarker);
      const styledSuffix = applyColor(suffixColor, suffixMarker);
      const styledValue = applyColor(valueColor, value);

      display = `${coloredIndicator} ${styledPrefix}${styledValue}${styledSuffix}`;
    }

    return {
      pre: null,
      value: disabled ? applyColor(getDisabledColor(tag, context.theme.input), display) : display,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  // Input type="file"
  if (getAttribute(tag, 'type', 'text') === 'file') {
    const disabled = isDisabled(tag);
    const value = getAttribute(tag, 'value', '');
    const placeholder = getAttr(tag, 'file.placeholder') ?? context.theme.input?.file?.placeholder;
    const filePrefixMarker = getAttr(tag, 'file.prefix.marker') ?? context.theme.input?.file?.prefix?.marker;

    const filePrefixColor = getAttr(tag, 'file.prefix.color') ?? context.theme.input?.file?.prefix?.color;
    const fileTextColor = getAttr(tag, 'file.color') ?? context.theme.input?.file?.color;

    const styledPrefix = applyColor(filePrefixColor, filePrefixMarker);
    const displayText = value || placeholder;
    const styledText = applyColor(fileTextColor, displayText);

    const result = `${styledPrefix} ${styledText}`;

    return {
      pre: null,
      value: disabled ? applyColor(getDisabledColor(tag, context.theme.input), result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  // Input type="password" - show fixed number of asterisks
  if (getAttribute(tag, 'type', 'text') === 'password') {
    const disabled = isDisabled(tag);
    const passwordChar = getAttr(tag, 'password.char') ?? context.theme.input?.password?.char;
    const passwordCount = Number(getAttr(tag, 'password.count') ?? context.theme.input?.password?.count);
    const passwordColor = getAttr(tag, 'password.color') ?? context.theme.input?.password?.color;

    // Display fixed number of characters regardless of actual value
    const maskedValue = passwordChar.repeat(passwordCount);
    const styledValue = applyColor(passwordColor, maskedValue);

    return {
      pre: null,
      value: disabled ? applyColor(getDisabledColor(tag, context.theme.input), styledValue) : styledValue,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  // Input type="email" - show with @ indicator
  if (getAttribute(tag, 'type', 'text') === 'email') {
    const disabled = isDisabled(tag);
    const value = getAttribute(tag, 'value', '');
    const placeholder = getAttribute(tag, 'placeholder', '');
    const emailPrefixMarker = getAttr(tag, 'email.prefix.marker') ?? context.theme.input?.email?.prefix?.marker;

    const emailPrefixColor = getAttr(tag, 'email.prefix.color') ?? context.theme.input?.email?.prefix?.color;
    const emailColor = getAttr(tag, 'email.color') ?? context.theme.input?.email?.color;

    const styledPrefix = applyColor(emailPrefixColor, emailPrefixMarker);
    const displayText = value || placeholder;
    const styledText = applyColor(emailColor, displayText);

    let result = `${styledPrefix}${styledText}`;
    result = addRequiredIndicator(result, tag, context.theme);

    return {
      pre: null,
      value: disabled ? applyColor(getDisabledColor(tag, context.theme.input), result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  // Input type="date" - show with calendar indicator
  if (getAttribute(tag, 'type', 'text') === 'date') {
    const disabled = isDisabled(tag);
    const value = getAttribute(tag, 'value', '');
    const datePrefixMarker = getAttr(tag, 'date.prefix.marker') ?? context.theme.input?.date?.prefix?.marker;

    const datePrefixColor = getAttr(tag, 'date.prefix.color') ?? context.theme.input?.date?.prefix?.color;
    const dateColor = getAttr(tag, 'date.color') ?? context.theme.input?.date?.color;

    const styledPrefix = applyColor(datePrefixColor, datePrefixMarker);
    const styledValue = applyColor(dateColor, value);

    let result = `${styledPrefix}${styledValue}`;
    result = addRequiredIndicator(result, tag, context.theme);

    return {
      pre: null,
      value: disabled ? applyColor(getDisabledColor(tag, context.theme.input), result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  // Text inputs (text, search, url, tel, number, etc.)
  const disabled = isDisabled(tag);
  const value = getAttribute(tag, 'value', '');
  const placeholder = getAttribute(tag, 'placeholder', '');
  const showPlaceholder = getAttr(tag, 'show-placeholder');

  const textColor = getAttr(tag, 'text-input.color') ?? context.theme.input?.textInput?.color;
  const placeholderColor = getAttr(tag, 'placeholder-color'); // data-cli only, no theme config

  // Determine what to display
  let displayValue = value;
  if (!value && placeholder && showPlaceholder === 'true') {
    displayValue = applyColor(placeholderColor, placeholder);
  } else if (value) {
    displayValue = applyColor(textColor, value);
  }

  let result = displayValue;
  result = addRequiredIndicator(result, tag, context.theme);

  return {
    pre: null,
    value: disabled ? applyColor(getDisabledColor(tag, context.theme.input), result) : result,
    post: null,
    type: 'inline',
    nodeName: tag.nodeName,
  };
};

export const output = inlineTag();

export const textarea = (tag, context) => {
  const disabled = isDisabled(tag);
  const value = tag.childNodes && tag.childNodes[0] && tag.childNodes[0].value
    ? tag.childNodes[0].value
    : '';

  const textColor = getAttr(tag, 'color') ?? context.theme.input?.textarea?.color;
  const result = applyColor(textColor, value);

  return {
    type: 'inline',
    value: disabled ? applyColor(getDisabledColor(tag, context.theme.input), result) : result,
  };
};
