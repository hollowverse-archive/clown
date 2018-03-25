#!/usr/bin/env node
import path from 'path';
import {
  verifyHecConfigLooksGood,
  isMergeableJsonContent,
  readFile,
  writeFile,
  isDotIgnoreFile,
} from './utils';
import { HecConfig, ExtensionPathsAndSourceFile } from './types';
import glob from 'globby';
import bluebird from 'bluebird';
import _ from 'lodash';
import realmkdirp from 'mkdirp';
import { promisify } from 'util';
import { extendJson } from '../functions/extendJson';
import { extendDotIgnore } from '../functions/extendDotIgnore';

const mkdirp = promisify(realmkdirp);

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
  const extensionPathsAndSourceFiles = await bluebird.map(
    extensionPaths,
    async (extensionPath: string) => {
      return [
        extensionPath,
        await glob('**', { dot: true, cwd: extensionPath }),
      ] as ExtensionPathsAndSourceFile;
    },
  );

  /* Now we can iterate over the source files for each extension, and either merge them with existing
  destination files, or simply copy them over as-is.

  Since we're doing this operation in an async manner, we return a promise from our `main` function
  to make sure the process doesn't exit before all promises have been resolved.
  (I'm not sure about this last bit, but I'm doing it just in case.) */
  await bluebird.each(extensionPathsAndSourceFiles, iterateOverSourceFiles);

  function iterateOverSourceFiles([
    extensionPath,
    sourceFiles,
  ]: ExtensionPathsAndSourceFile) {
    return bluebird.each(sourceFiles, sourceFile =>
      moveAndExtend(extensionPath, sourceFile),
    );
  }

  async function moveAndExtend(extensionPath: string, sourceFile: string) {
    const sourceFilePath = path.resolve(extensionPath, sourceFile);
    const destinationFilePath = path.resolve(pwd, sourceFile);
    const sourceFileContent = (await readFile(sourceFilePath)) as string;
    const destinationFileContent = await readFile(destinationFilePath);

    if (destinationFileContent === undefined) {
      /* if the destinationFileContent is undefined, that means we couldn't find the destination
      file at the expected location, either because the directory itself or the file doesn't exist.
      So before we attempt to create the file, let's ensure that the directory exists and then create the file. */
      await mkdirp(path.dirname(destinationFilePath));
      return writeFile(destinationFilePath, sourceFileContent);
    }

    if (isDotIgnoreFile(path.basename(destinationFilePath))) {
      const extendedContent = extendDotIgnore(
        destinationFileContent,
        sourceFileContent,
      );

      return writeFile(destinationFilePath, extendedContent);
    }

    if (isMergeableJsonContent(destinationFileContent)) {
      const extendedContent = extendJson(
        JSON.parse(destinationFileContent),
        JSON.parse(sourceFileContent),
      );

      return writeFile(destinationFilePath, JSON.stringify(extendedContent));
    }

    return writeFile(destinationFilePath, sourceFileContent);
  }
}

main();
