import path from 'path';
import { verifyHecConfigLooksGood } from './utils';
import { HecConfig, ExtensionPathAndSourceFiles } from './types';
import glob from 'globby';
import bluebird from 'bluebird';

export async function getExtensionPathsAndSourceFiles() {
  /* pwd is the location from where the user is running this shell script */
  const pwd = process.cwd();

  /* for HEC to work, the user has to have a file called `hec.js` at the location
  where they are running the script */
  const hecConfig = require(path.resolve(pwd, 'hec.js')) as HecConfig;

  /* We expect our `hecConfig` to look like this:

  {
    extensionsModule: '@hollowverse/config',
    extensions: ['basics', 'typescript', 'eslint']
  }

  Let's verify that or throw */
  verifyHecConfigLooksGood(hecConfig);

  /* The `extensionsModule` key of `hecConfig` tells us where we should find the repo
  that has all the extensions. So, let's get the absolute path to `extensionsModule`. */
  const extensionsModulePath = path.resolve(
    pwd,
    'node_modules',
    hecConfig.extensionsModule,
  );

  /* `extensionsModule` is expected to have a folder named `hec` inside it. Inside `hec` folder,
  there will be one or more folders that correspond to the items in the `extensions` array of the
  `hecConfig`. So let's create a list of the absolute paths to all of those folders. */
  const extensionPaths = hecConfig.extensions.map(extensionName => {
    return path.resolve(extensionsModulePath, 'hec', extensionName);
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
