#!/usr/bin/env node
import path from 'path';
import { verifyHecConfigLooksGood } from './utils';
import { HecConfig } from './types';
import glob from 'globby';
import bluebird from 'bluebird';
import _ from 'lodash';

function getCorrespondingDestinationPath(sourceFile: string, pwd: string) {
  return path.resolve();
  /*
  {
    "some/path/node_modules/@hollowverse/config/eslint" : [
      {
        source: "some/path/node_modules/@hollowverse/config/eslint/.eslintrc.json",
        destination: "some/path/.eslintrc.json"
      },
      {
        source: "some/path/node_modules/@hollowverse/config/eslint/package.json",
        destination: "some/path/package.json"
      }
    ]
  }
  "some/path",
  "some/path/node_modules/@hollowverse/config/eslint/package.json" - "some/path/node_modules/@hollowverse/config/eslint"
  */
}

async function main() {
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

  So, let's reduce the list of extension paths to a single object with the key being the extension path and the value being
  an array of the files paths relative to the extension path.

  {
    "some/path/node_modules/@hollowverse/config/eslint" : [
      ".eslintrc.json",
      "package.json",
    "etc...": [
      "etc...",
      "etc..."
    ]
  }
  */
  const sourceFilesByExtensionName = await bluebird.reduce(
    extensionPaths,
    async (obj: { [name: string]: string[] }, extensionPath: string) => {
      obj[extensionPath] = (await glob(extensionPath, { dot: true })).map(
        sourceFile => path.relative(extensionPath, sourceFile),
      );

      return obj;
    },
    {},
  );

  /* Now we want to get the corresponding destination file for each source file. We can map the values
  of each of our sourceFiles object to make it look like this:

  {
    "some/path/node_modules/@hollowverse/config/eslint" : [
      {
        source: ".eslintrc.json",
        destination: "some/path/.eslintrc.json"
      },
      {
        source: "some/path/node_modules/@hollowverse/config/eslint/package.json",
        destination: "some/path/package.json"
      }
    ]
  }
  */
  const sourceAndDestinationFiles = _.mapValues(
    sourceFilesByExtensionName,
    sourceFiles =>
      sourceFiles.map(sourceFile => ({
        source: sourceFile,
        desintation: getCorrespondingDestinationPath(sourceFile, pwd),
      })),
  );

  // const sourceAndDestinationFiles = sourceFiles.map(sourceFile => ({
  //   sourceFile,
  //   destinationFile: getCorrespondingDestinationPath(sourceFile, pwd),
  // }));

  // console.log('sourceAndDestinationFiles', sourceAndDestinationFiles);
}

main();
