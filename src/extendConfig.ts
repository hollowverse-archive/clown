import path from 'path';
import { writeFile } from './utils';
import { computeFileContents } from './computeFileContents';
import _ from 'lodash';
import bluebird from 'bluebird';
import fs from 'fs-extra';
import { isJsonEqual } from './isJsonEqual';

export async function extendConfig(cwd: string) {
  const fileContents = await computeFileContents(cwd);
  const iterableFileContents = _.entries(fileContents);

  await bluebird.each(
    iterableFileContents,
    async ([destinationPath, fileContent]) => {
      if (
        fileContent.destinationContent &&
        fileContent.type === 'json' &&
        isJsonEqual(fileContent.destinationContent, fileContent.computedContent)
      ) {
        return;
      }

      await fs.mkdirp(path.dirname(destinationPath));

      await writeFile(destinationPath, fileContent.computedContent);
    },
  );
}
