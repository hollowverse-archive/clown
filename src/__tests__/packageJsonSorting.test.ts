import { extendConfig } from '../extendConfig';
import { readJsonNoDoubleQuotes } from '../../mockAndTestHelpers/readJsonNoDoubleQuotes';
import { vol } from '@forabi/memfs';

describe('package.json key sorting', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('sorts dependencies and devDependencies', async () => {
    const files = {
      '/clown.json': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/package.json': `{
        "dependencies": {
          "z": "1",
          "b": "1",
          "a": "1"
        },
        "devDependencies": {
          "e": "1",
          "f": "1",
          "m": "1"
        }
      }`,
      '/package.json': `{
        "dependencies": {
          "c": "1"
        },
        "devDependencies": {
          "h": "1"
        }
      }`,
    };

    vol.fromJSON(files);

    await extendConfig('/');

    expect(readJsonNoDoubleQuotes('/package.json')).toMatchSnapshot();
  });
});
