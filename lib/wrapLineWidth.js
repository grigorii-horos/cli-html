const wrapAnsi = require('wrap-ansi');


const wrapLineWidth = (text, lineWidth, pre) => {
  if (pre) {
    return text;
  }
  return wrapAnsi(text, lineWidth, { trim: true });
};

module.exports = wrapLineWidth;
