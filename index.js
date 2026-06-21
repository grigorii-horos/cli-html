import { parse } from 'parse5';

import { getGlobalConfig } from './lib/utils/get-global-config.js';
import { renderTag } from './lib/utils/render-tag.js';
import { markdownToHtml } from './lib/markdown.js';

export const renderHTML = (rawHTML, theme = {}) => {
  const document = parse(rawHTML);
  const globalConfig = getGlobalConfig(document, theme);
  return `${(renderTag(document, globalConfig) || { value: '' }).value}\n`;
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

/**
 * Render a React/JSX element or component to terminal.
 *
 * react and react-dom are loaded lazily so the core HTML/Markdown path never
 * pays for them at runtime; they are declared as regular dependencies.
 * @param {object | (() => unknown)} jsx - A React element or component to render
 * @param {object} theme - Optional theme configuration
 * @returns {Promise<string>} Formatted terminal output
 */
export const renderJSX = async (jsx, theme = {}) => {
  const { createElement, isValidElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');

  const element = isValidElement(jsx) ? jsx : createElement(jsx, null);
  const html = renderToStaticMarkup(element);

  return renderHTML(html, theme);
};

export default renderHTML;
