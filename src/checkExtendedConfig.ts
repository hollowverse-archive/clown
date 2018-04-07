import { computeFileContents } from './computeFileContents';
import _ from 'lodash';
import bluebird from 'bluebird';
import { Discrepancies } from './types';
import { printErrors } from './printErrors';
import { isJsonEqual } from './isJsonEqual';

export async function checkExtendedConfig(cwd: string) {
  const expectedContents = await computeFileContents(cwd);
  const iterableExpectedContents = _.entries(expectedContents);

  const discrepancies: Discrepancies = await bluebird.reduce(
    iterableExpectedContents,
    async (
      discrepancyAccumulator: Discrepancies,
      [destinationPath, fileContent],
    ) => {
      if (
        (fileContent.destinationContent === undefined ||
          fileContent.destinationContent !== fileContent.computedContent) &&
        !isJsonEqual(
          fileContent.destinationContent || '',
          fileContent.computedContent,
        )
      ) {
        discrepancyAccumulator[destinationPath] = {
          expected: fileContent.computedContent,
          received: fileContent.destinationContent,
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
