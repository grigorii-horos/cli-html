import wrapAnsi from 'wrap-ansi';

const wrapLineWidth = (text, tag) => wrapAnsi(text, tag.lineWidth, { trim: !tag.pre });

export default wrapLineWidth;
