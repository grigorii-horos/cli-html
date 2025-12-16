import chalkString from 'chalk-string';

import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getCustomAttributes } from '../utilities.js';

/**
 * Blink element - deprecated HTML tag for blinking text
 * Shows animation indicator if enabled
 * @param tag
 * @param context
 */
export const blink = (tag, context) => {
  const custom = getCustomAttributes(tag);

  return inlineTag((value) => {
    // Check if animation indicator is enabled
    const animationConfig = context.theme.blink?.animation;
    const isEnabled = custom.animation?.enabled === undefined
      ? (animationConfig?.enabled === true)
      : (custom.animation.enabled === 'true' || custom.animation.enabled === true);

    if (!isEnabled || !animationConfig) {
      // No animation indicator, just return styled text
      const textColorFunction = custom.color
        ? (text) => chalkString(custom.color, { colors: true })(text)
        : context.theme.blink?.color;
      return textColorFunction ? textColorFunction(value) : value;
    }

    // Get indicator configuration
    const marker = custom.animation?.marker || animationConfig.indicator?.marker || '⚡';
    const markerColorFunction = custom.animation?.color
      ? (text) => chalkString(custom.animation.color, { colors: true })(text)
      : (animationConfig.indicator?.color
          ? (typeof animationConfig.indicator.color === 'function'
              ? animationConfig.indicator.color
              : (text) => chalkString(animationConfig.indicator.color, { colors: true })(text))
          : (text) => text);

    const position = custom.animation?.position || animationConfig.indicator?.position || 'both';
    const styledMarker = markerColorFunction(marker);

    // Apply text color
    const textColorFunction = custom.color
      ? (text) => chalkString(custom.color, { colors: true })(text)
      : context.theme.blink?.color;
    const styledValue = textColorFunction ? textColorFunction(value) : value;

    // Add marker based on position
    if (position === 'before') {
      return styledMarker + ' ' + styledValue;
    } else if (position === 'after') {
      return styledValue + ' ' + styledMarker;
    } else { // both
      return styledMarker + ' ' + styledValue + ' ' + styledMarker;
    }
  })(tag, context);
};

/**
 * Marquee element - deprecated HTML tag for scrolling text
 * Shows direction indicator if enabled
 * @param tag
 * @param context
 */
export const marquee = (tag, context) => {
  const custom = getCustomAttributes(tag);

  return inlineTag((value) => {
    // Get direction from HTML attribute
    const direction = getAttribute(tag, 'direction', 'left').toLowerCase();

    // Check if direction indicator is enabled
    const directionConfig = context.theme.marquee?.direction;
    const isEnabled = custom.direction?.enabled === undefined
      ? (directionConfig?.enabled !== false)
      : (custom.direction.enabled === 'true' || custom.direction.enabled === true);

    if (!isEnabled || !directionConfig) {
      // No direction indicator, just return styled text
      const textColorFunction = custom.color
        ? (text) => chalkString(custom.color, { colors: true })(text)
        : context.theme.marquee?.color;
      return textColorFunction ? textColorFunction(value) : value;
    }

    // Get indicator for specific direction
    const directionIndicatorConfig = directionConfig[direction] || directionConfig.left;
    const marker = custom.direction?.marker || directionIndicatorConfig?.indicator?.marker || '⟵';
    const markerColorFunction = custom.direction?.color
      ? (text) => chalkString(custom.direction.color, { colors: true })(text)
      : (directionIndicatorConfig?.indicator?.color
          ? (typeof directionIndicatorConfig.indicator.color === 'function'
              ? directionIndicatorConfig.indicator.color
              : (text) => chalkString(directionIndicatorConfig.indicator.color, { colors: true })(text))
          : (text) => text);

    const position = custom.direction?.position || directionConfig.position || 'before';
    const styledMarker = markerColorFunction(marker);

    // Apply text color
    const textColorFunction = custom.color
      ? (text) => chalkString(custom.color, { colors: true })(text)
      : context.theme.marquee?.color;
    const styledValue = textColorFunction ? textColorFunction(value) : value;

    // Add marker based on position
    if (position === 'before') {
      return styledMarker + ' ' + styledValue;
    } else { // after
      return styledValue + ' ' + styledMarker;
    }
  })(tag, context);
};
