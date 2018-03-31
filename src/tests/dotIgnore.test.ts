import { extendConfig } from '../cli/extendConfig';
import { vol, fs } from '@forabi/memfs';

describe('dot ignore', () => {
  beforeEach(() => {
    vol.reset();
  });

  test('merges the lines', async () => {
    const files = {
      '/clown.json': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/.gitignore': `
        # new stuff
        bin
      `,
      '/.gitignore': `
        # comment
        node_modules

        # another comment
        .idea
      `,
    };

    vol.fromJSON(files);

    await extendConfig('/');

    expect(fs.readFileSync('/.gitignore', 'utf8')).toMatchSnapshot();
  });

  test('it does not add unnecessary empty lines to the bottom', async () => {
    const files = {
      '/clown.json': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/.gitignore': `
        # comment
        node_modules

        # another comment
        .idea
      `,
      '/.gitignore': `
        # comment
        node_modules

        # another comment
        .idea
      `,
    };

    vol.fromJSON(files);

    await extendConfig('/');

    expect(fs.readFileSync('/.gitignore', 'utf8')).toMatchSnapshot();
  });

  test('it does not add unnecessary empty lines to the top', async () => {
    const files = {
      '/clown.json': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/.gitignore': `
        # comment
        node_modules

        # another comment
        .ideaz
      `,
    };

    vol.reset();
    vol.fromJSON(files);

    await extendConfig('/');

    expect(fs.readFileSync('/.gitignore', 'utf8')).toMatchSnapshot();
  });
});
