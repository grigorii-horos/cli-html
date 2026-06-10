export const stripAnsi = (str) => str.replace(/\x1B\[[0-9;]*m/g, '');

export const hasAnsi = (str) => /\x1B\[[0-9;]*m/.test(str);
