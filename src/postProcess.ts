import { FileContents, ExtensionPathAndSourceFiles } from './types';
import _ from 'lodash';
import path from 'path';
import { ClownFilesystem } from './ClownFilesystem';

export function postProcess(
  fileContents: FileContents,
  extensionPathAndSourceFiles: ExtensionPathAndSourceFiles,
): FileContents {
  const [extensionPath, sourceFiles] = extensionPathAndSourceFiles;
  const findFile = (filename: string) =>
    _.find(sourceFiles, sourceFile => path.basename(sourceFile) === filename);

  const clownCallbackRelativePath =
    findFile('clownCallback.ts') || findFile('clownCallback.js');

  if (!clownCallbackRelativePath) {
    return fileContents;
  }

  const clownCallbackPath = path.join(extensionPath, clownCallbackRelativePath);
  const clownFilesystem = new ClownFilesystem(fileContents);

  // tslint:disable:next non-literal-require
  return (
    require(path.join(process.cwd(), clownCallbackPath))(clownFilesystem) ||
    clownFilesystem.fileContents
  );
}
