import _ from 'lodash';
import {
  isArrayOfObjects,
  isArrayOfUnmergeables,
  isOfUnmergeableType,
} from './utils';
import { extendArraysOfObjects } from './extendArraysOfObjects';

export function extendJson(destination: any, source: any): any {
  const configs = [destination, source];

  if (_.every(configs, isOfUnmergeableType)) {
    return source;
  }

  if (_.every(configs, isArrayOfUnmergeables)) {
    return _.uniqWith([...destination, ...source], _.isEqual);
  }

  if (_.every(configs, isArrayOfObjects)) {
    return extendArraysOfObjects(destination, source, extendJson);
  }

  if (_.every(configs, _.isPlainObject)) {
    return _.mapValues({ ...destination, ...source }, (_1, key) => {
      if (destination[key] === undefined) {
        return source[key];
      }

      if (source[key] === undefined) {
        return destination[key];
      }

      return extendJson(destination[key], source[key]);
    });
  }

  /* If we don't explicitly handle the case in one of the branches above, just
  return the source as the value of the merge. */
  return source;
}
