const concatTwoInlineTags = require('./lib/concatTwoInlineTags');


console.log(concatTwoInlineTags(null, null));

console.log('-------');

console.log(concatTwoInlineTags(null, { pre: '', value: '', post: '' }));


console.log('-------');

console.log(concatTwoInlineTags(null, { pre: null, value: null, post: null }));

console.log('-------');

console.log(concatTwoInlineTags({ pre: '', value: '', post: '' }, null));

console.log('-------');

console.log(concatTwoInlineTags({
  pre: ' ', value: null, post: null, type: 'inline',
}, {
  pre: null, value: 'fdsgsdfgfsdgfdg', post: null, type: 'inline',
}));

console.log('-------');

console.log(concatTwoInlineTags({
  pre: ' ', value: 'with', post: ' ', type: 'inline',
}, {
  pre: null, value: 'asterisks', post: null, type: 'inline',
}));


console.log('-------');

console.log(concatTwoInlineTags(
  {
    pre: '\n', value: 'One', post: '\n', type: 'block', nodeName: 'p',
  }, {
    pre: '\n', value: 'Two', post: '\n', type: 'block', nodeName: 'p',
  },
));
