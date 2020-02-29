import typescript from 'rollup-plugin-typescript2';

const cacheRoot = '/tmp/rollup_typescript_cache';

const config = ['cjs', 'esm'].map(format => {
  return {
    input: {
      index: 'src/lib.ts',
    },
    output: [
      {
        dir: `dist/${format}`,
        format,
      },
    ],
    external: ['@cpmech/basic', 'aws-amplify', '@aws-amplify/auth/lib/types'],
    plugins: [
      typescript({
        cacheRoot,
        typescript: require('typescript'),
        tsconfigOverride: {
          compilerOptions: { declaration: format === 'esm' },
          include: ['src/helpers', 'src/locale', 'src/service'],
        },
      }),
    ],
  };
});

export default config;
