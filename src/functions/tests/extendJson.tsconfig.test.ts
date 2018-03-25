import { extendJson } from '../extendJson';

describe('extendJson of tsconfig.json files', () => {
  it('works 1', () => {
    expect(
      extendJson(
        {
          compilerOptions: {
            checkJs: true,
            allowJs: true,
          },
          exclude: ['*/**/dist', '__tests__', 'node_modules'],
        },
        {
          compilerOptions: {
            allowSyntheticDefaultImports: true,
            esModuleInterop: true,
            moduleResolution: 'node',

            strict: true,
            noImplicitReturns: true,
            forceConsistentCasingInFileNames: true,
            noFallthroughCasesInSwitch: true,
            noEmitOnError: true,
            noUnusedLocals: true,
            noUnusedParameters: true,

            module: 'commonjs',
            target: 'es2017',
            sourceMap: true,

            skipLibCheck: true,

            allowJs: false,
            checkJs: true,
            maxNodeModuleJsDepth: 2,
            jsx: 'preserve',
          },
        },
      ),
    ).toEqual({
      compilerOptions: {
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        moduleResolution: 'node',

        strict: true,
        noImplicitReturns: true,
        forceConsistentCasingInFileNames: true,
        noFallthroughCasesInSwitch: true,
        noEmitOnError: true,
        noUnusedLocals: true,
        noUnusedParameters: true,

        module: 'commonjs',
        target: 'es2017',
        sourceMap: true,

        skipLibCheck: true,

        allowJs: false,
        checkJs: true,
        maxNodeModuleJsDepth: 2,
        jsx: 'preserve',
      },
      exclude: ['*/**/dist', '__tests__', 'node_modules'],
    });
  });
});
