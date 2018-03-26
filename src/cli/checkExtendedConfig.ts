import path from 'path';
import _ from 'lodash';
import {
  iterateOverSourceAndDestinationFiles,
  isMergeableJsonContent,
  isDotIgnoreFile,
} from './utils';
import { extendJson } from '../functions/extendJson';
import { extendDotIgnore } from '../functions/extendDotIgnore';
import { getExtensionPathsAndSourceFiles } from './getExtensionPathsAndSourceFiles';

type Errors = { source: string; destination: string };

async function getErrors(): Promise<Errors[]> {
  const extensionPathsAndSourceFiles = await getExtensionPathsAndSourceFiles();

  async function collectErrors(
    sourceFilePath: string,
    destinationFilePath: string,
    sourceFileContent: string,
    destinationFileContent: string | undefined,
  ): Promise<Errors | null> {
    if (destinationFileContent === undefined) {
      return {
        source: sourceFilePath,
        destination: destinationFilePath,
      };
    }

    if (isDotIgnoreFile(path.basename(destinationFilePath))) {
      const extendedContent = extendDotIgnore(
        destinationFileContent,
        sourceFileContent,
      );

      if (extendedContent !== destinationFileContent) {
        return {
          source: sourceFilePath,
          destination: destinationFilePath,
        };
      }
    }

    if (isMergeableJsonContent(destinationFileContent)) {
      const parsedSourceFileContent = JSON.parse(sourceFileContent);
      const parsedDestinationFileContent = JSON.parse(destinationFileContent);
      const extendedContent = extendJson(
        parsedSourceFileContent,
        parsedDestinationFileContent,
      );

      if (!_.isEqual(extendedContent, parsedDestinationFileContent)) {
        return {
          source: sourceFilePath,
          destination: destinationFilePath,
        };
      }
    }

    if (sourceFileContent !== destinationFileContent) {
      return {
        source: sourceFilePath,
        destination: destinationFilePath,
      };
    }

    return null;
  }

  return _.compact(
    await iterateOverSourceAndDestinationFiles(
      extensionPathsAndSourceFiles,
      process.cwd(),
      collectErrors,
    ),
  );
}

export async function checkExtendedConfig() {
  const errors = await getErrors();

  function printErrors(errors: Errors[]) {
    const errorsWithRelativePaths = errors.map(error => {
      console.log('error', error);
      return {
        source: path.relative(process.cwd(), error.source),
        destination: path.relative(process.cwd(), error.destination),
      };
    });

    console.log(JSON.stringify(errorsWithRelativePaths, null, 2));
    process.exit(1);
  }

  function printSuccess() {
    console.log('Success!');
    process.exit(0);
  }

  if (errors.length > 0) {
    return printErrors(errors);
  }

  return printSuccess();
}

checkExtendedConfig();
