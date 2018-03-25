import { HecConfig } from './types';
import _ from 'lodash';

export function verifyHecConfigLooksGood(hecConfig: HecConfig) {
  const looksGood =
    _.isPlainObject(hecConfig) &&
    _.isString(hecConfig.extensionsModule) &&
    _.isArray(hecConfig.extensions) &&
    _.isString(hecConfig.extensions[0]);

  if (!looksGood) {
    throw new Error('hec.js file does not look valid');
  }
}
