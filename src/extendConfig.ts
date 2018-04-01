import path from 'path';
import { writeFile } from './utils';
import { computeFileContents } from './computeFileContents';
import _ from 'lodash';
import bluebird from 'bluebird';
import fs from 'fs-extra';

export async function extendConfig(cwd: string) {
  const fileContents = await computeFileContents(cwd);
  const iterableFileContents = _.entries(fileContents);

  await bluebird.each(
    iterableFileContents,
    async ([destinationPath, fileContent]) => {
      await fs.mkdirp(path.dirname(destinationPath));

      return writeFile(destinationPath, fileContent);
    },
  );
}
