import {
  cleanupTempProject,
  createTempProject,
} from './helpers/createTempProject';
import { tempFixturesDir } from './helpers/helpers';
import { extendConfig } from '../extendConfig';
import path from 'path';

const cwd = __filename;

describe('use case 1', () => {
  describe('extending a project', () => {
    it('works 1', async () => {
      await createTempProject('project1');

      await extendConfig(path.resolve(tempFixturesDir, 'project1'));

      await cleanupTempProject('project1');
      // copy use-case from fixtures to a temp test directory.
      // mock `process.cwd()` to point to a temp test directory.
      // Run `extendConfig`
      // make assertions
    });
  });
});
