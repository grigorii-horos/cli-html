import chalkString from 'chalk-string';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getCustomAttributes, getDisabledColor } from '../utilities.js';

export const button = (tag, context) => {
  const custom = getCustomAttributes(tag);
  const isDisabled = getAttribute(tag, 'disabled', null) !== null;

  return inlineTag(
    (value) => {
      const openMarker = custom.buttonOpenMarker || context.theme.input.button.open.marker || '[ ';
      const closeMarker = custom.buttonCloseMarker || context.theme.input.button.close.marker || ' ]';

      const openColorFn = custom.buttonOpenColor
        ? (text) => chalkString(custom.buttonOpenColor, { colors: true })(text)
        : context.theme.input.button.open.color;

      const closeColorFn = custom.buttonCloseColor
        ? (text) => chalkString(custom.buttonCloseColor, { colors: true })(text)
        : context.theme.input.button.close.color;

      const textColorFn = custom.buttonTextColor
        ? (text) => chalkString(custom.buttonTextColor, { colors: true })(text)
        : context.theme.input.button.text.color;

      const result = `${openColorFn(openMarker)}${textColorFn(value)}${closeColorFn(closeMarker)}`;
      return isDisabled ? chalkString(getDisabledColor(custom), { colors: true })(result) : result;
    },
  )(tag, context);
};

