import path from 'path';
import { writeFile, writeJsonFile } from './utils';
import { computeFileContents } from './computeFileContents';
import _ from 'lodash';
import bluebird from 'bluebird';
import fs from 'fs-extra';
import mockFs from 'mock-fs';

export async function extendConfig(
  cwd: string,
  mockContent: { [name: string]: string } | undefined = undefined,
) {
  const { fileContents } = await computeFileContents(cwd);
  const iterableFileContents = _.map(
    fileContents,
    (fileContent, destinationPath) => ({
      destinationPath,
      fileContent,
    }),
  );

  if (mockContent) {
    mockFs(mockContent);
  }

  return await bluebird.each(
    iterableFileContents,
    async ({ destinationPath, fileContent: { content, type } }) => {
      await fs.mkdirp(path.dirname(destinationPath));

      if (type === 'json') {
        return writeJsonFile(destinationPath, JSON.parse(content));
      }

      return writeFile(destinationPath, content);
    },
  );
}
