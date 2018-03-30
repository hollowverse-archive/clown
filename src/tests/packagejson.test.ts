import { extendConfig } from '../cli/extendConfig';
import { disk } from '../../mockHelpers/Disk';

describe('package.json', () => {
  it('use case 1', async () => {
    const files = {
      '/clown.js': {
        extensions: ['/clownExtensionA'],
      },
      '/clownExtensionA/package.json': `{
        "scripts": {
          "scriptA": "do the other thing",
          "scriptC": "script c",
          "scriptD": "script d"
        },
        "license": "Unlicense",
        "dependencies": {
          "dep-d": "^1.0.0",
          "dep-a": "^10.0.0"
        },
        "devDependencies": {
          "dev-dep-b": "^1.0.0"
        }
      }`,
      '/package.json': `{
        "name": "foo",
        "version": "1.0.0",
        "description": "foo.com",
        "main": "index.js",
        "repository": "https://foo.com/foo.git",
        "scripts": {
          "scriptA": "script a",
          "scriptB": "script b"
        },
        "homepage": "https://foo.com/foo#readme",
        "dependencies": {
          "dep-a": "^1.0.0",
          "dep-b": "^2.0.0",
          "dep-c": "^3.0.0"
        },
        "devDependencies": {
          "dev-dep-a": "^4.0.0"
        },
        "engines": {
          "node": ">= 9.2"
        }
      }`,
    };

    disk.setContent(files);

    await extendConfig('/');

    expect(await disk.read('/package.json')).toMatchSnapshot();
  });
});
