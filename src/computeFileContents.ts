import path from 'path';
import {
  isMergeableJsonContent,
  isDotIgnoreFile,
  readFile,
  getClownConfigPath,
  verifyClownConfigLooksGood,
} from './utils';
import { extendJson } from './extendJson';
import { extendDotIgnore } from './extendDotIgnore';
import bluebird from 'bluebird';
import {
  ClownConfig,
  FileContents,
  ExtensionPathAndSourceFiles,
} from './types';
import glob from 'globby';
import fs from 'fs-extra';
import { jsonStringify } from './jsonStringify';
import { ClownFilesystem } from './ClownFilesystem';
import { ensureHasFinalNewLine } from './ensureHasFinalNewLine';

// tslint:disable-next-line:max-func-body-length
export async function computeFileContents(cwd: string) {
  /* for Clown to work, the user has to have a file called `clown.json` at the location
  where they are running the script */
  const clownConfigPath = getClownConfigPath(cwd);
  const clownConfigContent = (await fs.readJson(
    clownConfigPath,
  )) as ClownConfig;

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
  verifyClownConfigLooksGood(clownConfigContent);

  /* So, let's map the list of extension paths so that for each path, we also have a list of the files
  paths relative to the extension path */
  const extensionPathsAndSourceFiles = await bluebird.map(
    clownConfigContent.extensions,
    async (extensionPath: string) => {
      const sourceFiles = await glob('**', { dot: true, cwd: extensionPath });

      if (sourceFiles.length === 0) {
        throw new Error(`${extensionPath} does not exist or has no content`);
      }

      return [extensionPath, sourceFiles] as ExtensionPathAndSourceFiles;
    },
  );

  /* `extensionPathsAndSourceFiles` is a list of all the files inside each extension path.
  Each item in the array looks like this:

  [
    'extensionFolder', // 👈 this is the extension path
    [
      'package.json', // 👈 these are the source files
      'eslintrc.json',
      'someFolder/someConfigFile.json'
    ]
  ]

  We want to reduce this structure to a single object, called `fileContents` where a KEY is the
  path to the destination file and the VALUE is the content of the file as a string.
  */
  return bluebird.reduce(
    extensionPathsAndSourceFiles,
    /* tslint:disable max-func-body-length */
    async (
      fileContents: FileContents,
      [extensionPath, sourceFiles]: ExtensionPathAndSourceFiles,
    ) => {
      let clownCallbackPath: string | null = null;

      await bluebird.each(sourceFiles, async sourceFile => {
        if (path.basename(sourceFile) === 'clownCallback.js') {
          clownCallbackPath = path.resolve(extensionPath, sourceFile);

          return;
        }

        /* We will need to merge each of the source files of this extension path with their targeted
        destination files. That's why we need to loop through the source files. */

        /* First, we need to read the content of the source file, which we will put in the
        destination file */
        const sourceFilePath = path.resolve(extensionPath, sourceFile);
        const sourceFileContent = await readFile(sourceFilePath);

        if (sourceFileContent === undefined) {
          throw new Error(
            `Error loading config source file at ${sourceFilePath}`,
          );
        }

        /* We consider the directory of the Clown config file to be the base from which we resolve
        the location of the destination file. So, if `clown.js` is located at `/some/path/clown.js`
        and the source file is located at `/other/location/package.json` then the location of the
        destination `package.json` is `/some/path/package.json`. That's what the few lines of code
        below compute. */
        const destinationFilePath = path.resolve(
          path.dirname(clownConfigPath),
          sourceFile,
        );

        /* Before we can determine what the content of the destination file will ultimately be,
        we need to read the existing content so that we can merge the content of the source files
        with it. So if we don't yet have a value for the destination file content, let's assign
        its initial value. */
        if (fileContents[destinationFilePath] === undefined) {
          const destinationFileContent = await readFile(destinationFilePath);

          fileContents[destinationFilePath] = {
            destinationContent: destinationFileContent,
            computedContent: destinationFileContent || '',
            type: 'unknown',
          };
        }
        /* Now we have the initial content for that destination file. Let's see if we can merge
        more stuff into it. */

        /* We know how to handle ignore files, such as .gitignore, .npmignore, etc. Let's see if
        our destination file is one of those, and if so, let's merge the content of the source file
        with it. */
        if (isDotIgnoreFile(path.basename(destinationFilePath))) {
          const extendedContent = extendDotIgnore(
            fileContents[destinationFilePath].computedContent,
            sourceFileContent,
          );

          fileContents[destinationFilePath].computedContent = extendedContent;
          fileContents[destinationFilePath].type = 'dot-ignore';

          return;
        }

        /* If the destination file initial content is JSON or the source file content is JSON,
        we treat this file as a JSON and extend it as such. */
        if (
          isMergeableJsonContent(
            fileContents[destinationFilePath].computedContent,
          ) ||
          isMergeableJsonContent(sourceFileContent)
        ) {
          const extendedContent = extendJson(
            JSON.parse(
              fileContents[destinationFilePath].computedContent || '{}',
            ),
            JSON.parse(sourceFileContent),
          );

          fileContents[destinationFilePath].computedContent = jsonStringify(
            extendedContent,
            fileContents[destinationFilePath].computedContent,
          );
          fileContents[destinationFilePath].type = 'json';

          return;
        }

        /* If the content type of the file is something we don't know how to extend, then we
        just put the content of the source file into the destination as-is */
        fileContents[destinationFilePath].computedContent = sourceFileContent;
        fileContents[destinationFilePath].type = 'unknown';

        return;
      });

      if (clownCallbackPath) {
        const clownFilesystem = new ClownFilesystem(fileContents);

        // tslint:disable:next non-literal-require no-parameter-reassignment
        fileContents =
          require(clownCallbackPath)(clownFilesystem) ||
          clownFilesystem.fileContents;

        clownCallbackPath = null;
      }

      fileContents = ensureHasFinalNewLine(fileContents);

      /* When the `each` loop above finishes, that means we have computed all of our file contents.
      Let's return them. */
      return fileContents;
    },
    {},
  );
}
