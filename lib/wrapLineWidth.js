import wrapAnsi from 'wrap-ansi';

const wrapLineWidth = (text, tag) => {
  if (tag.pre) {
    return text;
  }

  return wrapAnsi(text, tag.lineWidth, { trim: true });
};

export default wrapLineWidth;
