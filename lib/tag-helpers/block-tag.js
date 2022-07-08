import { getAttribute } from '../utils.js';
import { concatTwoBlockTags } from '../utils/concat-block-tags.js';
import { concatTwoInlineTags } from '../utils/concat-inline-tags.js';
import { inlineToBlockTag } from '../utils/inline-to-block-tag.js';
import { renderTag } from '../utils/render-tag.js';
import wrapLineWidth from '../wrap-line-width.js';

/**
 * @param wrapper
 * @param localContext
 */
export function blockTag(wrapper, localContext) {
  return (tag, context) => {
    const wrapFunction = wrapper || ((argument) => argument);

    if (!tag || !tag.childNodes) {
      return null;
    }

    let liItemNumber = Number.parseInt(getAttribute(tag, 'start', '1'), 10);
    const value = tag.childNodes.reduce(
      (accumulator, node) => {
        const nodeTag = renderTag(node, { ...context, liItemNumber });

        if (!nodeTag) {
          return accumulator;
        }

        if (nodeTag.nodeName === 'li') {
          liItemNumber += 1;
        }

        if (nodeTag.type === 'inline') {
          return {
            block: accumulator.block,
            inline: concatTwoInlineTags(accumulator.inline, nodeTag),
          };
        }

        if (accumulator.inline && accumulator.inline.value != undefined) {
          accumulator.inline.value = wrapLineWidth(
            accumulator.inline.value,
            context,
          );
        }

        accumulator.block = concatTwoBlockTags(
          accumulator.block,
          inlineToBlockTag(accumulator.inline),
        );

        accumulator.block = concatTwoBlockTags(accumulator.block, nodeTag);

        return {
          block: accumulator.block,
          inline: null,
        };
      },
      {
        block: null,
        inline: null,
      },
    );

    if (value.inline != undefined && value.inline.value != undefined) {
      value.inline.value = wrapLineWidth(value.inline.value, context);
    }

    value.block = concatTwoBlockTags(
      value.block,
      inlineToBlockTag(value.inline),
    );

    if (!value.block || !value.block.value) {
      return null;
    }

    let topBlock = (localContext && localContext.marginTop) || 0;

    topBlock = !context || !context.pre ? topBlock + 1 : topBlock;

    let bottomBlock = (localContext && localContext.marginBottom) || 0;

    bottomBlock = !context || !context.pre ? bottomBlock + 1 : bottomBlock;

    return {
      marginTop:
        value.block.marginTop && value.block.marginTop > topBlock
          ? value.block.marginTop
          : topBlock,
      value: wrapFunction(value.block.value, tag),
      marginBottom:
        value.block.marginBottom && value.block.marginBottom > bottomBlock
          ? value.block.marginBottom
          : bottomBlock,
      type: 'block',
      nodeName: tag.nodeName,
    };
  };
}
