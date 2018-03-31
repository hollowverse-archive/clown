import { extendConfig } from '../cli/extendConfig';
import { disk } from '../../mockHelpers/Disk';
import { getJsonContentFromDisk } from '../../mockHelpers/getJsonContentFromDisk';

describe('package.json', () => {
  it('use case 1', async () => {
    const files = {
      '/clown.js': {
        extensions: ['/clownExtensionA'],
      },
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

    disk.setContent(files);

    await extendConfig('/');

    expect(
      await getJsonContentFromDisk('/validateFilenames.json'),
    ).toMatchSnapshot();
  });
});
