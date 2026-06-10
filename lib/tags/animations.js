import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor, applyThemeColor } from '../core/color.js';

/**
 * Blink element - deprecated HTML tag for blinking text
 * Shows animation indicator if enabled
 * @param tag
 * @param context
 */
export const blink = (tag, context) => {
  return inlineTag((value) => {
    // Check if animation indicator is enabled
    const animationConfig = context.theme.blink?.animation;
    const customAnimationEnabled = getAttr(tag, 'animation.enabled');
    const isEnabled = customAnimationEnabled === null
      ? (animationConfig?.enabled === true)
      : (customAnimationEnabled === 'true');

    if (!isEnabled || !animationConfig) {
      // No animation indicator, just return styled text
      return applyThemeColor(getAttr(tag, 'color'), context.theme.blink?.color, value);
    }

    // Get indicator configuration
    const marker = getAttr(tag, 'animation.marker') || animationConfig.indicator?.marker || '⚡';
    const styledMarker = applyThemeColor(
      getAttr(tag, 'animation.color'),
      animationConfig.indicator?.color,
      marker
    );

    const position = getAttr(tag, 'animation.position') || animationConfig.indicator?.position || 'both';

    // Apply text color
    const styledValue = applyThemeColor(getAttr(tag, 'color'), context.theme.blink?.color, value);

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
  return inlineTag((value) => {
    // Get direction from HTML attribute
    const direction = getAttribute(tag, 'direction', 'left').toLowerCase();

    // Check if direction indicator is enabled
    const directionConfig = context.theme.marquee?.direction;
    const customDirectionEnabled = getAttr(tag, 'direction.enabled');
    const isEnabled = customDirectionEnabled === null
      ? (directionConfig?.enabled !== false)
      : (customDirectionEnabled === 'true');

    if (!isEnabled || !directionConfig) {
      // No direction indicator, just return styled text
      return applyThemeColor(getAttr(tag, 'color'), context.theme.marquee?.color, value);
    }

    // Get indicator for specific direction
    const directionIndicatorConfig = directionConfig[direction] || directionConfig.left;
    const marker = getAttr(tag, 'direction.marker') || directionIndicatorConfig?.indicator?.marker || '⟵';
    const styledMarker = applyThemeColor(
      getAttr(tag, 'direction.color'),
      directionIndicatorConfig?.indicator?.color,
      marker
    );

    const position = getAttr(tag, 'direction.position') || directionConfig.position || 'before';

    // Apply text color
    const styledValue = applyThemeColor(getAttr(tag, 'color'), context.theme.marquee?.color, value);

    // Add marker based on position
    if (position === 'before') {
      return styledMarker + ' ' + styledValue;
    } else { // after
      return styledValue + ' ' + styledMarker;
    }
  })(tag, context);
};
