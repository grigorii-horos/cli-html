import { parse } from 'parse5';

import { getGlobalConfig } from './lib/utils/get-global-config.js';
import { renderTag } from './lib/utils/render-tag.js';
import { markdownToHtml } from './lib/markdown.js';

export const renderHTML = (rawHTML, theme = {}) => {
  const document = parse(rawHTML);

  // console.dir(
  //   filterAst(document).childNodes[0].childNodes[1].childNodes,
  //   { depth: null },
  // );

  const globalConfig = getGlobalConfig(document, theme);

  return `${
    (renderTag(document, globalConfig) || { value: '' }).value
  }\n`;
};

/**
 * Render markdown to terminal
 * @param {string} markdown - Markdown content
 * @param {object} theme - Optional theme configuration
 * @returns {string} Formatted terminal output
 */
export const renderMarkdown = (markdown, theme = {}) => {
  const html = markdownToHtml(markdown);
  return renderHTML(html, theme);
};

export default renderHTML;
