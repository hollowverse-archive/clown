import { extendConfig } from '../extendConfig';
import { readJsonNoDoubleQuotes } from '../../mockAndTestHelpers/readJsonNoDoubleQuotes';
import { vol } from '@forabi/memfs';
import fs from 'fs';

describe('clownCallback.js', () => {
  beforeEach(() => {
    vol.reset();
    jest.resetModules();
  });

  it('can edit a json', async () => {
    const files = {
      '/clown.json': `{
        "extensions": [
          "/clownExtensionA",
          "/clownOverride"
        ]
      }`,
      '/clownExtensionA/package.json': `{
        "foo": "a",
        "bar": "b"
      }`,
      '/package.json': `{
        "name": "Stuff"
      }`,
    };

    // @ts-ignore
    files['/clownOverride/clownCallback.js'] = '';

    vol.fromJSON(files);

    jest.doMock(
      '/clownOverride/clownCallback.js',
      () => (clownFs: any) => {
        return clownFs.editJson('/package.json', (pkgJson: any) => {
          delete pkgJson.foo;

          return pkgJson;
        }).fileContents;
      },
      { virtual: true },
    );

    await extendConfig('/');

    expect(readJsonNoDoubleQuotes('/package.json')).toMatchSnapshot();
  });

  // tslint:disable
  it('can delete a file', async () => {
    const files = {
      '/clown.json': `{
        "extensions": [
          "/clownExtensionA",
          "/clownOverride"
        ]
      }`,
      '/clownExtensionA/newJsonFile.json': `{
        "foo": "a",
        "bar": "b"
      }`,
    };

    // @ts-ignore
    files['/clownOverride/clownCallback.js'] = '';

    vol.fromJSON(files);

    jest.doMock(
      '/clownOverride/clownCallback.js',
      () => (clownFs: any) => {
        return clownFs.deleteFile('/newJsonFile.json').fileContents;
      },
      { virtual: true },
    );

    await extendConfig('/');

    expect(fs.existsSync('/newJsonFile.json')).toBe(false);
  });
});
