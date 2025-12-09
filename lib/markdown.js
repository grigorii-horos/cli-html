import markdownit from 'markdown-it';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItIns from 'markdown-it-ins';
import markdownItMark from 'markdown-it-mark';
import markdownItDeflist from 'markdown-it-deflist';
import markdownItContainer from 'markdown-it-container';
import markdownItAbbr from 'markdown-it-abbr';
import markdownItSup from 'markdown-it-sup';
import markdownItSub from 'markdown-it-sub';
import markdownItTaskList from 'markdown-it-task-lists';
import { alert } from '@mdit/plugin-alert';

/**
 * Create a configured markdown-it instance with GFM support
 */
export const createMarkdownRenderer = () => {
  const md = markdownit({
    html: true,
    langPrefix: 'language-',
    linkify: true,
  })
    .use(markdownItFootnote)
    .use(markdownItIns)
    .use(markdownItMark)
    .use(markdownItDeflist)
    .use(markdownItAbbr)
    .use(markdownItContainer)
    .use(markdownItSup)
    .use(markdownItSub)
    .use(markdownItTaskList)
    .use(alert, {
      deep: false,

      openRender(tokens, index) {
        const token = tokens[index];

        let color = null;

        // Map alert types to colors
        switch (token?.markup) {
          case 'important': {
            color = 'red';
            break;
          }
          case 'note': {
            color = 'blue';
            break;
          }
          case 'tip': {
            color = 'green';
            break;
          }
          case 'warning': {
            color = 'yellow';
            break;
          }
          case 'caution': {
            color = "magenta";
            break;
          }
          default: {
            color = 'blue';
          }
        }

        return `<blockquote data-cli-color="${color}">`;
      },

      closeRender() {
        return '</blockquote>';
      },

      titleRender(tokens, index) {
        const token = tokens[index];

        let color = null;

        switch (token?.markup) {
          case 'important': {
            color = 'red';
            break;
          }
          case 'note': {
            color = 'blue';
            break;
          }
          case 'tip': {
            color = 'green';
            break;
          }
          case 'warning': {
            color = 'yellow';
            break;
          }
          case 'caution': {
            color = "magenta";
            break;
          }
          default: {
            color = 'blue';
          }
        }

        return `<p><span data-cli-color="${color}"><b>${
          token.content[0].toUpperCase() + token.content.slice(1).toLowerCase()
        }</b></span></p>`;
      },
    });

  // Remove footnote anchors
  md.renderer.rules.footnote_anchor = () => '';

  return md;
};

/**
 * Render markdown to HTML
 * @param {string} markdown - Markdown content
 * @returns {string} HTML string
 */
export const markdownToHtml = (markdown) => {
  const md = createMarkdownRenderer();
  return md.render(markdown);
};
