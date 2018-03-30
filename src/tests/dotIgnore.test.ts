import { extendConfig } from '../cli/extendConfig';
import { disk } from '../../mockHelpers/Disk';
import { stripIndents } from 'common-tags';

describe('dot ignore', () => {
  test('use case 1', async () => {
    const files = {
      '/clown.js': {
        extensions: ['/clownExtensionA'],
      },
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

    disk.setContent(files);

    await extendConfig('/');

    expect(await disk.read('/.gitignore')).toMatchSnapshot();
  });

  test('use case 2', async () => {
    const files = {
      '/clown.js': {
        extensions: ['/clownExtensionA'],
      },
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

    disk.setContent(files);

    await extendConfig('/');

    expect(await disk.read('/.gitignore')).toMatchSnapshot();
  });
});
