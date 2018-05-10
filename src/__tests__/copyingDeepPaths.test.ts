import { extendConfig } from '../extendConfig';
import { readJsonNoDoubleQuotes } from '../../mockAndTestHelpers/readJsonNoDoubleQuotes';
import { vol } from '@forabi/memfs';

describe('copying from deep paths', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('works', async () => {
    const files = {
      '/clown.json': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/.vscode/settings.json': `{
        "a": "1"
      }`,
      '/clownExtensionA/src/tslint.json': `{
        "a": "1"
      }`,
      '/clownExtensionA/src/deeper/tslint.json': `{
        "a": "1"
      }`,
      '/.vscode/settings.json': `{
        "b": "1"
      }`,
      '/src/tslint.json': `{
        "b": "1"
      }`,
    };

    vol.fromJSON(files);

    await extendConfig('/');

    expect(readJsonNoDoubleQuotes('/.vscode/settings.json')).toMatchSnapshot();
    expect(readJsonNoDoubleQuotes('/src/tslint.json')).toMatchSnapshot();
    expect(readJsonNoDoubleQuotes('/src/deeper/tslint.json')).toMatchSnapshot();
  });
});
