import { checkExtendedConfig } from '../checkExtendedConfig';
import { vol } from '@forabi/memfs';
import { printErrors } from '../printErrors';

describe('checkExtendedConfig basics', () => {
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
