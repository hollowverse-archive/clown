import path from 'path';
import { verifyClownConfigLooksGood } from './utils';
import { ClownConfig, ExtensionPathAndSourceFiles } from './types';
import glob from 'globby';
import bluebird from 'bluebird';

export async function getExtensionPathsAndSourceFiles(cwd: string) {
  /* for HEC to work, the user has to have a file called `clown.js` at the location
  where they are running the script */
  const clownConfig = require(path.resolve(cwd, 'clown.js')) as ClownConfig;

  /* We expect our `clownConfig` to look like this:

  {
    extensionsModule: '@hollowverse/config',
    extensions: ['basics', 'typescript', 'eslint']
  }

  Let's verify that or throw */
  verifyClownConfigLooksGood(clownConfig);

  /* The `extensionsModule` key of `clownConfig` tells us where we should find the repo
  that has all the extensions. So, let's get the absolute path to `extensionsModule`. */
  const extensionsModulePath = path.resolve(
    cwd,
    'node_modules',
    clownConfig.extensionsModule,
  );

  /* `extensionsModule` is expected to have a folder named `clown` inside it. Inside `clown` folder,
  there will be one or more folders that correspond to the items in the `extensions` array of the
  `clownConfig`. So let's create a list of the absolute paths to all of those folders. */
  const extensionPaths = clownConfig.extensions.map(extensionName => {
    return path.resolve(extensionsModulePath, extensionName);
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
