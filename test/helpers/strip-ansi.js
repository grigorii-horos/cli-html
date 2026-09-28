export const stripAnsi = (str) => str.replaceAll(/\u001B\[[0-9;]*m/g, '');

export const hasAnsi = (str) => /\u001B\[[0-9;]*m/.test(str);
