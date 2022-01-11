/* eslint-disable security/detect-object-injection */

import { textNode } from './tag-helpers/textNode.js';
import { blockTag } from './tag-helpers/blockTag.js';

import { abbr, dfn, acronym } from './tags/abbr.js';
import { address } from './tags/address.js';
import {
  title,
  span,
  label,
  p,
  div,
  head,
  header,
  article,
  footer,
  section,
  main,
  nav,
  aside,
  form,
  picture,
  figcaption,
  hgroup,
} from './tags/baseTags.js';
import { blockquote } from './tags/blockquote.js';
import { br } from './tags/br.js';
import { center } from './tags/center.js';
import { code, pre } from './tags/code.js';
import { dt, dd, dl } from './tags/definitions.js';
import { details } from './tags/details.js';
import { html, body } from './tags/document.js';
import { fieldset } from './tags/fieldset.js';
import { figure } from './tags/figure.js';
import {
  h1, h2, h3, h4, h5, h6,
} from './tags/headers.js';
import { hr } from './tags/hr.js';
import { img } from './tags/img.js';
import { button, input, output } from './tags/inputs.js';
import { a } from './tags/a.js';
import { ol, ul, li } from './tags/list.js';
import { caption, table } from './tags/table.js';
import {
  q,
  del,
  ins,
  italic,
  strikethrough,
  underline,
  bold,
  samp,
  kbd,
  variableTag,
  mark,
  b,
  s,
  strike,
  em,
  i as index,
  cite,
  strong,
  u,
  small,
  big,
  sub,
  sup,
  time,
  tt,
  font,
  data,
  wbr,
} from './tags/textStyles.js';

import {
  script,
  style,
  meta,
  audio,
  applet,
  area,
  map,
  base,
  track,
  embed,
  keygen,
  link,
  param as parameter,
  source,
  summary,
  noscript,
  bgsound,
} from './tags/void.js';

const __text = textNode;

//

export default {
  abbr,
  dfn,
  acronym,
  address,
  title,
  span,
  label,
  p,
  div,
  head,
  header,
  article,
  footer,
  section,
  main,
  nav,
  aside,
  form,
  picture,
  figcaption,
  hgroup,
  blockquote,
  br,
  center,
  code,
  pre,
  dt,
  dd,
  dl,
  details,
  html,
  body,
  fieldset,
  figure,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  img,
  button,
  input,
  output,
  a,
  ol,
  ul,
  li,
  table,
  caption,
  q,
  del,
  ins,
  italic,
  strikethrough,
  underline,
  bold,
  samp,
  kbd,
  var: variableTag,
  mark,
  b,
  s,
  strike,
  em,
  i: index,
  cite,
  strong,
  u,
  small,
  big,
  sub,
  sup,
  time,
  tt,
  font,
  data,
  wbr,

  //
  blockTag,

  //

  script,
  style,
  meta,
  audio,
  applet,
  area,
  map,
  base,
  track,
  embed,
  keygen,
  link,
  param: parameter,
  source,
  summary,

  noscript,
  bgsound,

  //
  '#text': __text,
};
