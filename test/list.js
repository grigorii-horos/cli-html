/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable node/no-unpublished-import */
import test from 'ava';

const { getListSymbol, getListType } = require('../lib/utils/list');

test("should be 'disc' for ['disc', 'square']", (t) => {
  t.is(getListType('disc', 'square'), 'disc');
});

test("should be 'circle' for [null, 'square']", (t) => {
  t.is(getListType(null, 'square'), 'circle');
});

test("should be 'disc' for [null, 'void']", (t) => {
  t.is(getListType(null, 'void'), 'disc');
});

test("should be 'disc' for [null, null]", (t) => {
  t.is(getListType(null, null), 'disc');
});

test("should be '•' for 'disc'", (t) => {
  t.is(getListSymbol('disc'), '•');
});
