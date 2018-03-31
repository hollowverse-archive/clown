import path from 'path';
import { verifyClownConfigLooksGood, getClownConfigPath } from './utils';
import { ClownConfig, ExtensionPathAndSourceFiles } from './types';
import glob from 'globby';
import bluebird from 'bluebird';
import fs from 'fs-extra';
import { vol } from '@forabi/memfs';

export async function getExtensionPathsAndSourceFiles(cwd: string) {
  /* for Clown to work, the user has to have a file called `clown.js` at the location
  where they are running the script */
  // console.log('vol', vol.toJSON());
  const clownConfigPath = getClownConfigPath(cwd);
  const clownConfig = (await fs.readJson(clownConfigPath)) as ClownConfig;

  /* We expect our `clownConfig` to look like this:

  {
    extensions: [
      './node_modules/@hollowverse/config/clown/basics',
      './node_modules/@hollowverse/config/clown/eslint',
      './node_modules/@hollowverse/config/clown/eslintBrowser',
      './node_modules/@hollowverse/config/clown/eslintGraphql'
    ],
  };

  Let's verify that or throw */
  verifyClownConfigLooksGood(clownConfig);

  /* So, let's map the list of extension paths so that for each path, we also have a list of the files
  paths relative to the extension path:

  [
    [
      "some/path/node_modules/@hollowverse/config/eslint", [".eslintrc.json", "package.json"],
    ],
    [
      "etc...": ["etc...", "etc..."]
    ]
  ]
  */
  return await bluebird.map(
    clownConfig.extensions,
    async (extensionPath: string) => {
      return [
        extensionPath,
        await glob('**', { dot: true, cwd: extensionPath }),
      ] as ExtensionPathAndSourceFiles;
    },
  );
}
