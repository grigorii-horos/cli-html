import chalkString from 'chalk-string';

import { blockTag } from '../tag-helpers/block-tag.js';
import inlineTag from '../tag-helpers/inline-tag.js';
import { getAttribute, getCustomAttributes, applyCustomColor } from '../utilities.js';

// option and optgroup are rendered inline when used outside select
export const option = inlineTag();
export const optgroup = blockTag();

export const select = (tag, context) => {
  const custom = getCustomAttributes(tag);
  const isMultiple = getAttribute(tag, 'multiple', null) !== null;
  const selectName = getAttribute(tag, 'name', '');

  if (!tag.childNodes) {
    return blockTag()(tag, context);
  }

  const selectTheme = context.theme.select || {};
  const optionTheme = context.theme.option || {};
  const optgroupTheme = context.theme.optgroup || {};

  // Get marker styles from option theme
  const selectedMarker = custom.selectedMarker || optionTheme.selected?.marker || '◉';
  const unselectedMarker = custom.unselectedMarker || optionTheme.unselected?.marker || '○';

  // Colors from theme are functions, from custom are strings
  const selectedColorStr = custom.selectedColor; // string or null
  const unselectedColorStr = custom.unselectedColor; // string or null
  const optionColorFn = custom.optionColor
    ? (text) => chalkString(custom.optionColor, { colors: true })(text)
    : optionTheme.color; // function or identity

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
    const isDisabled = parentDisabled || (getAttribute(optionTag, 'disabled', null) !== null);

    // Get custom option attributes
    const optionCustom = getCustomAttributes(optionTag);

    const marker = isSelected ? selectedMarker : unselectedMarker;

    // Apply marker color
    let styledMarker;
    if (isSelected) {
      styledMarker = selectedColorStr
        ? chalkString(selectedColorStr, { colors: true })(marker)
        : (optionTheme.selected?.color ? optionTheme.selected.color(marker) : marker);
    } else {
      styledMarker = unselectedColorStr
        ? chalkString(unselectedColorStr, { colors: true })(marker)
        : (optionTheme.unselected?.color ? optionTheme.unselected.color(marker) : marker);
    }

    // Apply text color: custom > option theme
    const displayLabel = optionLabel || optionValue;
    let styledLabel;
    if (isDisabled) {
      styledLabel = chalkString('gray dim', { colors: true })(displayLabel);
    } else if (optionCustom.color) {
      styledLabel = chalkString(optionCustom.color, { colors: true })(displayLabel);
    } else if (optionColorFn && typeof optionColorFn === 'function') {
      styledLabel = optionColorFn(displayLabel);
    } else {
      styledLabel = displayLabel;
    }

    return `${indent}${styledMarker} ${styledLabel}`;
  };

  const renderOptgroup = (optgroupTag, indent = '') => {
    const groupLabel = getAttribute(optgroupTag, 'label', 'Group');
    const isDisabled = getAttribute(optgroupTag, 'disabled', null) !== null;

    // Get custom optgroup attributes
    const optgroupCustom = getCustomAttributes(optgroupTag);

    const groupMarker = optgroupCustom.marker || optgroupTheme.indicator?.marker || '▸ ';
    const groupMarkerColor = optgroupCustom.markerColor || '';

    let styledGroupLabel, styledMarker;
    if (isDisabled) {
      styledGroupLabel = chalkString('gray dim bold', { colors: true })(groupLabel);
      styledMarker = chalkString('gray dim bold', { colors: true })(groupMarker);
    } else {
      // Label color: custom > optgroup.label.color
      if (optgroupCustom.color) {
        styledGroupLabel = chalkString(optgroupCustom.color, { colors: true })(groupLabel);
      } else if (optgroupTheme.label?.color && typeof optgroupTheme.label.color === 'function') {
        styledGroupLabel = optgroupTheme.label.color(groupLabel);
      } else {
        styledGroupLabel = groupLabel;
      }

      // Marker color: custom > optgroup.indicator.color
      if (groupMarkerColor) {
        styledMarker = chalkString(groupMarkerColor, { colors: true })(groupMarker);
      } else if (optgroupTheme.indicator?.color && typeof optgroupTheme.indicator.color === 'function') {
        styledMarker = optgroupTheme.indicator.color(groupMarker);
      } else {
        styledMarker = groupMarker;
      }
    }

    const result = [`${indent}${styledMarker}${styledGroupLabel}`];

    if (optgroupTag.childNodes) {
      const options = optgroupTag.childNodes
        .filter(node => node.nodeName === 'option')
        .map(opt => renderOption(opt, indent + '  ', isDisabled));
      result.push(...options);
    }

    return result.join('\n');
  };

  const lines = [];

  // Add select label/name if present
  if (selectName) {
    const selectLabel = custom.selectLabel || selectName;

    // Get prefix/suffix
    const selectPrefix = (custom.prefix !== null && custom.prefix !== undefined)
      ? custom.prefix
      : (selectTheme.prefix || '');
    const selectSuffix = (custom.suffix !== null && custom.suffix !== undefined)
      ? custom.suffix
      : (selectTheme.suffix || ':');

    const selectPrefixColor = custom.prefixColor || selectTheme.prefixColor || '';
    const selectSuffixColor = custom.suffixColor || selectTheme.suffixColor || '';

    // Style the label text
    let styledSelectLabel;
    if (custom.color) {
      styledSelectLabel = chalkString(custom.color, { colors: true })(selectLabel);
    } else if (selectTheme.color && typeof selectTheme.color === 'function') {
      styledSelectLabel = selectTheme.color(selectLabel);
    } else {
      styledSelectLabel = selectLabel;
    }

    // Style prefix and suffix
    const styledPrefix = (selectPrefixColor && selectPrefix)
      ? chalkString(selectPrefixColor, { colors: true })(selectPrefix)
      : selectPrefix;
    const styledSuffix = (selectSuffixColor && selectSuffix)
      ? chalkString(selectSuffixColor, { colors: true })(selectSuffix)
      : selectSuffix;

    lines.push(`${styledPrefix}${styledSelectLabel}${styledSuffix}`);
  }

  // Render all children
  tag.childNodes.forEach(child => {
    if (child.nodeName === 'option') {
      lines.push(renderOption(child));
    } else if (child.nodeName === 'optgroup') {
      lines.push(renderOptgroup(child));
    }
  });

  return {
    marginTop: 1,
    value: lines.join('\n'),
    marginBottom: 1,
    type: 'block',
  };
};
