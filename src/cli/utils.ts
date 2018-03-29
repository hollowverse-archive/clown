import { ClownConfig, ExtensionPathAndSourceFiles } from './types';
import _ from 'lodash';
import fs from 'fs-extra';
import realWriteJsonFile from 'write-json-file';
import path from 'path';

export function getClownConfigPath(cwd: string) {
  return path.resolve(cwd, 'clown.js');
}

export function writeJsonFile(filePath: string, json: {}) {
  return realWriteJsonFile(filePath, json, {
    indent: ' ',
    detectIndent: true,
  });
}

export function writeFile(filePath: string, fileContent: string) {
  return fs.writeFile(filePath, fileContent, 'utf8');
}

export async function readFile(filePath: string) {
  try {
    return fs.readFile(filePath, 'utf8');
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
    content = JSON.parse(str);
  } catch (e) {
    return false;
  }

  return _.some([_.isArray, _.isPlainObject], fn => fn(content));
}

export function isDotIgnoreFile(fileName: string) {
  return /^\..*ignore.*/i.test(fileName);
}
