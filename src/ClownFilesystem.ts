import { FileContents } from './types';
import { jsonStringify } from './jsonStringify';
import path from 'path';

export class ClownFilesystem {
  fileContents: FileContents;
  jsonStringify = jsonStringify;
  jsonParse = JSON.parse;

  constructor(fileContents: FileContents) {
    this.fileContents = fileContents;
  }

  deleteFile = (filePath: string, fileContents = this.fileContents) => {
    delete fileContents[filePath];

    this.fileContents = fileContents;

    return this;
  };

  findFilePathByBaseName = (baseName: string) =>
    Object.keys(this.fileContents).find(
      filePath => path.basename(filePath) === baseName,
    );

  editJson = (
    filePath: string,
    cb: (json: any) => any,
    fileContents = this.fileContents,
  ) => {
    const jsonContent = this.jsonParse(fileContents[filePath].computedContent);
    const newJsonContent = cb(jsonContent);

    fileContents[filePath].computedContent = this.jsonStringify(newJsonContent);

    this.fileContents = fileContents;

    return this;
  };
}
