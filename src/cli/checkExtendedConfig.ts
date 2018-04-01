import { readFile } from './utils';
import { computeFileContents } from './computeFileContents';
import _ from 'lodash';
import bluebird from 'bluebird';
import { FileContents, Discrepancies } from './types';
import { printErrors } from './printErrors';

export async function checkExtendedConfig(cwd: string) {
  /* We need to check if the content that currently exists on disk is the same as the content
  that Clown thinks should be on disk.

  The first step is to get the content that's currently on disk */
  const fileContents = await computeFileContents(cwd);
  const iterableFileContents = _.map(
    fileContents,
    (fileContent, destinationPath) => ({ destinationPath, fileContent }),
  );
  const currentContent: FileContents = await bluebird.reduce(
    iterableFileContents,
    async (currentContentAccumulator: FileContents, { destinationPath }) => {
      const content = await readFile(destinationPath);

      if (content) {
        currentContentAccumulator[destinationPath] = content;
      }

      return currentContentAccumulator;
    },
    {},
  );

  const discrepancies: Discrepancies = await bluebird.reduce(
    iterableFileContents,
    async (
      discrepancyAccumulator: Discrepancies,
      { destinationPath, fileContent: expectedContent },
    ) => {
      const destinationContent = currentContent[destinationPath];

      if (
        destinationContent === undefined ||
        destinationContent !== expectedContent
      ) {
        discrepancyAccumulator[destinationPath] = {
          expected: expectedContent,
          received: destinationContent,
        };
      }

      return discrepancyAccumulator;
    },
    {},
  );

  if (_.isEmpty(discrepancies)) {
    process.exit(0);
  } else {
    printErrors(discrepancies);
    process.exit(1);
  }
}
