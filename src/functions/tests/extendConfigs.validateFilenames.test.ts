import { extendConfigs } from '../extendConfigs';

describe('extendConfigs of validate-filenames', () => {
  it('works 1', () => {
    expect(
      extendConfigs(
        {
          rules: [
            {
              validation: 'camelCase',
              patterns: ['*/**'],
            },
            { validation: 'PascalCase', patterns: [] },
            {
              validation: 'ignore',
              patterns: [
                'Dockerfile*',
                'docker-compose.yml',
                '**/LICENSE.md',
                '**/README.md',
              ],
            },
          ],
        },
        {
          rules: [
            {
              validation: 'PascalCase',
              patterns: [
                'src/app/components/**',
                'src/app/pages/**',
                'src/app/hocs/**',
              ],
            },
            {
              validation: 'ignore',
              patterns: [
                '*/**/typings/*',
                'src/app/pages/NotablePerson/warningIcon.tsx',
                'src/app/__tests__/**/*',
                '__tests__/**/*',
                '_*.scss',
                'src/app/assets/algolia/*',
              ],
            },
          ],
        },
      ),
    ).toEqual({
      rules: [
        {
          validation: 'camelCase',
          patterns: ['*/**'],
        },
        {
          validation: 'PascalCase',
          patterns: [
            'src/app/components/**',
            'src/app/pages/**',
            'src/app/hocs/**',
          ],
        },
        {
          validation: 'ignore',
          patterns: [
            'Dockerfile*',
            'docker-compose.yml',
            '**/LICENSE.md',
            '**/README.md',
            '*/**/typings/*',
            'src/app/pages/NotablePerson/warningIcon.tsx',
            'src/app/__tests__/**/*',
            '__tests__/**/*',
            '_*.scss',
            'src/app/assets/algolia/*',
          ],
        },
      ],
    });
  });
});
