import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utilities.js';

export const button = (tag, context) => inlineTag(
  (value) => {
    const openMarker = context.theme.input.button.open.marker || '[ ';
    const closeMarker = context.theme.input.button.close.marker || ' ]';
    return `${context.theme.input.button.open.color(openMarker)}${context.theme.input.button.text.color(value)}${context.theme.input.button.close.color(closeMarker)}`;
  },
)(tag, context);

export const input = (tag, context) => {
  if (getAttribute(tag, 'type', 'text') === 'checkbox') {
    const openMarker = context.theme.input.checkbox.open.marker || '[';
    const closeMarker = context.theme.input.checkbox.close.marker || ']';
    const isChecked = getAttribute(tag, 'checked', ' ') === '';
    const marker = isChecked
      ? (context.theme.input.checkbox.checked.marker || '✓')
      : (context.theme.input.checkbox.unchecked.marker || ' ');
    const markerColor = isChecked
      ? context.theme.input.checkbox.checked.color
      : context.theme.input.checkbox.unchecked.color;

    return {
      pre: null,
      value: `${context.theme.input.checkbox.open.color(openMarker)}${markerColor(marker)}${context.theme.input.checkbox.close.color(closeMarker)}`,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  if (getAttribute(tag, 'type', 'text') === 'radio') {
    const openMarker = context.theme.input.radio.open.marker || '(';
    const closeMarker = context.theme.input.radio.close.marker || ')';
    const isChecked = getAttribute(tag, 'checked', ' ') === '';
    const marker = isChecked
      ? (context.theme.input.radio.checked.marker || '•')
      : (context.theme.input.radio.unchecked.marker || ' ');
    const markerColor = isChecked
      ? context.theme.input.radio.checked.color
      : context.theme.input.radio.unchecked.color;

    return {
      pre: null,
      value: `${context.theme.input.radio.open.color(openMarker)}${markerColor(marker)}${context.theme.input.radio.close.color(closeMarker)}`,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  if (getAttribute(tag, 'type', 'text') === 'button') {
    const openMarker = context.theme.input.button.open.marker || '[ ';
    const closeMarker = context.theme.input.button.close.marker || ' ]';
    const value = getAttribute(tag, 'value', '');
    return {
      pre: null,
      value: `${context.theme.input.button.open.color(openMarker)}${context.theme.input.button.text.color(value)}${context.theme.input.button.close.color(closeMarker)}`,
      post: null,
      type: 'inline',
      nodeName: tag.nodeName,
    };
  }

  if (getAttribute(tag, 'type', 'text') === 'hidden') {
    return null;
  }

  return {
    pre: null,
    value: getAttribute(tag, 'value', ''),
    post: null,
    type: 'inline',
    nodeName: tag.nodeName,
  };
};

export const output = inlineTag();

export const textarea = (tag, context) => {
  const value = tag.childNodes && tag.childNodes[0] && tag.childNodes[0].value
    ? tag.childNodes[0].value
    : '';

  return {
    type: 'inline',
    value: context.theme.code?.inline?.color
      ? context.theme.code.inline.color(value)
      : value,
  };
};
