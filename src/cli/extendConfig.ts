import path from 'path';
import { writeFile, writeJsonFile } from './utils';
import { getChanges } from './getChanges';
import _ from 'lodash';
import bluebird from 'bluebird';
import fs from 'fs-extra';

export async function extendConfig(cwd: string) {
  const changes = await getChanges(cwd);
  const iterableChanges = _.map(changes, (change, destinationPath) => ({
    destinationPath,
    change,
  }));

  return await bluebird.each(
    iterableChanges,
    async ({ destinationPath, change: { content, type } }) => {
      await fs.mkdirp(path.dirname(destinationPath));

      if (type === 'json') {
        return writeJsonFile(destinationPath, JSON.parse(content));
      }

      return writeFile(destinationPath, content);
    },
  );
}
