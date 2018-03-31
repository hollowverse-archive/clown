import { extendConfig } from '../cli/extendConfig';
import { readJsonNoDoubleQuotes } from '../../mockAndTestHelpers/readJsonNoDoubleQuotes';
import { vol } from '@forabi/memfs';

describe('.stylelintrc', () => {
  it('use case 1', async () => {
    const files = {
      '/clown.js': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/.stylelintrc': `{
        "rules": {
          "plugin/no-unsupported-browser-features": [true, {
            "ignore": ["css-featurequeries", "outline", "css-appearance", "viewport-units"]
          }]
        }
      }`,
      '/.stylelintrc': `{
        "plugins": [
          "stylelint-no-unsupported-browser-features"
        ],
        "rules": {
          "plugin/no-unsupported-browser-features": [true],
          "at-rule-no-vendor-prefix": [true],
          "media-feature-name-no-vendor-prefix": [true],
          "selector-no-vendor-prefix": [true],
          "property-no-vendor-prefix": [true],
          "value-no-vendor-prefix": [true],
          "property-blacklist": ["margin-bottom", "margin-right", "margin"]
        },
        "ignoreFiles": [
          "./coverage/**/*"
        ]
      }`,
    };

    vol.fromJSON(files);

    await extendConfig('/');

    expect(readJsonNoDoubleQuotes('/.stylelintrc')).toMatchSnapshot();
  });
});
