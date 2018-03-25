import { HecConfig } from './types';
import _ from 'lodash';
import fs from 'fs';
import { promisify } from 'util';

const promisifiedReadFile = promisify(fs.readFile);
const promisifiedWriteFile = promisify(fs.writeFile);

export async function writeFile(filePath: string, fileContent: string) {
  return await promisifiedWriteFile(filePath, fileContent, 'utf8');
}

export async function readFile(filePath: string) {
  try {
    return await promisifiedReadFile(filePath, 'utf8');
  } catch (e) {
    return undefined;
  }
}

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
