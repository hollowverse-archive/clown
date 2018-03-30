import { disk } from '../mockHelpers/Disk';

const fs = jest.genMockFromModule('fs-extra');

function readFile(filePath) {
  return disk.read(filePath);
}

function readJson(filePath) {
  return disk.read(filePath);
}

function writeFile(filePath, fileContent) {
  disk.write(filePath, fileContent);
}

fs['readFile'] = readFile;
fs['readJson'] = readJson;
fs['mkdirp'] = () => null;

module.exports = fs;
