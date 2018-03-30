import { extendConfig } from '../cli/extendConfig';
import { disk } from '../../mockHelpers/Disk';

describe('Basics', () => {
  it('use case 1', async () => {
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

    disk.setContent(files);

    await extendConfig('/');

    expect(await disk.read('/package.json')).toMatchSnapshot();
  });
});
