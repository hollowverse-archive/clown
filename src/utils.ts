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
  isNumber,
} from 'lodash';

export function isMergeableStructure(value: any) {
  return some([isArray, isPlainObject], fn => fn(value));
}

export function isArrayOfObjects(value: any[]): value is object[] {
  return isArray(value) && every(value, isObject);
}

export function keyIsPotentialId(arrayOfObjects: object[], key: string) {
  const valuesOfKey = arrayOfObjects.map((obj: any) => obj[key]);

  return (
    isArrayOfStrings(valuesOfKey) &&
    uniq(valuesOfKey).length === arrayOfObjects.length
  );
}

export function isArrayOfStrings(value: any[]): value is string[] {
  return isArray(value) && every(value, isString);
}

export function isArrayOfNumbers(value: any[]): value is number[] {
  return isArray(value) && every(value, isNumber);
}

export function guessRecordId(records: object[]) {
  const sampleRecord = records[0];
  const potentialKeys = mapValues(sampleRecord, key =>
    keyIsPotentialId(records, key),
  );

  const key = findKey(potentialKeys);

  if (key === undefined) {
    throw new Error(
      `Could not guess record ID. Example record: ${JSON.stringify(
        sampleRecord,
      )}`,
    );
  }

  return key;
}
