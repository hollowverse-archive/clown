import { extendConfig } from '../extendConfig';
import { readJsonNoDoubleQuotes } from '../../mockAndTestHelpers/readJsonNoDoubleQuotes';
import { vol } from '@forabi/memfs';

describe('json5 support', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('use case 1', async () => {
    const files = {
      '/clown.json': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/package.json': `{
        // No problamo
        "foo": "bar",
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
