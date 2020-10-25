import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: './dist/main.js',
        format: 'cjs',
      },
    ],
    plugins: [
      typescript({
        typescript: require('typescript'),
      }),
    ],
    external: ['path'],
  },
  {
    input: './src/index.ts',
    output: [
      {
        file: 'dist/main.d.ts',
        format: 'es',
      },
    ],
    plugins: [dts()],
    external: ['path'],
  },
]
