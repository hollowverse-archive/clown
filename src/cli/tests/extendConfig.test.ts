import { extendConfig } from '../extendConfig';
import { disk } from '../../../__mocks__/Disk';

const files = {
  '/clown.js': {
    extensions: ['/clownExtensionA'],
  },
  '/clownExtensionA/package.json': `{
    "foo": "bar"
  }`,
  '/package.json': `{
    "name": "Stuff"
  }`,
};

const results = {
  '/package.json': `{
    "name": "Stuff",
    "foo": "bar"
}\n`,
};

disk.setContent(files);

describe('use case 1', () => {
  it('works 1', async () => {
    await extendConfig('/');

    expect(await disk.read('/package.json')).toEqual(results['/package.json']);
  });
});
