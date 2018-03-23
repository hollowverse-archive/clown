import { isMergeableStructure } from './utils';

describe.only('isMergeableStructure', () => {
  it('tells us if a structure is mergeable', () => {
    expect(isMergeableStructure([1])).toEqual(true);
    expect(isMergeableStructure({ f: 1 })).toEqual(true);
    expect(isMergeableStructure('hello')).toEqual(false);
  });
});
