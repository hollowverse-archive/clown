import { extendConfig } from '../cli/extendConfig';
import { readJsonNoDoubleQuotes } from '../../mockAndTestHelpers/readJsonNoDoubleQuotes';
import { vol } from '@forabi/memfs';
import { stripIndents } from 'common-tags';

describe('dot ignore', () => {
  test('use case 1', async () => {
    const files = {
      '/clown.json': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/.gitignore': stripIndents`
        # new stuff
        bin
      `,
      '/.gitignore': stripIndents`
        # comment
        node_modules

        # another comment
        .idea
      `,
    };

    vol.fromJSON(files);

    await extendConfig('/');

    expect(readJsonNoDoubleQuotes('/.gitignore')).toMatchSnapshot();
  });

  test('use case 2', async () => {
    const files = {
      '/clown.json': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/.gitignore': stripIndents`
      # comment
      node_modules

      # another comment
      .idea
    `,
      '/.gitignore': stripIndents`
        # comment
        node_modules

        # another comment
        .idea
      `,
    };

    vol.fromJSON(files);

    await extendConfig('/');

    expect(readJsonNoDoubleQuotes('/.gitignore')).toMatchSnapshot();
  });
});
