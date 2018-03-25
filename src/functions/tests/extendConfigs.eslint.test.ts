import { extendJson } from '../extendJson';

describe('extendJson of eslint files', () => {
  it('works 1', () => {
    expect(
      extendJson(
        {
          plugins: ['graphql'],
          rules: {
            'graphql/template-strings': [
              'error',
              {
                env: 'literal',
                validators: 'all',
              },
            ],
            'graphql/no-deprecated-fields': [
              'error',
              {
                env: 'literal',
              },
            ],
            'graphql/capitalized-type-name': [
              'error',
              {
                env: 'literal',
              },
            ],
            'graphql/named-operations': [
              'error',
              {
                env: 'literal',
              },
            ],
          },
        },
        {
          plugins: ['plugin-required-for-react-i-guess'],
          parser: 'typescript-eslint-parser',
          rules: {
            'react/jsx-max-depth': ['error', { max: 4 }],
            'react/no-access-state-in-setstate': 'error',
            'react/no-array-index-key': 'error',
            'react/no-children-prop': 'error',
            'react/no-danger': 'error',
            'react/no-danger-with-children': 'error',
            'react/no-deprecated': 'error',
            'react/no-did-update-set-state': 'error',
            'react/no-will-update-set-state': 'error',
            'react/no-direct-mutation-state': 'error',
            'react/no-redundant-should-component-update': 'error',
            'react/no-render-return-value': 'error',
            'react/void-dom-elements-no-children': 'error',
            'react/no-multi-comp': ['error', { ignoreStateless: true }],
            'react/jsx-pascal-case': 'error',
            'react/jsx-no-target-blank': 'error',
          },
        },
      ),
    ).toEqual({
      plugins: ['graphql', 'plugin-required-for-react-i-guess'],
      parser: 'typescript-eslint-parser',
      rules: {
        'graphql/template-strings': [
          'error',
          {
            env: 'literal',
            validators: 'all',
          },
        ],
        'graphql/no-deprecated-fields': [
          'error',
          {
            env: 'literal',
          },
        ],
        'graphql/capitalized-type-name': [
          'error',
          {
            env: 'literal',
          },
        ],
        'graphql/named-operations': [
          'error',
          {
            env: 'literal',
          },
        ],
        'react/jsx-max-depth': ['error', { max: 4 }],
        'react/no-access-state-in-setstate': 'error',
        'react/no-array-index-key': 'error',
        'react/no-children-prop': 'error',
        'react/no-danger': 'error',
        'react/no-danger-with-children': 'error',
        'react/no-deprecated': 'error',
        'react/no-did-update-set-state': 'error',
        'react/no-will-update-set-state': 'error',
        'react/no-direct-mutation-state': 'error',
        'react/no-redundant-should-component-update': 'error',
        'react/no-render-return-value': 'error',
        'react/void-dom-elements-no-children': 'error',
        'react/no-multi-comp': ['error', { ignoreStateless: true }],
        'react/jsx-pascal-case': 'error',
        'react/jsx-no-target-blank': 'error',
      },
    });
  });
});
