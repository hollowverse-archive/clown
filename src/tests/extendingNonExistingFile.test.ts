import { extendConfig } from '../cli/extendConfig';
import { readJsonNoDoubleQuotes } from '../../mockAndTestHelpers/readJsonNoDoubleQuotes';
import { vol } from '@forabi/memfs';

describe('Extending non-existing file', () => {
  it('creates a file if it does not exist', async () => {
    const files = {
      '/clown.json': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/package.json': `{
        "name": "Stuff",
        "foo": "bar"
      }`,
    };

    vol.fromJSON(files);

    await extendConfig('/');

    expect(readJsonNoDoubleQuotes('/package.json')).toMatchSnapshot();
  });
});
