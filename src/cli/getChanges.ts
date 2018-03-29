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
import { Changes, ExtensionPathAndSourceFiles } from './types';

export async function getChanges(cwd: string) {
  const extensionPathsAndSourceFiles = await getExtensionPathsAndSourceFiles(
    cwd,
  );

  return bluebird.reduce(
    extensionPathsAndSourceFiles,
    async (
      changes: Changes,
      [extensionPath, sourceFiles]: ExtensionPathAndSourceFiles,
    ) => {
      const clownConfigPath = getClownConfigPath(cwd);

      await bluebird.each(sourceFiles, async sourceFile => {
        const sourceFilePath = path.resolve(extensionPath, sourceFile);
        const sourceFileContent = await readFile(sourceFilePath);

        if (sourceFileContent === undefined) {
          throw new Error(
            `Error loading config source file at ${sourceFilePath}`,
          );
        }

        const destinationFilePath = path.resolve(
          path.dirname(clownConfigPath),
          sourceFile,
        );

        if (changes[destinationFilePath] === undefined) {
          const destinationFileContent = await readFile(destinationFilePath);

          changes[destinationFilePath] = {
            content: destinationFileContent || '',
            type: 'unknown',
          };
        }

        if (isDotIgnoreFile(path.basename(destinationFilePath))) {
          const extendedContent = extendDotIgnore(
            changes[destinationFilePath].content,
            sourceFileContent,
          );

          changes[destinationFilePath] = {
            content: extendedContent,
            type: 'dotIgnore',
          };
          return;
        }

        if (
          isMergeableJsonContent(changes[destinationFilePath].content) ||
          isMergeableJsonContent(sourceFileContent)
        ) {
          const extendedContent = extendJson(
            JSON.parse(changes[destinationFilePath].content || '{}'),
            JSON.parse(sourceFileContent),
          );

          changes[destinationFilePath] = {
            content: JSON.stringify(extendedContent),
            type: 'json',
          };
          return;
        }

        changes[destinationFilePath] = {
          content: sourceFileContent,
          type: 'unknown',
        };
        return;
      });

      return changes;
    },
    {},
  );
}
