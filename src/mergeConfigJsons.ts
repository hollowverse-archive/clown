// import { Rule } from './types';
import {
  some,
  isArray,
  isPlainObject,
  every,
  isObject,
  mapValues,
  isString,
  uniq,
  findKey,
  merge,
  mergeWith,
} from 'lodash';
import {
  isMergeableStructure,
  guessRecordId,
  isArrayOfStrings,
  isArrayOfNumbers,
  isArrayOfObjects,
} from './utils';

export function mergeConfigJsons(targetJsonConfig: any, sourceJsonConfig: any) {
  /*
# Merging arrays of objects

Collect the keys of unmergeable structures in any one of the objects.
Find the first key that is unique among all the objects in the array.
Use that key as the ID by which to merge the objects in the array.
*/
  // const config1 = [
  //   {
  //     x: 'a',
  //     y: [{ x: 'c', y: [4] }, { x: 'd', y: [1, 2, 3] }],
  //   },
  //   {
  //     x: 'b',
  //     y: [{ x: 'c', y: [6] }, { x: 'd', y: [] }],
  //   },
  // ];

  // const config2 = [
  //   {
  //     x: 'a',
  //     y: [{ x: 'c', y: [3, 4, 8] }, { x: 'e', y: [9, 2, 1] }],
  //   },
  //   {
  //     x: 'b',
  //     y: [{ x: 'c', y: [94] }, { x: 'e', y: [3, 4, 7] }],
  //   },
  // ];

  // const result = [
  //   {
  //     x: 'a',
  //     y: [
  //       { x: 'c', y: [4, 3, 8] },
  //       { x: 'd', y: [1, 2, 3] },
  //       { x: 'e', y: [9, 2, 1] },
  //     ],
  //   },
  //   {
  //     x: 'b',
  //     y: [{ x: 'c', y: [6, 94] }, { x: 'd', y: [] }, { x: 'e', y: [3, 4, 7] }],
  //   },
  // ];
  const jsonConfigsToMerge = [targetJsonConfig, sourceJsonConfig];
  if (
    every(
      jsonConfigsToMerge,
      jsonConfig =>
        isArrayOfStrings(jsonConfig) || isArrayOfNumbers(jsonConfig),
    )
  ) {
    const mergedJsonConfigs = merge(targetJsonConfig, sourceJsonConfig);

    return uniq(mergedJsonConfigs);
  }

  if (every(jsonConfigsToMerge, isArrayOfObjects)) {
    const result = mergeWith(
      targetJsonConfig,
      sourceJsonConfig,
      (objValue, srcValue) => {
        if (every([objValue, srcValue], isArray)) {
          return merge(objValue, srcValue);
        }
      },
    );

    return result;
  }
}
