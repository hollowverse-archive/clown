import { extendConfig } from '../cli/extendConfig';
import { disk } from '../../mockHelpers/Disk';

describe('eslintrc.json', () => {
  it('use case 1', async () => {
    const files = {
      '/clown.js': {
        extensions: ['/clownExtensionA'],
      },
      '/clownExtensionA/eslintrc.json': `{
        "plugins": ["plugin-required-for-react-i-guess"],
        "parser": "typescript-eslint-parser",
        "rules": {
          "react/jsx-max-depth": ["error", { "max": 4 }],
          "react/no-access-state-in-setstate": "error",
          "react/no-multi-comp": ["error", { "ignoreStateless": true }],
          "react/jsx-pascal-case": "error",
          "react/jsx-no-target-blank": "error"
        }
      }`,
      '/eslintrc.json': `{
        "plugins": ["graphql"],
        "rules": {
          "graphql/template-strings": [
            "error",
            {
              "env": "literal",
              "validators": "all"
            }
          ],
          "graphql/no-deprecated-fields": [
            "error",
            {
              "env": "literal"
            }
          ],
          "graphql/capitalized-type-name": [
            "error",
            {
              "env": "literal"
            }
          ],
          "graphql/named-operations": [
            "error",
            {
              "env": "literal"
            }
          ]
        }
      }`,
    };

    disk.setContent(files);

    await extendConfig('/');

    expect(await disk.read('/eslintrc.json')).toMatchSnapshot();
  });
});
