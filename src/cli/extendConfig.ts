import path from 'path';
import { writeFile, writeJsonFile } from './utils';
import { computeFileContents } from './computeFileContents';
import _ from 'lodash';
import bluebird from 'bluebird';
import fs from 'fs-extra';

export async function extendConfig(
  cwd: string,
  _fileContents: any = undefined,
) {
  const { fileContents } =
    { fileContents: _fileContents } || (await computeFileContents(cwd));
  const iterableFileContents = _.map(
    fileContents,
    (fileContent, destinationPath) => ({
      destinationPath,
      fileContent,
    }),
  );

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
