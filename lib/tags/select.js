import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute } from '../utilities.js';
import { getAttr } from '../core/attr.js';
import { applyColor } from '../core/color.js';
import { getDisabledColor } from '../core/disabled.js';

// option and optgroup are rendered inline when used outside select
export const option = inlineTag();
export const optgroup = blockTag();

export const select = (tag, context) => {
  const isMultiple = getAttribute(tag, 'multiple', null) !== null;
  const selectName = getAttribute(tag, 'name', '');

  if (!tag.childNodes) {
    return blockTag()(tag, context);
  }

  const selectTheme = context.theme.select || {};
  const optionTheme = context.theme.option || {};
  const optgroupTheme = context.theme.optgroup || {};

  // Get marker styles from option theme
  const selectedMarker = optionTheme.selected?.marker;
  const unselectedMarker = optionTheme.unselected?.marker;

  const renderOption = (optionTag, indent = '', parentDisabled = false) => {
    const optionValue = getAttribute(optionTag, 'value', '');
    const optionLabel = optionTag.childNodes
      ? optionTag.childNodes
          .filter(node => node.nodeName === '#text')
          .map(node => node.value)
          .join('')
          .trim()
      : '';

    const isSelected = getAttribute(optionTag, 'selected', null) !== null;
    const isOptionDisabled = parentDisabled || (getAttribute(optionTag, 'disabled', null) !== null);

    const customSelectedMarker = getAttr(optionTag, 'selected.marker');
    const customUnselectedMarker = getAttr(optionTag, 'unselected.marker');
    const marker = isSelected
      ? (customSelectedMarker ?? selectedMarker)
      : (customUnselectedMarker ?? unselectedMarker);

    // Apply marker color
    let styledMarker;
    if (isSelected) {
      const markerColor = getAttr(optionTag, 'selected.color') ?? optionTheme.selected?.color;
      styledMarker = applyColor(markerColor, marker);
    } else {
      const markerColor = getAttr(optionTag, 'unselected.color') ?? optionTheme.unselected?.color;
      styledMarker = applyColor(markerColor, marker);
    }

    // Apply text color: custom > option theme
    const displayLabel = optionLabel || optionValue;
    let styledLabel;
    if (isOptionDisabled) {
      const disabledColor = getDisabledColor(optionTag, context.theme.option);
      styledLabel = applyColor(disabledColor, displayLabel);
    } else {
      const labelColor = getAttr(optionTag, 'color') ?? optionTheme.color;
      styledLabel = applyColor(labelColor, displayLabel);
    }

    return `${indent}${styledMarker} ${styledLabel}`;
  };

  const renderOptgroup = (optgroupTag, indent = '') => {
    const groupLabel = getAttribute(optgroupTag, 'label', 'Group');
    const isOptgroupDisabled = getAttribute(optgroupTag, 'disabled', null) !== null;

    const groupMarker = getAttr(optgroupTag, 'indicator.marker') ?? optgroupTheme.indicator?.marker;

    let styledGroupLabel, styledMarker;
    if (isOptgroupDisabled) {
      // TODO: add optgroup.disabled.color to config.yaml when standardizing optgroup disabled state
      styledGroupLabel = applyColor('gray dim bold', groupLabel);
      styledMarker = applyColor('gray dim bold', groupMarker);
    } else {
      // Label color: custom > optgroup.label.color
      const labelColor = getAttr(optgroupTag, 'label.color') ?? optgroupTheme.label?.color;
      styledGroupLabel = applyColor(labelColor, groupLabel);

      // Marker color: custom > optgroup.indicator.color
      const markerColor = getAttr(optgroupTag, 'indicator.color') ?? optgroupTheme.indicator?.color;
      styledMarker = applyColor(markerColor, groupMarker);
    }

    const result = [`${indent}${styledMarker}${styledGroupLabel}`];

    if (optgroupTag.childNodes) {
      const options = optgroupTag.childNodes
        .filter(node => node.nodeName === 'option')
        .map(opt => renderOption(opt, indent + '  ', isOptgroupDisabled));
      result.push(...options);
    }

    return result.join('\n');
  };

  const lines = [];

  // Add select label/name if present
  if (selectName) {
    const customLabel = getAttr(tag, 'label');
    const selectLabel = customLabel ?? selectName;

    // Get prefix/suffix
    const customPrefix = getAttr(tag, 'prefix.marker');
    const selectPrefix = customPrefix !== null ? customPrefix : selectTheme.prefix?.marker;
    const customSuffix = getAttr(tag, 'suffix.marker');
    const selectSuffix = customSuffix !== null ? customSuffix : selectTheme.suffix?.marker;

    const selectPrefixColor = getAttr(tag, 'prefix.color') ?? selectTheme.prefix?.color;
    const selectSuffixColor = getAttr(tag, 'suffix.color') ?? selectTheme.suffix?.color;

    // Style the label text
    const labelColor = getAttr(tag, 'color') ?? selectTheme.color;
    const styledSelectLabel = applyColor(labelColor, selectLabel);

    // Style prefix and suffix
    const styledPrefix = selectPrefix ? applyColor(selectPrefixColor, selectPrefix) : selectPrefix;
    const styledSuffix = selectSuffix ? applyColor(selectSuffixColor, selectSuffix) : selectSuffix;

    lines.push(`${styledPrefix}${styledSelectLabel}${styledSuffix}`);
  }

  // Render all children
  for (const child of tag.childNodes) {
    if (child.nodeName === 'option') {
      lines.push(renderOption(child));
    } else if (child.nodeName === 'optgroup') {
      lines.push(renderOptgroup(child));
    }
  }

  return {
    marginTop: 1,
    value: lines.join('\n'),
    marginBottom: 1,
    type: 'block',
  };
};
