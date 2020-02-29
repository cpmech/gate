import typescript from 'rollup-plugin-typescript2';

const cacheRoot = '/tmp/rollup_typescript_cache';

const config = ['cjs', 'esm'].map(format => {
  return {
    input: {
      index: 'src/index.ts',
    },
    output: [
      {
        dir: `dist/${format}`,
        format,
      },
    ],
    external: [
      // 'aws-amplify',
      // 'aws-amplify-react',
      // '@cpmech/react-icons',
      // '@aws-amplify/auth/lib-esm/types',
      // 'aws-amplify-react/lib-esm/Auth/common/types',
    ],
    plugins: [
      typescript({
        cacheRoot,
        typescript: require('typescript'),
        tsconfigOverride: {
          compilerOptions: { declaration: format === 'esm' },
          include: [],
        },
      }),
    ],
  };
});

export default config;
