const { expect } = require('chai');
const { createLookup, replaceKey } = require('../db/utils');

describe('createLookup()', () => {
  it('creates a lookup table from an array containing one objects', () => {
    const arr = [
      {
        title: 'TITLE1',
        body: 'BODY1',
        id: 1,
      },
    ];
    const key = 'title';
    const valueFrom = 'id';
    expect(createLookup(arr, key, valueFrom)).to.eql({ TITLE1: 1 });
  });
  it('creates a lookup table from an array containing multiple objects', () => {
    const arr = [
      {
        title: 'TITLE1',
        body: 'BODY1',
        id: 1,
      },
      {
        title: 'TITLE2',
        body: 'BODY2',
        id: 2,
      },
    ];
    const key = 'title';
    const valueFrom = 'id';
    expect(createLookup(arr, key, valueFrom)).to.eql({ TITLE1: 1, TITLE2: 2 });
  });
});

describe('replaceKey()', () => {
  it('replaces a key value pair based on a lookup object for a single item array', () => {
    const arr = [{ title: 'firstArticle', body: 'SomeText' }];
    const lookupObj = { firstArticle: 1 };
    const output = [{ title_id: 1, body: 'SomeText' }];
    expect(replaceKey(arr, lookupObj, 'title', 'title_id')).to.eql(output);
  });
  it('replaces a key value pair based on a lookup object for a multiple item array', () => {
    const arr = [
      { title: 'firstArticle', body: 'SomeText' },
      { title: 'secondArticle', body: 'SomeOtherText' },
    ];
    const lookupObj = {
      firstArticle: 1,
      secondArticle: 2,
    };
    const output = [
      { title_id: 1, body: 'SomeText' },
      { title_id: 2, body: 'SomeOtherText' },
    ];
    expect(replaceKey(arr, lookupObj, 'title', 'title_id')).to.eql(output);
  });
});
