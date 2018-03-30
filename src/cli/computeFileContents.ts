import path from 'path';
import {
  isMergeableJsonContent,
  isDotIgnoreFile,
  readFile,
  getClownConfigPath,
} from './utils';
import { extendJson } from '../functions/extendJson';
import { extendDotIgnore } from '../functions/extendDotIgnore';
import { getExtensionPathsAndSourceFiles } from './getExtensionPathsAndSourceFiles';
import bluebird from 'bluebird';
import { FileContents, ExtensionPathAndSourceFiles } from './types';

export async function computeFileContents(cwd: string) {
  const extensionPathsAndSourceFiles = await getExtensionPathsAndSourceFiles(
    cwd,
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

  We want to reduce this structure to a single object where a KEY is the path to the destination file
  and the VALUE is the content of the file as a string.
  */
  return bluebird.reduce(
    extensionPathsAndSourceFiles,
    async (
      fileContents: FileContents,
      [extensionPath, sourceFiles]: ExtensionPathAndSourceFiles,
    ) => {
      const clownConfigPath = getClownConfigPath(cwd);

      await bluebird.each(sourceFiles, async sourceFile => {
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
        with it. So if we don't yet have a value for the destination file conent, let's assign
        its initial value. */
        if (fileContents[destinationFilePath] === undefined) {
          const destinationFileContent = await readFile(destinationFilePath);

          fileContents[destinationFilePath] = {
            content: destinationFileContent || '',
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
            fileContents[destinationFilePath].content,
            sourceFileContent,
          );

          fileContents[destinationFilePath] = {
            content: extendedContent,
            type: 'dotIgnore',
          };
          return;
        }

        /* If the destination file initial content is JSON or the source file content is JSON,
        we treat this file as a JSON and extend it as such. */
        if (
          isMergeableJsonContent(fileContents[destinationFilePath].content) ||
          isMergeableJsonContent(sourceFileContent)
        ) {
          const extendedContent = extendJson(
            JSON.parse(fileContents[destinationFilePath].content || '{}'),
            JSON.parse(sourceFileContent),
          );

          fileContents[destinationFilePath] = {
            content: JSON.stringify(extendedContent),
            type: 'json',
          };
          return;
        }

        /* If the content type of the file is something we don't know how to extend, then we
        just put the content of the source file into the destination as-is */
        fileContents[destinationFilePath] = {
          content: sourceFileContent,
          type: 'unknown',
        };
        return;
      });

      /* When the `each` loop above finishes, that means we have computed all of our file contents.
      Let's return them. */
      return fileContents;
    },
    {},
  );
}
