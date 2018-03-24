import * as _ from 'lodash';
import {
  isArrayOfObjects,
  isArrayOfUnmergeables,
  isUnmergeable,
} from './utils';
import { mergeArraysOfObjects } from './mergeArraysOfObjects';

export function mergeConfigs(destination: any, source: any) {
  const configs = [destination, source];

  if (_.every(configs, isUnmergeable)) {
    return source;
  }

  if (_.every(configs, isArrayOfUnmergeables)) {
    return _.uniq([...destination, ...source]);
  }

  if (_.every(configs, isArrayOfObjects)) {
    return mergeArraysOfObjects(destination, source, mergeConfigs);
  }

  if (_.every(configs, _.isPlainObject)) {
    return _.mapValues({ ...destination, ...source }, (val, key) => {
      if (destination[key] === undefined) {
        return source[key];
      }

      if (source[key] === undefined) {
        return destination[key];
      }

      return mergeConfigs(destination[key], source[key]);
    });
  }

  /* All complex structures will be handled by the code above. If we get to this point,
  that means we were given simple values, such as strings, numbers, booleans. In such cases,
  we just return the source value. */
  return source;
}
