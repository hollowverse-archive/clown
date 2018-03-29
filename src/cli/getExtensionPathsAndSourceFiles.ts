import path from 'path';
import { verifyClownConfigLooksGood, getClownConfigPath } from './utils';
import { ClownConfig, ExtensionPathAndSourceFiles } from './types';
import glob from 'globby';
import bluebird from 'bluebird';
import fs from 'fs-extra';

export async function getExtensionPathsAndSourceFiles(cwd: string) {
  /* for Clown to work, the user has to have a file called `clown.js` at the location
  where they are running the script */
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

  /* `extensionsModule` is expected to have a folder named `clown` inside it. Inside `clown` folder,
  there will be one or more folders that correspond to the items in the `extensions` array of the
  `clownConfig`. So let's create a list of the absolute paths to all of those folders. */
  const extensionPaths = clownConfig.extensions.map(extensionPath => {
    return path.resolve(clownConfigPath, extensionPath);
  });

  /* Now, `extensionsPaths` is an array of absolute paths to the extension folders. We need a list of all the files and
  folders inside each of the extension folders. We can use `glob` to list the content.

  So, let's map the list of extension paths so that for each path, we also have a list of the files
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
  return await bluebird.map(extensionPaths, async (extensionPath: string) => {
    return [
      extensionPath,
      await glob('**', { dot: true, cwd: extensionPath }),
    ] as ExtensionPathAndSourceFiles;
  });
}
