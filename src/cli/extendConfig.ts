import path from 'path';
import {
  iterateOverSourceAndDestinationFiles,
  isMergeableJsonContent,
  writeFile,
  writeJsonFile,
  isDotIgnoreFile,
} from './utils';
import realmkdirp from 'mkdirp';
import { promisify } from 'util';
import { extendJson } from '../functions/extendJson';
import { extendDotIgnore } from '../functions/extendDotIgnore';
import { getExtensionPathsAndSourceFiles } from './getExtensionPathsAndSourceFiles';
import { stripIndents } from 'common-tags';
import { getChanges } from './getChanges';
import _ from 'lodash';
import { Change } from './types';
import bluebird from 'bluebird';

const mkdirp = promisify(realmkdirp);

export async function extendConfig() {
  const changes = await getChanges();
  const iterableChanges = (_.map(changes, (change, destinationPath) => ({
    destinationPath,
    change,
  })) as any) as { destinationPath: string; change: Change }[];

  return await bluebird.each(
    iterableChanges,
    async ({ destinationPath, change: { content, type } }) => {
      await mkdirp(path.dirname(destinationPath));

      if (type === 'json') {
        return writeJsonFile(destinationPath, JSON.parse(content));
      }

      return writeFile(destinationPath, content);
    },
  );
}
