const boxen = require('boxen');
const blockTag = require('../tag-helpers/blockTag');

const figure = (tag, context) => blockTag(
  (value, tag) => {
    const valueInBox = boxen(value, {
      padding: {
        top: 1,
        bottom: 1,
        left: 2,
        right: 2,
      },
      borderColor: 'gray',
      dimBorder: false,
      borderStyle: 'round',
      titleColor: 'red',
      dimTitle: true,
    });

    return valueInBox;
  },
  { marginTop: 1, marginBottom: 1 },
)(tag, { ...context, lineWidth: context.lineWidth - 6 });

module.exports.figure = figure;
