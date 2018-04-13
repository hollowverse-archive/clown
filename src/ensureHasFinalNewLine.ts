import { FileContents } from './types';
import _ from 'lodash';

export function ensureHasFinalNewLine(fileContents: FileContents) {
  return _.mapValues(fileContents, fileContent => {
    if (
      fileContent.computedContent &&
      !fileContent.computedContent.endsWith('\n')
    ) {
      fileContent.computedContent = `${fileContent.computedContent}\n`;
    }

    return fileContent;
  });
}
