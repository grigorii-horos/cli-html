import ansiAlign from 'ansi-align';
import boxen from 'boxen';
import chalkString from 'chalk-string';
import longestLine from 'longest-line';
import stringWidth from 'string-width';

import { blockTag } from '../tag-helpers/block-tag.js';
import { getCustomAttributes, extractBaseColor, applyCustomColor } from '../utilities.js';

// figcaption is handled internally by figure, similar to how table handles caption
export const figcaption = blockTag();

export const figure = (tag, context) => {
  if (!tag.childNodes) {
    return null;
  }

  const custom = getCustomAttributes(tag);

  // Find all figcaption elements
  const figcaptionTags = tag.childNodes.filter((child) => child.nodeName === 'figcaption');

  // Create a new tag with figcaptions removed to get the main content
  const contentTag = {
    ...tag,
    childNodes: tag.childNodes.filter((child) => child.nodeName !== 'figcaption'),
  };

  // Process the main content (without center alignment)
  const mainContent = blockTag()(contentTag, context);
  const contentValue = mainContent && mainContent.value ? mainContent.value : '';

  // Find the longest line width in the content
  const contentWidth = contentValue ? longestLine(contentValue) : 0;

  // Process figcaptions with manual center alignment based on content width
  const figcaptionValues = figcaptionTags.map((figcaptionTag) => {
    const figcaptionCustom = getCustomAttributes(figcaptionTag);
    const figcaptionContent = blockTag()(figcaptionTag, context);

    if (!figcaptionContent || !figcaptionContent.value) {
      return null;
    }

    const prefix = figcaptionCustom.prefix ?? context.theme.figcaption?.prefix ?? ' ';
    const suffix = figcaptionCustom.suffix ?? context.theme.figcaption?.suffix ?? ' ';
    const styledValue = applyCustomColor(
      figcaptionCustom.color,
      context.theme.figcaption?.color,
      figcaptionContent.value,
      chalkString
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

  // Apply boxen to the combined content (no center alignment for the whole content)
  const borderColorRaw = custom.border || context.theme.figure?.border?.color || 'gray';
  const borderColor = extractBaseColor(borderColorRaw);
  const borderStyle = custom.borderStyle || context.theme.figure?.border?.style || 'round';
  const dimBorder = custom.borderDim !== null ? custom.borderDim : (context.theme.figure?.border?.dim ?? false);
  const padding = context.theme.figure?.padding ?? { top: 0, bottom: 0, left: 1, right: 1 };

  const valueInBox = boxen(combinedContent, {
    padding,
    borderColor,
    dimBorder,
    borderStyle,
  });

  return {
    marginTop: 1,
    value: valueInBox,
    marginBottom: 1,
    type: 'block',
  };
};
