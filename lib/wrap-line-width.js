import wrapAnsi from 'wrap-ansi';

const wrapLineWidth = (text, context) => wrapAnsi(text, context.lineWidth, { trim: !context.pre });

export default wrapLineWidth;
