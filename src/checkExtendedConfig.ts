import { readFile } from './utils';
import { computeFileContents } from './computeFileContents';
import _ from 'lodash';
import bluebird from 'bluebird';
import { FileContents, Discrepancies } from './types';
import { printErrors } from './printErrors';
import { isJsonEqual } from './isJsonEqual';

export async function checkExtendedConfig(cwd: string) {
  const expectedContents = await computeFileContents(cwd);
  const iterableExpectedContents = _.entries(expectedContents);
  const currentContent: FileContents = await bluebird.reduce(
    iterableExpectedContents,
    async (currentContentAccumulator: FileContents, [destinationPath]) => {
      const content = await readFile(destinationPath);

      if (content) {
        currentContentAccumulator[destinationPath] = content;
      }

      return currentContentAccumulator;
    },
    {},
  );

  const discrepancies: Discrepancies = await bluebird.reduce(
    iterableExpectedContents,
    async (
      discrepancyAccumulator: Discrepancies,
      [destinationPath, expectedContent],
    ) => {
      const destinationContent = currentContent[destinationPath];

      if (
        (destinationContent === undefined ||
          destinationContent !== expectedContent) &&
        !isJsonEqual(destinationContent, expectedContent)
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
