import chalkString from 'chalk-string';

const newStyle = chalkString();

// @ts-ignore
const style = (styleString = "", value = "") =>
  styleString ? newStyle(styleString, value) : value;

export const getTheme = (customTheme) => ({
  h1: (value) => style(customTheme.h1 || "red bold", value),
  h2: (value) => style(customTheme.h2 || "blue bold", value),
  h3: (value) => style(customTheme.h3 || "blue bold", value),
  h4: (value) => style(customTheme.h4 || "cyan bold", value),
  h5: (value) => style(customTheme.h5 || "cyan", value),
  h6: (value) => style(customTheme.h6 || "cyan", value),

  //
  a: (value) => style(customTheme.a || "blue underline", value),
  figcaption: (value) => style(customTheme.figcaption || "bgGreen bold", value),
  blockquote: (value) => style(customTheme.blockquote || "black", value),

  // CODE
  code: (value) => style(customTheme.inlineCode || "yellowBright", value),
  inlineCode: (value) => style(customTheme.inlineCode || "bgBlack", value),
  codeNumbers: (value) =>
    style(customTheme.codeNumbers || "blackBright dim", value),

  dt: (value) => style(customTheme.dt || "blue bold", value),
  dd: (value) => style(customTheme.dt || "cyan", value),
  dl: (value) => style(customTheme.dl || "", value),

  del: (value) => style(customTheme.del || "bgRed black", value),
  ins: (value) => style(customTheme.ins || "bgGreen black", value),
  strike: (value) => style(customTheme.strikethrough || "strikethrough", value),
  underline: (value) => style(customTheme.underline || "underline", value),
  bold: (value) => style(customTheme.bold || "bold", value),
  samp: (value) => style(customTheme.samp || "yellowBright", value),
  kbd: (value) => style(customTheme.kbd || "bgBlack", value),
  var: (value) => style(customTheme.variableTag || "blue italic", value),
  mark: (value) => style(customTheme.mark || "bgYellow black", value),
  time: (value) => style(customTheme.mark || "cyan", value),

  //
  italic: (value) => style(customTheme.italic || "italic", value),
  i: (value) => style(customTheme.i || customTheme.italic || "italic", value),
  em: (value) => style(customTheme.em || customTheme.italic || "italic", value),
  cite: (value) =>
    style(customTheme.cite || customTheme.italic || "italic", value),
});
