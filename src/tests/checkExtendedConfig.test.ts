import { checkExtendedConfig } from '../cli/checkExtendedConfig';
import { vol } from '@forabi/memfs';

const { printErrors } = require('../cli/printErrors');

describe('checkExtendedConfig basics', () => {
  it('use case 1', async () => {
    const files = {
      '/clown.json': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/package.json': `{
        "foo": "bar"
      }`,
      '/clownExtensionA/eslintrc.json': `{
        "rules": "ok"
      }`,
      '/package.json': `{
        "name": "Stuff"
      }`,
      '/eslintrc.json': `{
        "extends": "someFoo"
      }`,
    };

    vol.fromJSON(files);

    await checkExtendedConfig('/');

    expect(printErrors.mock.calls).toMatchSnapshot();
  });
});
