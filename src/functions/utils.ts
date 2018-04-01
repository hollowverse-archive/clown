import _ from 'lodash';

export function isArrayOfObjects(value: any[]) {
  return _.isArray(value) && _.every(value, _.isObject);
}

export function keyIsPotentialId(arrayOfObjects: any[], key: string) {
  const valuesOfKey = arrayOfObjects.map((obj: any) => obj[key]);

  return (
    isArrayOfStrings(valuesOfKey) &&
    _.uniq(valuesOfKey).length === arrayOfObjects.length
  );
}

export function isArrayOfStrings(value: any[]) {
  return _.isArray(value) && _.every(value, _.isString);
}

export function guessKeyWithUniqueValue(records: any[]) {
  const sampleRecord = records[0];
  const potentialKeys = _.mapValues(sampleRecord, (_value, key) =>
    keyIsPotentialId(records, key),
  );

  const firstPotentialKey = _.findKey(potentialKeys);

  if (firstPotentialKey === undefined) {
    throw new Error(
      `Could not guess record ID. Example record: ${JSON.stringify(
        sampleRecord,
      )}`,
    );
  }

  return firstPotentialKey;
}

export function isArrayOfUnmergeables(arr: any[]) {
  return _.isArray(arr) && _.every(arr, isUnmergeable);
}

export function isUnmergeable(value: any) {
  return _.some(
    [
      _.isString,
      _.isBoolean,
      _.isBuffer,
      _.isDate,
      _.isEmpty,
      _.isError,
      _.isFinite,
      _.isFunction,
      _.isInteger,
      _.isNaN,
      _.isNil,
      _.isNull,
      _.isNumber,
      _.isRegExp,
      _.isSymbol,
      _.isUndefined,
    ],
    fn => fn(value),
  );
}
