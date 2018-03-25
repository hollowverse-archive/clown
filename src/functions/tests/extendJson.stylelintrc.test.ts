import { extendJson } from '../extendJson';

describe.only('extendJson of stylelintrc', () => {
  it('works 1', () => {
    expect(
      extendJson(
        {
          plugins: ['stylelint-no-unsupported-browser-features'],
          rules: {
            'plugin/no-unsupported-browser-features': [true],
            'at-rule-no-vendor-prefix': [true],
            'media-feature-name-no-vendor-prefix': [true],
            'selector-no-vendor-prefix': [true],
            'property-no-vendor-prefix': [true],
            'value-no-vendor-prefix': [true],
            'property-blacklist': ['margin-bottom', 'margin-right', 'margin'],
          },
          ignoreFiles: ['./coverage/**/*'],
        },
        {
          rules: {
            'plugin/no-unsupported-browser-features': [
              true,
              {
                ignore: [
                  'css-featurequeries',
                  'outline',
                  'css-appearance',
                  'viewport-units',
                ],
              },
            ],
          },
        },
      ),
    ).toEqual({
      plugins: ['stylelint-no-unsupported-browser-features'],
      rules: {
        'plugin/no-unsupported-browser-features': [
          true,
          {
            ignore: [
              'css-featurequeries',
              'outline',
              'css-appearance',
              'viewport-units',
            ],
          },
        ],
        'at-rule-no-vendor-prefix': [true],
        'media-feature-name-no-vendor-prefix': [true],
        'selector-no-vendor-prefix': [true],
        'property-no-vendor-prefix': [true],
        'value-no-vendor-prefix': [true],
        'property-blacklist': ['margin-bottom', 'margin-right', 'margin'],
      },
      ignoreFiles: ['./coverage/**/*'],
    });
  });
});
