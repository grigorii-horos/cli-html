import chalkString from 'chalk-string';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getCustomAttributes } from '../utilities.js';

/**
 * Data element - represents machine-readable data with human-readable content
 * @param {object} tag - HTML tag
 * @param {object} context - Rendering context
 * @returns {object} - Rendered data element
 */
export const data = (tag, context) => {
  const custom = getCustomAttributes(tag);

  return inlineTag((value) => {
    // Get data-value attribute
    const dataValue = getAttribute(tag, 'value', null);

    // Apply text color
    const textColorFunction = custom.color
      ? (text) => chalkString(custom.color, { colors: true })(text)
      : context.theme.data?.color;

    const styledValue = textColorFunction ? textColorFunction(value) : value;

    // Check if value display is enabled
    const valueConfig = context.theme.data?.value;
    const showValue = custom.data?.value?.enabled === undefined
      ? (valueConfig?.enabled === true)
      : (custom.data.value.enabled === 'true' || custom.data.value.enabled === true);

    // If no data-value or not showing it, just return styled text
    if (!dataValue || !showValue) {
      return styledValue;
    }

    // Get value display configuration
    const valueText = dataValue;
    const valueColorFunction = custom.data?.value?.color
      ? (text) => chalkString(custom.data.value.color, { colors: true })(text)
      : (valueConfig?.color
          ? (typeof valueConfig.color === 'function'
              ? valueConfig.color
              : (text) => chalkString(valueConfig.color, { colors: true })(text))
          : (text) => text);

    const prefixMarker = custom.data?.value?.prefix?.marker || valueConfig?.prefix?.marker || ' [';
    const suffixMarker = custom.data?.value?.suffix?.marker || valueConfig?.suffix?.marker || ']';

    const prefixColorFunction = custom.data?.value?.prefix?.color
      ? (text) => chalkString(custom.data.value.prefix.color, { colors: true })(text)
      : (valueConfig?.prefix?.color
          ? (typeof valueConfig.prefix.color === 'function'
              ? valueConfig.prefix.color
              : (text) => chalkString(valueConfig.prefix.color, { colors: true })(text))
          : (text) => text);

    const suffixColorFunction = custom.data?.value?.suffix?.color
      ? (text) => chalkString(custom.data.value.suffix.color, { colors: true })(text)
      : (valueConfig?.suffix?.color
          ? (typeof valueConfig.suffix.color === 'function'
              ? valueConfig.suffix.color
              : (text) => chalkString(valueConfig.suffix.color, { colors: true })(text))
          : (text) => text);

    const styledPrefix = prefixColorFunction(prefixMarker);
    const styledValueText = valueColorFunction(valueText);
    const styledSuffix = suffixColorFunction(suffixMarker);

    return styledValue + styledPrefix + styledValueText + styledSuffix;
  })(tag, context);
};
