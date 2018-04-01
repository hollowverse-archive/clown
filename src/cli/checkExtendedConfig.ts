import { readFile } from './utils';
import { computeFileContents } from './computeFileContents';
import _ from 'lodash';
import bluebird from 'bluebird';
import { patchFs } from 'fs-monkey';
import { vol } from '@forabi/memfs';
import { extendConfig } from './extendConfig';
import { DestinationContent, Discrepancies } from './types';
import { printErrors } from './printErrors';
import fs from 'fs';

export async function checkExtendedConfig(cwd: string) {
  /* We need to check if the content that currently exists on disk is the same as the content
  that Clown thinks should be on disk.

  The first step is to get the content that's currently on disk */
  const {
    fileContents,
    clownConfig: { path: clownConfigPath, content: clownConfigContent },
  } = await computeFileContents(cwd);
  const iterableFileContents = _.map(
    fileContents,
    (fileContent, destinationPath) => ({ destinationPath, fileContent }),
  );
  const currentContent: DestinationContent = await bluebird.reduce(
    iterableFileContents,
    async (
      currentContentAccumulator: DestinationContent,
      { destinationPath },
    ) => {
      currentContentAccumulator[destinationPath] = await readFile(
        destinationPath,
      );

      return currentContentAccumulator;
    },
    {},
  );

  /* Now that we have the content that's currently on disk, we need to find out what Clown thinks
  should be on disk instead. To do that, we'll use `extendConfig` since that's the function that
  knows the answer to our question. But `extendConfig` writes files to the actual disk, and we don't
  want that here. So we will patch the Node filesystem with a mock filesystem, which `extendConfig` will
  write to. */
  const mockDiskContent = {
    [clownConfigPath]: JSON.stringify(clownConfigContent),
    ..._.mapValues(fileContents, fileContent => fileContent.content),
  };
  vol.fromJSON(mockDiskContent);
  (patchFs as any)(vol, fs);
  await extendConfig(cwd, fileContents);

  /* Now, the expected content should have been written to the mock filesystem. Let's read it and
  compare it with the current content that we have retrieved earlier. */
  const discrepancies: Discrepancies = await bluebird.reduce(
    iterableFileContents,
    async (discrepancyAccumulator: Discrepancies, { destinationPath }) => {
      const expectedContent = (await readFile(destinationPath)) as string;
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
