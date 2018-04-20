import { ClownConfig } from './types';
import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import json5 from 'json5';

export function getClownConfigPath(cwd: string) {
  return path.resolve(cwd, 'clown.json');
}

export async function writeFile(filePath: string, fileContent: string) {
  return fs.writeFile(filePath, fileContent, 'utf8');
}

export async function readFile(filePath: string) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (e) {
    return undefined;
  }
}

export function verifyClownConfigLooksGood(clownConfig: ClownConfig) {
  const looksGood =
    _.isPlainObject(clownConfig) &&
    _.isArray(clownConfig.extensions) &&
    _.isString(clownConfig.extensions[0]);

  if (!looksGood) {
    throw new Error('clown.js file does not look valid');
  }
}

export function isMergeableJsonContent(str: string) {
  let content: any;

  try {
    content = json5.parse(str);
  } catch (e) {
    return false;
  }

  return _.some([_.isArray, _.isPlainObject], fn => fn(content));
}

export function isDotIgnoreFile(fileName: string) {
  return /^\..*ignore.*/i.test(fileName);
}

export function isArrayOfObjects(value: any[]) {
  return _.isArray(value) && _.every(value, _.isObject);
}

export function isArrayOfStrings(value: any[]) {
  return _.isArray(value) && _.every(value, _.isString);
}

export function keyIsPotentialId(arrayOfObjects: any[], key: string) {
  const valuesOfKey = arrayOfObjects.map((obj: any) => obj[key]);

  return _.uniqWith(valuesOfKey, _.isEqual).length === arrayOfObjects.length;
}

/** Find the first key which every single object in `records` has */
export function guessKeyWithUniqueValue(records: any[]) {
  const allKeys = _.flatten(
    records.map(r => _.keys(r).filter(k => keyIsPotentialId(records, k))),
  );

  return _.find(allKeys, key =>
    _.every(records, record => _.hasIn(record, key)),
  );
}

export function isArrayOfUnmergeables(arr: any[]) {
  return (
    _.isArray(arr) &&
    (_.every(arr, isOfUnmergeableType) ||
      (_.every(arr, _.isPlainObject) &&
        guessKeyWithUniqueValue(arr) === undefined))
  );
}

export function isOfUnmergeableType(value: any) {
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
