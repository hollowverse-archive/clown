import { extendConfig } from '../cli/extendConfig';
import { readJsonNoDoubleQuotes } from '../../mockAndTestHelpers/readJsonNoDoubleQuotes';
import { vol } from '@forabi/memfs';

describe('validateFilenames.json', () => {
  it('use case 1', async () => {
    const files = {
      '/clown.json': `{
        "extensions": ["/clownExtensionA"]
      }`,
      '/clownExtensionA/validateFilenames.json': `{
        "rules": [
          {
            "validation": "PascalCase",
            "patterns": [
              "src/app/components/**",
              "src/app/pages/**",
              "src/app/hocs/**"
            ]
          },
          {
            "validation": "ignore",
            "patterns": [
              "*/**/typings/*",
              "src/app/pages/NotablePerson/warningIcon.tsx",
              "src/app/__tests__/**/*",
              "__tests__/**/*",
              "_*.scss",
              "src/app/assets/algolia/*"
            ]
          }
        ]
      }`,
      '/validateFilenames.json': `{
          "rules": [
            {
              "validation": "camelCase",
              "patterns": ["*/**"]
            },
            { "validation": "PascalCase", "patterns": [] },
            {
              "validation": "ignore",
              "patterns": [
                "Dockerfile*",
                "docker-compose.yml",
                "**/LICENSE.md",
                "**/README.md"
              ]
            }
          ]
      }`,
    };

    vol.fromJSON(files);

    await extendConfig('/');

    expect(readJsonNoDoubleQuotes('/validateFilenames.json')).toMatchSnapshot();
  });
});
