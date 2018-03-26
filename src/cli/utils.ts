import { HecConfig } from './types';
import _ from 'lodash';
import fs from 'fs';
import { promisify } from 'util';
import realWriteJsonFile from 'write-json-file';

const promisifiedReadFile = promisify(fs.readFile);
const promisifiedWriteFile = promisify(fs.writeFile);

export function writeJsonFile(filePath: string, json: {}) {
  return realWriteJsonFile(filePath, json, {
    indent: ' ',
    detectIndent: true,
  });
}

export function writeFile(filePath: string, fileContent: string) {
  return promisifiedWriteFile(filePath, fileContent, 'utf8');
}

export async function readFile(filePath: string) {
  try {
    return await promisifiedReadFile(filePath, 'utf8');
  } catch (e) {
    console.log('e', e);
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

export function isMergeableJsonContent(str: string) {
  let content: any;

  try {
    content = JSON.parse(str);
  } catch (e) {
    return false;
  }

  return _.some([_.isArray, _.isPlainObject], fn => fn(content));
}

export function isDotIgnoreFile(fileName: string) {
  return /^\..*ignore.*/i.test(fileName);
}
