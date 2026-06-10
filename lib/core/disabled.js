import { getAttribute } from '../utilities.js';
import { getAttr } from './attr.js';

export const isDisabled = (tag) => getAttribute(tag, 'disabled', null) !== null;

export const getDisabledColor = (tag, theme) =>
  getAttr(tag, 'disabled.color') ?? theme?.disabled?.color ?? 'gray dim';
