import _ from 'lodash';
import { ExtendJson } from './types';
import { guessKeyWithUniqueValue } from './utils';

export function extendArraysOfObjects(
  destination: any[],
  source: any[],
  extendJson: ExtendJson,
) {
  /* In this function we handle config arrays that look like this:

  Destination:
  [
    { x: 'a', y: ['foo', 'bar', 'baz'], z: 'ff', k: 12 },
    { x: 'b', y: ['1foo', '1bar', '1baz'], z: 'ff' },
  ],

  Source:
  [
    { x: 'a', y: ['2foo', '2bar', 'baz'], z: 'nn' },
    { x: 'b', y: ['1foo', '1bar', '1baz'], z: 'nn' },
  ],

  We want the merged result in this case to look like this:

  [
    { x: 'a', y: ['foo', 'bar', 'baz', '2foo', '2bar'], z: 'nn', k: 12 },
    { x: 'b', y: ['1foo', '1bar', '1baz'], z: 'nn' },
  ]

  Usually in config files, in structures such as the above, there's one key
  that determines the uniqueness of objects. In our sample data above, that key would be `x`.

  Our goal is to merge all the objects with the same value of `x` together.

  So first, let's find the unique key for our objects. */
  const uniqueKey = guessKeyWithUniqueValue(destination);

  if (uniqueKey === undefined) {
    throw new Error(
      `Could not guess record ID. Example record: ${JSON.stringify(
        destination[0],
      )}`,
    );
  }

  /* Since we'll be merging all objects that have the same key together,
  we don't need the two config objects to be separate, we can combine them all into
  one array, like this:

  [
    { x: 'a', y: ['foo', 'bar', 'baz'], z: 'ff', k: 12 },
    { x: 'b', y: ['1foo', '1bar', '1baz'], z: 'ff', },
    { x: 'a', y: ['2foo', '2bar', 'baz'], z: 'nn', },
    { x: 'b', y: ['1foo', '1bar', '1baz'], z: 'nn', },
  ]; */
  const combinedJsonConfigsArray = [...destination, ...source];

  /* Next, we can group our config objects by their unique key, like this

  {
    a: [
      { x: 'a', y: ['foo', 'bar', 'baz'], z: 'ff', k: 12, },
      { x: 'a', y: ['2foo', '2bar', 'baz'], z: 'nn', },
    ],
    b: [
      { x: 'b', y: ['1foo', '1bar', '1baz'], z: 'ff', },
      { x: 'b', y: ['1foo', '1bar', '1baz'], z: 'nn', },
    ],
  }; */
  const groupedByKey = _.groupBy(combinedJsonConfigsArray, uniqueKey);

  /* Now we can reduce the value of each key into a single object */
  const processedGroupedByKey = _.mapValues(groupedByKey, arrOfObjs => {
    /* We use `reduceRight` so that we start from the end so that the last values overwrite
    earlier values */
    return _.reduceRight(arrOfObjs, (acc, obj) => {
      return extendJson(obj, acc);
    });
  });

  return _.values(processedGroupedByKey);
}
