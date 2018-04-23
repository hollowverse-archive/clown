import { FileContents } from './types';
import { jsonStringify } from './jsonStringify';
import path from 'path';
import json5 from 'json5';

const getFullPath = (filePath: string) => path.resolve(process.cwd(), filePath);

export class ClownFilesystem {
  fileContents: FileContents;
  jsonStringify = jsonStringify;
  jsonParse = json5.parse;

  constructor(fileContents: FileContents) {
    this.fileContents = fileContents;
  }

  add = (
    relativePath: string,
    computedContent: string,
    fileContents = this.fileContents,
  ) => {
    const fullPath = getFullPath(relativePath);

    fileContents[fullPath].computedContent = computedContent;

    this.fileContents = fileContents;

    return this;
  };

  remove = (relativePath: string, fileContents = this.fileContents) => {
    delete fileContents[getFullPath(relativePath)];

    this.fileContents = fileContents;

    return this;
  };

  editJson = (
    relativePath: string,
    cb: (json: any) => any,
    fileContents = this.fileContents,
  ) => {
    const fullPath = getFullPath(relativePath);
    const jsonContent = this.jsonParse(fileContents[fullPath].computedContent);
    const newJsonContent = cb(jsonContent);

    fileContents[fullPath].computedContent = this.jsonStringify(newJsonContent);

    this.fileContents = fileContents;

    return this;
  };

  editString = (
    relativePath: string,
    cb: (json: any) => any,
    fileContents = this.fileContents,
  ) => {
    const fullPath = getFullPath(relativePath);
    const newContent = cb(fileContents[fullPath].computedContent);

    fileContents[fullPath].computedContent = newContent;

    this.fileContents = fileContents;

    return this;
  };
}
