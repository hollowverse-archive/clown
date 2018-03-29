import { disk } from '../../../__mocks__/Disk';

module.exports = function(path: string) {
  return disk.read(path);
};
