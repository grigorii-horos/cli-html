import wrapAnsi from 'wrap-ansi';
import balanceLines from './ansi/balance-lines.js';

const wrapLineWidth = (text, context) =>
  balanceLines(wrapAnsi(text, context.lineWidth, { trim: !context.pre }));

export default wrapLineWidth;