export const input = (tag, context) => {
  const custom = getCustomAttributes(tag);

  if (getAttribute(tag, 'type', 'text') === 'checkbox') {
    const isDisabled = getAttribute(tag, 'disabled', null) !== null;
    const openMarker = custom.checkboxOpenMarker || context.theme.input.checkbox.open.marker || '[';
    const closeMarker = custom.checkboxCloseMarker || context.theme.input.checkbox.close.marker || ']';
    const isChecked = getAttribute(tag, 'checked', ' ') === '';
    const marker = isChecked
      ? (custom.checkedMarker || context.theme.input.checkbox.checked.marker || '✓')
      : (custom.uncheckedMarker || context.theme.input.checkbox.unchecked.marker || ' ');

    const openColorFn = custom.checkboxOpenColor
      ? (text) => chalkString(custom.checkboxOpenColor, { colors: true })(text)
      : context.theme.input.checkbox.open.color;

    const closeColorFn = custom.checkboxCloseColor
      ? (text) => chalkString(custom.checkboxCloseColor, { colors: true })(text)
      : context.theme.input.checkbox.close.color;

    const markerColorFn = isChecked
      ? (custom.checkedColor
        ? (text) => chalkString(custom.checkedColor, { colors: true })(text)
        : context.theme.input.checkbox.checked.color)
      : (custom.uncheckedColor
        ? (text) => chalkString(custom.uncheckedColor, { colors: true })(text)
        : context.theme.input.checkbox.unchecked.color);

    const result = `${openColorFn(openMarker)}${markerColorFn(marker)}${closeColorFn(closeMarker)}`;

    return {
      pre: null,
      value: isDisabled ? chalkString(getDisabledColor(custom), { colors: true })(result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  if (getAttribute(tag, 'type', 'text') === 'radio') {
    const isDisabled = getAttribute(tag, 'disabled', null) !== null;
    const openMarker = custom.radioOpenMarker || context.theme.input.radio.open.marker || '(';
    const closeMarker = custom.radioCloseMarker || context.theme.input.radio.close.marker || ')';
    const isChecked = getAttribute(tag, 'checked', ' ') === '';
    const marker = isChecked
      ? (custom.radioCheckedMarker || context.theme.input.radio.checked.marker || '•')
      : (custom.radioUncheckedMarker || context.theme.input.radio.unchecked.marker || ' ');

    const openColorFn = custom.radioOpenColor
      ? (text) => chalkString(custom.radioOpenColor, { colors: true })(text)
      : context.theme.input.radio.open.color;

    const closeColorFn = custom.radioCloseColor
      ? (text) => chalkString(custom.radioCloseColor, { colors: true })(text)
      : context.theme.input.radio.close.color;

    const markerColorFn = isChecked
      ? (custom.radioCheckedColor
        ? (text) => chalkString(custom.radioCheckedColor, { colors: true })(text)
        : context.theme.input.radio.checked.color)
      : (custom.radioUncheckedColor
        ? (text) => chalkString(custom.radioUncheckedColor, { colors: true })(text)
        : context.theme.input.radio.unchecked.color);

    const result = `${openColorFn(openMarker)}${markerColorFn(marker)}${closeColorFn(closeMarker)}`;

    return {
      pre: null,
      value: isDisabled ? chalkString(getDisabledColor(custom), { colors: true })(result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  if (getAttribute(tag, 'type', 'text') === 'button') {
    const isDisabled = getAttribute(tag, 'disabled', null) !== null;
    const openMarker = custom.buttonOpenMarker || context.theme.input.button.open.marker || '[ ';
    const closeMarker = custom.buttonCloseMarker || context.theme.input.button.close.marker || ' ]';
    const value = getAttribute(tag, 'value', '');

    const openColorFn = custom.buttonOpenColor
      ? (text) => chalkString(custom.buttonOpenColor, { colors: true })(text)
      : context.theme.input.button.open.color;

    const closeColorFn = custom.buttonCloseColor
      ? (text) => chalkString(custom.buttonCloseColor, { colors: true })(text)
      : context.theme.input.button.close.color;

    const textColorFn = custom.buttonTextColor
      ? (text) => chalkString(custom.buttonTextColor, { colors: true })(text)
      : context.theme.input.button.text.color;

    const result = `${openColorFn(openMarker)}${textColorFn(value)}${closeColorFn(closeMarker)}`;

    return {
      pre: null,
      value: isDisabled ? chalkString(getDisabledColor(custom), { colors: true })(result) : result,
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
    const value = parseFloat(getAttribute(tag, 'value', '50'));
    const min = parseFloat(getAttribute(tag, 'min', '0'));
    const max = parseFloat(getAttribute(tag, 'max', '100'));
    const step = parseFloat(getAttribute(tag, 'step', '1'));

    // Calculate percentage
    const percentage = ((value - min) / (max - min)) * 100;
    const width = 20; // Total width of the slider
    const filledWidth = Math.round((percentage / 100) * width);

    // Get markers and colors from custom or theme
    const filledMarker = custom.rangeFilled || context.theme.input?.range?.filled?.marker || '█';
    const emptyMarker = custom.rangeEmpty || context.theme.input?.range?.empty?.marker || '░';
    const thumbMarker = custom.rangeThumb || context.theme.input?.range?.thumb?.marker || '●';

    const filledColorFn = custom.rangeFilledColor
      ? (text) => chalkString(custom.rangeFilledColor, { colors: true })(text)
      : context.theme.input?.range?.filled?.color;

    const emptyColorFn = custom.rangeEmptyColor
      ? (text) => chalkString(custom.rangeEmptyColor, { colors: true })(text)
      : context.theme.input?.range?.empty?.color;

    const thumbColorFn = custom.rangeThumbColor
      ? (text) => chalkString(custom.rangeThumbColor, { colors: true })(text)
      : context.theme.input?.range?.thumb?.color;

    // Build slider
    const filled = filledMarker.repeat(Math.max(0, filledWidth - 1));
    const empty = emptyMarker.repeat(Math.max(0, width - filledWidth));

    const styledFilled = filledColorFn ? filledColorFn(filled) : filled;
    const styledThumb = thumbColorFn ? thumbColorFn(thumbMarker) : thumbMarker;
    const styledEmpty = emptyColorFn ? emptyColorFn(empty) : empty;

    const slider = `${styledFilled}${styledThumb}${styledEmpty}`;
    const valueDisplay = ` ${value}`;

    const result = `${slider}${valueDisplay}`;

    return {
      pre: null,
      value: isDisabled ? chalkString(getDisabledColor(custom), { colors: true })(result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  // Input type="color"
  if (getAttribute(tag, 'type', 'text') === 'color') {
    const isDisabled = getAttribute(tag, 'disabled', null) !== null;
    const value = getAttribute(tag, 'value', '#000000');
    const showHex = custom.showHex === 'true' || custom.showHex === true;

    const colorPrefix = custom.colorPrefix || context.theme.input?.color?.prefix || '⬤';

    // For now, just show the prefix without trying to color it
    // (chalk-string hex support is complex)
    const display = showHex ? `${colorPrefix} ${value}` : colorPrefix;

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
    const placeholder = custom.filePlaceholder || context.theme.input?.file?.placeholder || 'No file chosen';
    const filePrefix = custom.filePrefix || context.theme.input?.file?.prefix || '📎';

    const filePrefixColorFn = custom.filePrefixColor
      ? (text) => chalkString(custom.filePrefixColor, { colors: true })(text)
      : context.theme.input?.file?.prefixColor;

    const fileTextColorFn = custom.fileTextColor
      ? (text) => chalkString(custom.fileTextColor, { colors: true })(text)
      : context.theme.input?.file?.textColor;

    const styledPrefix = filePrefixColorFn ? filePrefixColorFn(filePrefix) : filePrefix;
    const displayText = value || placeholder;
    const styledText = fileTextColorFn ? fileTextColorFn(displayText) : displayText;

    const result = `${styledPrefix} ${styledText}`;

    return {
      pre: null,
      value: isDisabled ? chalkString(getDisabledColor(custom), { colors: true })(result) : result,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  // Text inputs (text, email, password, search, url, tel, number, date, etc.)
  const isDisabled = getAttribute(tag, 'disabled', null) !== null;
  const value = getAttribute(tag, 'value', '');
  const placeholder = getAttribute(tag, 'placeholder', '');
  const isRequired = getAttribute(tag, 'required', null) !== null;
  const showPlaceholder = custom.showPlaceholder || getAttribute(tag, 'data-cli-show-placeholder', 'false');

  // Get custom or theme colors
  const textColorFn = custom.textInputColor
    ? (text) => chalkString(custom.textInputColor, { colors: true })(text)
    : context.theme.input?.textInput?.color;

  const placeholderColor = custom.placeholderColor
    || getAttribute(tag, 'data-cli-placeholder-color')
    || 'gray dim';

  const requiredMarker = custom.requiredMarker
    || getAttribute(tag, 'data-cli-required-marker')
    || '*';

  const requiredColor = custom.requiredColor
    || getAttribute(tag, 'data-cli-required-color')
    || 'red';

  // Determine what to display
  let displayValue = value;
  if (!value && placeholder && (showPlaceholder === 'true' || showPlaceholder === true)) {
    displayValue = chalkString(placeholderColor, { colors: true })(placeholder);
  } else if (value) {
    displayValue = textColorFn ? textColorFn(value) : value;
  }

  // Add required marker if needed
  let result = displayValue;
  if (isRequired) {
    const styledMarker = chalkString(requiredColor, { colors: true })(requiredMarker);
    result = `${displayValue} ${styledMarker}`;
  }

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
  const textColorFn = custom.textareaColor
    ? (text) => chalkString(custom.textareaColor, { colors: true })(text)
    : (context.theme.input?.textarea?.color || context.theme.code?.inline?.color);

  const result = textColorFn ? textColorFn(value) : value;

  return {
    type: 'inline',
    value: isDisabled ? chalkString(getDisabledColor(custom), { colors: true })(result) : result,
  };
};
