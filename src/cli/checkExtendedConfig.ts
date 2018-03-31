import { readFile } from './utils';
import { computeFileContents } from './computeFileContents';
import _ from 'lodash';
import bluebird from 'bluebird';

export async function checkExtendedConfig(cwd: string) {
  const fileContents = await computeFileContents(cwd);
  const iterableFileContents = _.map(
    fileContents,
    (fileContent, destinationPath) => ({
      destinationPath,
      fileContent,
    }),
  );

  type Discrepancies = {
    [destinationFilePath: string]: {
      expected: string;
      received: string | undefined;
    };
  };

  const discrepancies: Discrepancies = await bluebird.reduce(
    iterableFileContents,
    async (
      discrepancyAccumulator: Discrepancies,
      { destinationPath, fileContent: { content } },
    ) => {
      const destinationContent = await readFile(destinationPath);

      if (destinationContent === undefined || destinationContent !== content) {
        discrepancyAccumulator[destinationPath] = {
          expected: content,
          received: destinationContent,
        };
      }

      return discrepancyAccumulator;
    },
    {},
  );

  console.log(discrepancies);
}
