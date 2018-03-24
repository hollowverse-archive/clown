import { mergeConfigs } from '../mergeConfigs';

describe('mergeConfigs of package.json files', () => {
  it('works 1', () => {
    expect(
      mergeConfigs(
        {
          name: 'hollowverse',
          version: '1.0.0',
          description: 'Hollowverse.com',
          main: 'index.js',
          repository: 'https://github.com/hollowverse/hollowverse.git',
          scripts: {
            foo: 'bar',
          },
          license: 'Unlicense',
          homepage: 'https://github.com/hollowverse/hollowverse#readme',
          'lint-staged': {
            '**/*.mz': ['prettier --write', 'git add'],
            '**/*.{j,t}s{x,}': ['prettier --write', 'git add'],
          },
          browserslist: ['and_chr >= 62'],
          resolutions: {
            '@types/react': '^16.0.35',
            graphql: '^0.13.1',
          },
          dependencies: {
            '@babel/polyfill': '^7.0.0-beta.36',
            '@babel/runtime': '^7.0.0-beta.36',
            'babel-plugin-universal-import': '^1.4.0',
          },
          devDependencies: {
            '@babel/core': '^7.0.0-beta.40',
            '@babel/plugin-syntax-dynamic-import': '^7.0.0-beta.40',
            '@babel/plugin-transform-runtime': '^7.0.0-beta.40',
            '@babel/preset-env': '^7.0.0-beta.40',
            '@babel/preset-es2015': '^7.0.0-beta.40',
          },
          engines: {
            node: '>= 9.2',
          },
        },
        {
          scripts: {
            lint: 'eslint stuff',
          },
          husky: {
            hooks: {
              'pre-commit': 'yarn lint-staged',
              'pre-push': 'yarn pretest',
              'post-merge': 'yarnhook',
              'post-checkout': 'yarnhook',
              'post-rewrite': 'yarnhook',
            },
          },
          'lint-staged': {
            '**/*.md': ['prettier --write', 'git add'],
            '**/*.{j,t}s{x,}': ['prettier --write', 'git add'],
            '**/!(package).json': ['prettier --write', 'git add'],
            '**/*.js{x,}': ['eslint'],
            '**/**/*.{s,}css': [
              'stylelint --syntax scss',
              'prettier --write',
              'git add',
            ],
          },
          devDependencies: {
            'eslint-config-airbnb': '^16.1.0',
            'eslint-config-prettier': '^2.9.0',
            'eslint-plugin-compat': '^2.1.0',
            'eslint-plugin-graphql': '^1.5.0',
            'eslint-plugin-import': '^2.9.0',
            'eslint-plugin-jsx-a11y': '^6.0.3',
            'eslint-plugin-react': '^7.7.0',
          },
        },
      ),
    ).toEqual({
      name: 'hollowverse',
      version: '1.0.0',
      description: 'Hollowverse.com',
      main: 'index.js',
      repository: 'https://github.com/hollowverse/hollowverse.git',
      scripts: {
        foo: 'bar',
        lint: 'eslint stuff',
      },
      license: 'Unlicense',
      homepage: 'https://github.com/hollowverse/hollowverse#readme',
      'lint-staged': {
        '**/*.mz': ['prettier --write', 'git add'],
        '**/*.{j,t}s{x,}': ['prettier --write', 'git add'],
        '**/*.md': ['prettier --write', 'git add'],
        '**/!(package).json': ['prettier --write', 'git add'],
        '**/*.js{x,}': ['eslint'],
        '**/**/*.{s,}css': [
          'stylelint --syntax scss',
          'prettier --write',
          'git add',
        ],
      },
      husky: {
        hooks: {
          'pre-commit': 'yarn lint-staged',
          'pre-push': 'yarn pretest',
          'post-merge': 'yarnhook',
          'post-checkout': 'yarnhook',
          'post-rewrite': 'yarnhook',
        },
      },
      browserslist: ['and_chr >= 62'],
      resolutions: {
        '@types/react': '^16.0.35',
        graphql: '^0.13.1',
      },
      dependencies: {
        '@babel/polyfill': '^7.0.0-beta.36',
        '@babel/runtime': '^7.0.0-beta.36',
        'babel-plugin-universal-import': '^1.4.0',
      },
      devDependencies: {
        '@babel/core': '^7.0.0-beta.40',
        '@babel/plugin-syntax-dynamic-import': '^7.0.0-beta.40',
        '@babel/plugin-transform-runtime': '^7.0.0-beta.40',
        '@babel/preset-env': '^7.0.0-beta.40',
        '@babel/preset-es2015': '^7.0.0-beta.40',
        'eslint-config-airbnb': '^16.1.0',
        'eslint-config-prettier': '^2.9.0',
        'eslint-plugin-compat': '^2.1.0',
        'eslint-plugin-graphql': '^1.5.0',
        'eslint-plugin-import': '^2.9.0',
        'eslint-plugin-jsx-a11y': '^6.0.3',
        'eslint-plugin-react': '^7.7.0',
      },
      engines: {
        node: '>= 9.2',
      },
    });
  });
});
