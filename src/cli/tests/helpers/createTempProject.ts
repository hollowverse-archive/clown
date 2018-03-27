import fs from 'fs-extra';
import { tempDir, fixturesDir } from './helpers';
import path from 'path';

export async function createTempProject(
  projectName: string,
  extensionsModuleName: string,
) {
  const fixtureProjectPath = path.resolve(fixturesDir, projectName);
  const fixtureExtensionsModule = path.resolve(
    fixturesDir,
    extensionsModuleName,
  );
  const tempProjectPath = path.resolve(tempDir, projectName);
  const tempExtensionsModulePath = path.resolve(tempDir, extensionsModuleName);

  await Promise.all([
    fs.mkdirp(tempProjectPath),
    fs.mkdirp(tempExtensionsModulePath),
  ]);

  await Promise.all([
    fs.copy(fixtureProjectPath, tempProjectPath),
    fs.copy(fixtureExtensionsModule, tempExtensionsModulePath),
  ]);
}

export async function cleanupTempProject(
  projectName: string,
  extensionsModuleName: string,
) {
  const tempProjectPath = path.resolve(tempDir, projectName);
  const tempExtensionsModulePath = path.resolve(tempDir, extensionsModuleName);

  await Promise.all([
    fs.remove(tempProjectPath),
    fs.remove(tempExtensionsModulePath),
  ]);
}
