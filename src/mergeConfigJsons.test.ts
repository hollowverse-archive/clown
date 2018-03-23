import { mergeConfigJsons } from './mergeConfigJsons';

describe('mergeConfigJsons', () => {
  // it('merges structures', () => {
  //   expect(mergeConfigJsons({ hi: 1 }, { ho: 2 })).toEqual({
  //     hi: 1,
  //     ho: 2,
  //   });
  // });

  // it('can merge array of objects', () => {
  //   expect(
  //     mergeConfigJsons(
  //       [{ name: 'a', values: [1, 2, 3] }, { name: 'b', values: [4, 5, 6] }],
  //       [{ name: 'a', values: [0, 3, 4] }, { name: 'c', values: [1, 5, 8] }],
  //     ),
  //   ).toMatchSnapshot();
  // });

  // it('can merge arrays of numbers', () => {
  //   expect(mergeConfigJsons([1, 2, 3], [1, 3, 2, 4])).toEqual([1, 3, 2, 4]);
  // });

  // it('can merge arrays of strings', () => {
  //   expect(mergeConfigJsons(['a', 'b'], ['a', 'd'])).toEqual(['a', 'd']);
  // });

  it.only('can merge simple arrays of objects', () => {
    expect(
      mergeConfigJsons(
        [
          { x: 'a', y: ['foo', 'bar', 'baz'], z: 'ff', k: 12 },
          { x: 'b', y: ['1foo', '1bar', '1baz'], z: 'ff' },
        ],
        [
          { x: 'a', y: ['2foo', '2bar', 'baz'], z: 'nn' },
          { x: 'b', y: ['1foo', '1bar', '1baz'], z: 'nn' },
        ],
      ),
    ).toEqual([
      { x: 'a', y: ['foo', 'bar', 'baz', '2foo', '2bar'], z: 'nn', k: 12 },
      { x: 'b', y: ['1foo', '1bar', '1baz'], z: 'nn' },
    ]);
  });

  // it('merges arrays of objects', () => {
  //   const config1 = [
  //     {
  //       x: 'a',
  //       y: [{ x: 'c', y: [4] }, { x: 'd', y: [1, 2, 3] }],
  //     },
  //     {
  //       x: 'b',
  //       y: [{ x: 'c', y: [6] }, { x: 'd', y: [] }],
  //     },
  //   ];

  //   const config2 = [
  //     {
  //       x: 'a',
  //       y: [{ x: 'c', y: [3, 4, 8] }, { x: 'e', y: [9, 2, 1] }],
  //     },
  //     {
  //       x: 'b',
  //       y: [{ x: 'c', y: [94] }, { x: 'e', y: [3, 4, 7] }],
  //     },
  //   ];

  //   const result = [
  //     {
  //       x: 'a',
  //       y: [
  //         { x: 'c', y: [4, 3, 8] },
  //         { x: 'd', y: [1, 2, 3] },
  //         { x: 'e', y: [9, 2, 1] },
  //       ],
  //     },
  //     {
  //       x: 'b',
  //       y: [
  //         { x: 'c', y: [6, 94] },
  //         { x: 'd', y: [] },
  //         { x: 'e', y: [3, 4, 7] },
  //       ],
  //     },
  //   ];

  //   expect(mergeConfigJsons(config1, config2)).toEqual(result);
  // });
});
