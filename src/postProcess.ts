import { FileContents, ExtensionPathAndSourceFiles } from './types';
import _ from 'lodash';
import path from 'path';
import { ClownFilesystem } from './ClownFilesystem';

export function postProcess(
  fileContents: FileContents,
  extensionPathAndSourceFiles: ExtensionPathAndSourceFiles,
): FileContents {
  const [extensionPath, sourceFiles] = extensionPathAndSourceFiles;

  const clownCallbackRelativePath =
    _.find(
      sourceFiles,
      sourceFile => path.basename(sourceFile) === 'clownCallback.ts',
    ) ||
    _.find(
      sourceFiles,
      sourceFile => path.basename(sourceFile) === 'clownCallback.js',
    );

  if (!clownCallbackRelativePath) {
    return fileContents;
  }

  const clownCallbackPath = path.join(extensionPath, clownCallbackRelativePath);

  const clownFilesystem = new ClownFilesystem(fileContents);

  // tslint:disable:next non-literal-require no-parameter-reassignment
  return (
    require(clownCallbackPath)(clownFilesystem) || clownFilesystem.fileContents
  );
}
