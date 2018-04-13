import { extendConfig } from '../extendConfig';
import { vol } from '@forabi/memfs';

describe('Failing loudly', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('fails when attempting to extend from an empty or non-existing folder', async () => {
    const files = {
      '/clown.json': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/package.json': `{
        "name": "Stuff"
      }`,
    };

    vol.fromJSON(files);

    return expect(extendConfig('/')).rejects.toThrowError(/does not exist/);
  });
});
