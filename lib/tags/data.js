import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';

/**
 * Data element - represents machine-readable data with human-readable content
 * @param {object} tag - HTML tag
 * @param {object} context - Rendering context
 * @returns {object} - Rendered data element
 */
export const data = (tag, context) => {
  return inlineTag((value) => {
    // Get data-value attribute
    const dataValue = getAttribute(tag, 'value', null);

    // Apply text color
    const styledValue = applyThemeColor(getAttr(tag, 'color'), context.theme.data?.color, value);

    // Check if value display is enabled
    const valueConfig = context.theme.data?.value;
    const customValueEnabled = getAttr(tag, 'value.enabled');
    const showValue = customValueEnabled === null
      ? (valueConfig?.enabled === true)
      : (customValueEnabled === 'true');

    // If no data-value or not showing it, just return styled text
    if (!dataValue || !showValue) {
      return styledValue;
    }

    // Get value display configuration
    const valueText = dataValue;

    const prefixMarker = getAttr(tag, 'value.prefix.marker') || valueConfig?.prefix?.marker || ' [';
    const suffixMarker = getAttr(tag, 'value.suffix.marker') || valueConfig?.suffix?.marker || ']';

    const styledPrefix = applyThemeColor(getAttr(tag, 'value.prefix.color'), valueConfig?.prefix?.color, prefixMarker);
    const styledValueText = applyThemeColor(getAttr(tag, 'value.color'), valueConfig?.color, valueText);
    const styledSuffix = applyThemeColor(getAttr(tag, 'value.suffix.color'), valueConfig?.suffix?.color, suffixMarker);

    return styledValue + styledPrefix + styledValueText + styledSuffix;
  })(tag, context);
};
