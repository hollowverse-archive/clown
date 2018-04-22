import { extendConfig } from '../extendConfig';
import { readJsonNoDoubleQuotes } from '../../mockAndTestHelpers/readJsonNoDoubleQuotes';
import { vol } from '@forabi/memfs';

describe('escaped filenames support', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('use case 1', async () => {
    const files = {
      '/clown.json': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/c__package.json': `{
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

  it('use case 2 deep path', async () => {
    const files = {
      '/clown.json': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/folder/c__package.json': `{
        // No problamo
        "foo": "bar",
      }`,
      '/folder/package.json': `{
        "name": "Stuff"
      }`,
    };

    vol.fromJSON(files);

    await extendConfig('/');

    expect(readJsonNoDoubleQuotes('/folder/package.json')).toMatchSnapshot();
  });
});
