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
import { full as markdownItEmoji } from 'markdown-it-emoji';
import { alert } from '@mdit/plugin-alert';

const CALLOUT_COLORS = {
  important: 'red',
  danger: 'red',
  note: 'blue',
  info: 'blue',
  tip: 'green',
  warning: 'yellow',
  caution: 'magenta',
};

const CONTAINER_PATTERN = /^([\w-]+)(?:\s+(.*))?$/;

const calloutColor = (type) => CALLOUT_COLORS[type?.toLowerCase()] ?? 'blue';

const capitalize = (text) => text[0].toUpperCase() + text.slice(1).toLowerCase();

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
    .use(markdownItSup)
    .use(markdownItSub)
    .use(markdownItTaskList)
    .use(markdownItEmoji)
    .use(markdownItContainer, 'callout', {
      // Accept any `::: name [title]` container, not only one fixed name
      validate: (params) => CONTAINER_PATTERN.test(params.trim()),

      render(tokens, index) {
        const token = tokens[index];
        if (token.nesting !== 1) {
          return '</blockquote>\n';
        }

        const [, type, title] = token.info.trim().match(CONTAINER_PATTERN);
        const color = calloutColor(type);
        const heading = md.utils.escapeHtml(title?.trim() || capitalize(type));

        return `<blockquote data-cli-indicator-color="${color}"><p><span data-cli-color="${color}"><b>${heading}</b></span></p>\n`;
      },
    })
    .use(alert, {
      deep: false,

      openRender(tokens, index) {
        return `<blockquote data-cli-indicator-color="${calloutColor(tokens[index]?.markup)}">`;
      },

      closeRender() {
        return '</blockquote>';
      },

      titleRender(tokens, index) {
        const token = tokens[index];

        return `<p><span data-cli-color="${calloutColor(token?.markup)}"><b>${
          capitalize(token.content)
        }</b></span></p>`;
      },
    });

  // Remove footnote anchors
  md.renderer.rules.footnote_anchor = () => '';

  // Plain footnote numbers: <sup> already adds its own markers, so no [brackets]
  md.renderer.rules.footnote_caption = (tokens, index) => {
    const { id, subId } = tokens[index].meta;
    return subId > 0 ? `${id + 1}:${subId}` : `${id + 1}`;
  };

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
