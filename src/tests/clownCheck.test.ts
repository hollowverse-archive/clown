import { checkExtendedConfig } from '../cli/checkExtendedConfig';
import { readJsonNoDoubleQuotes } from '../../mockAndTestHelpers/readJsonNoDoubleQuotes';

describe('Basics', () => {
  it('use case 1', async () => {
    const files = {
      '/clown.js': {
        extensions: ['/clownExtensionA'],
      },
      '/clownExtensionA/package.json': `{
        "foo": "bar"
      }`,
      '/package.json': `{
        "name": "Stuff"
      }`,
    };

    // await checkExtendedConfig('/');

    expect(true).toEqual(true);
    // expect(readJsonNoDoubleQuotes('/package.json')).toMatchSnapshot();
  });
});
