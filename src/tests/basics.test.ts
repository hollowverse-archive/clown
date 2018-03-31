import { extendConfig } from '../cli/extendConfig';
import { readJsonNoDoubleQuotes } from '../../mockAndTestHelpers/readJsonNoDoubleQuotes';
import { vol } from '@forabi/memfs';

describe('Basics', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('use case 1', async () => {
    const files = {
      '/clown.json': `{
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

    await extendConfig('/');

    expect(readJsonNoDoubleQuotes('/package.json')).toMatchSnapshot();
  });
});
