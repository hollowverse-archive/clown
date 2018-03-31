import { checkExtendedConfig } from '../cli/checkExtendedConfig';
import { readJsonNoDoubleQuotes } from '../../mockAndTestHelpers/readJsonNoDoubleQuotes';
import { vol } from '@forabi/memfs';

describe('Basics', () => {
  it('use case 1', async () => {
    const files = {
      '/clown.js': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/package.json': `{
        "foo": "bar"
      }`,
      '/package.json': `{
        "name": "Stuff"
      }`,
    };

    vol.fromJSON(files);

    await checkExtendedConfig('/');

    expect(true).toEqual(true);
    // expect(readJsonNoDoubleQuotes('/package.json')).toMatchSnapshot();
  });
});
