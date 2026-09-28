import stringWidth from 'string-width';

import { blockTag } from '../tag-helpers/block-tag.js';
import { boxContentWidth, getBoxSettings, renderBox } from '../tag-helpers/box.js';
import { getAttr } from '../core/attr.js';
import { maxLineWidth } from '../utils/string.js';
import { applyThemeColor } from '../core/color.js';

// figcaption is handled internally by figure, similar to how table handles caption
export const figcaption = blockTag();

export const figure = (tag, context) => {
  if (!tag.childNodes) {
    return null;
  }

  const settings = getBoxSettings(tag, context.theme.figure);
  const innerContext = {
    ...context,
    lineWidth: boxContentWidth(context.lineWidth, settings.padding),
  };

  // Find all figcaption elements
  const figcaptionTags = tag.childNodes.filter((child) => child.nodeName === 'figcaption');

  // Create a new tag with figcaptions removed to get the main content
  const contentTag = {
    ...tag,
    childNodes: tag.childNodes.filter((child) => child.nodeName !== 'figcaption'),
  };

  // Process the main content (without center alignment)
  const mainContent = blockTag()(contentTag, innerContext);
  const contentValue = applyThemeColor(getAttr(tag, 'color'), context.theme.figure?.color, mainContent?.value ?? '');

  // Find the longest line width in the content
  const contentWidth = contentValue ? maxLineWidth(contentValue) : 0;

  // Process figcaptions with manual center alignment based on content width
  const figcaptionValues = figcaptionTags.map((figcaptionTag) => {
    const figcaptionContent = blockTag()(figcaptionTag, innerContext);

    if (!figcaptionContent || !figcaptionContent.value) {
      return null;
    }

    const prefix = getAttr(figcaptionTag, 'prefix') ?? context.theme.figcaption?.prefix;
    const suffix = getAttr(figcaptionTag, 'suffix') ?? context.theme.figcaption?.suffix;
    const styledValue = applyThemeColor(
      getAttr(figcaptionTag, 'color'),
      context.theme.figcaption?.color,
      figcaptionContent.value,
    );

    const captionText = `${prefix}${styledValue}${suffix}`;

    // Manually center each line of the figcaption
    const centeredLines = captionText.split('\n').map(line => {
      const lineWidth = stringWidth(line);
      if (lineWidth >= contentWidth) {
        return line;
      }
      const padding = contentWidth - lineWidth;
      const leftPad = Math.floor(padding / 2);
      const rightPad = padding - leftPad;
      return ' '.repeat(leftPad) + line + ' '.repeat(rightPad);
    });

    return centeredLines.join('\n');
  }).filter(Boolean);

  // Combine content with figcaptions
  let combinedContent = contentValue;
  if (figcaptionValues.length > 0) {
    const figcaptionsText = figcaptionValues.join('\n');
    combinedContent = contentValue ? `${contentValue}\n${figcaptionsText}` : figcaptionsText;
  }

  const valueInBox = renderBox(combinedContent, { ...settings, lineWidth: context.lineWidth });

  return {
    marginTop: 1,
    value: valueInBox,
    marginBottom: 1,
    type: 'block',
  };
};
