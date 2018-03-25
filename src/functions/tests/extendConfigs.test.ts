import { extendConfigs } from '../extendConfigs';

describe('extendConfigs', () => {
  describe('merging primitives', () => {
    it('returns the source string when merging strings', () => {
      expect(extendConfigs('foo', 'bar')).toEqual('bar');
    });

    it('returns the source number when merging numbers', () => {
      expect(extendConfigs(1, 2)).toEqual(2);
    });

    it('returns the source boolean when merging booleans', () => {
      expect(extendConfigs(true, false)).toEqual(false);
    });

    it('returns the source value when given falsy values', () => {
      expect(extendConfigs(null, undefined)).toEqual(undefined);
      expect(extendConfigs(undefined, null)).toEqual(null);
      expect(extendConfigs(NaN, null)).toEqual(null);
      expect(extendConfigs(null, NaN)).toEqual(NaN);
    });
  });

  describe('merging arrays of unmergeables', () => {
    it('spreads the content into a single array and runs _.uniq on them', () => {
      expect(extendConfigs([1, 2, 3], [4, 5, 6, 1])).toEqual([
        1,
        2,
        3,
        4,
        5,
        6,
      ]);
    });
  });

  describe('merging arrays of objects', () => {
    it('works 1', () => {
      expect(
        extendConfigs(
          [{ x: '1', y: [1, 2, 6] }],
          [{ x: '1', y: [1, 2, 3, 4] }],
        ),
      ).toEqual([{ x: '1', y: [1, 2, 6, 3, 4] }]);
    });

    it('works 2', () => {
      expect(
        extendConfigs(
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

    it('works 3', () => {
      const config1 = [
        {
          x: 'a',
          y: [{ x: 'c', y: [4] }, { x: 'd', y: [1, 2, 3] }],
        },
        {
          x: 'b',
          y: [{ x: 'c', y: [6] }, { x: 'd', y: [] }],
        },
      ];

      const config2 = [
        {
          x: 'a',
          y: [{ x: 'c', y: [3, 4, 8] }, { x: 'e', y: [9, 2, 1] }],
        },
        {
          x: 'b',
          y: [{ x: 'c', y: [94] }, { x: 'e', y: [3, 4, 7] }],
        },
      ];

      const result = [
        {
          x: 'a',
          y: [
            { x: 'c', y: [4, 3, 8] },
            { x: 'd', y: [1, 2, 3] },
            { x: 'e', y: [9, 2, 1] },
          ],
        },
        {
          x: 'b',
          y: [
            { x: 'c', y: [6, 94] },
            { x: 'd', y: [] },
            { x: 'e', y: [3, 4, 7] },
          ],
        },
      ];

      expect(extendConfigs(config1, config2)).toEqual(result);
    });
  });

  describe('merging plain objects', () => {
    it('works 1', () => {
      expect(extendConfigs({ hi: 1 }, { ho: 2 })).toEqual({
        hi: 1,
        ho: 2,
      });
    });

    it('works 2', () => {
      expect(extendConfigs({ a: 1 }, { b: 2, c: 3 })).toEqual({
        a: 1,
        b: 2,
        c: 3,
      });
    });

    it('works 3', () => {
      expect(extendConfigs({ a: 1, b: { c: 1 } }, { b: 2, c: 4 })).toEqual({
        a: 1,
        b: 2,
        c: 4,
      });
    });

    it('works 4', () => {
      expect(extendConfigs({ a: 1, b: { c: 1 } }, { b: { c: 4 } })).toEqual({
        a: 1,
        b: {
          c: 4,
        },
      });
    });
  });
});
