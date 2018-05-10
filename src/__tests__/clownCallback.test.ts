import { extendConfig } from '../extendConfig';
import { readJsonNoDoubleQuotes } from '../../mockAndTestHelpers/readJsonNoDoubleQuotes';
import { vol } from '@forabi/memfs';
import fs from 'fs';
import { omit } from 'lodash';

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
      `${process.cwd()}/clownOverride/clownCallback.js`,
      () => (clownFs: any) => {
        return clownFs.editJson('/package.json', (pkgJson: any) => {
          return omit(pkgJson, 'foo');
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
      `${process.cwd()}/clownOverride/clownCallback.js`,
      () => (clownFs: any) => {
        return clownFs.remove('/newJsonFile.json').fileContents;
      },
      { virtual: true },
    );

    await extendConfig('/');

    expect(fs.existsSync('/newJsonFile.json')).toBe(false);
  });

  it('is executed but not copied over to the destination directory', async () => {
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

    const spy = jest.fn();

    jest.doMock(`${process.cwd()}/clownOverride/clownCallback.js`, () => spy, {
      virtual: true,
    });

    // @ts-ignore
    files['/clownOverride/clownCallback.js'] = '';

    vol.fromJSON(files);

    await extendConfig('/');

    expect(spy).toHaveBeenCalled();

    expect(fs.existsSync('/clownCallback.js')).toBe(false);
  });
});
