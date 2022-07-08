import { blockTag } from './tag-helpers/block-tag.js';
import { textNode } from './tag-helpers/text-node.js';
import { a } from './tags/a.js';
import { abbr, acronym, dfn } from './tags/abbr.js';
import { address } from './tags/address.js';
import {
  article,
  aside,
  div,
  figcaption,
  footer,
  form,
  head,
  header,
  hgroup,
  label,
  main,
  nav,
  p,
  picture,
  section,
  span,
  title,
} from './tags/base-tags.js';
import { blockquote } from './tags/blockquote.js';
import { br } from './tags/br.js';
import { center } from './tags/center.js';
import { code, pre } from './tags/code.js';
import { dd, dl, dt } from './tags/definitions.js';
import { details } from './tags/details.js';
import { body, html } from './tags/document.js';
import { fieldset } from './tags/fieldset.js';
import { figure } from './tags/figure.js';
import { font } from './tags/font.js';
import {
  h1, h2, h3, h4, h5, h6,
} from './tags/headers.js';
import { hr } from './tags/hr.js';
import { img } from './tags/img.js';
import { button, input, output } from './tags/inputs.js';
import { li, ol, ul } from './tags/list.js';
import { progress } from './tags/progress.js';
import { caption, table } from './tags/table.js';
import {
  b,
  big,
  bold,
  cite,
  data,
  del,
  em,
  i as index,
  ins,
  italic,
  kbd,
  mark,
  q,
  s,
  samp,
  small,
  strike,
  strikethrough,
  strong,
  sub,
  sup,
  time,
  tt,
  u,
  underline,
  variableTag,
  wbr,
} from './tags/text-styles.js';
import {
  applet,
  area,
  audio,
  base,
  bgsound,
  embed,
  keygen,
  link,
  map,
  meta,
  noscript,
  param as parameter,
  script,
  source,
  style,
  summary,
  track,
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

  progress,

  //
  '#text': __text,
};
