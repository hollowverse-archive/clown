import path from 'path';
import { disk } from './Disk';
import _ from 'lodash';

module.exports = jest.fn((_1: string, { cwd }: any) => {
  const content = disk.getContent();

  return _.keys(content)
    .filter(filePath => _.startsWith(filePath, cwd))
    .map(filePath => path.relative(cwd, filePath));
});
