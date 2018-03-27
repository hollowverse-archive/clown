import {
  cleanupTempProject,
  createTempProject,
} from './helpers/createTempProject';
import { tempDir } from './helpers/helpers';
import { extendConfig } from '../extendConfig';
import path from 'path';
import fs from 'fs-extra';
import { readFile } from '../utils';

const cwd = __filename;

describe('use case 1', () => {
  describe('extending a project', () => {
    it('works 1', async () => {
      const tempProject = path.resolve(tempDir, 'project1');

      await createTempProject('project1', 'extensionsModule1');

      await extendConfig(tempProject);

      const pkgjson = await readFile(path.resolve(tempProject, 'package.json'));

      console.log('pkgJson', pkgjson);

      await cleanupTempProject('project1', 'extensionsModule1');
    });
  });
});
