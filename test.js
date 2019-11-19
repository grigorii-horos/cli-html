const { concatTwoInlineTags } = require('./lib/concat');


// console.log(concatTwoInlineTags(null, null));

// console.log('-------');

// console.log(concatTwoInlineTags(null, { pre: '', value: '', post: '' }));


// console.log('-------');

// console.log(concatTwoInlineTags(null, { pre: null, value: null, post: null }));

// console.log('-------');

// console.log(concatTwoInlineTags({ pre: '', value: '', post: '' }, null));

// console.log('-------');

// console.log(concatTwoInlineTags({
//   pre: ' ', value: null, post: null, type: 'inline',
// }, {
//   pre: null, value: 'fdsgsdfgfsdgfdg', post: null, type: 'inline',
// }));

// console.log('-------');

// console.log(concatTwoInlineTags({
//   pre: ' ', value: 'with', post: ' ', type: 'inline',
// }, {
//   pre: null, value: 'asterisks', post: null, type: 'inline',
// }));


// console.log('-------');

// console.log({
//   pre: ' ',
//   value: null,
//   post: null,
//   type: 'inline',
//   nodeName: '#text',
// },
// {
//   pre: ' ',
//   value: 'fsdfsd',
//   post: null,
//   type: 'inline',
//   nodeName: '#text',
// },
// concatTwoInlineTags(
//   {
//     pre: ' ',
//     value: null,
//     post: null,
//     type: 'inline',
//     nodeName: '#text',
//   },
//   {
//     pre: ' ',
//     value: 'fsdfsd',
//     post: null,
//     type: 'inline',
//     nodeName: '#text',
//   },
// ));


a = {
  nodeName: 'a',
  tagName: 'a',
  attrs: [
    { name: 'href', value: 'https://www.google.com' },
    { name: 'title', value: "Google's Homepage" },
  ],
  namespaceURI: 'http://www.w3.org/1999/xhtml',
  childNodes: [
    {
      nodeName: '#text',
      value: "I'm an link with title",

    },
  ],
};

console.log(
  a.attrs.find((attribute) => attribute.name === 'href').value,
);
